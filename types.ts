
export interface User {
    id: string;
    username: string;
}

export enum ReportStatus {
    PENDING = 'Pending Summary',
    SUMMARIZED = 'Summarized',
    FAILED = 'Failed',
}

export interface Report {
    id: string;
    filename: string;
    originalText: string;
    status: ReportStatus;
    summary: string | null;
    chatHistory: ChatMessage[];
    uploadDate: string;
}

export interface ChatMessage {
    id: string;
    sender: 'user' | 'ai';
    text: string;
}
