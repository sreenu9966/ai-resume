import React from 'react';
import { Github, Twitter, Linkedin } from 'lucide-react';

export function Footer() {
    return (
        <footer className="border-t border-white/10 bg-slate-950/50 backdrop-blur-sm mt-auto">
            <div className="container mx-auto px-4 py-6">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="text-sm text-slate-400">
                        © {new Date().getFullYear()} ResumeGen. All rights reserved.
                    </div>

                    <div className="flex items-center gap-6">
                        <button
                            onClick={() => toast.success("We collect basic device info, IP, and location for security logging as per our privacy policy.", { icon: '🛡️' })}
                            className="text-slate-400 hover:text-indigo-400 transition-colors text-sm"
                        >
                            Privacy Policy
                        </button>
                        <a href="#" className="text-slate-400 hover:text-indigo-400 transition-colors text-sm">Terms of Service</a>
                        <a href="mailto:support@resumegen.com" className="text-slate-400 hover:text-indigo-400 transition-colors text-sm">Contact</a>
                    </div>

                    <div className="flex items-center gap-4">
                        <a href="#" className="text-slate-400 hover:text-white transition-colors">
                            <Github className="w-5 h-5" />
                        </a>
                        <a href="#" className="text-slate-400 hover:text-white transition-colors">
                            <Twitter className="w-5 h-5" />
                        </a>
                        <a href="#" className="text-slate-400 hover:text-white transition-colors">
                            <Linkedin className="w-5 h-5" />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
