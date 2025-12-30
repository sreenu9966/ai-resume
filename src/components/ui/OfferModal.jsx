import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Gift, ArrowRight } from 'lucide-react';
import { Button } from './Button';

export function OfferModal({ isOpen, onClose, onApply }) {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="relative w-full max-w-md bg-gradient-to-br from-indigo-900 via-slate-900 to-black rounded-3xl shadow-2xl overflow-hidden border border-indigo-500/30"
                >
                    {/* Animated Background Sparkles */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/20 blur-[80px] rounded-full animate-pulse" />
                        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/20 blur-[80px] rounded-full animate-pulse delay-700" />
                    </div>

                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors z-10 p-1"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    <div className="p-8 text-center relative z-10">
                        <div className="w-16 h-16 bg-indigo-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-indigo-500/30">
                            <Gift className="w-8 h-8 text-indigo-400" />
                        </div>

                        <h2 className="text-3xl font-bold text-white mb-2 flex items-center justify-center gap-2">
                            New Year Offer! <Sparkles className="w-6 h-6 text-yellow-400" />
                        </h2>
                        <p className="text-indigo-200/80 mb-8">
                            Get 1 Year Premium Access for <span className="text-white font-bold">FREE</span> using our special New Year coupon.
                        </p>

                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8 group hover:border-indigo-500/50 transition-colors">
                            <p className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-2">Use Coupon Code</p>
                            <div className="text-3xl font-mono font-bold text-indigo-400 tracking-widest select-all">
                                RGNEW2026
                            </div>
                        </div>

                        <div className="space-y-4">
                            <Button
                                onClick={onApply}
                                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/25 transition-transform hover:scale-[1.02] active:scale-[0.98]"
                            >
                                Upgrade Now <ArrowRight className="w-4 h-4" />
                            </Button>
                            <button
                                onClick={onClose}
                                className="text-slate-400 hover:text-slate-300 text-sm font-medium transition-colors"
                            >
                                Maybe Later
                            </button>
                        </div>

                        <p className="mt-8 text-[10px] text-slate-500 uppercase tracking-widest font-bold">
                            Valid for limited time only
                        </p>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
