
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import UploadPage from './pages/UploadPage';
import ReportDetailPage from './pages/ReportDetailPage';
import { useAppStore } from './hooks/useAppStore';

const App: React.FC = () => {
    const { user, reports } = useAppStore();

    return (
        <HashRouter>
            <div className="min-h-screen flex flex-col font-sans text-gray-800">
                <Header />
                <main className="flex-grow container mx-auto px-4 py-8">
                    <Routes>
                        <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <LoginPage />} />
                        <Route path="/dashboard" element={user ? <DashboardPage /> : <Navigate to="/login" />} />
                        <Route path="/upload" element={user ? <UploadPage /> : <Navigate to="/login" />} />
                        <Route path="/report/:id" element={user ? <ReportDetailPage /> : <Navigate to="/login" />} />
                        <Route path="*" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
                    </Routes>
                </main>
                <footer className="bg-gray-100 p-4 text-center text-sm text-gray-500 border-t">
                    MediScan AI &copy; 2024 - For Demonstration Purposes Only
                </footer>
            </div>
        </HashRouter>
    );
};

export default App;
