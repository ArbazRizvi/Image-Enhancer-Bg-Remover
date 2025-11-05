
import { GoogleGenAI, Modality } from "@google/genai";
import type { ProcessMode } from '../types';

// FIX: Per coding guidelines, initialize directly with process.env.API_KEY and assume it is set.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const getPromptForMode = (mode: ProcessMode): string => {
    switch (mode) {
        case 'removeBg':
            return 'Remove the background of this image completely, leaving only the main subject. The new background must be transparent.';
        case 'enhance':
            return 'Enhance the quality of this image. Improve sharpness, clarity, color balance, and lighting. Optimize the final image for web usage to ensure a small file size without significant quality loss.';
        default:
            throw new Error('Invalid processing mode');
    }
}

export const processImageWithGemini = async (
    base64ImageData: string,
    mimeType: string,
    mode: ProcessMode
): Promise<string> => {
    const prompt = getPromptForMode(mode);

    const imagePart = {
        inlineData: {
            data: base64ImageData,
            mimeType: mimeType,
        },
    };
    const textPart = { text: prompt };

    try {
        // FIX: Per coding guidelines, use ai.models.generateContent and pass the model name.
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: { parts: [imagePart, textPart] },
            config: {
                responseModalities: [Modality.IMAGE],
            },
        });
        
        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
              return part.inlineData.data;
            }
        }
        
        throw new Error("No image data found in the API response.");

    } catch (error) {
        console.error("Error processing image with Gemini:", error);
        throw new Error("Gemini API call failed.");
    }
};