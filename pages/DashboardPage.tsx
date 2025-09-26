
import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppStore } from '../hooks/useAppStore';
import { Report, ReportStatus } from '../types';

const StatusBadge: React.FC<{ status: ReportStatus }> = ({ status }) => {
    const statusStyles = {
        [ReportStatus.PENDING]: 'bg-yellow-100 text-yellow-800',
        [ReportStatus.SUMMARIZED]: 'bg-green-100 text-green-800',
        [ReportStatus.FAILED]: 'bg-red-100 text-red-800',
    };
    return (
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusStyles[status]}`}>
            {status}
        </span>
    );
};

const ReportRow: React.FC<{ report: Report }> = ({ report }) => {
    const navigate = useNavigate();
    return (
        <tr className="hover:bg-gray-50 cursor-pointer" onClick={() => navigate(`/report/${report.id}`)}>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{report.filename}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(report.uploadDate).toLocaleString()}</td>
            <td className="px-6 py-4 whitespace-nowrap">
                <StatusBadge status={report.status} />
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <span className="text-primary-600 hover:text-primary-900">View Details</span>
            </td>
        </tr>
    );
};

const DashboardPage: React.FC = () => {
    const { reports, user } = useAppStore();

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Welcome, {user?.username}!</h1>
                <Link
                    to="/upload"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    Upload New Report
                </Link>
            </div>
            
            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                <div className="px-6 py-4 border-b">
                    <h2 className="text-xl font-semibold">Your Reports</h2>
                </div>
                {reports.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Filename</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Uploaded</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th scope="col" className="relative px-6 py-3"><span className="sr-only">View</span></th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {reports.map(report => <ReportRow key={report.id} report={report} />)}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center py-12">
                         <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No reports found</h3>
                        <p className="mt-1 text-sm text-gray-500">Get started by uploading your first medical report.</p>
                        <div className="mt-6">
                            <Link
                                to="/upload"
                                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                            >
                                Upload Report
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DashboardPage;
