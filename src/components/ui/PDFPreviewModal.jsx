import React, { useState } from 'react';
import { Button } from './Button';
import { X, Download, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

export function PDFPreviewModal({ isOpen, onClose, pdfUrl, onDownload }) {
    const [zoom, setZoom] = useState(100);

    if (!isOpen) return null;

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const handleZoomIn = () => setZoom(prev => Math.min(prev + 25, 200));
    const handleZoomOut = () => setZoom(prev => Math.max(prev - 25, 50));
    const handleResetZoom = () => setZoom(100);

    return (
        <div
            onClick={handleBackdropClick}
            className="fixed inset-0 z-[9999] flex flex-col items-center justify-start bg-slate-950/95 backdrop-blur-3xl p-4 sm:p-6 animate-in fade-in duration-200 overflow-hidden"
        >
            {/* Full Screen Container */}
            <div className="relative w-full h-full max-w-7xl flex flex-col items-center pointer-events-none">

                {/* Close Button - Top Right Floating */}
                <button
                    onClick={onClose}
                    className="absolute -top-2 -right-2 md:top-0 md:-right-12 z-50 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-md transition-all border border-white/10 group shadow-xl pointer-events-auto"
                    title="Close Preview"
                >
                    <X className="w-6 h-6 text-white/80 group-hover:text-white" />
                </button>

                {/* PDF Viewer - Main Content */}
                <div
                    className="w-full flex-1 bg-gray-900/50 rounded-xl overflow-hidden shadow-2xl border border-white/10 relative mt-2 pointer-events-auto flex items-center justify-center cursor-pointer"
                    onClick={handleBackdropClick}
                >
                    {pdfUrl ? (
                        <div
                            className="w-full h-full overflow-auto flex items-center justify-center p-4 custom-scrollbar cursor-default"
                            onClick={(e) => e.stopPropagation()} // Prevent closing when scrolling/clicking inside the scroll area
                        >
                            {/* Wrapper for Zoom */}
                            <div
                                style={{
                                    transform: `scale(${zoom / 100})`,
                                    transformOrigin: 'top center',
                                    transition: 'transform 0.2s ease-out',
                                    width: '100%',
                                    height: '100%',
                                    display: 'flex',
                                    justifyContent: 'center'
                                }}
                            >
                                <iframe
                                    src={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=0&view=FitV`}
                                    className="w-full h-full rounded-md bg-white shadow-lg"
                                    title="Resume Preview"
                                    style={{ maxWidth: '210mm', height: '100%', minHeight: '297mm' }}
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-full">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
                        </div>
                    )}
                </div>

                {/* Bottom Bar with Actions */}
                <div className="mt-4 flex items-center gap-4 pb-2 pointer-events-auto">

                    {/* Zoom Controls */}
                    <div className="flex items-center gap-2 bg-slate-900/80 backdrop-blur border border-white/10 rounded-full p-1.5 shadow-lg">
                        <button onClick={handleZoomOut} className="p-2 hover:bg-white/10 rounded-full text-white/70 hover:text-white transition">
                            <ZoomOut className="w-5 h-5" />
                        </button>
                        <span className="text-sm font-medium text-white w-12 text-center">{zoom}%</span>
                        <button onClick={handleZoomIn} className="p-2 hover:bg-white/10 rounded-full text-white/70 hover:text-white transition">
                            <ZoomIn className="w-5 h-5" />
                        </button>
                        <div className="w-px h-6 bg-white/10 mx-1"></div>
                        <button onClick={handleResetZoom} className="p-2 hover:bg-white/10 rounded-full text-white/70 hover:text-white transition" title="Reset Zoom">
                            <RotateCcw className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button
                            onClick={onClose}
                            className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold text-lg rounded-full border border-white/10 backdrop-blur transition-all"
                        >
                            Close
                        </Button>
                        <Button
                            onClick={onDownload}
                            className="px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-bold text-lg rounded-full shadow-[0_0_20px_rgba(99,102,241,0.5)] hover:shadow-[0_0_30px_rgba(99,102,241,0.7)] transition-all transform hover:scale-105 flex items-center gap-3 border border-white/10"
                        >
                            <Download className="w-6 h-6" />
                            Download PDF
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
