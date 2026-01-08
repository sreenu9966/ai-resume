import { DessertIcon } from 'lucide-react';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { resumeService } from '../services/resumeService';

const sampleResumeData = {
    personal: {
        fullName: 'Priya Rao',
        email: 'priya.rao@resumegemini.com',
        phone: '+1 (555) 555-555',
        role: 'Software Development Manager',
        summary: 'Highly motivated and result-oriented Software Development Manager with over 10 years of experience in the full software development lifecycle (SDLC). Proven track record of designing and building highly scalable, secure, and performant software systems. Passionate about leading and mentoring high-performing development teams to deliver innovative and high-quality software solutions that consistently exceed business objectives.',
        location: 'Bengaluru, KA, 560001',
        photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=500',
    },
    education: [
        {
            id: '1',
            school: 'Rhode Island School of Design',
            degree: 'BFA in Graphic Design',
            year: '2023 - 2024',
            description: 'Graduated Magna Cum Laude. President of the Design & Tech Association.'
        }
    ],
    experience: [
        {
            id: '1',
            company: 'Tech Innovations Labs',
            role: 'Product Manager',
            date: '2024 - Present',
            location: 'San Francisco, CA',
            description: '• Spearheaded the redesign of the core flagship product, resulting in a 25% increase in user retention.\n• Managed a team of 5 designers, establishing a new design system used across 3 interconnected products.\n• Collaborated closely with engineering and product management to define product roadmap and vision.'
        },
        {
            id: '2',
            company: 'Digital Solutions Corp',
            role: 'Senior Developer',
            date: '2021 - 2024',
            location: 'Austin, TX',
            description: '• Designed and launched mobile-first interfaces for fintech applications.\n• Conducted user research and usability testing sessions to validate design concepts.\n• Reduced customer support tickets by 15% through intuitive UI improvements.'
        }
    ],
    projects: [
        {
            id: '1',
            name: 'Analytics Dashboard',
            link: '#',
            date: '2023',
            description: 'Complete overhaul of an analytics dashboard for e-commerce merchants. Focused on data visualization and accessibility.'
        },
        {
            id: '2',
            name: 'Fitness Tracking App',
            link: '#',
            date: '2022',
            description: 'Concept to launch design for a fitness tracking application. Featured in "Best of App Design 2022".'
        }
    ],
    achievements: [
        { id: '1', title: "CEO's Choice Award, 2023", description: '' },
        { id: '2', title: 'Excellence in Customer Partnership Award, 2021', description: '' },
        { id: '3', title: 'Growth Mindset Pioneer Award, 2017', description: '' }
    ],
    extras: [
        { id: '1', text: 'telugu', type: 'languages' },
        { id: '2', text: 'hindi', type: 'languages' },
        { id: '3', text: 'english', type: 'languages' }
    ],
    extrasTitle: 'Languages',
    skills: [
        { id: '1', name: 'Frontend', items: ['React', 'HTML', 'CSS', 'Tailwind', 'JavaScript'] },
        { id: '2', name: 'Backend', items: ['Node.js', 'Python', 'PostgreSQL', 'MongoDB'] },
        { id: '3', name: 'Tools', items: ['Git', 'Docker', 'AWS', 'Jira'] }
    ],
    skillsViewMode: 'categorized', // 'categorized' | 'list'
    skillsLayout: 'row', // 'row' | 'column' (for categorized view) OR 'grid' | 'list' (for list view)
    themeColor: '#2563eb', // blue-600
    theme: 'modern',
    fontFamily: 'font-sans',
    fontSize: 'text-base',
    experienceType: 'experienced', // 'experienced' | 'fresher'
    experienceTitle: 'Experience',
    fresherSummary: '',
    sectionVisibility: {
        personal: true,
        education: true,
        experience: true,
        projects: true,
        achievements: true,
        skills: true,
        languages: true,
    },
};

