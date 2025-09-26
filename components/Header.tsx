
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAppStore } from '../hooks/useAppStore';

const Header: React.FC = () => {
    const { user, logout } = useAppStore();
    const location = useLocation();

    return (
        <header className="bg-white shadow-md">
            <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
                <Link to="/" className="flex items-center space-x-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary-600" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V5zm4 0a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1zm-1 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                    </svg>
                    <span className="text-2xl font-bold text-gray-800">MediScan <span className="text-primary-600">AI</span></span>
                </Link>

                {user && (
                    <div className="flex items-center space-x-6">
                        <NavLink to="/dashboard" currentPath={location.pathname}>Dashboard</NavLink>
                        <NavLink to="/upload" currentPath={location.pathname}>Upload</NavLink>
                        <button
                            onClick={logout}
                            className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors duration-200 text-sm font-medium"
                        >
                            Logout
                        </button>
                    </div>
                )}
            </nav>
        </header>
    );
};

interface NavLinkProps {
    to: string;
    currentPath: string;
    children: React.ReactNode;
}

const NavLink: React.FC<NavLinkProps> = ({ to, currentPath, children }) => {
    const isActive = currentPath === to;
    return (
        <Link
            to={to}
            className={`text-sm font-medium ${isActive ? 'text-primary-600 border-b-2 border-primary-600' : 'text-gray-500 hover:text-primary-600'}`}
        >
            {children}
        </Link>
    );
};

export default Header;
