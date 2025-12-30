import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Wand2, Sparkles, CheckCircle2 } from 'lucide-react';
import { ResumeSelectionModal } from './ResumeSelectionModal';
// import Auth from '../auth/Auth'; // Removed


export function Hero({ onOpenAuth }) {
    const [showSelection, setShowSelection] = useState(false);

    return (
        <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
            <ResumeSelectionModal isOpen={showSelection} onClose={() => setShowSelection(false)} />

            {/* Background Gradients */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl z-0 pointer-events-none">
                <div className="absolute top-20 left-20 w-72 h-72 bg-indigo-500/30 rounded-full blur-[100px]" />
                <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/20 rounded-full blur-[100px]" />
            </div>

            <div className="container mx-auto px-4 relative z-10 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-8">
                        <Sparkles className="w-4 h-4 text-amber-400" />
                        <span className="text-sm font-medium text-slate-300">AI-Powered Resume Builder</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold text-slate-100 mb-6 tracking-tight leading-tight">
                        Craft Your <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400">Perfect Resume</span><br className="hidden md:block" /> in Minutes
                    </h1>

                    <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
                        Stand out with professional, ATS-friendly templates designed to land you interviews.
                        No design skills needed—just enter your details and let our AI handle the rest.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <button
                            onClick={() => {
                                const token = localStorage.getItem('token');
                                const user = JSON.parse(localStorage.getItem('user') || '{}');
                                if (token && user.role !== 'guest') {
                                    setShowSelection(true);
                                } else {
                                    onOpenAuth();
                                }
                            }}
                            className="px-8 py-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-lg flex items-center gap-2 transition-all hover:scale-105 shadow-xl shadow-indigo-500/20"
                        >
                            <Wand2 className="w-5 h-5" />
                            Build My Resume
                        </button>

                        <a
                            href="#how-it-works"
                            className="px-8 py-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 font-medium text-lg flex items-center gap-2 transition-all hover:scale-105"
                        >
                            Learn More
                        </a>
                    </div>

                    <div className="mt-12 flex items-center justify-center gap-8 text-sm text-slate-500">
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-green-500" /> No credit card required
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-green-500" /> ATS-Friendly
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-green-500" /> PDF Download
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
