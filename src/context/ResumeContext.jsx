import { DessertIcon } from 'lucide-react';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { resumeService } from '../services/resumeService';

const initialResumeState = {
    personal: {
        fullName: '',
        email: '',
        phone: '',
        role: '',
        summary: '',
        location: '',
        photo: null,
    },
    education: [],
    experience: [],
    projects: [],
    achievements: [],
    extras: [],
    extrasTitle: 'Activities',
    skills: [],
    themeColor: '#2563eb', // blue-600
    theme: 'modern',
    fontFamily: 'font-sans',
    fontSize: 'text-base',
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
        return saved ? JSON.parse(saved) : initialResumeState;
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
            education: [...prev.education, { id: crypto.randomUUID(), school: '', degree: '', year: '', description: '' }]
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
            experience: [...prev.experience, { id: crypto.randomUUID(), description: '' }]
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
            projects: [...(prev.projects || []), { id: crypto.randomUUID(), name: '', link: '', date: '', description: '' }]
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
            achievements: [...(prev.achievements || []), { id: crypto.randomUUID(), title: '' }]
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
            extras: [...(prev.extras || []), { id: crypto.randomUUID(), text: '', type }]
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
        setResumeData(initialResumeState);
        setCurrentResumeId(null);
        setResumeTitle('My Resume');
        localStorage.removeItem('currentResumeId');
    };



    const updateResumeData = (newData) => {
        setResumeData(prev => ({
            ...prev,
            ...newData,
            // Ensure ID generation for arrays if missing (fallback)
            education: newData.education?.map(e => ({ ...e, id: e.id || crypto.randomUUID() })) || [],
            experience: newData.experience?.map(e => ({ ...e, id: e.id || crypto.randomUUID() })) || [],
            projects: newData.projects?.map(e => ({ ...e, id: e.id || crypto.randomUUID() })) || [],
            achievements: newData.achievements?.map(e => ({ ...e, id: e.id || crypto.randomUUID() })) || [],
            extras: newData.extras?.map(e => ({ ...e, id: e.id || crypto.randomUUID() })) || [],
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

            updateFontFamily: (font) => setResumeData(prev => ({ ...prev, fontFamily: font })),
            updateFontSize: (size) => setResumeData(prev => ({ ...prev, fontSize: size })),

            // Backend Integration
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
            setShowPaymentModal
        }}>
            {children}
        </ResumeContext.Provider>
    );
};
