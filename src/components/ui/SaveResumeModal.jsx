import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export function SaveResumeModal({ isOpen, onClose, onConfirm, initialTitle }) {
    const [title, setTitle] = useState(initialTitle);

    useEffect(() => {
        setTitle(initialTitle);
    }, [initialTitle, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onConfirm(title);
    };

    return (
        <div
            className="fixed inset-0 z-[9999] flex items-start justify-center pt-[10vw] bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-md shadow-2xl w-full max-w-md overflow-hidden relative animate-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close X */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="p-8">
                    <h3 className="text-xl font-bold text-gray-800 mb-6">
                        Name your Resume
                    </h3>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all text-gray-800 placeholder-gray-400"
                            placeholder="Enter resume name..."
                            autoFocus
                        />

                        <button
                            type="submit"
                            className="px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md transition-colors shadow-sm"
                        >
                            Save Resume
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