const emptyResumeState = {
    personal: {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        role: '',
        summary: '',
        location: '',
        photo: '',
    },
    education: [],
    experience: [],
    projects: [],
    achievements: [],
    extras: [],
    extrasTitle: 'Languages',
    skills: [],
    skillsViewMode: 'categorized',
    skillsLayout: 'row',
    themeColor: '#2563eb',
    theme: 'modern',
    fontFamily: 'font-sans',
    fontSize: 'text-base',
    experienceType: 'experienced',
    experienceTitle: 'Experience',
    fresherSummary: '',
    sectionVisibility: {
        personal: true,
        education: true,
        experience: true,
        projects: true,
        achievements: true,
        skills: true,
        languages: true,
    },
};

// Helper to generate IDs safely (works on mobile/http)
const generateId = () => {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        return crypto.randomUUID();
    }
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

const ResumeContext = createContext();

export const useResume = () => {
    const context = useContext(ResumeContext);
    if (!context) {
        throw new Error('useResume must be used within a ResumeProvider');
    }
    return context;
};

export const ResumeProvider = ({ children }) => {
    const [resumeData, setResumeData] = useState(() => {
        const saved = localStorage.getItem('resumeData');
        if (!saved) return sampleResumeData;

        try {
            const parsed = JSON.parse(saved);
            // Deep merge with sample elements if missing, but otherwise trust parsed
            return {
                ...emptyResumeState,
                ...parsed,
                personal: { ...emptyResumeState.personal, ...parsed.personal },
            };
        } catch (e) {
            console.error("Failed to parse resume data", e);
            return sampleResumeData;
        }
    });

    const [sectionOrder, setSectionOrder] = useState(() => {
        const saved = localStorage.getItem('sectionOrder');
        const defaultOrder = ['personal', 'experience', 'education', 'projects', 'achievements', 'extras', 'skills'];
        if (!saved) return defaultOrder;

        try {
            const parsed = JSON.parse(saved);
            // Verify all new sections exist, if not append them
            const missing = defaultOrder.filter(item => !parsed.includes(item));
            if (missing.length > 0) {
                return [...parsed, ...missing];
            }
            return parsed;
        } catch (e) {
            return defaultOrder;
        }
    });

    // Track the ID of the resume being edited
    const [currentResumeId, setCurrentResumeId] = useState(() => {
        return localStorage.getItem('currentResumeId') || null;
    });

    // Track Resume Title
    const [resumeTitle, setResumeTitle] = useState('My Resume');

    // Global Modal State
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);

    // Page Limit State
    const [isOverOnePage, setIsOverOnePage] = useState(false);

    useEffect(() => {
        if (currentResumeId) {
            localStorage.setItem('currentResumeId', currentResumeId);
        } else {
            localStorage.removeItem('currentResumeId');
        }
    }, [currentResumeId]);

    useEffect(() => {
        localStorage.setItem('resumeData', JSON.stringify(resumeData));
    }, [resumeData]);

    useEffect(() => {
        localStorage.setItem('sectionOrder', JSON.stringify(sectionOrder));
    }, [sectionOrder]);

    const updatePersonal = (field, value) => {
        setResumeData(prev => ({
            ...prev,
            personal: { ...prev.personal, [field]: value }
        }));
    };

    const addEducation = () => {
        setResumeData(prev => ({
            ...prev,
            education: [...prev.education, { id: generateId(), school: '', degree: '', year: '', description: '' }]
        }));
    };

    const updateEducation = (id, field, value) => {
        setResumeData(prev => ({
            ...prev,
            education: prev.education.map(edu => edu.id === id ? { ...edu, [field]: value } : edu)
        }));
    };

    const removeEducation = (id) => {
        setResumeData(prev => ({
            ...prev,
            education: prev.education.filter(edu => edu.id !== id)
        }));
    };

    const addExperience = () => {
        setResumeData(prev => ({
            ...prev,
            experience: [...prev.experience, { id: generateId(), description: '' }]
        }));
    };

    const updateExperience = (id, field, value) => {
        setResumeData(prev => ({
            ...prev,
            experience: prev.experience.map(exp => exp.id === id ? { ...exp, [field]: value } : exp)
        }));
    };

    const removeExperience = (id) => {
        setResumeData(prev => ({
            ...prev,
            experience: prev.experience.filter(exp => exp.id !== id)
        }));
    };

    const updateSkills = (value) => {
        setResumeData(prev => ({ ...prev, skills: value }));
    };

    const updateSkill = (index, value) => {
        setResumeData(prev => {
            const newSkills = [...prev.skills];
            newSkills[index] = value;
            return { ...prev, skills: newSkills };
        });
    };

    const updateTheme = (theme) => {
        setResumeData(prev => ({ ...prev, theme }));
    };

    const updateThemeColor = (color) => {
        setResumeData(prev => ({ ...prev, themeColor: color }));
    };

    const reorderSection = (newOrder) => {
        setSectionOrder(newOrder);
    };

    const addProject = () => {
        setResumeData(prev => ({
            ...prev,
            projects: [...(prev.projects || []), { id: generateId(), name: '', link: '', date: '', description: '' }]
        }));
    };

    const updateProject = (id, field, value) => {
        setResumeData(prev => ({
            ...prev,
            projects: prev.projects.map(proj => proj.id === id ? { ...proj, [field]: value } : proj)
        }));
    };

    const removeProject = (id) => {
        setResumeData(prev => ({
            ...prev,
            projects: prev.projects.filter(proj => proj.id !== id)
        }));
    };

    const addAchievement = () => {
        setResumeData(prev => ({
            ...prev,
            achievements: [...(prev.achievements || []), { id: generateId(), title: '' }]
        }));
    };

    const updateAchievement = (id, field, value) => {
        setResumeData(prev => ({
            ...prev,
            achievements: prev.achievements.map(ach => ach.id === id ? { ...ach, [field]: value } : ach)
        }));
    };

    const removeAchievement = (id) => {
        setResumeData(prev => ({
            ...prev,
            achievements: prev.achievements.filter(ach => ach.id !== id)
        }));
    };

    const addExtra = (type = 'normal') => {
        setResumeData(prev => ({
            ...prev,
            extras: [...(prev.extras || []), { id: generateId(), text: '', type }]
        }));
    };

    const updateExtra = (id, value) => {
        setResumeData(prev => ({
            ...prev,
            extras: prev.extras.map(ex => ex.id === id ? { ...ex, text: value } : ex)
        }));
    };

    const removeExtra = (id) => {
        setResumeData(prev => ({
            ...prev,
            extras: prev.extras.filter(ex => ex.id !== id)
        }));
    };

    const updateExtrasTitle = (title) => {
        setResumeData(prev => ({
            ...prev,
            extrasTitle: title
        }));
    };

    const clearResume = () => {
        setResumeData(emptyResumeState);
        setCurrentResumeId(null);
        setResumeTitle('My Resume');
        localStorage.removeItem('currentResumeId');
    };

    const fillSampleData = () => {
        setResumeData(sampleResumeData);
    };



    const updateResumeData = (newData) => {
        setResumeData(prev => ({
            ...prev,
            ...newData,
            // Ensure ID generation for arrays if missing (fallback)
            education: newData.education?.map(e => ({ ...e, id: e.id || generateId() })) || [],
            experience: newData.experience?.map(e => ({ ...e, id: e.id || generateId() })) || [],
            projects: newData.projects?.map(e => ({ ...e, id: e.id || generateId() })) || [],
            achievements: newData.achievements?.map(e => ({ ...e, id: e.id || generateId() })) || [],
            extras: newData.extras?.map(e => ({ ...e, id: e.id || generateId() })) || [],
        }));
    };

    return (
        <ResumeContext.Provider value={{
            resumeData,
            sectionOrder,
            updateResumeData,
            updatePersonal,
            addEducation,
            updateEducation,
            removeEducation,
            addExperience,
            updateExperience,
            removeExperience,
            updateSkills,

            // Skills Categories
            addSkillGroup: () => setResumeData(prev => ({
                ...prev,
                skills: [...(Array.isArray(prev.skills) && prev.skills.every(s => typeof s === 'string')
                    ? [{ id: generateId(), name: 'General', items: prev.skills }] // Migrate legacy
                    : (prev.skills || [])),
                { id: generateId(), name: 'New Category', items: [] }]
            })),
            updateSkillGroup: (id, name) => setResumeData(prev => ({
                ...prev,
                skills: prev.skills.map(grp => grp.id === id ? { ...grp, name } : grp)
            })),
            removeSkillGroup: (id) => setResumeData(prev => ({
                ...prev,
                skills: prev.skills.filter(grp => grp.id !== id)
            })),
            addSkillToGroup: (groupId) => setResumeData(prev => ({
                ...prev,
                skills: prev.skills.map(grp => grp.id === groupId ? { ...grp, items: [...grp.items, ''] } : grp)
            })),
            updateSkillInGroup: (groupId, index, value) => setResumeData(prev => ({
                ...prev,
                skills: prev.skills.map(grp => grp.id === groupId ? { ...grp, items: grp.items.map((item, i) => i === index ? value : item) } : grp)
            })),
            removeSkillFromGroup: (groupId, index) => setResumeData(prev => ({
                ...prev,
                skills: prev.skills.map(grp => grp.id === groupId ? { ...grp, items: grp.items.filter((_, i) => i !== index) } : grp)
            })),

            updateTheme,
            updateThemeColor,
            reorderSection,
            clearResume,
            addProject,
            updateProject,
            removeProject,
            addAchievement,
            updateAchievement,
            removeAchievement,
            addExtra,
            updateExtra,
            removeExtra,
            updateExtrasTitle,
            fillSampleData,

            updateExperienceType: (type) => setResumeData(prev => ({ ...prev, experienceType: type })),
            updateExperienceTitle: (title) => setResumeData(prev => ({ ...prev, experienceTitle: title })),
            updateFresherSummary: (text) => setResumeData(prev => ({ ...prev, fresherSummary: text })),
            updateSkillsViewMode: (mode) => setResumeData(prev => ({ ...prev, skillsViewMode: mode })),
            updateSkillsLayout: (layout) => setResumeData(prev => ({ ...prev, skillsLayout: layout })),
            updateSectionVisibility: (section, isVisible) => setResumeData(prev => ({
                ...prev,
                sectionVisibility: { ...prev.sectionVisibility, [section]: isVisible }
            })),

            updateFontFamily: (font) => setResumeData(prev => ({ ...prev, fontFamily: font })),
            updateFontSize: (size) => setResumeData(prev => ({ ...prev, fontSize: size })),

            // Backend Integration
            getUserResumes: async () => {
                try {
                    return await resumeService.getUserResumes();
                } catch (error) {
                    console.error("Context: Error fetching resumes", error);
                    throw error;
                }
            },
            saveResumeToBackend: async (title) => {
                try {
                    console.log("Context: Saving new resume with title:", title);
                    const saved = await resumeService.saveResume(resumeData, title);
                    console.log("Context: New resume saved successfully:", saved);
                    if (saved && (saved._id || saved.id)) {
                        const newId = saved._id || saved.id;
                        setCurrentResumeId(newId);
                    }
                    return saved;
                } catch (error) {
                    if (error.status === 402) {
                        setShowPaymentModal(true);
                    }
                    throw error;
                }
            },
            updateResumeInBackend: async (resumeId, title) => {
                console.log("Context: Updating resume ID:", resumeId, "with title:", title);
                try {
                    const saved = await resumeService.updateResume(resumeId, resumeData, title);
                    console.log("Context: Update successful:", saved);
                    return saved;
                } catch (error) {
                    if (error.status === 402) {
                        setShowPaymentModal(true);
                    }
                    // If resume not found (deleted or invalid ID), clear the ID so next save creates a new one
                    if (error.message && (error.message.includes('not found') || error.message.includes('Not found'))) {
                        console.warn("Resume ID invalid or not found, clearing state.");
                        setCurrentResumeId(null);
                        localStorage.removeItem('currentResumeId');
                    }
                    throw error;
                }
            },

            currentResumeId,
            setCurrentResumeId,
            resumeTitle,
            setResumeTitle,
            showPaymentModal,
            setShowPaymentModal,
            showPaymentModal,
            setShowPaymentModal,
            isGenerating,
            setIsGenerating,
            isOverOnePage,
            setIsOverOnePage
        }}>
            {children}
        </ResumeContext.Provider>
    );
};
