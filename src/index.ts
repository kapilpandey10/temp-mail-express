import PostalMime from 'postal-mime';

export interface Env {
  EMAIL_STORE: KVNamespace;
  API_AUTH_TOKEN: string;
}

export default {
  async email(message: any, env: Env): Promise<void> {
    const id = crypto.randomUUID();
    const to = message.to.toLowerCase();
    
    const rawEmailBuffer = await new Response(message.raw).arrayBuffer();
    const parser = new PostalMime();
    const parsed = await parser.parse(rawEmailBuffer);

    const emailData = {
      id,
      from: message.from,
      subject: parsed.subject || "No Subject",
      body: parsed.text || "No readable content",
      timestamp: new Date().toISOString(),
      // We don't know the device ID on the SMTP side, 
      // so we allow the first device that "claims" this email to see it.
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
    const deviceId = request.headers.get("X-Device-ID"); // THE SECURITY LOCK

    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Authorization, Content-Type, X-Device-ID",
      "Content-Type": "application/json",
    };

    if (request.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

    if (authToken !== `Bearer ${env.API_AUTH_TOKEN}`) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: corsHeaders });
    }

    if (!deviceId) {
      return new Response(JSON.stringify({ error: "Device Identity Required" }), { status: 403, headers: corsHeaders });
    }

    if (emailAddr && emailAddr.endsWith("@pandeykapil.com.np")) {
      // Logic: Only show emails that were generated while THIS device was active
      // We use a "Session Key" in KV to lock the email to a device
      const sessionKey = `session:${emailAddr}`;
      let sessionOwner = await env.EMAIL_STORE.get(sessionKey);

      if (!sessionOwner) {
        // Claim this email for this device for the next 5 minutes
        await env.EMAIL_STORE.put(sessionKey, deviceId, { expirationTtl: 300 });
        sessionOwner = deviceId;
      }

      if (sessionOwner !== deviceId) {
        // Someone else is using this email on another device!
        return new Response(JSON.stringify([]), { headers: corsHeaders });
      }

      // If owner matches, show the mail
      const list = await env.EMAIL_STORE.list({ prefix: `inbox:${emailAddr}:` });
      const emails = await Promise.all(
        list.keys.map(async (key) => JSON.parse((await env.EMAIL_STORE.get(key.name)) || "{}"))
      );
      
      const sorted = emails.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      return new Response(JSON.stringify(sorted), { headers: corsHeaders });
    }

    return new Response("[]", { headers: corsHeaders });
  }
};