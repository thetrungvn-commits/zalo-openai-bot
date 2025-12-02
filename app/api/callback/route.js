// app/api/callback/route.js
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");

  if (!code) {
    return new Response(JSON.stringify({ error: "Missing code" }), {
      status: 400
    });
  }

  const appId = process.env.ZALO_APP_ID;
  const appSecret = process.env.ZALO_APP_SECRET;

  if (!appId || !appSecret) {
    return new Response(JSON.stringify({ error: "Missing appId/appSecret" }), {
      status: 500
    });
  }

  const resp = await fetch("https://oauth.zalo.me/v4/oa/access_token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      app_id: appId,
      app_secret: appSecret,
      grant_type: "authorization_code",
      code
    })
  });

  const data = await resp.json();

  return new Response(JSON.stringify(data), { status: 200 });
}
