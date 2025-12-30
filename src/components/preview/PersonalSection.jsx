import React from 'react';
import { useResume } from '../../context/ResumeContext';
import './personal.css';



export function PersonalSection({ isWeb, theme }) {
    const { resumeData } = useResume();
    const { personal, themeColor } = resumeData;

    const isCentered = theme === 'classic' || theme === 'elegant';
    const containerClass = isCentered ? "text-center" : "text-left";
    const headerClass = isCentered ? "justify-center" : "justify-start";

    const textColor = isWeb ? "text-slate-100" : "text-gray-900";
    const mutedColor = isWeb ? "text-slate-400" : "text-gray-600";
    // const borderColor = isWeb ? "border-white/10" : "border-gray-100"; // Unused now?

    const alignClass = isCentered ? "text-center" : "text-left";

    return (
        <div className={`${containerClass} mb-6 w-full`}>
            {personal.photo && (
                <div className={`flex ${headerClass} mb-4`}>
                    <img
                        src={personal.photo}
                        alt={personal.fullName}
                        className={`w-24 h-24 rounded-full object-cover border-4 ${isWeb ? 'border-white/10' : 'border-gray-200'}`}
                    />
                </div>
            )}
            <h1 className={`text-3xl font-bold uppercase tracking-wide mb-2 ${alignClass} ${textColor} ${theme === 'elegant' ? 'font-serif italic' : ''}`}>
                {personal.fullName || 'YOUR NAME'}
            </h1>
            <h2 className={`text-sm font-bold tracking-wider mb-3 uppercase ${alignClass} ${isWeb ? 'gradient-text' : ''}`}
                style={!isWeb ? { color: themeColor } : {}}>
                {personal.role || 'JOB TITLE'}
            </h2>

            <div className={`flex flex-wrap ${headerClass} gap-4 text-sm mb-4 ${mutedColor}`}>
                {personal.email && (
                    <div className="flex items-center gap-1">
                        <span className={`font-semibold ${isWeb ? 'text-indigo-400' : 'text-gray-800'}`}>Email:</span>
                        <span>{personal.email}</span>
                    </div>
                )}
                {personal.phone && (
                    <div className="flex items-center gap-1">
                        <span className={`font-semibold ${isWeb ? 'text-indigo-400' : 'text-gray-800'}`}>Ph:</span>
                        <span>{personal.phone}</span>
                    </div>
                )}
                {personal.location && (
                    <div className="flex items-center gap-1">
                        <span className={`font-semibold ${isWeb ? 'text-indigo-400' : 'text-gray-800'}`}>Place:</span>
                        <span>{personal.location}</span>
                    </div>
                )}
            </div>

            {personal.summary && (
                <div className={`mt-4 w-full ${isWeb ? 'text-slate-300' : 'text-gray-700'}`}>
                    <h3 className={`text-left text-base font-bold uppercase tracking-wider mb-2 pb-1.5 ${isWeb ? 'text-indigo-400' : ''}`}
                        style={!isWeb ? { color: themeColor, borderColor: themeColor, borderBottomWidth: '2px' } : {}}>
                        Professional Summary
                    </h3>
                    <p className={`w-full text-left whitespace-pre-wrap leading-relaxed`}>
                        {personal.summary}
                    </p>
                </div>
            )}
        </div>
    );
}
