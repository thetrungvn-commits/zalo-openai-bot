// app/api/zalo/refresh/route.js

export const dynamic = "force-dynamic"; // ⚠ BẮT BUỘC để Next.js không prerender

export async function GET() {
  try {
    const refreshToken = process.env.ZALO_REFRESH_TOKEN;
    const appId = process.env.ZALO_APP_ID;
    const appSecret = process.env.ZALO_APP_SECRET;

    if (!refreshToken) {
      return new Response("Missing refresh token", { status: 400 });
    }

    const params = new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
      app_id: appId,
      app_secret: appSecret
    });

    const resp = await fetch("https://oauth.zalo.me/v4/oa/access_token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString()
    });

    const data = await resp.json();

    console.log("New Access Token:", data);

    return new Response(JSON.stringify(data), { status: 200 });
  } catch (err) {
    console.error("[Refresh Token Error]", err);
    return new Response("Internal error", { status: 500 });
  }
}
