import React from 'react';
import { useResume } from '../../context/ResumeContext';

export function SkillsSection({ isWeb }) {
    const { resumeData } = useResume();
    const { skills, skillsViewMode = 'categorized', skillsLayout = 'row', themeColor, sectionVisibility } = resumeData;

    if (sectionVisibility?.skills === false) return null;
    if (!skills || skills.length === 0) return null;

    const textColor = isWeb ? "text-slate-300" : "text-gray-800";

    // Normalize Data
    const rawSkills = Array.isArray(skills) ? skills : [];
    const isLegacy = rawSkills.length > 0 && typeof rawSkills[0] === 'string';

    // If Legacy, wrap in dummy group for consistent processing (or treat as ViewMode='list')
    // Actually, if ViewMode is 'list', we flatten everything.
    const allSkillsFlat = isLegacy
        ? rawSkills
        : rawSkills.reduce((acc, group) => [...acc, ...(group.items || [])], []);

    const skillGroups = isLegacy
        ? [{ id: 'legacy', name: 'Skills', items: rawSkills }]
        : rawSkills;

    const isListMode = skillsViewMode === 'list';

    return (
        <div className="mb-6 w-full break-inside-avoid">
            <h3 className={`text-base font-bold uppercase tracking-wider mb-3 pb-1.5 ${isWeb ? 'text-indigo-400' : ''}`}
                style={!isWeb ? { borderColor: themeColor, color: themeColor, borderBottomWidth: '2px' } : { borderColor: 'rgba(99, 102, 241, 0.3)', borderBottomWidth: '2px' }}>
                Skills
            </h3>

            {/* LIST VIEW MODE */}
            {isListMode ? (
                <div className={`${skillsLayout === 'row' ? 'flex flex-wrap gap-x-4 gap-y-2' : 'flex flex-col gap-1'} ${textColor} text-sm leading-relaxed`}>
                    {allSkillsFlat.map((skill, index) => (
                        <div key={index} className="flex items-center">
                            {/* Bullet for vertical list? Or just text? User asked for "Java\nPython" style. */}
                            {skillsLayout === 'column' && <span className="mr-2">•</span>}
                            <span>{skill}</span>
                            {/* Comma for horizontal list? */}
                            {skillsLayout === 'row' && index < allSkillsFlat.length - 1 && <span className="opacity-50 ml-1">,</span>}
                        </div>
                    ))}
                </div>
            ) : (
                // CATEGORIZED VIEW MODE
                <div className={`space-y-3 ${skillsLayout === 'column' ? 'flex flex-col' : 'grid grid-cols-1 sm:grid-cols-2 gap-4 space-y-0'}`}>
                    {skillGroups.map((group) => (
                        <div key={group.id} className="flex flex-col leading-relaxed">
                            {/* Category Label */}
                            <div className={`font-bold mb-1 ${isWeb ? 'text-slate-100' : 'text-gray-900 uppercase text-xs tracking-wide'}`}>
                                {group.name}
                            </div>
                            {/* Skills List - Always comma separated inside a category for compactness? Or line by line?
                               User said "frotend:java,css,html". So likely comma separated. 
                            */}
                            <div className={`flex flex-wrap gap-1 ${textColor} text-sm`}>
                                {group.items && group.items.length > 0 ? (
                                    <span>{group.items.join(', ')}</span>
                                ) : (
                                    <span className="opacity-50 italic">No skills added</span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
