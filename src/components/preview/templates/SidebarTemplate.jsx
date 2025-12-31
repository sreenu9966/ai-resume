import React from 'react';
import { PersonalSection } from '../PersonalSection';
import { EducationSection } from '../EducationSection';
import { ExperienceSection } from '../ExperienceSection';
import { ProjectsSection } from '../ProjectsSection';
import { AchievementsSection } from '../AchievementsSection';
import { ExtrasSection } from '../ExtrasSection';
import { SkillsSection } from '../SkillsSection';
import clsx from 'clsx';

export const SidebarTemplate = ({ isWeb, theme, sectionOrder }) => {

    // Theme-specific logic
    const isCascade = theme === 'cascade';

    const sidebarClasses = clsx(
        "col-span-4 pr-4 h-full min-h-screen", // Base
        isWeb && "border-white/10 border-r", // Web separator
        !isCascade && "border-r border-gray-200", // Standard Sidebar separator
        isCascade && "bg-slate-900 text-white p-6 -ml-8 py-8 pl-8", // Cascade: Full height dark bg (negative margin to stretch if needed, but grid handles it?)
        // Actually grid handles width. We need to make sure it covers height and padding.
    );

    const mainClasses = "col-span-8";

    // Re-adjust sections for Cascade? usually same structure.

    // Define which sections go to sidebar vs main
    // This could be dynamic later, but hardcoded for this "Structure" for now.
    const sidebarSections = ['personal', 'skills', 'extras', 'personal_details']; // personal_details isn't a separate section ID usually, but PersonalSection handles it.
    // Actually PersonalSection handles Name + Contact + Summary. 
    // We might need to split Summary out if we want it in the main column?
    // Current PersonalSection includes Summary.

    // Modification: We might need to effectively "hide" the summary key in PersonalSection if we want to render it separately, 
    // OR we just put PersonalSection in the Sidebar and it includes summary.
    // Usually Summary is in the Main column.

    // For this iteration, let's put Personal at top left.
    // If PersonalSection renders the summary, it will be in the sidebar. 
    // NOTE: We might need to update PersonalSection to accept a "hideSummary" prop if we want to render Summary elsewhere?
    // Or just let it be in sidebar for now.

    // Let's assume Personal, Skills, Extras in Left.
    // Experience, Education, Projects, Achievements in Right.

    const leftSections = ['personal', 'skills', 'extras'];
    const rightSections = ['experience', 'education', 'projects', 'achievements'];

    // In web mode, we might want to show some visual distinction
    const columnClass = isWeb ? "space-y-6" : "space-y-4";

    const sectionComponents = {
        personal: PersonalSection,
        education: EducationSection,
        experience: ExperienceSection,
        projects: ProjectsSection,
        achievements: AchievementsSection,
        extras: ExtrasSection,
        skills: SkillsSection,
    };

    const renderSection = (id) => {
        const Component = sectionComponents[id];
        if (!Component) return null;

        // Custom styling for Web mode wrappers
        if (isWeb) {
            return (
                <div key={id} className={clsx(
                    "glass-panel p-4 rounded-xl hover:border-indigo-500/30 transition-colors duration-300",
                    "mb-6",
                    // If inside colored sidebar, maybe adjust glass effect or remove it to avoid clashes?
                    // For now keep it.
                )}>
                    {/* Pass theme to component so it can adjust text color if needed (e.g. white text on dark sidebar) */}
                    <Component isWeb={true} theme={theme} isInSidebar={leftSections.includes(id) && isCascade} />
                </div>
            );
        }

        return (
            <div key={id} className="mb-4">
                <Component isWeb={isWeb} theme={theme} isInSidebar={leftSections.includes(id) && isCascade} />
            </div>
        );
    };

    return (
        <div className="grid gap-0 h-full" style={{ gridTemplateColumns: 'minmax(0, 3fr) minmax(0, 7fr)' }}>
            {/* Left Sidebar */}
            <div className={clsx(
                "min-h-full min-w-0",
                isCascade ? "bg-slate-800 text-white" : "border-r border-gray-200 text-gray-900",
                isWeb && !isCascade && "border-white/10 text-slate-200"
            )}>
                <div className={clsx("p-6", columnClass)}>
                    {leftSections.map(id => renderSection(id))}
                </div>
            </div>

            {/* Right Main Content */}
            <div className="p-6 min-w-0">
                <div className={columnClass}>
                    {/* We need to filter sectionOrder to preserve user's ordering preference within the columns if possible,
                        but for now we enforce the structural split */}
                    {rightSections.map(id => renderSection(id))}
                </div>
            </div>
        </div>
    );
};
