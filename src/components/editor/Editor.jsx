import React from 'react';
import { PersonalForm } from './PersonalForm';
import { EducationForm } from './EducationForm';
import { ExperienceForm } from './ExperienceForm';
import { SkillsForm } from './SkillsForm';
import { SectionReorder } from './SectionReorder';
import { ThemeSelector } from './ThemeSelector';
import { ProjectsForm } from './ProjectsForm';
import { AchievementsForm } from './AchievementsForm';
import { ExtrasForm } from './ExtrasForm';


export function Editor() {
    return (
        <div className="space-y-6 pb-20 h-full overflow-y-auto pr-2 custom-scrollbar">
            <ThemeSelector />
            <PersonalForm />
            <SectionReorder />
            <EducationForm />
            <ExperienceForm />
            <ProjectsForm />
            <AchievementsForm />
            <ExtrasForm />
            <SkillsForm />
        </div>
    );
}
