import { GoogleGenAI } from "@google/genai";

// Based on the environment requirements, we must assume process.env.API_KEY is available.
// The check for `typeof process` is removed to align with this requirement.
const API_KEY = process.env.API_KEY;

let ai: GoogleGenAI | null = null;
let initError: string | null = null;

// Initialize the AI client. If API_KEY is missing or invalid, capture the error.
if (API_KEY) {
  try {
    // The apiKey must be a non-empty string.
    ai = new GoogleGenAI({ apiKey: API_KEY });
  } catch (error) {
    console.error("Failed to initialize GoogleGenAI, likely due to an invalid API key format:", error);
    initError = "รูปแบบของ API Key ไม่ถูกต้อง หรือ Key ไม่ถูกต้อง";
  }
} else {
  console.warn("Gemini API key not found in process.env.API_KEY. AI features will be disabled.");
  initError = "คุณสมบัตินี้ต้องใช้ API Key ที่ตั้งค่าไว้ในระบบ";
}


export const generateDescription = async (businessName: string, category: string): Promise<string> => {
  // Check for initialization errors or a missing 'ai' instance.
  if (initError || !ai) {
    return Promise.reject(new Error(initError || "ไม่สามารถเริ่มต้นระบบ AI ได้"));
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
    throw new Error("ไม่สามารถสร้างคำอธิบายได้ กรุณาลองใหม่อีกครั้ง หรือตรวจสอบ API Key");
  }
};
