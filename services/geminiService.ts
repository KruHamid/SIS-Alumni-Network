
import { GoogleGenAI } from "@google/genai";

// Safely access process.env to avoid crashing in browser environments
const API_KEY = typeof process !== 'undefined' && process.env ? process.env.API_KEY : undefined;

let ai: GoogleGenAI | null = null;

// Initialize the AI client only if the API key exists.
// This prevents the app from crashing on startup if the key is not configured.
if (API_KEY) {
  try {
    ai = new GoogleGenAI({ apiKey: API_KEY });
  } catch (error) {
    console.error("Failed to initialize GoogleGenAI, likely due to an invalid API key format:", error);
  }
} else {
  console.warn("Gemini API key not found or configured. AI features will be disabled.");
}


export const generateDescription = async (businessName: string, category: string): Promise<string> => {
  // Check for both the initialized 'ai' instance and the API_KEY
  if (!ai || !API_KEY) {
    // This specific error message will be caught and displayed to the user in the form.
    return Promise.reject(new Error("คุณสมบัตินี้ต้องใช้ API Key ที่ตั้งค่าไว้ในระบบ"));
  }

  const prompt = `ในฐานะผู้เชี่ยวชาญด้านการตลาด, ช่วยเขียนคำอธิบายธุรกิจสั้นๆ ที่น่าสนใจและดูเป็นมืออาชีพสำหรับธุรกิจชื่อ "${businessName}" ซึ่งอยู่ในหมวดหมู่ "${category}" ให้มีความยาวประมาณ 2-3 ประโยค เน้นความเป็นมิตรและเชิญชวนลูกค้า`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        temperature: 0.7,
        topP: 1,
        topK: 32,
        maxOutputTokens: 200,
        thinkingConfig: { thinkingBudget: 100 }
      }
    });
    return response.text.trim();
  } catch (error) {
    console.error("Error generating description with Gemini:", error);
    throw new Error("ไม่สามารถสร้างคำอธิบายได้ กรุณาลองใหม่อีกครั้ง");
  }
};
