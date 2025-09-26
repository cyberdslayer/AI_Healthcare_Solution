
import { ChatMessage } from '../types';

export const summarizeReport = async (reportText: string): Promise<string> => {
    const response = await fetch('/api/summarize', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reportText }),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'An unknown error occurred.' }));
        throw new Error(errorData.error || 'Failed to get summary from AI service.');
    }

    const data = await response.json();
    return data.summary;
};

export const getChatResponse = async (reportText: string, history: ChatMessage[], question: string): Promise<string> => {
     const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reportText, history, question }),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'An unknown error occurred.' }));
        throw new Error(errorData.error || 'Failed to get chat response from AI service.');
    }
    
    const data = await response.json();
    return data.response;
};
