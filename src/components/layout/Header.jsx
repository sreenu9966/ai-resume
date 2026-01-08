import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Download, FileText, Save, Shield, User, LogOut, ChevronDown, Edit, Check } from 'lucide-react';
import { Button } from '../ui/Button';
import { useResume } from '../../context/ResumeContext';
import toast from 'react-hot-toast';
import { SaveResumeModal } from '../ui/SaveResumeModal';
import { AuthModal } from '../auth/AuthModal';

export function Header({ onDownload, isGenerating }) {
    // const { currentUser } = useAuth(); // Removed
    const navigate = useNavigate();
    const location = useLocation();

    const [user, setUser] = React.useState(null);
    const [showDropdown, setShowDropdown] = React.useState(false);

    // Check for user/token on mount and when interactions happen
    React.useEffect(() => {
        const checkUser = () => {
            const token = localStorage.getItem('token');
            const userData = localStorage.getItem('user');
            if (token && userData) {
                try {
                    setUser(JSON.parse(userData));
                } catch (e) {
                    setUser(null);
                }
            } else {
                setUser(null);
            }
        };

        checkUser();

        window.addEventListener('storage', checkUser);
        window.addEventListener('auth-change', checkUser); // Custom event listener

        return () => {
            window.removeEventListener('storage', checkUser);
            window.removeEventListener('auth-change', checkUser);
        };
    }, []);

    // Close dropdown when clicking outside
    React.useEffect(() => {
        const handleClickOutside = (event) => {
            if (showDropdown && !event.target.closest('.relative-dropdown')) {
                setShowDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showDropdown]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('currentResumeId'); // Clear resume edit state
        setUser(null);
        setShowDropdown(false);
        window.dispatchEvent(new Event('auth-change'));
        window.location.href = '/'; // Reloads the page
    };

    return (
        <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-slate-950/80 backdrop-blur-md">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-2 group cursor-pointer hover:no-underline mr-4">
                    <div className="p-2 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-xl shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-all duration-300">
                        <FileText className="w-6 h-6 text-white" />
                    </div>
                </Link>

                {/* Editable Title */}
                <div className="flex-1 max-w-md hidden lg:block">
                    <ResumeTitleInput />
                </div>

                <div className="flex items-center gap-3">
                    {user ? (
                        <div className="relative relative-dropdown">
                            <button
                                onClick={() => setShowDropdown(!showDropdown)}
                                className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 transition-colors"
                            >
                                <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold">
                                    {user.name ? user.name.charAt(0).toUpperCase() : 'G'}
                                </div>
                                <span className="text-sm font-medium text-slate-200 hidden sm:inline">{user.name || 'Guest'}</span>
                                <ChevronDown className="w-4 h-4 text-slate-400" />
                            </button>

                            {/* Dropdown Menu */}
                            {showDropdown && (
                                <div className="absolute right-0 mt-2 w-48 bg-slate-900 border border-white/10 rounded-xl shadow-xl overflow-hidden py-1 z-50">
                                    <div className="px-4 py-3 border-b border-white/5">
                                        <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Signed in as</p>
                                        <p className="text-sm font-medium text-white truncate">{user.name || 'Guest User'}</p>
                                    </div>

                                    <button
                                        className="w-full text-left px-4 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-white/5 flex items-center gap-2 transition-colors"
                                        onClick={() => {
                                            setShowDropdown(false);
                                            navigate('/dashboard');
                                        }}
                                    >
                                        <User className="w-4 h-4" />
                                        My Profile
                                    </button>

                                    <div className="h-px bg-white/5 my-1" />

                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-left px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 flex items-center gap-2 transition-colors"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        Sign out
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <Link to="/admin">
                            <Button variant="ghost" size="sm" className="gap-2 text-slate-400 hover:text-white">
                                <Shield className="w-4 h-4" />
                                <span className="hidden sm:inline">Admin Panel</span>
                            </Button>
                        </Link>
                    )}

                    <SaveButton />


                    <Button onClick={onDownload} className="glass-button gap-2 border-0" size="sm" disabled={isGenerating}>
                        {isGenerating ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white/30 border-b-white rounded-full animate-spin" />
                                <span className="hidden md:inline">Processing...</span>
                            </>
                        ) : (
                            <>
                                <Download className="w-4 h-4" />
                                <span className="hidden md:inline">Preview</span>
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </header>
    );
}

function SaveButton() {
    const { saveResumeToBackend, updateResumeInBackend, currentResumeId, resumeTitle, setResumeTitle, getUserResumes } = useResume();
    const navigate = useNavigate();

    const [saving, setSaving] = React.useState(false);
    const [showSaveModal, setIsSaveModalOpen] = React.useState(false);
    const [showAuthModal, setShowAuthModal] = React.useState(false);

    const handleSaveClick = () => {
        const storedUser = localStorage.getItem('user');
        const user = storedUser ? JSON.parse(storedUser) : null;

        if (!user || user.role === 'guest') {
            setShowAuthModal(true);
            return;
        }
        setIsSaveModalOpen(true);
    };

    const [savedSuccess, setSavedSuccess] = React.useState(false);

    // Reset success message after 2 seconds
    React.useEffect(() => {
        if (savedSuccess) {
            const timer = setTimeout(() => setSavedSuccess(false), 2000);
            return () => clearTimeout(timer);
        }
    }, [savedSuccess]);

    const handleConfirmSave = async (newTitle) => {
        const finalTitle = newTitle || resumeTitle;

        setSaving(true);
        try {
            // Check for duplicates
            const allResumes = await getUserResumes();
            const normalize = (str) => str?.toLowerCase().trim();

            const existing = allResumes.find(r => normalize(r.title) === normalize(finalTitle));

            // Logic: 
            // 1. If existing found AND we aim to CREATE new (currentResumeId is null) -> Conflict. 
            // 2. If existing found AND we aim to UDPATE (currentResumeId is set) AND existing ID !== currentResumeId -> Conflict (renaming to someone else's name).

            if (existing) {
                const isConflict = !currentResumeId || (currentResumeId && existing._id !== currentResumeId && existing.id !== currentResumeId);
                if (isConflict) {
                    toast.error(`A resume named "${finalTitle}" already exists! Please choose a different name.`);
                    setSaving(false);
                    // Re-open modal or keep it open? logic closes it before calling confirm. 
                    // We need to re-open it or handle this better. 
                    // Since setIsSaveModalOpen(false) was called by Modal internally/wrapper? No, called in this function in previous code.
                    // I should call setIsSaveModalOpen(true) again? Or just prevent closing? 
                    // The modal prop `onConfirm` usually implies the modal is closing. I'll just show toast.
                    return;
                }
            }

            setIsSaveModalOpen(false);

            // Update title context if valid
            if (newTitle) setResumeTitle(newTitle);

            console.log("Saving resume with title:", finalTitle, "ID:", currentResumeId);
            if (currentResumeId) {
                await updateResumeInBackend(currentResumeId, finalTitle);
                toast.success('Resume Updated!');
            } else {
                await saveResumeToBackend(finalTitle);
                toast.success('Resume Saved!');
            }
            setSavedSuccess(true);
        } catch (error) {
            console.error("Save failed in Header:", error);
            toast.error(error.message || 'Failed to save');
        } finally {
            setSaving(false);
        }
    };

    return (
        <>
            <Button onClick={handleSaveClick} variant="outline" size="sm" disabled={saving || savedSuccess} className={`gap-2 ${savedSuccess ? 'border-green-500 text-green-500 hover:text-green-500 hover:bg-green-500/10' : ''}`}>
                {saving ? (
                    <>
                        <div className="w-4 h-4 border-2 border-current border-b-transparent rounded-full animate-spin" />
                        <span className="hidden md:inline">Saving...</span>
                    </>
                ) : savedSuccess ? (
                    <>
                        <Check className="w-4 h-4" />
                        <span className="hidden md:inline">Saved!</span>
                    </>
                ) : (
                    <>
                        <Save className="w-4 h-4" />
                        <span className="hidden md:inline">{currentResumeId ? 'Update' : 'Save'}</span>
                    </>
                )}
            </Button>


            <SaveResumeModal
                isOpen={showSaveModal}
                onClose={() => setIsSaveModalOpen(false)}
                onConfirm={handleConfirmSave}
                initialTitle={resumeTitle}
            />
            <AuthModal
                isOpen={showAuthModal}
                onClose={() => setShowAuthModal(false)}
                onSuccess={() => {
                    setShowAuthModal(false);
                    // Optionally trigger save immediately or let user click again
                    // checkUser() is handled by events
                }}
            />
        </>
    );
}

function ResumeTitleInput() {
    const { resumeTitle, setResumeTitle } = useResume();

    return (
        <div className="relative group">
            <input
                type="text"
                value={resumeTitle}
                onChange={(e) => setResumeTitle(e.target.value)}
                className="bg-transparent text-white text-lg font-bold border-b border-transparent hover:border-white/20 focus:border-indigo-500 focus:outline-none px-2 py-1 transition-all w-full md:w-auto"
                placeholder="Enter Resume Name"
            />
            <Edit className="w-3 h-3 text-slate-500 absolute top-1/2 -translate-y-1/2 right-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
        </div>
    );
}


