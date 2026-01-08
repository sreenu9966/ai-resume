import React from 'react';
import { useResume } from '../../context/ResumeContext';

export function ProjectsSection({ isWeb }) {
    const { resumeData } = useResume();
    const { projects, themeColor, sectionVisibility } = resumeData;

    if (sectionVisibility?.projects === false) return null;
    if (!projects || projects.length === 0) return null;

    const textColor = isWeb ? "text-slate-200" : "text-gray-900";
    const subTextColor = isWeb ? "text-slate-400" : "text-gray-600";

    return (
        <div className="mb-4">
            <h3 className={`text-base font-bold uppercase tracking-wider mb-2 pb-1.5 ${isWeb ? 'text-indigo-400' : ''}`}
                style={!isWeb ? { borderColor: themeColor, color: themeColor, borderBottomWidth: '2px' } : { borderColor: 'rgba(99, 102, 241, 0.3)', borderBottomWidth: '2px' }}>
                Projects
            </h3>
            <div className="space-y-4">
                {projects.map((proj) => (
                    <div key={proj.id}>
                        <div className="flex justify-between items-baseline mb-0.5">
                            <h4 className={`font-bold text-sm flex items-center gap-2 ${textColor}`}>
                                {proj.name}
                                {proj.link && (
                                    <a href={`https://${proj.link.replace(/^https?:\/\//, '')}`} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 hover:text-blue-400 hover:underline font-normal">
                                        🔗
                                    </a>
                                )}
                            </h4>
                        </div>

                        {(proj.date || proj.description) && (
                            <div className={`w-full text-start text-sm ${subTextColor}`}>
                                <span className="mr-2">&#8226;</span>
                                <span className="mr-1">{proj.date}</span>
                                {proj.description && (
                                    <>
                                        <span> - </span>
                                        <span>{proj.description}</span>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
