import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Activity, Settings, LogOut, FileText } from 'lucide-react';
import { motion } from 'framer-motion';

export function AdminLayout() {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Clear admin session logic here
        navigate('/login');
    };

    return (
        <div className="flex h-screen bg-slate-950 text-slate-200 font-sans selection:bg-indigo-500/30 overflow-hidden">
            {/* Sidebar */}
            <aside className="w-64 border-r border-white/10 bg-slate-900/50 backdrop-blur-xl flex flex-col">
                <div className="p-6 border-b border-white/10 flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-indigo-500/20">
                        <FileText className="w-6 h-6 text-indigo-400" />
                    </div>
                    <span className="text-lg font-bold text-white">Admin Panel</span>
                </div>

                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    <NavItem to="/admin" end icon={<LayoutDashboard className="w-5 h-5" />} label="Dashboard" />
                    <NavItem to="/admin/users" icon={<Users className="w-5 h-5" />} label="Users" />
                    <NavItem to="/admin/activity" icon={<Activity className="w-5 h-5" />} label="Activity Logs" />
                    <NavItem to="/admin/settings" icon={<Settings className="w-5 h-5" />} label="Settings" />
                </nav>

                <div className="p-4 border-t border-white/10">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-4 py-2 text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                        <LogOut className="w-5 h-5" />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto bg-grid-white/[0.02]">
                <div className="p-8 max-w-7xl mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}

function NavItem({ to, icon, label, end }) {
    return (
        <NavLink
            to={to}
            end={end}
            className={({ isActive }) => `
                flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all
                ${isActive
                    ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 shadow-lg shadow-indigo-500/5'
                    : 'text-slate-400 hover:bg-white/5 hover:text-white'}
            `}
        >
            {icon}
            {label}
        </NavLink>
    );
}
