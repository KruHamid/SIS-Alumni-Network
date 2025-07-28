import { GoogleGenAI, Type } from "@google/genai";

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

export const geocodeAddress = async (address: string): Promise<{ lat: number; lng: number } | null> => {
  if (!ai || !API_KEY) {
    console.warn("Geocoding disabled: Gemini API key not configured.");
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