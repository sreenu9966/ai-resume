import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
// import { FileText, Github, LogIn, LogOut, User } from 'lucide-react'; // Removed unused icons
import { FileText, User, LogOut, ChevronDown } from 'lucide-react';
// import { useAuth } from '../../context/AuthContext'; // Removed
// import { AuthModal } from '../auth/AuthModal'; // Removed

export function Navbar({ onOpenAuth }) {
    // const { currentUser, loginWithGoogle, logout } = useAuth(); // Removed
    const navigate = useNavigate();
    const location = useLocation();
    // const [showAuthModal, setShowAuthModal] = useState(false); // Removed

    const [user, setUser] = useState(null);
    const [showDropdown, setShowDropdown] = useState(false);

    // Check for user/token on mount and when interactions happen
    React.useEffect(() => {
        const checkUser = () => {
            const token = localStorage.getItem('token');
            const userData = localStorage.getItem('user');
            if (token && userData) {
                try {
                    setUser(JSON.parse(userData));
                } catch (e) {
                    setUser(null);
                }
            } else {
                setUser(null);
            }
        };

        checkUser();

        // Listen for storage events (login from other tab/modal)
        window.addEventListener('storage', checkUser);
        // Also listen for custom event if we dispatch it
        window.addEventListener('auth-change', checkUser);

        return () => {
            window.removeEventListener('storage', checkUser);
            window.removeEventListener('auth-change', checkUser);
        };
    }, [location.pathname]); // Re-check on route change too

    // Close dropdown when clicking outside
    React.useEffect(() => {
        const handleClickOutside = (event) => {
            if (showDropdown && !event.target.closest('.relative-dropdown')) {
                setShowDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showDropdown]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        setShowDropdown(false);
        navigate('/');
        // Force re-render of other components if needed
        window.dispatchEvent(new Event('auth-change'));
    };

    // const handleLogout = async () => {
    //     try {
    //         await logout();
    //         navigate('/');
    //     } catch (error) {
    //         console.error("Logout failed", error);
    //     }
    // };

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-slate-950/50 backdrop-blur-xl"
        >
            {/* <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} /> */}

            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-2 group">
                    <div className="p-2 rounded-xl bg-indigo-500/20 group-hover:bg-indigo-500/30 transition-colors">
                        <FileText className="w-6 h-6 text-indigo-400" />
                    </div>
                    <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">
                        ResumeAI
                    </span>
                </Link>

                <div className="hidden md:flex items-center gap-8">
                    <a href="#how-it-works" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">How it Works</a>
                    <a href="#templates" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Templates</a>
                    <a href="#faq" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">FAQ</a>
                </div>

                <div className="flex items-center gap-4">
                    {/* Profile Dropdown or Login */}
                    {user ? (
                        <div className="relative relative-dropdown">
                            <button
                                onClick={() => setShowDropdown(!showDropdown)}
                                className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 transition-colors"
                            >
                                <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold">
                                    {user.name ? user.name.charAt(0).toUpperCase() : 'G'}
                                </div>
                                <span className="text-sm font-medium text-slate-200">{user.name || 'Guest'}</span>
                                <ChevronDown className="w-4 h-4 text-slate-400" />
                            </button>

                            {/* Dropdown Menu */}
                            {showDropdown && (
                                <div className="absolute right-0 mt-2 w-48 bg-slate-900 border border-white/10 rounded-xl shadow-xl overflow-hidden py-1 z-50">
                                    <div className="px-4 py-3 border-b border-white/5">
                                        <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Signed in as</p>
                                        <p className="text-sm font-medium text-white truncate">{user.name || 'Guest User'}</p>
                                    </div>

                                    <Link
                                        to="/dashboard"
                                        className="w-full text-left px-4 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-white/5 flex items-center gap-2 transition-colors"
                                        onClick={() => setShowDropdown(false)}
                                    >
                                        <User className="w-4 h-4" />
                                        My Profile
                                    </Link>

                                    <div className="h-px bg-white/5 my-1" />

                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-left px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 flex items-center gap-2 transition-colors"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        Sign out
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <button
                            onClick={onOpenAuth}
                            className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
                        >
                            Login
                        </button>
                    )}

                    <button
                        onClick={() => {
                            if (user && user.role !== 'guest') {
                                navigate('/builder');
                            } else {
                                onOpenAuth();
                            }
                        }}
                        className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition-colors shadow-lg shadow-indigo-500/25"
                    >
                        Create Resume
                    </button>
                </div>
            </div>
        </motion.nav>
    );
}
