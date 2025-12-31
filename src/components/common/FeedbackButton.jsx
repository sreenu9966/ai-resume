import React from 'react';
import { MessageSquareText } from 'lucide-react';

export const FeedbackButton = () => {
    return (
        <a
            href="https://forms.gle/udmWyKuUgSE3gYuF6"
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-24 lg:bottom-6 right-6 z-[100] flex items-center justify-center w-14 h-14 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full shadow-lg hover:shadow-indigo-500/50 transition-all duration-300 transform hover:scale-110 group"
            aria-label="Send Feedback"
        >
            <MessageSquareText className="w-7 h-7" />
            <span className="absolute right-full mr-4 bg-slate-900 text-slate-200 text-sm font-medium px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 whitespace-nowrap pointer-events-none shadow-xl border border-slate-700 translate-x-2 group-hover:translate-x-0">
                Feedback
            </span>
        </a>
    );
};
