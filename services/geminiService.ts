import { GoogleGenAI, Type } from "@google/genai";

let ai: GoogleGenAI | null = null;
let initError: string | null = null;

// Lazily initializes and returns the GoogleGenAI client instance.
// Throws an error if initialization fails.
const getAiClient = (): GoogleGenAI => {
    // If we've already initialized successfully, return the cached instance.
    if (ai) {
        return ai;
    }
    
    // If we've already failed during a previous attempt, throw the captured error.
    if (initError) {
        throw new Error(initError);
    }
    
    // This is the first attempt to initialize.
    const API_KEY = process.env.API_KEY;

    // Check if the API_KEY is available in the environment.
    if (!API_KEY) {
        initError = "คุณสมบัตินี้ต้องใช้ API Key ที่ตั้งค่าไว้ในระบบ";
        console.warn("Gemini API key not found in process.env.API_KEY. AI features will be disabled.");
        throw new Error(initError);
    }
    
    try {
        // Create and cache the client instance.
        const client = new GoogleGenAI({ apiKey: API_KEY });
        ai = client;
        return client;
    } catch (error) {
        // Capture and re-throw initialization errors.
        console.error("Failed to initialize GoogleGenAI, likely due to an invalid API key format:", error);
        initError = "รูปแบบของ API Key ไม่ถูกต้อง หรือ Key ไม่ถูกต้อง";
        throw new Error(initError);
    }
};

export const generateDescription = async (businessName: string, category: string): Promise<string> => {
  try {
    const client = getAiClient();
    const prompt = `ในฐานะผู้เชี่ยวชาญด้านการตลาด, ช่วยเขียนคำอธิบายธุรกิจสั้นๆ ที่น่าสนใจและดูเป็นมืออาชีพสำหรับธุรกิจชื่อ "${businessName}" ซึ่งอยู่ในหมวดหมู่ "${category}" ให้มีความยาวประมาณ 2-3 ประโยค เน้นความเป็นมิตรและเชิญชวนลูกค้า`;
    
    const response = await client.models.generateContent({
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
  } catch (error: any) {
    console.error("Error generating description with Gemini:", error);
    // Propagate a user-friendly error message. If it's an init error, it will be thrown from getAiClient().
    // Otherwise, provide a generic message for API call failures.
    throw new Error(error.message || "ไม่สามารถสร้างคำอธิบายได้ กรุณาลองใหม่อีกครั้ง หรือตรวจสอบ API Key");
  }
};

export const geocodeAddress = async (address: string): Promise<{ lat: number; lng: number } | null> => {
    try {
        const client = getAiClient();
        const cleanedAddress = address.trim().replace(/\s+/g, ' ');
        if (!cleanedAddress || cleanedAddress.toLowerCase() === 'ออนไลน์') {
             return null;
        }

        const prompt = `Provide the geographic coordinates (latitude and longitude) for the following address in Thailand: "${cleanedAddress}". If the address is ambiguous or cannot be found, return null for lat and lng.`;

        const response = await client.models.generateContent({
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
                temperature: 0.1,
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

    } catch (error: any) {
        // To prevent the entire map from crashing due to one failed geocode,
        // we log the error and return null, allowing other profiles to be processed.
        console.error(`Error geocoding address "${address}":`, error.message);
        return null;
    }
};