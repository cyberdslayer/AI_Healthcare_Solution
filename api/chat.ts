import { GoogleGenAI } from "@google/genai";
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }
    
    const API_KEY = process.env.API_KEY;
    if (!API_KEY) {
        return res.status(500).json({ error: 'API key not configured on the server.' });
    }
    
    const { reportText, history, question } = req.body;

    if (!reportText || !history || !question) {
        return res.status(400).json({ error: 'reportText, history, and question are required.' });
    }

    const chatPrompt = `
CONTEXT:
---
${reportText}
---
CONVERSATION HISTORY:
${history.map((m: any) => `${m.sender.toUpperCase()}: ${m.text}`).join('\n')}
---
NEW QUESTION: ${question}

Based on the CONTEXT and HISTORY, answer the NEW QUESTION. If the answer is not in the context, say so. Do not provide medical advice.
`;

    try {
        const ai = new GoogleGenAI({ apiKey: API_KEY });
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: chatPrompt,
            config: {
                temperature: 0.5,
            }
        });

        res.status(200).json({ response: response.text });
    } catch (error) {
        console.error("Error calling Gemini API for chat:", error);
        res.status(500).json({ error: "Failed to get chat response from AI service." });
    }
}
