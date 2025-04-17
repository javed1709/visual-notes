const apiKey = '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'; // Replace with your API key
const siteUrl = '<YOUR_SITE_URL>'; // Optional: Replace with your site URL
const siteName = '<YOUR_SITE_NAME>'; // Optional: Replace with your site name

const prompt = "Explain me kubernates and docker in detail with examples and diagrams. Also explain the differences between them. Give me a mermaidjs script for the diagram and a markdown table for the differences.";

const callDeepSeekAPI = async () => {
  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "HTTP-Referer": siteUrl, // Optional
        "X-Title": siteName, // Optional
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-chat-v3-0324:free",
        messages: [
          {
            role: "user",
            content: prompt
          }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    // Extract the actual content from the response
    const content = data.choices[0]?.message?.content;
    console.log("Generated Response:", content);
  } catch (error) {
    console.error("Error:", error);
  }
};

callDeepSeekAPI();