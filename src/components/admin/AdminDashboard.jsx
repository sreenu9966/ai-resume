
import React, { useState, useEffect } from 'react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, PieChart, Pie, Cell
} from 'recharts';
import { Users, FileText, Eye, TrendingUp } from 'lucide-react';
import { UserTable } from './UserTable';
import { LeadTable } from './LeadTable';
import { ActivityLog } from './ActivityLog';
import { adminService } from '../../services/adminService';

export function AdminDashboard() {
    const [stats, setStats] = useState({
        totalUsers: 0,
        activeNow: 0,
        loginsToday: 0,
        downloadsToday: 0,
        totalDownloads: 0
    });
    const [users, setUsers] = useState([]);
    const [leads, setLeads] = useState([]);
    const [logs, setLogs] = useState([]);

    useEffect(() => {
        // Fetch Data from MongoDB API
        const loadDashboardData = async () => {
            const dashboardStats = await adminService.getStats();
            const allUsers = await adminService.getAllUsers();
            const allLeads = await adminService.getAllLeads();

            setStats(dashboardStats);
            setUsers(allUsers);
            setLeads(allLeads);
        };

        loadDashboardData();
        // Poll every 10 seconds for "live" feel
        const interval = setInterval(loadDashboardData, 10000);

        return () => clearInterval(interval);
    }, []);

    const data = [
        { name: 'Mon', downloads: 400, visits: 240 },
        { name: 'Tue', downloads: 300, visits: 139 },
        { name: 'Wed', downloads: 200, visits: 980 },
        { name: 'Thu', downloads: 278, visits: 390 },
        { name: 'Fri', downloads: 189, visits: 480 },
        { name: 'Sat', downloads: 239, visits: 380 },
        { name: 'Sun', downloads: 349, visits: 430 },
    ];

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Dashboard Overview</h1>
                    <p className="text-slate-400">Real-time platform analytics and user tracking.</p>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm animate-pulse">
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    Live System
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Users"
                    value={stats.totalUsers.toLocaleString()}
                    trend="+12% this week"
                    icon={<Users className="w-6 h-6 text-indigo-400" />}
                />
                <StatCard
                    title="Active Now"
                    value={stats.activeNow}
                    trend="Updated 10s ago"
                    icon={<Eye className="w-6 h-6 text-emerald-400" />}
                    live
                />
                <StatCard
                    title="Logins Today"
                    value={stats.loginsToday}
                    trend="Since midnight"
                    icon={<Users className="w-6 h-6 text-amber-400" />}
                />
                <StatCard
                    title="Downloads Today"
                    value={stats.downloadsToday}
                    // Show total as subtext or handle in UI? 
                    // Let's keep value as Today for cleaner look, update trend to show Total
                    trend={`Total: ${stats.totalDownloads}`}
                    icon={<FileText className="w-6 h-6 text-purple-400" />}
                />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 shadow-xl">
                    <h3 className="text-lg font-bold text-white mb-6">Traffic Overview</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data}>
                                <defs>
                                    <linearGradient id="colorDownloads" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                                <XAxis dataKey="name" stroke="#64748b" />
                                <YAxis stroke="#64748b" />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc' }}
                                />
                                <Area type="monotone" dataKey="downloads" stroke="#6366f1" fillOpacity={1} fill="url(#colorDownloads)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <ActivityLog logs={logs} />
            </div>

            {/* User Management */}
            <UserTable users={users} />

            {/* Leads Management */}
            <LeadTable leads={leads} />
        </div>
    );
}

function StatCard({ title, value, trend, icon, live }) {
    return (
        <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 shadow-xl relative overflow-hidden group hover:border-indigo-500/30 transition-colors">
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity transform scale-150">
                {icon}
            </div>
            <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                    {icon}
                </div>
                <div>
                    <div className="text-slate-400 text-sm font-medium mb-1">{title}</div>
                    <div className="text-2xl font-bold text-white flex items-center gap-3">
                        {value}
                        {live && <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />}
                    </div>
                    <div className="text-emerald-400 text-xs font-medium flex items-center gap-1 mt-1">
                        <TrendingUp className="w-3 h-3" />
                        {trend}
                    </div>
                </div>
            </div>
        </div>
    );
}
