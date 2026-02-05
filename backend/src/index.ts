import PostalMime from 'postal-mime';

export interface Env {
  EMAIL_STORE: KVNamespace;
  API_AUTH_TOKEN: string;
}

export default {
  async email(message: any, env: Env): Promise<void> {
    const id = crypto.randomUUID();
    const to = message.to.toLowerCase();
    
    let subject = "No Subject";
    let body = "";

    try {
      // 1. TRY ADVANCED PARSING (Clean text/OTP extraction)
      const rawEmailBuffer = await new Response(message.raw).arrayBuffer();
      const parser = new PostalMime();
      const parsed = await parser.parse(rawEmailBuffer);
      
      subject = parsed.subject || "No Subject";
      body = parsed.text || parsed.html || "No content found";
    } catch (e) {
      // 2. FALLBACK (If parser fails, get raw text so user still gets the code)
      const rawText = await new Response(message.raw).text();
      subject = message.headers.get("subject") || "Fallback: Check Raw Content";
      body = rawText;
    }

    const emailData = {
      id,
      from: message.from,
      subject: subject,
      body: body,
      timestamp: new Date().toISOString(),
    };

    // Auto-delete after 300 seconds (5 minutes)
    await env.EMAIL_STORE.put(`inbox:${to}:${id}`, JSON.stringify(emailData), {
      expirationTtl: 300 
    });
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

    if (request.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

    if (authToken !== `Bearer ${env.API_AUTH_TOKEN}`) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: corsHeaders });
    }

    if (!emailAddr || !emailAddr.endsWith("@pandeykapil.com.np")) {
      return new Response("[]", { headers: corsHeaders });
    }

    if (request.method === "DELETE") {
      const list = await env.EMAIL_STORE.list({ prefix: `inbox:${emailAddr}:` });
      await Promise.all(list.keys.map(key => env.EMAIL_STORE.delete(key.name)));
      return new Response(JSON.stringify({ success: true }), { headers: corsHeaders });
    }

    const list = await env.EMAIL_STORE.list({ prefix: `inbox:${emailAddr}:` });
    const emails = await Promise.all(
      list.keys.map(async (key) => JSON.parse((await env.EMAIL_STORE.get(key.name)) || "{}"))
    );
    
    const sorted = emails.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    return new Response(JSON.stringify(sorted), { headers: corsHeaders });
  }
};