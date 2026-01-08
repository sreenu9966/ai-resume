import React from 'react';
import { useResume } from '../../context/ResumeContext';

export function AchievementsSection({ isWeb }) {
    const { resumeData } = useResume();
    const { achievements, themeColor, sectionVisibility } = resumeData;

    if (sectionVisibility?.achievements === false) return null;
    if (!achievements || achievements.length === 0) return null;

    const textColor = isWeb ? "text-slate-300" : "text-gray-700";

    return (
        <div className="mb-4">
            <h3 className={`text-base font-bold mb-2 pb-1.5 uppercase tracking-wider ${isWeb ? 'text-indigo-400' : ''}`}
                style={!isWeb ? { borderColor: themeColor, color: themeColor, borderBottomWidth: '2px' } : {}}>
                Achievements
            </h3>
            {achievements.map((ach) => (
                <div key={ach.id} className={`text-sm leading-snug flex items-start gap-2 mb-1 ${textColor}`}>
                    <span>&#8226;</span>
                    <span>{ach.title}</span>
                </div>
            ))}
        </div>
    );
}
