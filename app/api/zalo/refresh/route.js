// app/api/zalo/refresh/route.js
export async function GET() {
  const appId = process.env.ZALO_APP_ID;
  const refreshToken = process.env.ZALO_OA_REFRESH;

  if (!appId || !refreshToken) {
    return new Response(
      JSON.stringify({ error: "Missing ZALO_APP_ID or ZALO_OA_REFRESH" }),
      { status: 500 }
    );
  }

  const resp = await fetch("https://oauth.zalo.me/v4/oa/access_token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      app_id: appId,
      grant_type: "refresh_token",
      refresh_token: refreshToken
    })
  });

  const data = await resp.json();

  return new Response(JSON.stringify(data), { status: 200 });
}
