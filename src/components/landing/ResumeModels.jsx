import React from 'react';
import { motion } from 'framer-motion';
export function ResumeModels() {
    const navigate = useNavigate();
    const { updateTheme, fillSampleData } = useResume();

    const handleUseTemplate = (themeId) => {
        updateTheme(themeId.toLowerCase());
        fillSampleData();
        navigate('/builder');
        window.scrollTo(0, 0);
    };

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
                                <button
                                    onClick={() => handleUseTemplate(template.name)}
                                    className="px-6 py-2 bg-white text-black font-semibold rounded-full flex items-center gap-2 hover:bg-slate-200 transition-colors"
                                >
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
