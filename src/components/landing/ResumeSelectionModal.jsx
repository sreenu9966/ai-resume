import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, FileText, UploadCloud, ArrowRight, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ImportModal } from './ImportModal';
// import { useAuth } from '../../context/AuthContext'; // Removed
// import { AuthModal } from '../auth/AuthModal'; // Removed

export function ResumeSelectionModal({ isOpen, onClose }) {
    const navigate = useNavigate();
    // const { currentUser } = useAuth(); // Removed
    const [showImportModal, setShowImportModal] = useState(false);
    // const [showAuthModal, setShowAuthModal] = useState(false); // Removed

    if (!isOpen) return null;

    // If Import Modal is active, render it instead (or on top)
    if (showImportModal) {
        return <ImportModal isOpen={true} onClose={() => {
            setShowImportModal(false);
            onClose(); // Close parent too if needed, or just go back
        }} />;
    }

    const handleCreateNew = () => {
        onClose();
        navigate('/builder');
    };

    const handleImport = () => {
        setShowImportModal(true);
    };

    return (
        <AnimatePresence>
            {/* <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} /> */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="relative w-full max-w-2xl bg-slate-900 border border-white/10 rounded-3xl p-8 shadow-2xl overflow-hidden"
                >
                    {/* Background Glow */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -z-10" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl -z-10" />

                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 text-slate-400 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-full"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    <div className="text-center mb-10">
                        <h2 className="text-3xl font-bold text-white mb-3">How would you like to start?</h2>
                        <p className="text-slate-400">Choose the best way to build your professional resume.</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Option 1: Create New */}
                        <button
                            onClick={handleCreateNew}
                            className="group relative p-6 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-indigo-500/50 text-left transition-all hover:scale-[1.02]"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/0 via-indigo-500/0 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />

                            <div className="w-12 h-12 rounded-full bg-indigo-500/20 flex items-center justify-center mb-4 group-hover:bg-indigo-500 transition-colors">
                                <FileText className="w-6 h-6 text-indigo-400 group-hover:text-white" />
                            </div>

                            <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                                Create from Scratch
                                <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                            </h3>
                            <p className="text-sm text-slate-400 leading-relaxed">
                                Start with a clean slate. Fill in your details manually using our smart editor and templates.
                            </p>
                        </button>

                        {/* Option 2: Import with AI */}
                        <button
                            onClick={handleImport}
                            className="group relative p-6 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-purple-500/50 text-left transition-all hover:scale-[1.02]"
                        >
                            <div className="absolute top-4 right-4 px-2 py-0.5 rounded-full bg-purple-500/20 border border-purple-500/30 text-[10px] font-bold text-purple-300 uppercase tracking-wide">
                                Beta
                            </div>

                            <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center mb-4 group-hover:bg-purple-500 transition-colors">
                                <UploadCloud className="w-6 h-6 text-purple-400 group-hover:text-white" />
                            </div>

                            <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                                Import with AI
                                <Sparkles className="w-4 h-4 text-amber-400" />
                            </h3>
                            <p className="text-sm text-slate-400 leading-relaxed">
                                Upload an existing PDF resume. Our AI will extract your data and format it perfectly.
                            </p>
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
