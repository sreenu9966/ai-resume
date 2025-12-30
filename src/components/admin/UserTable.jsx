import React, { useState } from 'react';
import { Search, Filter, MoreVertical, Edit, Trash2 } from 'lucide-react';
import { adminService } from '../../services/adminService';

export function UserTable({ users }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('All');

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = filterType === 'All' || user.type === filterType;
        return matchesSearch && matchesType;
    });

    return (
        <div className="bg-slate-900 border border-white/10 rounded-2xl overflow-hidden shadow-xl">
            <div className="p-6 border-b border-white/10 flex flex-col md:flex-row gap-4 justify-between items-center">
                <h3 className="text-lg font-bold text-white">Registered Users</h3>

                <div className="flex gap-3 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                        <input
                            type="text"
                            placeholder="Search users..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-slate-950 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                        />
                    </div>

                    <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        className="bg-slate-950 border border-white/10 rounded-lg px-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                    >
                        <option value="All">All Types</option>
                        <option value="Student">Student</option>
                        <option value="Fresher">Fresher</option>
                        <option value="Employee">Employee</option>
                        <option value="Freelancer">Freelancer</option>
                    </select>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-400">
                    <thead className="bg-slate-950 text-slate-200 uppercase text-xs font-semibold">
                        <tr>
                            <th className="px-6 py-4">User</th>
                            <th className="px-6 py-4">Role/Type</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Graduation</th>
                            <th className="px-6 py-4">Joined</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {filteredUsers.map((user) => (
                            <tr key={user.id} className="hover:bg-white/5 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold text-xs">
                                            {user.name.charAt(0)}
                                        </div>
                                        <div>
                                            <div className="font-medium text-slate-200">{user.name}</div>
                                            <div className="text-xs text-slate-500">{user.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="px-2 py-1 rounded-md bg-white/5 border border-white/10 text-xs">
                                        {user.type}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-col gap-1">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-2 h-2 rounded-full ${user.onlineStatus === 'online' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-600'}`} />
                                            <span className="text-xs text-slate-500">{user.onlineStatus === 'online' ? 'Online' : 'Offline'}</span>
                                        </div>
                                        <span className={`text-xs font-semibold px-2 py-0.5 rounded w-fit ${user.accountStatus === 'blocked' ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
                                            {user.accountStatus === 'blocked' ? 'BLOCKED' : 'ACTIVE'}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">{user.year}</td>
                                <td className="px-6 py-4">{new Date(user.joinDate).toLocaleDateString()}</td>
                                <td className="px-6 py-4 text-right">
                                    <ActionButtons user={user} onUpdate={() => window.location.reload()} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="p-4 border-t border-white/10 bg-slate-950/50 text-xs text-slate-500 flex justify-between items-center">
                <span>Showing {filteredUsers.length} users</span>
                <div className="flex gap-2">
                    <button className="px-3 py-1 rounded bg-white/5 hover:bg-white/10 disabled:opacity-50">Previous</button>
                    <button className="px-3 py-1 rounded bg-white/5 hover:bg-white/10">Next</button>
                </div>
            </div>
        </div>
    );
}

function ActionButtons({ user, onUpdate }) {
    const [loading, setLoading] = useState(false);
    // Dynamic Import or passed prop? UserTable already imports React.
    // We need adminService.
    // Ideally adminService should be imported at top.

    const handleBlockToggle = async () => {
        if (!confirm(`Are you sure you want to ${user.accountStatus === 'blocked' ? 'Unblock' : 'Block'} ${user.name}?`)) return;

        setLoading(true);
        try {
            const newStatus = user.accountStatus === 'blocked' ? 'active' : 'blocked';
            await adminService.updateUserStatus(user.id, newStatus);
            onUpdate(); // Reload table
        } catch (error) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex gap-2 justify-end">
            <button
                onClick={handleBlockToggle}
                disabled={loading}
                className={`p-1.5 rounded transition-colors text-xs font-medium flex items-center gap-1 ${user.accountStatus === 'blocked'
                    ? 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
                    : 'bg-red-500/10 text-red-400 hover:bg-red-500/20'
                    }`}
            >
                {loading ? '...' : (user.accountStatus === 'blocked' ? 'Unblock' : 'Block')}
            </button>
        </div>
    );
}
