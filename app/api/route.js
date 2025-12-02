// app/api/webhook/route.js
import crypto from "crypto";
import { callOpenAI } from "@/lib/ai";

export async function POST(req) {
  const body = await req.json();
  const signature = req.headers.get("x-zalo-signature") || "";
  const secret = process.env.ZALO_OA_SECRET;

  if (!secret) {
    console.error("Missing ZALO_OA_SECRET");
    return new Response("Server config error", { status: 500 });
  }

  // Verify chữ ký
  const computed =
    "sha256=" +
    crypto.createHmac("sha256", secret).update(JSON.stringify(body)).digest("hex");

  if (computed !== signature) {
    console.error("Invalid signature");
    return new Response("Invalid signature", { status: 401 });
  }

  console.log("📩 Zalo event:", body.event_name);

  if (body.event_name === "user_send_text") {
    const userId = body.sender.id;
    const userText = body.message.text;

    console.log("👤 User:", userId, "→", userText);

    // Gọi OpenAI
    const reply = await callOpenAI(userText);

    // Gửi trả lời về Zalo
    await fetch("https://openapi.zalo.me/v3.0/oa/message/cs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "access_token": process.env.ZALO_OA_TOKEN
      },
      body: JSON.stringify({
        recipient: { user_id: userId },
        message: { text: reply }
      })
    });
  }

  return new Response("OK", { status: 200 });
}
