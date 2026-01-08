import React from 'react';
import { useResume } from '../../context/ResumeContext';
import { EditableField } from '../ui/EditableField';
import './personal.css';

export function PersonalSection({ isWeb, theme }) {
    const { resumeData, updatePersonal } = useResume();
    const { personal, themeColor, sectionVisibility } = resumeData;

    if (sectionVisibility?.personal === false) return null;

    const isCentered = theme === 'classic' || theme === 'elegant';
    const containerClass = isCentered ? "text-center" : "text-left";
    const headerClass = isCentered ? "justify-center" : "justify-start";

    const textColor = isWeb ? "text-slate-100" : "text-gray-900";
    const mutedColor = isWeb ? "text-slate-400" : "text-gray-600";

    // Theme logic for styles is getting a bit complex, ideally Context handles this, but sticking to existing pattern for now.

    return (
        <div className={`${containerClass} mb-6 w-full`}>
            {personal.photo && (
                <div className={`flex ${headerClass} mb-4`}>
                    <img
                        src={personal.photo}
                        alt={personal.fullName}
                        crossOrigin="anonymous"
                        loading="eager"
                        className={`w-24 h-24 rounded-full object-cover border-4 ${isWeb ? 'border-white/10' : 'border-gray-200'}`}
                    />
                </div>
            )}

            <div className={`mb-2 ${theme === 'elegant' ? 'font-serif italic' : ''}`}>
                <EditableField
                    value={personal.fullName}
                    onSave={(val) => updatePersonal('fullName', val)}
                    placeholder="YOUR NAME"
                    isWeb={isWeb}
                    className={`text-3xl font-bold uppercase tracking-wide ${textColor}`}
                />
            </div>

            <div className={`mb-3 uppercase ${isWeb ? 'gradient-text' : ''}`} style={!isWeb ? { color: themeColor } : {}}>
                <EditableField
                    value={personal.role}
                    onSave={(val) => updatePersonal('role', val)}
                    placeholder="JOB TITLE"
                    isWeb={isWeb}
                    className={`text-sm font-bold tracking-wider block`}
                />
            </div>

            <div className={`flex flex-wrap ${headerClass} gap-4 text-sm mb-4 ${mutedColor}`}>
                {/* Contact info editing is tricky because of labels 'Email:', 'Ph:'. 
                     For now, we let them edit the value. Ideally, validaty checks? 
                     We keep it simple: edit the text. */}

                <div className="flex items-center gap-1">
                    <span className={`font-semibold ${isWeb ? 'text-indigo-400' : 'text-gray-800'}`}>Email:</span>
                    <EditableField
                        value={personal.email}
                        onSave={(val) => updatePersonal('email', val)}
                        placeholder="your@email.com"
                        isWeb={isWeb}
                    />
                </div>

                <div className="flex items-center gap-1">
                    <span className={`font-semibold ${isWeb ? 'text-indigo-400' : 'text-gray-800'}`}>Ph:</span>
                    <EditableField
                        value={personal.phone}
                        onSave={(val) => updatePersonal('phone', val)}
                        placeholder="+1 234 567 890"
                        isWeb={isWeb}
                    />
                </div>

                <div className="flex items-center gap-1">
                    <span className={`font-semibold ${isWeb ? 'text-indigo-400' : 'text-gray-800'}`}>Place:</span>
                    <EditableField
                        value={personal.location}
                        onSave={(val) => updatePersonal('location', val)}
                        placeholder="City, Country"
                        isWeb={isWeb}
                    />
                </div>
            </div>

            {/* Resume Summary */}
            {/* Note: In Sidebar layout, this might be rendered in the main column if we split it out. 
                But for now, it stays here. If SidebarTemplate puts PersonalSection in sidebar, Summary is in sidebar. */}
            <div className={`mt-4 w-full ${isWeb ? 'text-slate-300' : 'text-gray-700'}`}>
                {/* Heading */}
                <h3 className={`text-left text-base font-bold uppercase tracking-wider mb-2 pb-1.5 ${isWeb ? 'text-indigo-400' : ''}`}
                    style={!isWeb ? { color: themeColor, borderColor: themeColor, borderBottomWidth: '2px' } : {}}>
                    Professional Summary
                </h3>

                <EditableField
                    value={personal.summary}
                    onSave={(val) => updatePersonal('summary', val)}
                    placeholder="Write a professional summary..."
                    multiline={true} // Use textarea
                    isWeb={isWeb}
                    className="w-full text-justify whitespace-pre-wrap leading-relaxed block"
                />
            </div>
        </div>
    );
}
