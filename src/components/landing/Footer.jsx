import React from 'react';
import { FileText, Twitter, Linkedin, Github, Heart } from 'lucide-react';

export function Footer() {
    return (
        <footer className="border-t border-white/10 bg-black/20 backdrop-blur-sm pt-16 pb-8">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <div className="p-2 rounded-xl bg-indigo-500/20">
                                <FileText className="w-6 h-6 text-indigo-400" />
                            </div>
                            <span className="text-xl font-bold text-slate-100">ResumeAI</span>
                        </div>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            Building professional, ATS-friendly resumes has never been easier.
                            Powered by AI to help you land your dream job.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-semibold text-slate-100 mb-4">Product</h4>
                        <ul className="space-y-2 text-sm text-slate-400">
                            <li><a href="#" className="hover:text-indigo-400 transition-colors">Templates</a></li>
                            <li><a href="#" className="hover:text-indigo-400 transition-colors">Examples</a></li>
                            <li><a href="#" className="hover:text-indigo-400 transition-colors">Pricing</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold text-slate-100 mb-4">Resources</h4>
                        <ul className="space-y-2 text-sm text-slate-400">
                            <li><a href="#" className="hover:text-indigo-400 transition-colors">Blog</a></li>
                            <li><a href="#" className="hover:text-indigo-400 transition-colors">Career Tips</a></li>
                            <li><a href="#" className="hover:text-indigo-400 transition-colors">Help Center</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold text-slate-100 mb-4">Legal</h4>
                        <ul className="space-y-2 text-sm text-slate-400">
                            <li><a href="#" className="hover:text-indigo-400 transition-colors">Privacy Policy</a></li>
                            <li><a href="#" className="hover:text-indigo-400 transition-colors">Terms of Service</a></li>
                            <li><a href="#" className="hover:text-indigo-400 transition-colors">Cookie Policy</a></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-sm text-slate-500 text-center md:text-left">
                        © 2024 ResumeAI. All rights reserved.
                    </p>
                    <div className="flex items-center gap-6">
                        <a href="#" className="text-slate-400 hover:text-indigo-400 transition-colors"><Twitter className="w-5 h-5" /></a>
                        <a href="#" className="text-slate-400 hover:text-indigo-400 transition-colors"><Linkedin className="w-5 h-5" /></a>
                        <a href="#" className="text-slate-400 hover:text-indigo-400 transition-colors"><Github className="w-5 h-5" /></a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
