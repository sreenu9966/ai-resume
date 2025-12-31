import React from 'react';
import { motion } from 'framer-motion';

export function Loader({ text = "Loading..." }) {
    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950/80 backdrop-blur-sm">
            <div className="relative w-16 h-16">
                {/* Outer Ring */}
                <motion.div
                    className="absolute inset-0 border-4 border-indigo-500/30 rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                />

                {/* Inner Spinner */}
                <motion.div
                    className="absolute inset-0 border-4 border-t-indigo-500 border-r-transparent border-b-indigo-500 border-l-transparent rounded-full"
                    animate={{ rotate: -360 }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                />

                {/* Center Dot */}
                <motion.div
                    className="absolute inset-[22px] bg-indigo-500 rounded-full"
                    animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />
            </div>

            {text && (
                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mt-6 text-sm font-medium text-indigo-400 uppercase tracking-widest"
                >
                    {text}
                </motion.p>
            )}
        </div>
    );
}
