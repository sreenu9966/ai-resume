import React, { useEffect, useState, useMemo } from 'react';
import { User, Mail, Plus, Edit, Trash2, Clock, FileText, LayoutGrid, List, LogOut, ArrowLeft, Home, Ticket, ShieldCheck, RotateCcw, History } from 'lucide-react';
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
    const [activeTab, setActiveTab] = useState('active'); // 'active' or 'trash'
    const [trashResumes, setTrashResumes] = useState([]);

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
                if (activeTab === 'active') {
                    const fetchedResumes = await resumeService.getUserResumes();
                    setResumes(fetchedResumes);
                } else {
                    const fetchedTrash = await resumeService.getTrashResumes();
                    setTrashResumes(fetchedTrash);
                }
            } catch (error) {
                console.error("Failed to load resumes", error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [navigate, activeTab]);

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
            if (activeTab === 'active') {
                await resumeService.deleteResume(resumeToDelete);
                setResumes(prev => prev.filter(r => (r._id || r.id) !== resumeToDelete));
                toast.success('Resume moved to Trash');
            } else {
                await resumeService.permanentDeleteResume(resumeToDelete);
                setTrashResumes(prev => prev.filter(r => (r._id || r.id) !== resumeToDelete));
                toast.success('Resume permanently deleted');
            }
        } catch (error) {
            toast.error(activeTab === 'active' ? "Failed to delete" : "Failed to permanently delete");
        } finally {
            setShowDeleteModal(false);
            setResumeToDelete(null);
        }
    };

    const handleRestore = async (id) => {
        try {
            await resumeService.restoreResume(id);
            setTrashResumes(prev => prev.filter(r => (r._id || r.id) !== id));
            toast.success('Resume restored successfully');
            // Refresh main list is handled by dependency on activeTab if we switched back, 
            // but we stay on trash tab, so we just remove it from local trash state
        } catch (error) {
            toast.error("Failed to restore resume");
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

                {/* Subscription Details & Invoice */}
                {user?.isSubscribed && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="grid md:grid-cols-2 gap-6"
                    >
                        {/* Sub Details */}
                        <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                <ShieldCheck className="w-5 h-5 text-indigo-400" />
                                Subscription Plan
                            </h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center py-3 border-b border-white/5">
                                    <span className="text-slate-400">Plan Type</span>
                                    <span className="text-white font-bold capitalize">{user?.subscriptionType} Plan</span>
                                </div>
                                <div className="flex justify-between items-center py-3 border-b border-white/5">
                                    <span className="text-slate-400">Status</span>
                                    <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 uppercase font-bold tracking-wider">Active</span>
                                </div>
                                <div className="flex justify-between items-center py-3 border-b border-white/5">
                                    <span className="text-slate-400">Activation Date</span>
                                    <span className="text-slate-200 font-medium">
                                        {user?.lastActivationDate
                                            ? `${new Date(user.lastActivationDate).toLocaleDateString()} ${new Date(user.lastActivationDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                                            : 'N/A'}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center py-3 border-b border-white/5">
                                    <span className="text-slate-400">Offer Applied</span>
                                    <span className="text-indigo-400 font-bold">
                                        {user?.appliedOffer === 'New Year Special Offer' ? 'New Year 2026 Special Offer (₹0)' : (user?.appliedOffer || 'Standard Plan')}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center py-3">
                                    <span className="text-slate-400">Plan Benefit</span>
                                    <span className="text-emerald-400 font-bold">100% Free - ₹0 Activation</span>
                                </div>
                                <div className="flex justify-between items-center py-3 border-b border-white/5">
                                    <span className="text-slate-400">Expiry Date</span>
                                    <span className="text-slate-200 font-medium">{user?.subscriptionExpiry ? new Date(user.subscriptionExpiry).toLocaleDateString() : 'N/A'}</span>
                                </div>
                                <div className="flex justify-between items-center py-3">
                                    <span className="text-slate-400">Days Remaining</span>
                                    <span className="text-emerald-400 font-bold">
                                        {user?.subscriptionExpiry ? (() => {
                                            const expiry = new Date(user.subscriptionExpiry);
                                            const now = new Date();
                                            const diff = expiry - now;
                                            const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
                                            return days > 0 ? `${days} Days` : 'Expired';
                                        })() : 'N/A'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Invoice Summary */}
                        <div className="bg-indigo-600/5 border border-indigo-500/20 rounded-2xl p-6 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-8 rotate-12 opacity-5 scale-150">
                                <FileText className="w-24 h-24 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                <Ticket className="w-5 h-5 text-indigo-400" />
                                Activation Invoice
                            </h3>
                            <div className="bg-slate-950/50 rounded-xl p-6 border border-white/5">
                                <div className="space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-400">Plan Price</span>
                                        <span className="text-white font-bold">
                                            ₹{user?.subscriptionType === 'yearly' ? '365' :
                                                user?.subscriptionType === 'quarterly' ? '299' :
                                                    user?.subscriptionType === 'monthly' ? '90' : '365'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-400">Coupon Discount</span>
                                        <span className="text-emerald-400 font-bold">
                                            {user?.subscriptionAmount === 0 ?
                                                `-₹${user?.subscriptionType === 'yearly' ? '365' : user?.subscriptionType === 'quarterly' ? '299' : user?.subscriptionType === 'monthly' ? '90' : '365'}`
                                                : '-₹0'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-400">Coupon Used</span>
                                        <span className="text-emerald-400 font-bold uppercase tracking-wider">
                                            {user?.couponUsed || (user?.subscriptionAmount === 0 ? 'RGNEW2026' : 'DIRECT')}
                                        </span>
                                    </div>
                                    <div className="h-px bg-white/5 my-2" />
                                    <div className="flex justify-between text-lg font-bold">
                                        <span className="text-indigo-400 uppercase tracking-tighter">Total Paid</span>
                                        <span className="text-white">₹{user?.subscriptionAmount || 0}</span>
                                    </div>
                                </div>
                                <div className="mt-6 pt-4 border-t border-white/5 text-[10px] text-slate-500 uppercase font-bold tracking-widest text-center">
                                    Digital Invoice • {user?.isSubscribed ? 'PRO STATUS ACTIVE' : 'FREE ACCOUNT'}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Resumes Header & Tabs */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                            <FileText className="w-6 h-6 text-indigo-400" />
                            My Resumes
                        </h2>

                        {/* Status Tabs */}
                        <div className="flex p-1 bg-slate-900/50 border border-white/10 rounded-xl w-fit">
                            <button
                                onClick={() => setActiveTab('active')}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'active' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                            >
                                <LayoutGrid className="w-4 h-4" />
                                Active
                                {resumes.length > 0 && (
                                    <span className="ml-1 px-1.5 py-0.5 rounded-md bg-white/10 text-[10px]">{resumes.length}</span>
                                )}
                            </button>
                            <button
                                onClick={() => setActiveTab('trash')}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'trash' ? 'bg-red-500 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                            >
                                <History className="w-4 h-4" />
                                Trash History
                                {trashResumes.length > 0 && (
                                    <span className="ml-1 px-1.5 py-0.5 rounded-md bg-white/10 text-[10px]">{trashResumes.length}</span>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* View & Search Tools */}
                    <div className="flex items-center gap-4">
                        <div className="flex bg-slate-900 rounded-lg p-1 border border-white/10 h-10">
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
                </div>

                {/* Content Area */}
                <AnimatePresence mode="wait">
                    {activeTab === 'active' ? (
                        resumes.length === 0 ? (
                            <motion.div
                                key="empty-active"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-center py-20 bg-white/5 rounded-2xl border border-white/5 border-dashed"
                            >
                                <div className="w-16 h-16 bg-indigo-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <FileText className="w-8 h-8 text-indigo-400" />
                                </div>
                                <p className="text-slate-400 mb-4">You haven't saved any resumes yet.</p>
                                <button
                                    onClick={handleCreateNew}
                                    className="text-indigo-400 hover:text-indigo-300 font-medium"
                                >
                                    Create your first resume
                                </button>
                            </motion.div>
                        ) : (
                            viewMode === 'table' ? (
                                // Table Layout (Current Items)
                                <motion.div
                                    key="table-active"
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
                        )
                    ) : null}
                </AnimatePresence>

                {/* Trash Content Rendering */}
                {activeTab === 'trash' && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-6"
                    >
                        {trashResumes.length === 0 ? (
                            <div className="text-center py-20 bg-white/5 rounded-2xl border border-white/5 border-dashed">
                                <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <History className="w-8 h-8 text-red-400" />
                                </div>
                                <p className="text-slate-400 mb-2">Your trash is empty.</p>
                                <p className="text-xs text-slate-500 uppercase font-bold tracking-widest">30-Day Auto Delete Policy Active</p>
                            </div>
                        ) : (
                            <div className="bg-slate-900/40 border border-white/5 rounded-2xl overflow-hidden divide-y divide-white/5">
                                <div className="bg-red-500/5 px-6 py-3 border-b border-white/5 flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-xs font-bold text-red-400 uppercase tracking-widest">
                                        <Clock className="w-4 h-4" />
                                        Auto-Deletion History
                                    </div>
                                    <span className="text-[10px] text-slate-500 uppercase font-bold">Resumes kept for 30 days before permanent removal</span>
                                </div>
                                {trashResumes.map((resume) => {
                                    const deletedDate = new Date(resume.deletedAt);
                                    const expiryDate = new Date(deletedDate);
                                    expiryDate.setDate(expiryDate.getDate() + 30);
                                    const diff = expiryDate - new Date();
                                    const daysLeft = Math.ceil(diff / (1000 * 60 * 60 * 24));

                                    return (
                                        <div key={resume._id || resume.id} className="group flex flex-col sm:flex-row items-center gap-4 p-5 hover:bg-white/5 transition-all">
                                            <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center shrink-0">
                                                <FileText className="w-6 h-6 text-red-400" />
                                            </div>
                                            <div className="flex-1 min-w-0 text-center sm:text-left">
                                                <h4 className="text-lg font-medium text-white truncate">{resume.title || 'Untitled Resume'}</h4>
                                                <div className="flex items-center justify-center sm:justify-start gap-4 text-xs text-slate-500 mt-1">
                                                    <span className="flex items-center gap-1">
                                                        <Clock className="w-3.5 h-3.5" />
                                                        Deleted on {new Date(resume.deletedAt).toLocaleDateString()}
                                                    </span>
                                                    <span className={`font-bold uppercase tracking-tighter ${daysLeft <= 5 ? 'text-orange-400' : 'text-slate-400'}`}>
                                                        {daysLeft} Days Remaining
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => handleRestore(resume._id || resume.id)}
                                                    className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 rounded-lg border border-emerald-500/20 transition-all uppercase tracking-widest"
                                                >
                                                    <RotateCcw className="w-4 h-4" />
                                                    Restore
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteClick(resume._id || resume.id)}
                                                    className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                                                    title="Permanently Delete"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </motion.div>
                )}

            </div >

            <ConfirmationModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={confirmDelete}
            />
        </div >
    );
}
