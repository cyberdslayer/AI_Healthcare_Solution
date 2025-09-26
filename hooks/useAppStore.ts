import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, Report, ChatMessage, ReportStatus } from '../types';

interface AppState {
    user: User | null;
    reports: Report[];
    login: (username: string) => void;
    logout: () => void;
    addReport: (report: Omit<Report, 'id' | 'uploadDate'>) => string;
    updateReportSummary: (reportId: string, summary: string) => void;
    updateReportStatus: (reportId: string, status: ReportStatus) => void;
    addChatMessage: (reportId: string, message: ChatMessage) => void;
}

export const useAppStore = create<AppState>()(
    persist(
        (set, get) => ({
            user: null,
            reports: [],
            login: (username) => set({ user: { id: 'mock-user-1', username } }),
            logout: () => set({ user: null }),
            addReport: (reportData) => {
                const newId = `report-${Date.now()}`;
                const newReport: Report = {
                    ...reportData,
                    id: newId,
                    uploadDate: new Date().toISOString(),
                };
                set((state) => ({ reports: [newReport, ...state.reports] }));
                return newId;
            },
            updateReportSummary: (reportId, summary) => {
                set((state) => ({
                    reports: state.reports.map((r) =>
                        r.id === reportId ? { ...r, summary, status: ReportStatus.SUMMARIZED } : r
                    ),
                }));
            },
            updateReportStatus: (reportId, status) => {
                set((state) => ({
                    reports: state.reports.map((r) =>
                        r.id === reportId ? { ...r, status } : r
                    ),
                }));
            },
            addChatMessage: (reportId, message) => {
                set((state) => ({
                    reports: state.reports.map((r) =>
                        r.id === reportId
                            ? { ...r, chatHistory: [...r.chatHistory, message] }
                            : r
                    ),
                }));
            },
        }),
        {
            name: 'mediscan-ai-storage', // name of the item in the storage (must be unique)
        }
    )
);