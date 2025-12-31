import React from 'react';
import { PersonalSection } from '../PersonalSection';
import { EducationSection } from '../EducationSection';
import { ExperienceSection } from '../ExperienceSection';
import { ProjectsSection } from '../ProjectsSection';
import { AchievementsSection } from '../AchievementsSection';
import { ExtrasSection } from '../ExtrasSection';
import { SkillsSection } from '../SkillsSection';

export const StandardTemplate = ({ isWeb, theme, sectionOrder }) => {

    const sectionComponents = {
        personal: PersonalSection,
        education: EducationSection,
        experience: ExperienceSection,
        projects: ProjectsSection,
        achievements: AchievementsSection,
        extras: ExtrasSection,
        skills: SkillsSection,
    };

    return (
        <div className="space-y-6">
            {sectionOrder.map((sectionId) => {
                const Component = sectionComponents[sectionId];
                if (!Component) return null;

                if (isWeb) {
                    return (
                        <div key={sectionId} className="glass-panel p-6 rounded-2xl hover:border-indigo-500/30 transition-colors duration-300">
                            <Component isWeb={true} theme={theme} />
                        </div>
                    );
                }

                return <Component key={sectionId} isWeb={isWeb} theme={theme} />;
            })}
        </div>
    );
};
