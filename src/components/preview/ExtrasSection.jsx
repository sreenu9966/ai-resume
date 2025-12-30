import React from 'react';
import { useResume } from '../../context/ResumeContext';

export function ExtrasSection({ isWeb }) {
    const { resumeData, themeColor } = useResume();
    const { extras, extrasTitle } = resumeData;

    const boldExtras = (extras || []).filter(e => e.type === 'bold');
    const normalExtras = (extras || []).filter(e => e.type === 'normal');

    if ((!boldExtras.length && !normalExtras.length)) return null;

    const textColor = isWeb ? "text-slate-200" : "text-gray-800";
    const headerColor = isWeb ? "text-indigo-400" : "text-gray-900";
    const borderColor = isWeb ? "border-indigo-500/30" : "border-gray-300";

    return (
        <div className="mb-6">
            <h3 className={`text-lg font-bold uppercase tracking-wider mb-3 pb-1.5 border-b-2 ${headerColor} ${borderColor}`}
                style={!isWeb ? { color: themeColor, borderColor: themeColor } : {}}
            >
                {extrasTitle || 'Activities'}
            </h3>

            <div className="space-y-3">
                {boldExtras.length > 0 && (
                    <div className={`flex flex-wrap gap-3 ${textColor}`}>
                        {boldExtras.map((item) => (
                            <span key={item.id} className="font-bold bg-gray-100 dark:bg-white/10 px-2 py-1 rounded text-sm print:bg-transparent print:p-0" style={{ fontWeight: 700 }}>
                                {item.text}
                            </span>
                        ))}
                    </div>
                )}

                {normalExtras.length > 0 && (
                    <ul className={`list-disc list-inside space-y-1 text-sm ${textColor}`}>
                        {normalExtras.map((item) => (
                            <li key={item.id} className="marker:text-gray-400">
                                {item.text}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}
