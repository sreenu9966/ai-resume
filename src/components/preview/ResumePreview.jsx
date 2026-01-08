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

    // PDF Mode Classes
    // When generating (scale === 1), we remove shadow and margins to ensure 1:1 capture without shrinking
    // We also use specific A4 pixel dimensions (approx 794px x 1123px @ 96DPI) for better stability than 'mm' in some browsers
    const isGenerating = scale === 1;

    const pdfBaseClasses = clsx(
        "bg-white text-gray-900 origin-top pt-[6mm] px-[6mm] pb-[5mm]", // Top padding prevents clipping, small side padding minimizes gaps
        // Only apply shadow and centering when NOT generating
        !isGenerating && "shadow-2xl mx-auto transition-transform",
        // Strict dimensions: Fixed Height 295mm (A4 is 297mm) to guarantee 1 page
        "w-[210mm] h-[295mm] shrink-0 overflow-hidden"
    );

    // If scale is provided and NOT 1 (i.e. preview zoom), apply it. 
    // If scale is 1, we rely on the container to hold the 210mm document naturally.
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
                // Only apply transform if we are PREVIEWING (scale != 1). 
                // During generation (scale == 1), we want natural layout.
                style={!isWeb && scale && scale !== 1 ? { transform: `scale(${scale})` } : {}}
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
                isWeb && !isSidebar && "text-slate-200"
            )}
            id="resume-preview"
            style={!isWeb && scale && scale !== 1 ? { transform: `scale(${scale})` } : {}}
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
