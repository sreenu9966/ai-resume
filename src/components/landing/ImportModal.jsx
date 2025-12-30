import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, FileText, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { parseResumeWithGemini } from '../../services/gemini';
import { useNavigate } from 'react-router-dom';
import { useResume } from '../../context/ResumeContext';

export function ImportModal({ isOpen, onClose }) {
    const [dragActive, setDragActive] = useState(false);
    const [file, setFile] = useState(null);
    const [apiKey, setApiKey] = useState(import.meta.env.VITE_GEMINI_API_KEY || '');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [step, setStep] = useState('upload'); // upload, processing, success
    const navigate = useNavigate();
    const { updateResumeData } = useResume();

    const handleDrag = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    }, []);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            validateAndSetFile(e.dataTransfer.files[0]);
        }
    }, []);

    const handleChange = (e) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            validateAndSetFile(e.target.files[0]);
        }
    };

    const validateAndSetFile = (file) => {
        if (file.type !== 'application/pdf') {
            setError('Please upload a PDF file.');
            return;
        }
        setFile(file);
        setError(null);
    };

    const handleImport = async () => {
        if (!file || !apiKey) return;

        setIsLoading(true);
        setError(null);
        setStep('processing');

        try {
            // Direct PDF processing with Gemini 1.5 Flash
            const parsedData = await parseResumeWithGemini(file, apiKey);

            // Update Context
            updateResumeData(parsedData);

            setStep('success');

            // Short delay to show success state before redirect
            setTimeout(() => {
                navigate('/builder');
            }, 1500);

        } catch (err) {
            console.error(err);
            setError(err.message || 'Failed to process resume. Please check your API key and try again.');
            setStep('upload');
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="relative w-full max-w-lg bg-slate-900 border border-white/10 rounded-2xl p-6 shadow-2xl"
                >
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    <div className="mb-6">
                        <h2 className="text-xl font-bold text-white mb-2">Import with AI</h2>
                        <p className="text-slate-400 text-sm">
                            Upload your existing resume (PDF) and let our AI extract the details for you.
                        </p>
                    </div>

                    {step === 'processing' ? (
                        <div className="flex flex-col items-center justify-center py-12 space-y-4">
                            <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
                            <p className="text-slate-300 font-medium">Analyzing your resume...</p>
                            <p className="text-slate-500 text-xs text-center max-w-xs">
                                This may take a few seconds. We are extracting text and mapping it to our format.
                            </p>
                        </div>
                    ) : step === 'success' ? (
                        <div className="flex flex-col items-center justify-center py-12 space-y-4">
                            <CheckCircle2 className="w-16 h-16 text-green-500" />
                            <p className="text-white text-lg font-bold">Import Successful!</p>
                            <p className="text-slate-400 text-sm">Redirecting to builder...</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {/* File Upload Area */}
                            <div
                                className={`relative border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center transition-colors cursor-pointer
                                    ${dragActive ? 'border-indigo-500 bg-indigo-500/10' : 'border-slate-700 hover:border-slate-600 bg-slate-950'}
                                    ${file ? 'border-green-500/50 bg-green-500/5' : ''}
                                `}
                                onDragEnter={handleDrag}
                                onDragLeave={handleDrag}
                                onDragOver={handleDrag}
                                onDrop={handleDrop}
                                onClick={() => document.getElementById('resume-upload').click()}
                            >
                                <input
                                    id="resume-upload"
                                    type="file"
                                    className="hidden"
                                    accept=".pdf"
                                    onChange={handleChange}
                                />

                                {file ? (
                                    <>
                                        <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center mb-3">
                                            <FileText className="w-6 h-6 text-green-400" />
                                        </div>
                                        <p className="text-slate-200 font-medium">{file.name}</p>
                                        <p className="text-slate-500 text-xs mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                    </>
                                ) : (
                                    <>
                                        <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mb-3">
                                            <Upload className="w-6 h-6 text-slate-400" />
                                        </div>
                                        <p className="text-slate-300 font-medium">Click or drag PDF here</p>
                                        <p className="text-slate-500 text-xs mt-1">Maximum file size 10MB</p>
                                    </>
                                )}
                            </div>

                            {/* API Key Input (Hidden functionality) */}
                            {/* Key is auto-loaded from environment variables */}

                            {/* Error Message */}
                            {error && (
                                <div className="flex flex-col gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
                                    <div className="flex items-start gap-2">
                                        <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                        <span className="font-semibold">Error: {error}</span>
                                    </div>
                                    <div className="pl-6 text-slate-400">
                                        {error.includes('429') && <p>• Quota exceeded. Please try again later or use a paid key.</p>}
                                        {error.includes('400') && <p>• Bad Request. The PDF might be corrupted or too complex.</p>}
                                        {error.includes('401') && <p>• Invalid API Key. Please check your key.</p>}
                                        {error.includes('500') && <p>• Google AI Service Error. Try again in a moment.</p>}
                                    </div>
                                </div>
                            )}

                            {/* Actions */}
                            <button
                                onClick={handleImport}
                                disabled={!file || !apiKey || isLoading}
                                className="w-full py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium transition-colors shadow-lg shadow-indigo-500/25"
                            >
                                {isLoading ? 'Processing...' : 'Import Resume'}
                            </button>
                        </div>
                    )}
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
