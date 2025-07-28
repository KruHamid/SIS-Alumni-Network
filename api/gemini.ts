import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI, Type } from "@google/genai";

// This function will not be bundled with the client-side code.
// It will be deployed as a Vercel Serverless Function.

let ai: GoogleGenAI | null = null;
try {
    const API_KEY = process.env.API_KEY;
    if (!API_KEY) {
        throw new Error("API_KEY is not set in environment variables.");
    }
    ai = new GoogleGenAI({ apiKey: API_KEY });
} catch (error) {
    console.error("Failed to initialize GoogleGenAI:", error);
    // ai remains null, and the handler will return an error.
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Only POST requests are allowed' });
    }

    if (!ai) {
        return res.status(500).json({ error: 'AI client failed to initialize. Check server logs for API_KEY.' });
    }

    const { type, payload } = req.body;

    try {
        switch (type) {
            case 'generateDescription':
                const { businessName, category } = payload;
                if (!businessName || !category) {
                    return res.status(400).json({ error: 'Missing businessName or category in payload.' });
                }
                const prompt = `ในฐานะผู้เชี่ยวชาญด้านการตลาด, ช่วยเขียนคำอธิบายธุรกิจสั้นๆ ที่น่าสนใจและดูเป็นมืออาชีพสำหรับธุรกิจชื่อ "${businessName}" ซึ่งอยู่ในหมวดหมู่ "${category}" ให้มีความยาวประมาณ 2-3 ประโยค เน้นความเป็นมิตรและเชิญชวนลูกค้า`;
                
                const descResponse = await ai.models.generateContent({
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

                return res.status(200).json({ text: descResponse.text.trim() });

            case 'geocodeAddress':
                const { address } = payload;
                if (!address) {
                    return res.status(400).json({ error: 'Missing address in payload.' });
                }
                const cleanedAddress = address.trim().replace(/\s+/g, ' ');
                if (!cleanedAddress || cleanedAddress.toLowerCase() === 'ออนไลน์') {
                     return res.status(200).json(null);
                }
                const geocodePrompt = `Provide the geographic coordinates (latitude and longitude) for the following address in Thailand: "${cleanedAddress}". If the address is ambiguous or cannot be found, return null for lat and lng.`;

                const geocodeResponse = await ai.models.generateContent({
                    model: 'gemini-2.5-flash',
                    contents: geocodePrompt,
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
                
                const jsonString = geocodeResponse.text.trim();
                const parsed = JSON.parse(jsonString);

                if (parsed && typeof parsed.lat === 'number' && typeof parsed.lng === 'number') {
                    if (parsed.lat > 5 && parsed.lat < 21 && parsed.lng > 97 && parsed.lng < 106) {
                        return res.status(200).json(parsed);
                    }
                    console.warn(`Geocoded coordinates for "${address}" are outside Thailand.`, parsed);
                    return res.status(200).json(null);
                }
                
                console.warn(`Could not geocode address: ${address}`, parsed);
                return res.status(200).json(null);

            default:
                return res.status(400).json({ error: 'Invalid request type' });
        }
    } catch (error: any) {
        console.error(`Error processing request type "${type}":`, error);
        return res.status(500).json({ error: `An error occurred while processing the request: ${error.message}` });
    }
}
