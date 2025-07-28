import { GoogleGenAI, Type } from "@google/genai";

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

export const geocodeAddress = async (address: string): Promise<{ lat: number; lng: number } | null> => {
  if (initError || !ai) {
    console.warn("Geocoding disabled: Gemini AI client not initialized.");
    return null;
  }
  
  const cleanedAddress = address.trim().replace(/\s+/g, ' ');
  if (!cleanedAddress) return null;

  const prompt = `Provide the geographic coordinates (latitude and longitude) for the following address in Thailand: "${cleanedAddress}". If the address is ambiguous or cannot be found, return null for lat and lng.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            lat: { type: Type.NUMBER, description: "Latitude. Return null if not found." },
            lng: { type: Type.NUMBER, description: "Longitude. Return null if not found." },
          },
          required: ["lat", "lng"],
        },
        temperature: 0.1, // Lower temperature for more deterministic results
      },
    });

    const jsonString = response.text.trim();
    const parsed = JSON.parse(jsonString);

    if (parsed && typeof parsed.lat === 'number' && typeof parsed.lng === 'number') {
      // Basic validation for coordinates in/around Thailand
      if (parsed.lat > 5 && parsed.lat < 21 && parsed.lng > 97 && parsed.lng < 106) {
          return parsed;
      }
      console.warn(`Geocoded coordinates for "${address}" are outside Thailand.`, parsed);
      return null;
    }
    
    console.warn(`Could not geocode address: ${address}`, parsed);
    return null;

  } catch (error) {
    console.error(`Error geocoding address "${address}" with Gemini:`, error);
    return null;
  }
};
