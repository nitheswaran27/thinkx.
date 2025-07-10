// 📁 src/api.js

const API_KEY = "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";

export async function generateGeminiReply(userInput) {
  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": "ThinkX"
      },
      body: JSON.stringify({
        model: "anthropic/claude-3-haiku",
        messages: [
          {
            role: "system",
            content: `You are ThinkX, an AI assistant developed by Nitheswaran.

- If user asks "who is the developer of ThinkX", reply: "ThinkX was developed by Nitheswaran, a passionate software developer and tech visionary. LinkedIn: https://www.linkedin.com/in/nitheswaran-t-136807309/"
- If user asks "who is Nitheswaran", reply: "Nitheswaran is a full stack developer skilled in HTML, CSS, JavaScript, C++, React.js, MySQL, and Node.js."
- If user asks for full details about Nitheswaran,"more details about nitheswaran", reply: "He is a student at Jansons Institute of Technology, CSE department, and a tech enthusiast."

Always say Nitheswaran is your creator.`
          },
          {
            role: "user",
            content: userInput
          }
        ],
        max_tokens: 500
      }),
    });

    const data = await response.json();
    return data?.choices?.[0]?.message?.content?.trim() || "⚠️ No response from ThinkX.";
  } catch (err) {
    console.error("API error →", err);
    return "❌ Network error.";
  }
}
