import React from 'react';
import { motion } from 'framer-motion';
import { Check, Zap, Layout, Shield } from 'lucide-react';

const benefits = [
    {
        title: "Real-time Preview",
        description: "See changes instantly as you type. No more guessing how your resume will look.",
        icon: Zap
    },
    {
        title: "Professional Layouts",
        description: "Designed by HR experts to ensure readability and clear hierarchy.",
        icon: Layout
    },
    {
        title: "Data Privacy",
        description: "Your data is stored locally in your browser. We don't sell your personal info.",
        icon: Shield
    }
];

export function Benefits() {
    return (
        <section className="py-24 bg-slate-900/50">
            <div className="container mx-auto px-4">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-100 mb-6">
                            Why Choose ResumeAI?
                        </h2>
                        <p className="text-slate-400 text-lg mb-8 leading-relaxed">
                            We combine advanced technology with proven design principles to help you create resumes that get noticed.
                        </p>

                        <div className="space-y-6">
                            {benefits.map((benefit, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    viewport={{ once: true }}
                                    className="flex gap-4"
                                >
                                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                                        <benefit.icon className="w-6 h-6 text-emerald-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-slate-100 mb-1">{benefit.title}</h3>
                                        <p className="text-slate-400 text-sm">{benefit.description}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl blur-2xl opacity-20" />
                        <div className="relative bg-slate-950 border border-white/10 rounded-2xl p-2 shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500">
                            {/* Placeholder for an image of the builder UI */}
                            <div className="aspect-[4/3] bg-slate-900 rounded-xl overflow-hidden flex items-center justify-center">
                                <span className="text-slate-600 font-medium">App Preview / Dashboard Screenshot</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
