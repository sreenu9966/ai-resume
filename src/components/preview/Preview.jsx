import React from 'react';
import { ResumePreview } from './ResumePreview';

export function Preview({ resumeRef }) {
    const [viewMode, setViewMode] = React.useState('pdf'); // 'pdf' or 'web'

    return (
        <div className="flex flex-col items-center gap-4 h-full">
            {/* Toggle Switch */}
            <div className="glass-panel p-1 rounded-lg flex items-center gap-1 flex-shrink-0">
                <button
                    onClick={() => setViewMode('pdf')}
                    className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${viewMode === 'pdf'
                        ? 'bg-indigo-500/20 text-indigo-300 shadow-sm'
                        : 'text-slate-400 hover:text-slate-200'
                        }`}
                >
                    Paper Mode
                </button>
                <button
                    onClick={() => setViewMode('web')}
                    className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${viewMode === 'web'
                        ? 'bg-indigo-500/20 text-indigo-300 shadow-sm'
                        : 'text-slate-400 hover:text-slate-200'
                        }`}
                >
                    Digital Portfolio
                </button>
            </div>

            {/* Preview Container */}
            <div className={`w-full flex justify-center transition-all duration-300 h-full overflow-hidden ${viewMode === 'pdf'
                ? 'pb-0'
                : ''
                }`}>
                <div className={`${viewMode === 'pdf'
                    ? 'border border-white/10 bg-slate-900/50 p-8 rounded-xl overflow-y-auto custom-scrollbar h-full w-full'
                    : 'w-full max-w-5xl h-full overflow-y-auto custom-scrollbar'
                    }`}>
                    <ResumePreview ref={resumeRef} viewMode={viewMode} />
                </div>
            </div>
        </div>
    );
}
