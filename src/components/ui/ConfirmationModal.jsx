import React from 'react';
import { X } from 'lucide-react';

export function ConfirmationModal({ isOpen, onClose, onConfirm, title, message }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-sm overflow-hidden relative animate-in zoom-in-95 duration-200">
                {/* Close X */}
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="p-6 flex flex-col items-center text-center">
                    {/* Red Circle X Icon */}
                    <div className="w-16 h-16 rounded-full border-4 border-red-400/30 flex items-center justify-center mb-4 text-red-500">
                        <X className="w-8 h-8" strokeWidth={3} />
                    </div>

                    <h3 className="text-2xl font-bold text-gray-700 mb-2">Are you sure?</h3>

                    <p className="text-gray-500 text-sm mb-8 leading-relaxed">
                        Do you really want to delete these records? This process cannot be undone.
                    </p>

                    <div className="flex gap-3 w-full">
                        <button
                            onClick={onClose}
                            className="flex-1 px-4 py-2 bg-gray-400 hover:bg-gray-500 text-white font-medium rounded transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onConfirm}
                            className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded transition-colors"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
