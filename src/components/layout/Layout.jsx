import React from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { FeedbackButton } from '../common/FeedbackButton';
import { MobileNotice } from '../ui/MobileNotice';

export function Layout({ children, onDownload, isGenerating, fullHeight = false }) {
    return (
        <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black text-slate-100 flex flex-col font-sans selection:bg-indigo-500/30 no-scrollbar">
            <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
            <Header onDownload={onDownload} isGenerating={isGenerating} />
            <main className={`flex-1 container mx-auto px-4 relative z-10 ${fullHeight ? 'py-4' : 'py-8'}`}>
                {children}
            </main>
            <Footer />
            <MobileNotice />
            <FeedbackButton />
        </div>
    );
}
