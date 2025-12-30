import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

import modernTemplate from '../../assets/templates/modern.png';
import minimalTemplate from '../../assets/templates/minimal.png';
import creativeTemplate from '../../assets/templates/creative.png';

const templates = [
    {
        name: "Modern",
        image: modernTemplate,
        description: "Clean and professional, perfect for tech and corporate roles."
    },
    {
        name: "Minimal",
        image: minimalTemplate,
        description: "Simple and elegant, focusing purely on your content."
    },
    {
        name: "Creative",
        image: creativeTemplate,
        description: "Unique and artistic, designed to stand out from the crowd."
    }
];

export function ResumeModels() {
    return (
        <section id="templates" className="py-24">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-100 mb-4">Professional Templates</h2>
                    <p className="text-slate-400 max-w-2xl mx-auto">
                        Choose from our collection of ATS-optimized templates.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {templates.map((template, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="group relative rounded-2xl overflow-hidden aspect-[3/4] border border-white/10 bg-slate-900"
                        >
                            <img
                                src={template.image}
                                alt={template.name}
                                className="absolute inset-0 w-full h-full object-cover transition-opacity opacity-80 group-hover:opacity-100"
                            />

                            {/* Overlay */}
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-6 text-center">
                                <h3 className="text-2xl font-bold text-white mb-2">{template.name}</h3>
                                <p className="text-slate-300 mb-6">{template.description}</p>
                                <button className="px-6 py-2 bg-white text-black font-semibold rounded-full flex items-center gap-2 hover:bg-slate-200 transition-colors">
                                    Use Template <ArrowUpRight className="w-4 h-4" />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
