import React from 'react';
import { PersonalSection } from '../PersonalSection';
import { EducationSection } from '../EducationSection';
import { ExperienceSection } from '../ExperienceSection';
import { ProjectsSection } from '../ProjectsSection';
import { AchievementsSection } from '../AchievementsSection';
import { ExtrasSection } from '../ExtrasSection';
import { SkillsSection } from '../SkillsSection';
import { useResume } from '../../../context/ResumeContext';
import { EditableField } from '../../ui/EditableField';
import clsx from 'clsx';
import { User, GraduationCap, Briefcase, Award, Languages, MapPin, Phone, Mail, Globe } from 'lucide-react';

export const GeometricTemplate = ({ isWeb, theme, isEditable }) => {
    const { resumeData, updatePersonal } = useResume();
    const { personal, themeColor } = resumeData;

    // Fixed Color Scheme based on image (Blue)
    const primaryColor = '#2563eb'; // Royal Blue-ish
    const secondaryColor = '#1e40af'; // Darker Blue

    // Icons map for the section headers
    const IconMap = {
        education: GraduationCap,
        experience: Briefcase,
        projects: Briefcase,
        achievements: Award,
        extras: Languages, // Fallback
        skills: User // Fallback
    };

    // SECTION RENDERER for Main Column (Right)
    const RenderSection = ({ id, title, icon: Icon }) => {
        // We need custom rendering for these to match the specific "Card" style or "Header" style of the image.
        // The image shows sections with a header icon + text, changing color.

        // This is a bit tricky because we were using the generic XSection components before.
        // To get the EXACT look, we might need to override the internal styles of those components OR 
        // passing enough props to them to style themselves.
        // For now, let's wrap them and use CSS to force styles if needed, 
        // OR better: Create a "SectionWrapper" logic here.

        let Component = null;
        if (id === 'education') Component = EducationSection;
        if (id === 'experience') Component = ExperienceSection;
        if (id === 'projects') Component = ProjectsSection;
        if (id === 'achievements') Component = AchievementsSection;

        if (!Component) return null;

        return (
            <div className="mb-8">
                <div className="flex items-center gap-2 mb-4 border-b border-gray-300 pb-2">
                    {Icon && <Icon className="w-6 h-6 text-blue-600" />}
                    <h3 className="text-xl font-bold text-blue-700 uppercase tracking-wide">{title || id}</h3>
                </div>
                <Component isWeb={isWeb} theme={theme} />
            </div>
        );
    };

    // Helper for Skills rendering to match the "List" style in the image
    const RenderSkills = () => (
        <div className="mb-8">
            <div className="flex items-center gap-2 mb-3">
                <User className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-bold text-blue-700 uppercase">Skills</h3>
            </div>
            <SkillsSection isWeb={isWeb} theme={theme} variant="list" />
            {/* We might need to implement 'variant' support in SkillsSection to do a list instead of pills if it doesn't already */}
        </div>
    );

    return (
        <div className="w-full h-full bg-white relative overflow-hidden font-sans text-gray-800">
            {/* Background Pattern (Faint Geometric Lines) - Simulated with CSS/SVG */}
            <div className="absolute top-0 right-0 w-full h-[400px] opacity-10 pointer-events-none"
                style={{
                    backgroundImage: 'linear-gradient(135deg, #2563eb 1px, transparent 1px), linear-gradient(45deg, #2563eb 1px, transparent 1px)',
                    backgroundSize: '40px 40px'
                }}
            />

            {/* SINGLE MAIN GRID (30% Left / 70% Right) - Full Height */}
            <div className="grid gap-8 h-full p-8" style={{ gridTemplateColumns: 'minmax(0, 3fr) minmax(0, 7fr)' }}>

                {/* LEFT SIDEBAR (30%) */}
                <div className="space-y-6 min-w-0">

                    {/* Photo - Centered */}
                    <div className="flex justify-center">
                        <div className="relative w-32 h-32 rounded-full border-4 border-blue-600 p-1 bg-white shadow-lg">
                            {personal.photo ? (
                                <img src={personal.photo} alt="Profile" className="w-full h-full rounded-full object-cover" />
                            ) : (
                                <div className="w-full h-full rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                                    <User className="w-12 h-12" />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Name Block */}
                    <div className="bg-blue-600 text-white p-4 rounded-lg shadow-md -mx-2 text-center">
                        <EditableField
                            value={personal.fullName}
                            onSave={(val) => updatePersonal('fullName', val)}
                            className="text-xl font-bold block mb-1 break-words"
                            isWeb={isWeb}
                            isEditable={isEditable}
                            textStyle={{ color: 'white' }}
                        />
                        <EditableField
                            value={personal.role}
                            onSave={(val) => updatePersonal('role', val)}
                            className="text-xs font-medium text-blue-100 uppercase tracking-wider block"
                            isWeb={isWeb}
                            isEditable={isEditable}
                            textStyle={{ color: '#dbeafe' }}
                        />
                    </div>

                    {/* Contact Info - Vertical List */}
                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 space-y-3 text-sm text-gray-700">
                        <div className="flex items-start gap-3">
                            <Phone className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
                            <EditableField value={personal.phone} onSave={v => updatePersonal('phone', v)} isWeb={isWeb} className="break-all" />
                        </div>
                        <div className="flex items-start gap-3">
                            <Mail className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
                            <EditableField value={personal.email} onSave={v => updatePersonal('email', v)} isWeb={isWeb} className="break-all" />
                        </div>
                        <div className="flex items-start gap-3">
                            <MapPin className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
                            <EditableField value={personal.location} onSave={v => updatePersonal('location', v)} isWeb={isWeb} />
                        </div>
                        {/* 
                           Note: If website/link is needed, add here. 
                           For now, keeping it clean based on standard fields.
                        */}
                    </div>

                    {/* Skills */}
                    <div className="border-t border-gray-200 pt-6">
                        <RenderSkills />
                    </div>

                    {/* Languages */}
                    <div className="border-t border-gray-200 pt-6">
                        <div className="flex items-center gap-2 mb-3">
                            <Languages className="w-5 h-5 text-blue-600" />
                            <h3 className="text-sm font-bold text-blue-800 uppercase">Languages</h3>
                        </div>
                        <ExtrasSection isWeb={isWeb} theme={theme} />
                    </div>

                </div>

                {/* RIGHT MAIN CONTENT (70%) */}
                <div className="space-y-8 min-w-0">

                    {/* Professional Summary - Now at top of Main Content */}
                    <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-r-lg shadow-sm">
                        <div className="flex items-center gap-2 mb-3">
                            <User className="w-5 h-5 text-blue-600" />
                            <h3 className="text-lg font-bold text-blue-800 uppercase tracking-wide">Professional Summary</h3>
                        </div>
                        <EditableField
                            value={personal.summary}
                            onSave={(val) => updatePersonal('summary', val)}
                            className="text-gray-700 leading-relaxed text-sm text-justify"
                            multiline
                            isWeb={isWeb}
                        />
                    </div>

                    {/* Main Sections */}
                    <div className="space-y-8">
                        <RenderSection id="education" title="Education" icon={GraduationCap} />
                        <RenderSection id="experience" title="Experience" icon={Briefcase} />
                        {/* Projects could go here if needed, adding if data exists logic or just render */}
                        {/* <RenderSection id="projects" title="Projects" icon={Briefcase} /> */}
                        <RenderSection id="achievements" title="Awards" icon={Award} />
                    </div>
                </div>

            </div>
        </div>
    );
};
