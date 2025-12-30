import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import Auth from './Auth';

export function AuthModal({ isOpen, onClose, onSuccess }) {
    if (!isOpen) return null;

    const handleSuccess = onSuccess || onClose;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
                >
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors z-10"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    <div className="p-1">
                        <Auth onSuccess={handleSuccess} />

                        <div className="px-8 pb-6 mt-2">
                            <div className="relative flex py-2 items-center">
                                <div className="flex-grow border-t border-gray-200"></div>
                                <span className="flex-shrink-0 mx-4 text-gray-400 text-xs">OR</span>
                                <div className="flex-grow border-t border-gray-200"></div>
                            </div>

                            <button
                                onClick={() => {
                                    localStorage.setItem('token', 'guest-token');
                                    localStorage.setItem('user', JSON.stringify({ name: 'Guest User', role: 'guest' }));
                                    localStorage.removeItem('currentResumeId');
                                    handleSuccess(); // Trigger navigation callback
                                }}
                                className="w-full py-2.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium text-sm transition-colors mt-2"
                            >
                                Skip Login / Continue as Guest
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
