import PostalMime from 'postal-mime';

export interface Env {
  EMAIL_STORE: KVNamespace;
  API_AUTH_TOKEN: string;
}

interface EmailData {
  id: string;
  from: string;
  subject: string;
  body: string;
  timestamp: string;
}

interface EmailMessage {
  from: string;
  to: string;
  raw: ReadableStream;
  headers: Headers;
}

export default {
  async email(message: EmailMessage, env: Env): Promise<void> {
    const id = crypto.randomUUID();
    const to = message.to.toLowerCase();
    
    console.log(`[EMAIL RECEIVED] To: ${to}, From: ${message.from}`);
    
    let subject = "No Subject";
    let body = "";

    try {
      const rawEmailBuffer = await new Response(message.raw).arrayBuffer();
      const parser = new PostalMime();
      const parsed = await parser.parse(rawEmailBuffer);
      
      subject = parsed.subject || "No Subject";
      
      if (parsed.text) {
        body = parsed.text.trim();
      } else if (parsed.html) {
        body = parsed.html
          .replace(/<style[^>]*>.*?<\/style>/gis, '')
          .replace(/<script[^>]*>.*?<\/script>/gis, '')
          .replace(/<[^>]+>/g, ' ')
          .replace(/\s+/g, ' ')
          .trim();
      } else {
        body = "No content found";
      }
      
      console.log(`[PARSE SUCCESS] Subject: ${subject}`);
      
    } catch (e) {
      console.error(`[PARSE ERROR]`, e);
      
      try {
        const rawText = await new Response(message.raw).text();
        subject = message.headers.get("subject") || "Fallback: Check Raw Content";
        body = rawText.substring(0, 5000);
      } catch (fallbackError) {
        console.error(`[FALLBACK ERROR]`, fallbackError);
        subject = "Error parsing email";
        body = "Unable to parse email content.";
      }
    }

    const emailData: EmailData = {
      id,
      from: message.from,
      subject,
      body,
      timestamp: new Date().toISOString(),
    };

    try {
      await env.EMAIL_STORE.put(
        `inbox:${to}:${id}`, 
        JSON.stringify(emailData), 
        { expirationTtl: 1800 }
      );
      
      console.log(`[STORED] Email ${id} for ${to}`);
    } catch (storeError) {
      console.error(`[STORAGE ERROR]`, storeError);
    }
  },

  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const emailAddr = url.searchParams.get("email")?.toLowerCase();
    const authToken = request.headers.get("Authorization");

    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Authorization, Content-Type",
      "Content-Type": "application/json",
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    if (authToken !== `Bearer ${env.API_AUTH_TOKEN}`) {
      console.warn(`[AUTH FAILED]`);
      return new Response(
        JSON.stringify({ error: "Unauthorized" }), 
        { status: 401, headers: corsHeaders }
      );
    }

    if (!emailAddr) {
      return new Response(
        JSON.stringify({ error: "Email parameter required" }), 
        { status: 400, headers: corsHeaders }
      );
    }

    if (!emailAddr.endsWith("@pandeykapil.com.np")) {
      console.log(`[INVALID DOMAIN] Request for: ${emailAddr}`);
      return new Response("[]", { headers: corsHeaders });
    }

    if (request.method === "DELETE") {
      try {
        const list = await env.EMAIL_STORE.list({ prefix: `inbox:${emailAddr}:` });
        
        if (list.keys.length === 0) {
          return new Response(
            JSON.stringify({ success: true, deleted: 0 }), 
            { headers: corsHeaders }
          );
        }

        await Promise.all(list.keys.map(key => env.EMAIL_STORE.delete(key.name)));
        
        console.log(`[DELETE SUCCESS] Deleted ${list.keys.length} emails`);
        return new Response(
          JSON.stringify({ success: true, deleted: list.keys.length }), 
          { headers: corsHeaders }
        );
      } catch (error) {
        console.error(`[DELETE ERROR]`, error);
        return new Response(
          JSON.stringify({ error: "Delete failed" }), 
          { status: 500, headers: corsHeaders }
        );
      }
    }

    if (request.method === "GET") {
      try {
        const list = await env.EMAIL_STORE.list({ prefix: `inbox:${emailAddr}:` });
        
        if (list.keys.length === 0) {
          console.log(`[GET] No emails for ${emailAddr}`);
          return new Response("[]", { headers: corsHeaders });
        }

        const emails = await Promise.all(
          list.keys.map(async (key) => {
            const data = await env.EMAIL_STORE.get(key.name);
            if (!data) return null;
            
            try {
              return JSON.parse(data) as EmailData;
            } catch (parseError) {
              console.error(`[PARSE ERROR] Failed to parse email ${key.name}`);
              return null;
            }
          })
        );
        
        const validEmails = emails.filter((email): email is EmailData => email !== null);
        const sorted = validEmails.sort(
          (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
        
        console.log(`[GET SUCCESS] Returned ${sorted.length} emails`);
        return new Response(JSON.stringify(sorted), { headers: corsHeaders });
        
      } catch (error) {
        console.error(`[GET ERROR]`, error);
        return new Response(
          JSON.stringify({ error: "Failed to retrieve emails" }), 
          { status: 500, headers: corsHeaders }
        );
      }
    }

    return new Response(
      JSON.stringify({ error: "Method not allowed" }), 
      { status: 405, headers: corsHeaders }
    );
  }
};