import React from 'react';
import { Clock, FilePlus, Edit3, Trash, Download } from 'lucide-react';

export function ActivityLog({ logs }) {
    const getIcon = (action) => {
        if (action.includes('Created')) return <FilePlus className="w-4 h-4 text-emerald-400" />;
        if (action.includes('Updated')) return <Edit3 className="w-4 h-4 text-blue-400" />;
        if (action.includes('Deleted')) return <Trash className="w-4 h-4 text-red-400" />;
        if (action.includes('Downloaded')) return <Download className="w-4 h-4 text-indigo-400" />;
        return <Clock className="w-4 h-4 text-slate-400" />;
    };

    return (
        <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 shadow-xl h-full">
            <h3 className="text-lg font-bold text-white mb-6">Live Activity Feed</h3>

            <div className="space-y-6 relative">
                {/* Timeline Line */}
                <div className="absolute left-4 top-2 bottom-2 w-px bg-white/10" />

                {logs.map((log) => (
                    <div key={log.id} className="relative pl-10 group">
                        {/* Timeline Dot */}
                        <div className="absolute left-[13px] top-1.5 w-1.5 h-1.5 rounded-full bg-slate-600 group-hover:bg-indigo-500 group-hover:shadow-[0_0_8px_rgba(99,102,241,0.6)] transition-all" />

                        <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2 text-sm font-medium text-slate-200">
                                {getIcon(log.action)}
                                <span>{log.user}</span>
                                <span className="text-slate-500 font-normal">performed</span>
                                <span className="text-indigo-400">{log.action}</span>
                            </div>
                            <span className="text-xs text-slate-500">
                                {new Date(log.timestamp).toLocaleTimeString()} · {new Date(log.timestamp).toLocaleDateString()}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
