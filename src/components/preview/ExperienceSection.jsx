import React from 'react';
import { useResume } from '../../context/ResumeContext';

export function ExperienceSection({ isWeb }) {
    const { resumeData } = useResume();
    const { experience, themeColor, experienceType, experienceTitle, fresherSummary, sectionVisibility } = resumeData;

    // Visibility Check
    if (sectionVisibility?.experience === false) return null;

    // Determine what to show
    const isFresher = experienceType === 'fresher';
    const hasExperience = experience && experience.length > 0;
    const hasFresherSummary = fresherSummary && fresherSummary.trim().length > 0;

    // If nothing to show in either mode, return null
    if (isFresher) {
        if (!hasFresherSummary) return null;
    } else {
        if (!hasExperience) return null;
    }

    const textColor = isWeb ? "text-slate-300" : "text-gray-700";
    const subTextColor = isWeb ? "text-slate-400" : "text-gray-600";

    return (
        <div className="mb-4">
            <h3 className={`text-base font-bold uppercase tracking-wider mb-2 pb-1.5 ${isWeb ? 'text-indigo-400' : ''}`}
                style={!isWeb ? { borderColor: themeColor, color: themeColor, borderBottomWidth: '2px' } : {}}>
                {experienceTitle}
            </h3>

            {isFresher ? (
                <div className={`text-sm whitespace-pre-line leading-relaxed ${textColor} text-justify`}>
                    {fresherSummary}
                </div>
            ) : (
                <div className="space-y-3">
                    {experience.map((exp) => (
                        <div key={exp.id}>
                            <h4 className={`text-sm font-bold ${textColor}`}>
                                {exp.role}
                            </h4>
                            <h5 className={`text-sm font-semibold flex items-center justify-between ${subTextColor}`}>
                                <span>
                                    {exp.company}
                                    {exp.location && <span className="ml-1 font-normal opacity-75">, {exp.location}</span>}
                                </span>
                                <span>{exp.date || exp.duration}</span>
                            </h5>
                            {exp.description && (
                                <div className={`text-sm whitespace-pre-line leading-snug ${subTextColor}`}>
                                    {exp.description}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
