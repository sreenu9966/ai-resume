import React from 'react';
import { Button } from './Button';
import { X, Download } from 'lucide-react';

export function PDFPreviewModal({ isOpen, onClose, pdfUrl, onDownload }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl h-[90vh] flex flex-col animate-in fade-in zoom-in duration-200">
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-xl font-bold text-gray-800">Resume Preview</h2>
                    <div className="flex items-center gap-2">
                        <Button onClick={onDownload} variant="primary" className="flex items-center gap-2">
                            <Download className="w-4 h-4" /> Download PDF
                        </Button>
                        <Button onClick={onClose} variant="ghost" size="icon">
                            <X className="w-5 h-5" />
                        </Button>
                    </div>
                </div>

                <div className="flex-1 bg-gray-100 p-4 overflow-hidden relative">
                    {pdfUrl ? (
                        <iframe
                            src={pdfUrl}
                            className="w-full h-full rounded shadow-lg border"
                            title="PDF Preview"
                        />
                    ) : (
                        <div className="flex items-center justify-center h-full">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
