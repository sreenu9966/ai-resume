import React, { useEffect } from 'react';
import { ResumePreview } from './ResumePreview';
import { useResume } from '../../context/ResumeContext';
import toast from 'react-hot-toast';

import { Plus, Minus } from 'lucide-react';

export function Preview({ resumeRef, isGenerating }) {
    const { resumeData, setIsOverOnePage } = useResume();
    const [viewMode, setViewMode] = React.useState('pdf'); // 'pdf' or 'web'
    const [zoom, setZoom] = React.useState(0.8);

    // Disable editing during generation to remove placeholders
    const isEditable = !isGenerating;

    const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.1, 1.5));
    const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.1, 0.4));

    // Check for single page limit
    useEffect(() => {
        if (resumeRef.current && viewMode === 'pdf') {
            // A4 height at 96 DPI is approx 1123px. We use 1130 as a safe threshold.
            // We measure the scrollHeight of the resume container.
            const height = resumeRef.current.scrollHeight;
            const A4_HEIGHT_PX = 1130;

            if (height > A4_HEIGHT_PX) {
                setIsOverOnePage(true);
                // Debounce toast to avoid spamming on every keystroke
                const toastId = 'page-limit-warning';
                toast.error(
                    "Single Page Limit Exceeded!\nFor the best resume, please keep it to one page.",
                    {
                        id: toastId,
                        duration: 4000,
                        icon: '⚠️',
                        style: {
                            borderRadius: '10px',
                            background: '#1e293b', // slate-800
                            color: '#fff',
                        },
                    }
                );
            } else {
                setIsOverOnePage(false);
            }
        } else {
            // Reset if not in PDF mode
            setIsOverOnePage(false);
        }
    }, [resumeData, resumeRef, viewMode, zoom]); // Re-run when data or view changes

    // Force PDF mode and 100% scale during generation to ensure clean export
    const currentViewMode = isGenerating ? 'pdf' : viewMode;
    const currentScale = isGenerating ? 1 : zoom;

    return (
        <div className="flex flex-col items-center gap-4 h-full relative">
            {/* Toggle Switch */}
            <div className="glass-panel p-1 rounded-lg flex items-center gap-1 flex-shrink-0 z-10">
                <button
                    onClick={() => setViewMode('pdf')}
                    className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${currentViewMode === 'pdf'
                        ? 'bg-indigo-500/20 text-indigo-300 shadow-sm'
                        : 'text-slate-400 hover:text-slate-200'
                        }`}
                >
                    Paper Mode
                </button>
                <button
                    onClick={() => setViewMode('web')}
                    className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${currentViewMode === 'web'
                        ? 'bg-indigo-500/20 text-indigo-300 shadow-sm'
                        : 'text-slate-400 hover:text-slate-200'
                        }`}
                >
                    Digital Portfolio
                </button>
            </div>

            {/* Zoom Controls (Only for PDF) */}
            {currentViewMode === 'pdf' && (
                <div className="absolute right-4 top-20 flex flex-col gap-2 z-20">
                    <button
                        onClick={handleZoomIn}
                        className="p-2 bg-slate-800 text-slate-200 rounded-full hover:bg-slate-700 hover:text-white transition-colors shadow-lg border border-white/10"
                        title="Zoom In"
                    >
                        <Plus className="w-5 h-5" />
                    </button>
                    <div className="bg-slate-900/80 text-white text-xs py-1 px-2 rounded text-center backdrop-blur-sm border border-white/5">
                        {Math.round(zoom * 100)}%
                    </div>
                    <button
                        onClick={handleZoomOut}
                        className="p-2 bg-slate-800 text-slate-200 rounded-full hover:bg-slate-700 hover:text-white transition-colors shadow-lg border border-white/10"
                        title="Zoom Out"
                    >
                        <Minus className="w-5 h-5" />
                    </button>
                </div>
            )}

            {/* Preview Container */}
            <div className={`w-full flex justify-center lg:overflow-hidden transition-all duration-300 h-full ${currentViewMode === 'pdf'
                ? 'pb-0'
                : ''
                }`}>
                <div className={`${currentViewMode === 'pdf'
                    ? 'border border-white/10 bg-slate-900/50 p-4 md:p-8 rounded-xl overflow-auto custom-scrollbar h-full w-full flex justify-start md:justify-center items-start'
                    : 'w-full max-w-5xl h-full overflow-y-auto custom-scrollbar'
                    }`}>
                    <ResumePreview ref={resumeRef} viewMode={currentViewMode} scale={currentScale} isEditable={isEditable} />
                </div>
            </div>
        </div>
    );
}
