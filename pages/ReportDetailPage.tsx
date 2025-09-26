
import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAppStore } from '../hooks/useAppStore';
import { Report, ReportStatus } from '../types';
import Spinner from '../components/Spinner';
import Disclaimer from '../components/Disclaimer';
import ChatMessageBubble from '../components/ChatMessageBubble';
import { getChatResponse } from '../services/geminiService';

const ReportDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { reports, addChatMessage } = useAppStore();
    const [report, setReport] = useState<Report | undefined>(undefined);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const foundReport = reports.find(r => r.id === id);
        setReport(foundReport);
        setIsLoading(false);
    }, [id, reports]);

    if (isLoading) {
        return <div className="flex justify-center items-center h-64"><Spinner /></div>;
    }

    if (!report) {
        return (
            <div className="text-center py-10">
                <h2 className="text-2xl font-bold">Report not found</h2>
                <p className="text-gray-600 mt-2">The report you are looking for does not exist.</p>
                <Link to="/dashboard" className="mt-4 inline-block text-primary-600 hover:underline">Back to Dashboard</Link>
            </div>
        );
    }
    
    return (
        <div>
             <Link to="/dashboard" className="text-primary-600 hover:underline text-sm mb-4 inline-block">&larr; Back to Dashboard</Link>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{report.filename}</h1>
            <p className="text-sm text-gray-500 mb-6">Uploaded on {new Date(report.uploadDate).toLocaleString()}</p>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column: Summary and Chat */}
                <div className="bg-white p-6 rounded-lg shadow-lg">
                    <SummarySection report={report} />
                    <ChatSection report={report} addChatMessage={addChatMessage} />
                </div>
                {/* Right Column: Original Report */}
                <div className="bg-white p-6 rounded-lg shadow-lg">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Original Report Text</h2>
                    <div className="prose prose-sm max-w-none h-96 overflow-y-auto bg-gray-50 p-4 rounded-md border">
                        <pre className="whitespace-pre-wrap font-sans">{report.originalText}</pre>
                    </div>
                </div>
            </div>
        </div>
    );
};

const SummarySection: React.FC<{report: Report}> = ({ report }) => {
    return (
        <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">AI-Powered Summary</h2>
            {report.status === ReportStatus.PENDING && (
                <div className="flex items-center text-gray-600">
                    <Spinner size="sm" />
                    <span className="ml-2">Generating summary...</span>
                </div>
            )}
             {report.status === ReportStatus.FAILED && (
                <div className="text-red-600">
                    Failed to generate summary. Please try uploading the report again.
                </div>
            )}
            {report.status === ReportStatus.SUMMARIZED && report.summary && (
                <div className="prose prose-sm max-w-none">
                    <p className="whitespace-pre-wrap">{report.summary.replace(report.summary.split('\n').pop()!, '')}</p>
                    <Disclaimer />
                </div>
            )}
        </div>
    );
};

const ChatSection: React.FC<{report: Report; addChatMessage: (reportId: string, message: any) => void;}> = ({ report, addChatMessage }) => {
    const [userInput, setUserInput] = useState('');
    const [isAiThinking, setIsAiThinking] = useState(false);
    const chatEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [report.chatHistory]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userInput.trim() || isAiThinking) return;

        const userMessage = { id: `msg-${Date.now()}`, sender: 'user' as 'user', text: userInput.trim() };
        addChatMessage(report.id, userMessage);
        setUserInput('');
        setIsAiThinking(true);

        try {
            const aiResponseText = await getChatResponse(report.originalText, report.chatHistory, userInput.trim());
            const aiMessage = { id: `msg-${Date.now() + 1}`, sender: 'ai' as 'ai', text: aiResponseText };
            addChatMessage(report.id, aiMessage);
        } catch (error) {
            const errorMessage = { id: `msg-${Date.now() + 1}`, sender: 'ai' as 'ai', text: 'Sorry, I encountered an error. Please try again.' };
            addChatMessage(report.id, errorMessage);
        } finally {
            setIsAiThinking(false);
        }
    };
    
    return (
        <div className="border-t pt-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Ask a Question</h2>
             <div className="h-64 flex flex-col space-y-4 overflow-y-auto bg-gray-50 p-4 rounded-md border mb-4">
                {report.chatHistory.map((msg) => (
                    <ChatMessageBubble key={msg.id} message={msg} />
                ))}
                {isAiThinking && (
                    <div className="flex items-start gap-3">
                         <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center text-white font-bold text-sm">AI</div>
                         <div className="bg-gray-100 rounded-xl p-3 shadow-sm"><Spinner size="sm" /></div>
                    </div>
                )}
                <div ref={chatEndRef} />
            </div>
            <form onSubmit={handleSendMessage} className="flex gap-2">
                <input
                    type="text"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    placeholder="e.g., What were the results of the MRI?"
                    className="flex-grow p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                    disabled={report.status !== ReportStatus.SUMMARIZED || isAiThinking}
                />
                <button
                    type="submit"
                    disabled={report.status !== ReportStatus.SUMMARIZED || isAiThinking || !userInput.trim()}
                    className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:bg-gray-400"
                >
                    Send
                </button>
            </form>
        </div>
    );
};


export default ReportDetailPage;
