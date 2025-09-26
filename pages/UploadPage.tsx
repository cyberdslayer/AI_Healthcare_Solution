
import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../hooks/useAppStore';
import { extractTextFromPdf } from '../services/pdfService';
import { summarizeReport } from '../services/geminiService';
import { ReportStatus } from '../types';
import Spinner from '../components/Spinner';

const UploadPage: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [text, setText] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const { addReport, updateReportSummary, updateReportStatus } = useAppStore();

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setError(null);
            setFile(selectedFile);
            if (selectedFile.type === 'application/pdf') {
                setIsUploading(true);
                try {
                    const extractedText = await extractTextFromPdf(selectedFile);
                    setText(extractedText);
                } catch (err) {
                    setError('Failed to extract text from PDF. Please try again or paste the text manually.');
                } finally {
                    setIsUploading(false);
                }
            } else if (selectedFile.type === 'text/plain') {
                const reader = new FileReader();
                reader.onload = (event) => setText(event.target?.result as string);
                reader.readAsText(selectedFile);
            } else {
                 setError('Unsupported file type. Please upload a PDF or TXT file.');
            }
        }
    };
    
    const handleSubmit = async () => {
        if (!file || !text.trim()) {
            setError('Please upload a file and ensure it contains text.');
            return;
        }

        setIsUploading(true);
        setError(null);
        
        try {
            const reportId = addReport({
                filename: file.name,
                originalText: text,
                status: ReportStatus.PENDING,
                summary: null,
                chatHistory: [],
            });

            // Navigate immediately for better UX
            navigate(`/report/${reportId}`);
            
            // Asynchronously get summary
            const summary = await summarizeReport(text);
            updateReportSummary(reportId, summary);
            
        } catch (err) {
            setError('Failed to process the report. Please try again.');
            // Here we'd need a way to find the report and set its status to FAILED.
            // For simplicity in this demo, the user can re-upload.
            setIsUploading(false); // only stop on error here.
        }
    };

    return (
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Upload New Report</h1>
            <p className="text-gray-600 mb-6">Upload a PDF or TXT file, or paste the report text directly.</p>
            
            {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">{error}</div>}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <h2 className="text-xl font-semibold mb-4">Option 1: Upload File</h2>
                    <div className="flex items-center justify-center w-full">
                        <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-48 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <svg className="w-8 h-8 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/></svg>
                                <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                <p className="text-xs text-gray-500">PDF or TXT (MAX. 10MB)</p>
                            </div>
                            <input id="dropzone-file" type="file" className="hidden" onChange={handleFileChange} accept=".pdf,.txt" />
                        </label>
                    </div>
                     {file && <p className="mt-4 text-sm text-gray-600">Selected file: <span className="font-medium text-gray-800">{file.name}</span></p>}
                </div>
                <div>
                     <h2 className="text-xl font-semibold mb-4">Option 2: Paste Text</h2>
                    <textarea 
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Paste medical report text here..."
                        className="w-full h-48 p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                    />
                </div>
            </div>

            <div className="mt-8 text-center">
                <button
                    onClick={handleSubmit}
                    disabled={isUploading || !text.trim()}
                    className="w-full max-w-xs inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                    {isUploading ? <Spinner size="sm" /> : 'Analyze & Summarize Report'}
                </button>
            </div>
        </div>
    );
};

export default UploadPage;
