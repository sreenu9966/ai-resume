import React, { useState } from 'react';
import { useResume } from '../../context/ResumeContext';
import { Input } from '../ui/Input';
import { Card } from '../ui/Card';
import { Sparkles, Loader2 } from 'lucide-react';
import { enhanceTextWithGemini } from '../../services/gemini';

export function PersonalForm() {
    const { resumeData, updatePersonal, setShowPaymentModal } = useResume();
    const { personal = {} } = resumeData || {};
    const [isEnhancing, setIsEnhancing] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        updatePersonal(name, value);
    };

    const handlePhotoUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                updatePersonal('photo', reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleEnhanceSummary = async () => {
        if (!personal.summary) return;

        // Subscription Check
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const isSubscribed = user.isSubscribed;

        if (!isSubscribed) {
            setShowPaymentModal(true);
            return;
        }

        setIsEnhancing(true);
        try {
            const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
            const enhancedText = await enhanceTextWithGemini(personal.summary, 'summary', apiKey);
            updatePersonal('summary', enhancedText);
        } catch (error) {
            console.error("Failed to enhance summary", error);
        } finally {
            setIsEnhancing(false);
        }
    };

    return (
        <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 text-slate-100">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2 flex items-center gap-4 mb-2">
                    <div className="w-20 h-20 rounded-full bg-slate-800 border-2 border-dashed border-slate-600 flex items-center justify-center overflow-hidden shrink-0">
                        {personal.photo ? (
                            <img src={personal.photo} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-xs text-slate-500 text-center px-1">Upload Photo</span>
                        )}
                    </div>
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                            Profile Photo
                        </label>
                        <div className="flex gap-2">
                            <label className="cursor-pointer px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition-colors shadow-lg shadow-indigo-500/25">
                                {personal.photo ? 'Change Photo' : 'Upload Photo'}
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handlePhotoUpload}
                                    className="hidden"
                                />
                            </label>
                            {personal.photo && (
                                <button
                                    onClick={() => updatePersonal('photo', null)}
                                    className="px-4 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/50 text-sm font-medium transition-colors"
                                >
                                    Remove
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                <Input
                    label="Full Name"
                    name="fullName"
                    value={personal.fullName}
                    onChange={handleChange}
                    placeholder="e.g. John Doe"
                />
                <Input
                    label="Job Title"
                    name="role"
                    value={personal.role}
                    onChange={handleChange}
                    placeholder="e.g. Software Engineer"
                />
                <Input
                    label="Email"
                    name="email"
                    type="email"
                    value={personal.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                />
                <Input
                    label="Phone"
                    name="phone"
                    value={personal.phone}
                    onChange={handleChange}
                    placeholder="+1 234 567 890"
                />
                <div className="md:col-span-2">
                    <Input
                        label="Location"
                        name="location"
                        value={personal.location}
                        onChange={handleChange}
                        placeholder="City, Country"
                    />
                </div>
                <div className="md:col-span-2">
                    <div className="flex justify-between items-center mb-1">
                        <label className="block text-sm font-medium text-slate-300">
                            Professional Summary
                        </label>
                        <button
                            onClick={handleEnhanceSummary}
                            disabled={isEnhancing || !personal.summary}
                            className="flex items-center gap-1.5 text-xs font-medium text-indigo-400 hover:text-indigo-300 disabled:opacity-50 transition-colors"
                        >
                            {isEnhancing ? (
                                <Loader2 className="w-3 h-3 animate-spin" />
                            ) : (
                                <Sparkles className="w-3 h-3" />
                            )}
                            {isEnhancing ? 'Enhancing...' : 'Enhance with AI'}
                        </button>
                    </div>
                    <textarea
                        className="w-full rounded-lg glass-input px-3 py-2 text-sm h-24 resize-none text-justify"
                        name="summary"
                        value={personal.summary}
                        onChange={handleChange}
                        placeholder="Brief overview of your professional background..."
                    />
                </div>
            </div>
        </Card>
    );
}
