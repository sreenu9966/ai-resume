import React, { useState, useEffect } from 'react';
import { X, Monitor } from 'lucide-react';

export function MobileNotice() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const checkVisibility = () => {
            // Only run on mobile (simple check, or rely on CSS)
            // We'll rely on CSS for hiding on desktop, but logic runs anyway
            const lastDismissed = localStorage.getItem('mobileNoticeDismissed');

            if (!lastDismissed) {
                setIsVisible(true);
                return;
            }

            const FIVE_MINUTES = 5 * 60 * 1000;
            const now = Date.now();

            if (now - parseInt(lastDismissed) > FIVE_MINUTES) {
                setIsVisible(true);
            }
        };

        checkVisibility();
    }, []);

    const handleDismiss = () => {
        setIsVisible(false);
        localStorage.setItem('mobileNoticeDismissed', Date.now().toString());
    };

    if (!isVisible) return null;

    return (
        <div className="lg:hidden fixed bottom-4 left-4 right-4 z-50 animate-in slide-in-from-bottom duration-500">
            <div className="bg-slate-900/90 backdrop-blur-md border border-indigo-500/30 rounded-lg p-4 shadow-2xl flex items-start gap-4 ring-1 ring-white/10">
                <div className="p-2 bg-indigo-500/20 rounded-full shrink-0">
                    <Monitor className="w-5 h-5 text-indigo-400" />
                </div>
                <div className="flex-1">
                    <h3 className="text-sm font-semibold text-white mb-1">Better on Desktop</h3>
                    <p className="text-xs text-slate-300 leading-relaxed">
                        For the best experience, including easier editing and previewing, we recommend using a laptop or desktop computer.
                    </p>
                </div>
                <button
                    onClick={handleDismiss}
                    className="p-1 text-slate-400 hover:text-white transition-colors -mt-1 -mr-1"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}
