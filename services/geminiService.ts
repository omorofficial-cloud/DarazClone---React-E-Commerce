import { GoogleGenAI } from "@google/genai";

let aiClient: GoogleGenAI | null = null;

const getClient = () => {
  if (!aiClient) {
    const apiKey = process.env.API_KEY || ''; 
    // Ideally, we handle the missing key in the UI, but for safety in initialization:
    if (apiKey) {
      aiClient = new GoogleGenAI({ apiKey });
    }
  }
  return aiClient;
};

export const generateProductDescription = async (title: string, category: string, features: string) => {
  const client = getClient();
  if (!client) {
    throw new Error("API Key is missing.");
  }

  const prompt = `
    Write a compelling and SEO-friendly product description for an e-commerce listing.
    Product Title: ${title}
    Category: ${category}
    Key Features: ${features}
    
    Format the output as a clean paragraph suitable for a product details page. Do not use markdown formatting like **bold** or # headings, just plain text with paragraphs.
    Keep it under 150 words.
  `;

  try {
    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to generate description. Please try again.");
  }
};

export const chatWithAssistant = async (history: {role: 'user' | 'model', text: string}[], message: string) => {
   const client = getClient();
    if (!client) return "I'm offline right now (API Key missing).";

    try {
        const chat = client.chats.create({
            model: 'gemini-2.5-flash',
            history: history.map(h => ({
                role: h.role,
                parts: [{ text: h.text }]
            })),
            config: {
                systemInstruction: "You are a helpful AI shopping assistant for 'DarazClone'. You help users find products, compare prices, and suggest items based on categories. Be concise, friendly, and use emojis."
            }
        });

        const result = await chat.sendMessage({ message });
        return result.text;
    } catch (error) {
        console.error("Chat Error", error);
        return "Sorry, I'm having trouble connecting to the server right now.";
    }
}