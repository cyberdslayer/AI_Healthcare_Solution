import { GoogleGenAI } from "@google/genai";
import type { VercelRequest, VercelResponse } from '@vercel/node';

// This is the system prompt from your constants.ts
const MEDICAL_DISCLAIMER = `⚠️ This summary is for informational purposes only and should not replace professional medical advice. Consult a qualified healthcare professional for diagnosis and treatment.`;
const SYSTEM_PROMPT = `You are a helpful and highly-knowledgeable medical report summarization assistant. Your task is to analyze a provided medical report and generate a clear, concise, patient-friendly summary.

Follow these instructions precisely:
1.  **Primary Goal:** Summarize the key findings from the report in simple language that a patient can easily understand. Avoid overly technical jargon.
2.  **Key Information to Extract:**
    *   Identify and list the main findings.
    *   Extract any numerical results or measurements and present them clearly.
    *   Explicitly highlight any findings described as "abnormal", "urgent", "critical", or similar terms.
3.  **Prohibitions:**
    *   **DO NOT** provide a diagnosis unless it is explicitly stated in the report.
    *   **DO NOT** speculate or infer information not present in the text.
    *   **NEVER** suggest prescriptions, treatments, or medical advice.
4.  **Final Disclaimer:** ALWAYS append the following disclaimer at the very end of your response, on a new line, exactly as written:
    "${MEDICAL_DISCLAIMER}"`;


export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }
    
    // API_KEY is a secure Environment Variable on Vercel
    const API_KEY = process.env.API_KEY;
    if (!API_KEY) {
        return res.status(500).json({ error: 'API key not configured on the server.' });
    }

    const { reportText } = req.body;

    if (!reportText) {
        return res.status(400).json({ error: 'reportText is required.' });
    }

    try {
        const ai = new GoogleGenAI({ apiKey: API_KEY });
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: reportText,
            config: {
                systemInstruction: SYSTEM_PROMPT,
                temperature: 0.2,
            }
        });
        
        res.status(200).json({ summary: response.text });

    } catch (error) {
        console.error("Error calling Gemini API:", error);
        res.status(500).json({ error: 'Failed to get summary from AI service.' });
    }
}
