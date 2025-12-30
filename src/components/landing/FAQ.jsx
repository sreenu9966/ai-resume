import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';

const faqs = [
    {
        question: "Is this resume builder free?",
        answer: "Yes, you can create and download your resume for free. We may introduce premium features in the future, but the core builder will always be accessible."
    },
    {
        question: "Are the templates ATS-friendly?",
        answer: "Absolutely. Our templates are designed with Applicant Tracking Systems (ATS) in mind, ensuring your resume gets parsed correctly by hiring software."
    },
    {
        question: "Can I download my resume as a PDF?",
        answer: "Yes, you can download your resume as a high-quality PDF document instantly with a single click."
    },
    {
        question: "Is my data secure?",
        answer: "Your data is stored locally in your browser's local storage. We do not store your personal information on our servers."
    }
];

export function FAQ() {
    const [openIndex, setOpenIndex] = useState(null);

    return (
        <section id="faq" className="py-24 bg-slate-900/30">
            <div className="container mx-auto px-4 max-w-3xl">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-100 mb-4">Frequently Asked Questions</h2>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            className="border border-white/10 rounded-xl bg-white/5 overflow-hidden transition-colors hover:border-white/20"
                        >
                            <button
                                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                className="w-full flex items-center justify-between p-6 text-left"
                            >
                                <span className="font-medium text-slate-200">{faq.question}</span>
                                {openIndex === index ? (
                                    <Minus className="w-5 h-5 text-indigo-400" />
                                ) : (
                                    <Plus className="w-5 h-5 text-slate-400" />
                                )}
                            </button>
                            <AnimatePresence>
                                {openIndex === index && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <div className="p-6 pt-0 text-slate-400 leading-relaxed border-t border-white/5">
                                            {faq.answer}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
