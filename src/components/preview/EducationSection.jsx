import React from 'react';
import { useResume } from '../../context/ResumeContext';

export function EducationSection({ isWeb }) {
    const { resumeData } = useResume();
    const { education, themeColor, sectionVisibility } = resumeData;

    if (sectionVisibility?.education === false) return null;
    if (!education || education.length === 0) return null;

    const textColor = isWeb ? "text-slate-200" : "text-gray-900";
    const subTextColor = isWeb ? "text-slate-400" : "text-gray-800";
    const descColor = isWeb ? "text-slate-500" : "text-gray-600";

    return (
        <div className="mb-4">
            <h3 className={`text-base font-bold uppercase tracking-wider mb-2 pb-1.5 ${isWeb ? 'text-indigo-400' : ''}`}
                style={!isWeb ? { borderColor: themeColor, color: themeColor, borderBottomWidth: '2px' } : {}}>
                Education
            </h3>
            <div className="space-y-2">
                {education.map((edu) => (
                    <div key={edu.id} className="leading-tight">
                        <div className="flex justify-between items-baseline mb-0">
                            <h4 className={`font-bold text-sm ${textColor}`}>{edu.school}</h4>

                        </div>
                        <div className="flex justify-between items-baseline mb-0">

                            <span className={`italic text-sm ${subTextColor}`}>{edu.degree}
                                {edu.description && (
                                    <span className={`text-sm mt-0 leading-none ${descColor}`} placeholder='Percentage/CGPA' > - {edu.description}</span>
                                )}

                            </span>
                            <span className={`text-sm font-medium whitespace-nowrap ml-4 ${isWeb ? 'text-slate-400' : 'text-gray-700'}`}>{edu.year}</span>
                        </div>

                    </div>
                ))}
            </div>
        </div>
    );
}
