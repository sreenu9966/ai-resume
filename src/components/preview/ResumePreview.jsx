import React, { forwardRef } from 'react';
import { useResume } from '../../context/ResumeContext';
import clsx from 'clsx';
import { StandardTemplate } from './templates/StandardTemplate';
import { SidebarTemplate } from './templates/SidebarTemplate';
import { GeometricTemplate } from './templates/GeometricTemplate';

export const ResumePreview = forwardRef((props, ref) => {
    const { resumeData, sectionOrder } = useResume();
    const { theme } = resumeData;
    const { viewMode, scale, isEditable = true } = props; // Accept scale and isEditable prop

    const themeClasses = {
        modern: 'font-sans text-gray-800',
        classic: 'font-serif text-gray-900',
        minimal: 'font-serif text-gray-700 tracking-tight',
        professional: 'font-sans text-slate-900',
        elegant: 'font-serif text-slate-800',
        // New Structured Themes
        executive: 'font-sans text-slate-800',
        creative: 'font-sans text-gray-800',
    };

    // Minimal override: maybe force clean simple sans
    const computedClass = themeClasses[theme] || themeClasses.modern;

    const isWeb = viewMode === 'web';

    // Digital Mode Classes
    const webClasses = "w-full mx-auto space-y-8 p-8 animate-fade-in";
    // Modified: Remove hardcoded scale classes if we have a dynamic scale
    // Base classes without scale:
    const pdfBaseClasses = "bg-white p-[10mm] shadow-2xl mx-auto min-h-[297mm] w-[210mm] origin-top transition-transform text-gray-900";

    // If scale is provided, use it. Otherwise fallback to responsive defaults.
    const pdfClasses = scale
        ? pdfBaseClasses
        : `${pdfBaseClasses} scale-[0.6] sm:scale-[0.8] md:scale-100`;

    // Template Selection
    // 1. Geometric / Creative
    if (theme === 'creative') {
        return (
            <div
                ref={ref}
                className={clsx(isWeb ? "w-full mx-auto animate-fade-in" : pdfClasses, "bg-white text-gray-800")}
                id="resume-preview"
                style={!isWeb && scale ? { transform: `scale(${scale})` } : {}}
            >
                {/* For Geometric, we override the standard padding container because it has full width elements */}
                <GeometricTemplate isWeb={isWeb} isEditable={isEditable} theme={theme} sectionOrder={sectionOrder} />
            </div>
        );
    }

    // 2. Sidebar Types
    const isSidebar = theme === 'executive' || theme === 'cascade';

    return (
        <div
            ref={ref}
            className={clsx(
                isWeb ? webClasses : pdfClasses,
                !isWeb && computedClass,
                isWeb && !isSidebar && "text-slate-200" // Only apply light text for Standard/Dark web themes, not the white-paper ones
            )}
            id="resume-preview"
            style={!isWeb && scale ? { transform: `scale(${scale})` } : {}}
        >
            {isSidebar ? (
                <SidebarTemplate isWeb={isWeb} isEditable={isEditable} theme={theme} sectionOrder={sectionOrder} />
            ) : (
                <StandardTemplate isWeb={isWeb} isEditable={isEditable} theme={theme} sectionOrder={sectionOrder} />
            )}
        </div>
    );
});

ResumePreview.displayName = 'ResumePreview';
