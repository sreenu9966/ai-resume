import React from 'react';
import { motion } from 'framer-motion';
import { UserCircle2, Palette, Download, Share2 } from 'lucide-react';

const steps = [
    {
        icon: UserCircle2,
        title: "Enter Your Details",
        description: "Fill in your experience, skills, and education. Our easy-to-use editor guides you through each section."
    },
    {
        icon: Palette,
        title: "Choose a Template",
        description: "Select from our range of professional, ATS-friendly templates. Switch designs with a single click."
    },
    {
        icon: Download,
        title: "Download PDF",
        description: "Get a polished, print-ready PDF generated instantly. Perfect for job applications."
    },
    {
        icon: Share2,
        title: "Share Online",
        description: "Get a unique link to your digital portfolio. Share it directly with recruiters or on LinkedIn."
    }
];

export function HowItWorks() {
    return (
        <section id="how-it-works" className="py-24 relative">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-100 mb-4">How It Works</h2>
                    <p className="text-slate-400 max-w-2xl mx-auto">
                        Create a job-winning resume in four simple steps. Our streamlined process makes it effortless.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {steps.map((step, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors group"
                        >
                            <div className="w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <step.icon className="w-6 h-6 text-indigo-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-slate-100 mb-2">{step.title}</h3>
                            <p className="text-slate-400 leading-relaxed text-sm">{step.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
