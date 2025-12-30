import React, { forwardRef } from 'react';
import { useResume } from '../../context/ResumeContext';
import { PersonalSection } from './PersonalSection';
import { EducationSection } from './EducationSection';
import { ExperienceSection } from './ExperienceSection';
import { ProjectsSection } from './ProjectsSection';
import { AchievementsSection } from './AchievementsSection';
import { ExtrasSection } from './ExtrasSection';

import { SkillsSection } from './SkillsSection';
import clsx from 'clsx';

export const ResumePreview = forwardRef((props, ref) => {
    const { resumeData, sectionOrder } = useResume();
    const { theme } = resumeData;

    const sectionComponents = {
        personal: PersonalSection,
        education: EducationSection,
        experience: ExperienceSection,
        projects: ProjectsSection,
        achievements: AchievementsSection,
        extras: ExtrasSection,

        skills: SkillsSection,
    };

    const themeClasses = {
        modern: 'font-sans text-gray-800',
        classic: 'font-serif text-gray-900',
        minimal: 'font-serif text-gray-700 tracking-tight',
        professional: 'font-sans text-slate-900',
        elegant: 'font-serif text-slate-800',
    };

    // Minimal override: maybe force clean simple sans
    const computedClass = themeClasses[theme] || themeClasses.modern;

    // Digital Mode Classes
    const webClasses = "w-full max-w-4xl mx-auto space-y-8 p-8 animate-fade-in";
    const pdfClasses = "bg-white p-[10mm] shadow-2xl mx-auto min-h-[297mm] w-[210mm] origin-top scale-[0.6] sm:scale-[0.8] md:scale-100 transition-transform text-gray-900";

    const isWeb = props.viewMode === 'web';

    return (
        <div
            ref={ref}
            className={clsx(
                isWeb ? webClasses : pdfClasses,
                !isWeb && computedClass,
                isWeb && "text-slate-200"
            )}
            id="resume-preview"
        >
            {/* Header / Hero Section */}
            {sectionOrder.map((sectionId) => {
                const Component = sectionComponents[sectionId];
                if (!Component) return null;

                // Wrapper for Web Mode Sections
                if (isWeb) {
                    return (
                        <div key={sectionId} className="glass-panel p-6 rounded-2xl hover:border-indigo-500/30 transition-colors duration-300">
                            <Component isWeb={true} />
                        </div>
                    );
                }

                return <Component key={sectionId} isWeb={isWeb} theme={theme} />;
            })}
        </div>
    );
});

ResumePreview.displayName = 'ResumePreview';
