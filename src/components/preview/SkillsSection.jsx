import React from 'react';
import { useResume } from '../../context/ResumeContext';

export function SkillsSection({ isWeb }) {
    const { resumeData } = useResume();
    const { skills, themeColor } = resumeData;

    if (!skills || skills.length === 0) return null;

    const textColor = isWeb ? "text-slate-300" : "text-gray-800";

    return (
        <div className="mb-6">
            <h3 className={`text-base font-bold uppercase tracking-wider mb-2 pb-1.5 ${isWeb ? 'text-indigo-400' : ''}`}
                style={!isWeb ? { borderColor: themeColor, color: themeColor, borderBottomWidth: '2px' } : { borderColor: 'rgba(99, 102, 241, 0.3)', borderBottomWidth: '2px' }}>
                Skills
            </h3>
            <div className="space-y-2">
                {skills.map((skillLine, index) => {
                    if (typeof skillLine !== 'string') return null;
                    const colonIndex = skillLine.indexOf(':');
                    if (colonIndex !== -1) {
                        const label = skillLine.substring(0, colonIndex + 1);
                        const value = skillLine.substring(colonIndex + 1);
                        return (
                            <div key={index} className={`text-sm leading-relaxed ${textColor}`}>
                                <span className={`font-bold ${isWeb ? 'text-slate-100' : ''}`}>{label}</span>{value}
                            </div>
                        );
                    }
                    return (
                        <div key={index} className={`text-sm leading-relaxed ${textColor}`}>
                            {skillLine}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
