
import { GoogleGenAI } from "@google/genai";
import { SYSTEM_PROMPT, MEDICAL_DISCLAIMER } from '../constants';
import { ChatMessage } from '../types';

// IMPORTANT: In a real production application, the API key and all Gemini API calls
// MUST be handled on a secure backend server. Exposing API keys in the browser
// is a security risk. This implementation is for demonstration purposes only.
const API_KEY = process.env.API_KEY;

const MOCK_MODE = !API_KEY;

let ai: GoogleGenAI | null = null;
if (!MOCK_MODE) {
  ai = new GoogleGenAI({ apiKey: API_KEY! });
}

const mockSummary = `
**Patient-Friendly Summary of CT Scan Report**

**Main Findings:**
- A small nodule (a tiny spot) measuring 5mm was found in the upper part of your right lung.
- Your heart size is normal.
- There are no signs of fluid around your lungs (pleural effusion).
- The main blood vessels appear normal.

**Highlighted Item:**
- The report notes a **5mm pulmonary nodule**. The radiologist recommends a follow-up CT scan in 6-12 months to check if it has changed.

This summary simplifies the key points of your report.
${MEDICAL_DISCLAIMER}`;

const mockChatResponse = `Based on the report, the CT scan found a small 5mm nodule in the upper lobe of the right lung. The report recommends a follow-up scan in 6-12 months to monitor it.`;


export const summarizeReport = async (reportText: string): Promise<string> => {
    if (MOCK_MODE) {
        console.log("Using Mock AI for summarization.");
        await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate network delay
        return mockSummary;
    }

    if (!ai) throw new Error("Gemini AI client not initialized.");
    
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: reportText,
            config: {
                systemInstruction: SYSTEM_PROMPT,
                temperature: 0.2,
            }
        });
        
        return response.text;
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw new Error("Failed to get summary from AI service.");
    }
};

export const getChatResponse = async (reportText: string, history: ChatMessage[], question: string): Promise<string> => {
    if (MOCK_MODE) {
        console.log("Using Mock AI for chat response.");
        await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay
        return mockChatResponse;
    }
    
    if (!ai) throw new Error("Gemini AI client not initialized.");

    const chatPrompt = `
CONTEXT:
---
${reportText}
---
CONVERSATION HISTORY:
${history.map(m => `${m.sender.toUpperCase()}: ${m.text}`).join('\n')}
---
NEW QUESTION: ${question}

Based on the CONTEXT and HISTORY, answer the NEW QUESTION. If the answer is not in the context, say so. Do not provide medical advice.
`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: chatPrompt,
            config: {
                temperature: 0.5,
            }
        });
        return response.text;
    } catch (error) {
        console.error("Error calling Gemini API for chat:", error);
        throw new Error("Failed to get chat response from AI service.");
    }
};
