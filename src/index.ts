import PostalMime from 'postal-mime';

export interface Env {
  EMAIL_STORE: KVNamespace;
  API_AUTH_TOKEN: string;
}

export default {
  // 1. RECEIVE AND CLEAN EMAIL
  async email(message: any, env: Env): Promise<void> {
    const id = crypto.randomUUID();
    const to = message.to.toLowerCase();
    
    // Read the raw email data from the stream
    const rawEmailBuffer = await new Response(message.raw).arrayBuffer();
    
    // Parse the email to extract clean text and subject
    const parser = new PostalMime();
    const parsed = await parser.parse(rawEmailBuffer);

    const emailData = {
      id,
      from: message.from,
      subject: parsed.subject || "No Subject",
      // parsed.text contains the clean message without HTML tags or headers
      body: parsed.text || "No text content found in this email.", 
      timestamp: new Date().toISOString(),
    };

    // Store in KV for 10 minutes (600 seconds)
    await env.EMAIL_STORE.put(`inbox:${to}:${id}`, JSON.stringify(emailData), {
      expirationTtl: 600 
    });
  },

  // 2. SERVE EMAILS TO FRONTEND
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const emailAddr = url.searchParams.get("email")?.toLowerCase();
    const authToken = request.headers.get("Authorization");

    const corsHeaders = {
      "Access-Control-Allow-Origin": "*", // You can restrict this to your domain later
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Authorization, Content-Type",
      "Content-Type": "application/json",
    };

    if (request.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

    // Verify the security token
    if (url.pathname !== "/messages" || authToken !== `Bearer ${env.API_AUTH_TOKEN}`) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: corsHeaders });
    }

    if (emailAddr && emailAddr.endsWith("@pandeykapil.com.np")) {
      const list = await env.EMAIL_STORE.list({ prefix: `inbox:${emailAddr}:` });
      const emails = await Promise.all(
        list.keys.map(async (key) => {
          const val = await env.EMAIL_STORE.get(key.name);
          return val ? JSON.parse(val) : null;
        })
      );

      const validEmails = emails.filter(e => e !== null);
      const sorted = validEmails.sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );

      return new Response(JSON.stringify(sorted), { headers: corsHeaders });
    }

    return new Response(JSON.stringify([]), { headers: corsHeaders });
  }
};