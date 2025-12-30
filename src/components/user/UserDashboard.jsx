import React, { useEffect, useState, useMemo } from 'react';
import { User, Mail, Plus, Edit, Trash2, Clock, FileText, LayoutGrid, List, LogOut, ArrowLeft, Home } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { resumeService } from '../../services/resumeService';
import { useResume } from '../../context/ResumeContext';
import { ConfirmationModal } from '../ui/ConfirmationModal';
import toast from 'react-hot-toast';
import axios from 'axios';
import { API_URL } from '../../services/api';

export function UserDashboard() {
    const navigate = useNavigate();
    const { updateResumeData, clearResume, setCurrentResumeId, setResumeTitle } = useResume();

    // Local state for user, resumes, and view mode
    const [user, setUser] = useState(null);
    const [resumes, setResumes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState(() => localStorage.getItem('dashboardViewMode') || 'table');

    // Modal State
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [resumeToDelete, setResumeToDelete] = useState(null);

    // Persist view mode
    useEffect(() => {
        localStorage.setItem('dashboardViewMode', viewMode);
    }, [viewMode]);

    // Load User & Resumes
    useEffect(() => {
        const loadData = async () => {
            const userData = localStorage.getItem('user');
            if (!userData) {
                navigate('/');
                return;
            }

            const parsedUser = JSON.parse(userData);
            setUser(parsedUser);

            // Sync latest user status (including expiry)
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const res = await axios.get(`${API_URL}/users/profile`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (res.data) {
                        setUser(res.data);
                        localStorage.setItem('user', JSON.stringify(res.data));
                    }
                } catch (err) {
                    console.error("Failed to sync user on dashboard", err);
                }
            }

            // Fetch Resumes
            try {
                // Fetch Resumes (Backend determines user from token)
                const fetchedResumes = await resumeService.getUserResumes();
                setResumes(fetchedResumes);

                // Self-Healing: Clear stale edit state if it points to a resume we don't own
                const currentId = localStorage.getItem('currentResumeId');
                if (currentId && !fetchedResumes.find(r => (r._id || r.id) === currentId)) {
                    console.warn("Cleared stale resume ID:", currentId);
                    localStorage.removeItem('currentResumeId');
                }
            } catch (error) {
                console.error("Failed to load resumes", error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [navigate]);

    const handleCreateNew = () => {
        clearResume();
        navigate('/builder');
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('currentResumeId'); // Clear resume edit state
        setUser(null);
        navigate('/');
        window.dispatchEvent(new Event('auth-change'));
        toast.success('Logged out successfully');
    };

    const handleEdit = (resume) => {
        // Load resume data into context
        updateResumeData(resume.data);
        setCurrentResumeId(resume._id || resume.id);
        setResumeTitle(resume.title || 'My Resume');
        navigate('/builder');
    };

    const handleDeleteClick = (id) => {
        setResumeToDelete(id);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        if (!resumeToDelete) return;

        try {
            await resumeService.deleteResume(resumeToDelete);
            setResumes(prev => prev.filter(r => (r._id || r.id) !== resumeToDelete));
            toast.success('Resume Deleted Successfully');
        } catch (error) {
            toast.error("Failed to delete resume");
        } finally {
            setShowDeleteModal(false);
            setResumeToDelete(null);
        }
    };

    // Date Grouping Logic
    const groupedResumes = useMemo(() => {
        const groups = {};
        const now = new Date();

        // Ensure resumes are sorted by date desc first
        const sortedResumes = [...resumes].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

        // Helper to get group title
        const getGroupTitle = (dateStr) => {
            const updatedAt = new Date(dateStr);
            const diffTime = Math.abs(now - updatedAt);
            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays === 0) return 'Today';
            if (diffDays === 1) return 'Yesterday';
            if (diffDays <= 30) return `${diffDays} days ago`;
            if (diffDays <= 365) return updatedAt.toLocaleString('default', { month: 'long' });
            return updatedAt.getFullYear().toString();
        };

        const sections = [];
        let currentCategory = null;

        sortedResumes.forEach(resume => {
            const category = getGroupTitle(resume.updatedAt);

            if (category !== currentCategory) {
                sections.push({ title: category, items: [] });
                currentCategory = category;
            }
            sections[sections.length - 1].items.push(resume);
        });

        return sections;
    }, [resumes]);


    if (loading) return <div className="min-h-screen pt-24 flex justify-center text-white">Loading...</div>;

    return (
        <div className="min-h-screen pt-24 px-4 bg-slate-950 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950">
            <div className="max-w-6xl mx-auto space-y-8 pb-20">

                {/* Navigation Back */}
                <button
                    onClick={() => navigate('/')}
                    className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors group"
                >
                    <div className="p-2 rounded-lg bg-white/5 group-hover:bg-white/10 transition-colors">
                        <ArrowLeft className="w-4 h-4" />
                    </div>
                    <span className="font-medium">Back to Home</span>
                </button>

                {/* Header Profile Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-8 flex flex-col md:flex-row items-center md:items-start gap-8"
                >
                    {/* Avatar */}
                    <div className="relative">
                        <div className="w-24 h-24 rounded-full border-4 border-indigo-500/30 overflow-hidden shadow-2xl bg-indigo-500/20 flex items-center justify-center">
                            <span className="text-3xl font-bold text-indigo-400">
                                {user?.name ? user.name.charAt(0).toUpperCase() : 'G'}
                            </span>
                        </div>
                        <div className="absolute bottom-1 right-1 w-5 h-5 bg-emerald-500 border-4 border-slate-900 rounded-full" title="Online"></div>
                    </div>

                    {/* Info */}
                    <div className="flex-1 text-center md:text-left space-y-2">
                        <h1 className="text-3xl font-bold text-white">{user?.name || 'Guest User'}</h1>
                        <div className="flex items-center justify-center md:justify-start gap-2 text-slate-400">
                            <Mail className="w-4 h-4" />
                            <span>{user?.email || 'No email attached'}</span>
                        </div>
                        <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-4">
                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                                {user?.isSubscribed ? 'Pro Account' : 'Free Account'}
                            </span>
                            {user?.isSubscribed && user?.subscriptionExpiry && (
                                <span className="px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {(() => {
                                        const expiry = new Date(user.subscriptionExpiry);
                                        const now = new Date();
                                        const diff = expiry - now;
                                        const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
                                        return days > 0 ? `${days} days left` : 'Expired';
                                    })()}
                                </span>
                            )}
                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-slate-800 text-slate-400 border border-slate-700">
                                {resumes.length} Resumes Saved
                            </span>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                        <button
                            onClick={handleLogout}
                            className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg border border-red-500/20 bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:border-red-500/30 font-medium transition-all"
                        >
                            <LogOut className="w-4 h-4" />
                            Logout
                        </button>
                        <button
                            onClick={handleCreateNew}
                            className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium shadow-lg shadow-indigo-500/25 transition-all hover:scale-105"
                        >
                            <Plus className="w-4 h-4" />
                            Create New Resume
                        </button>
                    </div>
                </motion.div>

                {/* Resumes List Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                        <FileText className="w-6 h-6 text-indigo-400" />
                        My Resumes
                    </h2>

                    {/* View Toggle */}
                    <div className="flex bg-slate-900 rounded-lg p-1 border border-white/10">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-2 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                            title="Grid View"
                        >
                            <LayoutGrid className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setViewMode('table')}
                            className={`p-2 rounded-md transition-colors ${viewMode === 'table' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                            title="List View"
                        >
                            <List className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Content Area */}
                <AnimatePresence mode="wait">
                    {resumes.length === 0 ? (
                        <div className="text-center py-20 bg-white/5 rounded-2xl border border-white/5 border-dashed">
                            <p className="text-slate-400 mb-4">You haven't saved any resumes yet.</p>
                            <button
                                onClick={handleCreateNew}
                                className="text-indigo-400 hover:text-indigo-300 font-medium"
                            >
                                Create your first resume
                            </button>
                        </div>
                    ) : (
                        viewMode === 'table' ? (
                            // Table Layout
                            <motion.div
                                key="table"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="space-y-6"
                            >
                                {groupedResumes.map((group, index) => (
                                    <div key={index} className="space-y-3">
                                        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider pl-2">
                                            {group.title}
                                        </h3>

                                        <div className="bg-slate-900/40 border border-white/5 rounded-xl overflow-hidden divide-y divide-white/5">
                                            {group.items.map((resume) => (
                                                <div
                                                    key={resume._id || resume.id}
                                                    className="group flex flex-col sm:flex-row items-center gap-4 p-4 hover:bg-white/5 transition-colors"
                                                >
                                                    {/* File Icon */}
                                                    <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center shrink-0">
                                                        <FileText className="w-5 h-5 text-indigo-400" />
                                                    </div>

                                                    {/* Details */}
                                                    <div className="flex-1 min-w-0 text-center sm:text-left">
                                                        <h4 className="text-base font-medium text-white truncate group-hover:text-indigo-300 transition-colors cursor-pointer" onClick={() => handleEdit(resume)}>
                                                            {resume.title || 'Untitled Resume'}
                                                        </h4>
                                                        <div className="flex items-center justify-center sm:justify-start gap-2 text-xs text-slate-500 mt-1">
                                                            <Clock className="w-3 h-3" />
                                                            <span>Edited {new Date(resume.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                        </div>
                                                    </div>

                                                    {/* Actions */}
                                                    <div className="flex items-center gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button
                                                            onClick={() => handleEdit(resume)}
                                                            className="px-3 py-1.5 text-sm font-medium text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 rounded-md transition-colors"
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteClick(resume._id || resume.id)}
                                                            className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-md transition-colors"
                                                            title="Delete"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </motion.div>
                        ) : (
                            // Grid Layout
                            <motion.div
                                key="grid"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
                            >
                                {resumes.map((resume) => (
                                    <div
                                        key={resume._id || resume.id}
                                        className="bg-slate-900/80 border border-white/10 rounded-xl overflow-hidden hover:border-indigo-500/50 transition-colors group flex flex-col"
                                    >
                                        <div className="p-6 flex-1">
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center">
                                                    <FileText className="w-5 h-5 text-indigo-400" />
                                                </div>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleEdit(resume)}
                                                        className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors"
                                                        title="Edit"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteClick(resume._id || resume.id)}
                                                        className="p-2 hover:bg-red-500/10 rounded-lg text-slate-400 hover:text-red-400 transition-colors"
                                                        title="Delete"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>

                                            <h3 className="text-lg font-bold text-white mb-1 truncate">{resume.title || 'Untitled Resume'}</h3>

                                            <div className="flex items-center gap-4 text-xs text-slate-500 mt-4">
                                                <div className="flex items-center gap-1">
                                                    <Clock className="w-3 h-3" />
                                                    {new Date(resume.updatedAt).toLocaleString()}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-white/5 px-6 py-3 flex justify-between items-center mt-auto">
                                            <button
                                                onClick={() => handleEdit(resume)}
                                                className="text-sm font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
                                            >
                                                Open in Editor &rarr;
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </motion.div>
                        )
                    )}
                </AnimatePresence>

            </div >

            <ConfirmationModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={confirmDelete}
            />
        </div >
    );
}
