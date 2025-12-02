export async function callOpenAI(message) {
  const apiKey = process.env.OPENAI_API_KEY;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: "gpt-4.1-mini",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: message }
      ]
    })
  });

  const data = await response.json();
  return data?.choices?.[0]?.message?.content || "Xin lỗi, tôi chưa trả lời được.";
}
