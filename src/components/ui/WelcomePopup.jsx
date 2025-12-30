import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Mail, MessageSquare, Timer, Lock, Rocket, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

export function WelcomePopup() {
    const [isOpen, setIsOpen] = useState(false);
    const [countdown, setCountdown] = useState(10);
    const [hasSubmitted, setHasSubmitted] = useState(false);
    const [canAccess, setCanAccess] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });

    useEffect(() => {
        const hasEarlyAccess = localStorage.getItem('earlyAccessGranted');
        if (!hasEarlyAccess) {
            const timer = setTimeout(() => {
                setIsOpen(true);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, []);

    useEffect(() => {
        let timer;
        if (isOpen && hasSubmitted && countdown > 0) {
            timer = setInterval(() => {
                setCountdown(prev => prev - 1);
            }, 1000);
        } else if (countdown === 0) {
            setCanAccess(true);
        }
        return () => clearInterval(timer);
    }, [isOpen, hasSubmitted, countdown]);

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await fetch('https://submit-form.com/8est8DjK1', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                setHasSubmitted(true);
                toast.success('Form submitted! Access will be granted in 10 seconds.');
            } else {
                throw new Error('Form submission failed');
            }
        } catch (error) {
            console.error('Submission error:', error);
            toast.error('Submission failed. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const grantAccess = () => {
        localStorage.setItem('earlyAccessGranted', 'true');
        setIsOpen(false);
        toast.success('Early Access Granted! Enjoy building your resume.', {
            icon: '🚀',
            duration: 5000
        });
        window.location.reload();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-slate-950/90 backdrop-blur-md"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="relative w-full max-w-lg bg-slate-900 border border-white/10 rounded-3xl shadow-2xl overflow-hidden"
                    >
                        {/* Decorative bar */}
                        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

                        {!canAccess && (
                            <button
                                onClick={() => setIsOpen(false)}
                                className="absolute top-4 right-4 p-2 text-slate-500 hover:text-white transition-colors rounded-full hover:bg-white/5"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        )}

                        <div className="p-8 sm:p-10">
                            <div className="flex flex-col items-center text-center mb-8">
                                <div className="p-4 rounded-3xl bg-indigo-500/10 border border-indigo-500/20 mb-6">
                                    {canAccess ? (
                                        <CheckCircle2 className="w-12 h-12 text-emerald-400" />
                                    ) : (
                                        <Lock className="w-12 h-12 text-indigo-400" />
                                    )}
                                </div>
                                <h2 className="text-3xl font-bold text-white mb-2">
                                    {canAccess ? 'Access Ready!' : 'Welcome to ResumeAI'}
                                </h2>
                                <p className="text-slate-400 text-sm">
                                    {canAccess
                                        ? 'Your early access has been verified. You can now start creating your professional resume.'
                                        : 'Please complete the form below to receive instant early access to our premium resume builder.'}
                                </p>
                            </div>

                            {!hasSubmitted ? (
                                <form onSubmit={handleFormSubmit} className="space-y-4">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Your Name</label>
                                        <div className="relative">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                            <input
                                                type="text"
                                                required
                                                placeholder="Name"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                className="w-full bg-slate-950 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all shadow-inner"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Email Address</label>
                                        <div className="relative">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                            <input
                                                type="email"
                                                required
                                                placeholder="Email"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                className="w-full bg-slate-950 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all shadow-inner"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Your Message</label>
                                        <div className="relative">
                                            <MessageSquare className="absolute left-4 top-4 w-4 h-4 text-slate-500" />
                                            <textarea
                                                required
                                                placeholder="Message"
                                                rows="3"
                                                value={formData.message}
                                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                                className="w-full bg-slate-950 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all shadow-inner resize-none"
                                            ></textarea>
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-600/50 text-white font-bold py-5 rounded-2xl shadow-lg shadow-indigo-600/30 transition-all active:scale-[0.98] flex items-center justify-center gap-3 mt-4 group"
                                    >
                                        {isSubmitting ? (
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        ) : (
                                            <>
                                                Send & Get Access
                                                <Rocket className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                            </>
                                        )}
                                    </button>
                                </form>
                            ) : (
                                <div className="space-y-8">
                                    {!canAccess ? (
                                        <div className="flex flex-col items-center gap-6">
                                            <div className="relative w-28 h-28 flex items-center justify-center bg-white/5 rounded-full border border-white/10">
                                                <svg className="absolute inset-0 w-full h-full -rotate-90">
                                                    <circle
                                                        cx="56"
                                                        cy="56"
                                                        r="52"
                                                        stroke="currentColor"
                                                        strokeWidth="4"
                                                        fill="transparent"
                                                        className="text-white/5"
                                                    />
                                                    <circle
                                                        cx="56"
                                                        cy="56"
                                                        r="52"
                                                        stroke="currentColor"
                                                        strokeWidth="4"
                                                        fill="transparent"
                                                        strokeDasharray={326}
                                                        strokeDashoffset={326 - (326 * countdown) / 10}
                                                        className="text-indigo-500 transition-all duration-1000"
                                                    />
                                                </svg>
                                                <span className="text-4xl font-black text-white font-mono">{countdown}</span>
                                            </div>
                                            <div className="text-slate-400 text-sm font-medium animate-pulse flex items-center gap-3">
                                                <Timer className="w-4 h-4 text-indigo-400" />
                                                Verifying Early Access...
                                            </div>
                                        </div>
                                    ) : (
                                        <motion.button
                                            initial={{ scale: 0.9, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            onClick={grantAccess}
                                            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black py-6 rounded-2xl shadow-lg shadow-emerald-600/30 transition-all active:scale-[0.98] flex items-center justify-center gap-4 group"
                                        >
                                            CLICK HERE TO ACCESS
                                            <Rocket className="w-6 h-6 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                        </motion.button>
                                    )}
                                </div>
                            )}

                            <div className="mt-8 pt-8 border-t border-white/5 grid grid-cols-2 gap-4 text-[10px] text-slate-500">
                                <div className="flex items-center gap-1.5 font-medium">
                                    <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                                    Instant Activation
                                </div>
                                <div className="flex items-center gap-1.5 font-medium">
                                    <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                                    Priority Support
                                </div>
                                <div className="col-span-2 text-center mt-2 italic px-4 py-2 bg-indigo-500/5 rounded-xl border border-indigo-500/10 text-indigo-400/80 leading-relaxed font-medium">
                                    ⚠️ Note: Login/Signup & AI Import features are currently under development.
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
