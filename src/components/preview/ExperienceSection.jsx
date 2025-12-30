import React from 'react';
import { useResume } from '../../context/ResumeContext';

export function ExperienceSection({ isWeb }) {
    const { resumeData } = useResume();
    const { experience, themeColor } = resumeData;

    if (!experience || experience.length === 0) return null;

    const textColor = isWeb ? "text-slate-300" : "text-gray-700";

    return (
        <div className="mb-4">
            <h3 className={`text-base font-bold uppercase tracking-wider mb-2 pb-1.5 ${isWeb ? 'text-indigo-400' : ''}`}
                style={!isWeb ? { borderColor: themeColor, color: themeColor, borderBottomWidth: '2px' } : {}}>
                Experience
            </h3>
            <div className="space-y-3">
                {experience.map((exp) => (
                    <ul key={exp.id}>
                        {exp.description && (
                            <li className={`text-sm whitespace-pre-line leading-relaxed flex items-start gap-2 ${textColor}`}>
                                <span>&#9679;</span>
                                <span>{exp.description}</span>
                            </li>
                        )}
                    </ul>
                ))}
            </div>
        </div>
    );
}
