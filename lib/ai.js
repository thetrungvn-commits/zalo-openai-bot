// lib/ai.js
export async function callOpenAI(userText) {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return "Hệ thống chưa được cấu hình khóa OpenAI. Vui lòng báo admin.";
  }

  try {
    const resp = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4.1",
        messages: [
          {
            role: "system",
            content:
              "Bạn là chatbot hỗ trợ khách hàng của doanh nghiệp trên Zalo OA. Hãy trả lời ngắn gọn, thân thiện, rõ ràng bằng tiếng Việt."
          },
          {
            role: "user",
            content: userText
          }
        ]
      })
    });

    const data = await resp.json();

    if (!data.choices || !data.choices[0]?.message?.content) {
      console.error("OpenAI response error:", data);
      return "Xin lỗi, hiện tôi chưa xử lý được yêu cầu. Anh/chị vui lòng thử lại sau.";
    }

    return data.choices[0].message.content;

  } catch (err) {
    console.error("OpenAI call failed:", err);
    return "Hệ thống đang gặp sự cố, anh/chị vui lòng thử lại sau.";
  }
}
