import React from 'react';
import { useResume } from '../../context/ResumeContext';
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
    const { fillSampleData, clearResume } = useResume();

    return (
        <div className="space-y-6 pb-20 h-full overflow-y-auto pr-2 custom-scrollbar">
            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-4 mb-4">
                <button
                    onClick={fillSampleData}
                    className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 hover:bg-indigo-600/20 transition-all font-medium text-sm"
                >
                    <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                    Fill Sample Data
                </button>
                <button
                    onClick={clearResume}
                    className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:bg-white/10 transition-all font-medium text-sm"
                >
                    Clear All
                </button>
            </div>

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
