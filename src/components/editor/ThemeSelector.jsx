import React, { useState } from 'react';
import { useResume } from '../../context/ResumeContext';
import { Card } from '../ui/Card';
import { Check, Palette, Layout as LayoutIcon, Grid, Columns } from 'lucide-react';
import { clsx } from 'clsx';

const colors = [
    { name: 'Blue', value: '#2563eb' },
    { name: 'Purple', value: '#9333ea' },
    { name: 'Red', value: '#dc2626' },
    { name: 'Green', value: '#16a34a' },
    { name: 'Slate', value: '#475569' },
    { name: 'Black', value: '#000000' },
];

const standardThemes = [
    { id: 'modern', name: 'Modern', type: 'standard' },
    { id: 'professional', name: 'Professional', type: 'standard' },
    { id: 'minimal', name: 'Minimal', type: 'standard' },
    { id: 'classic', name: 'Classic', type: 'serif' },
    { id: 'elegant', name: 'Elegant', type: 'serif' },
];

const modernThemes = [
    { id: 'modern', name: 'Standard', type: 'standard' }, // Duplicate for access
    { id: 'creative', name: 'Creative', type: 'geometric' },
];

// Mini Preview Component
const ThemePreview = ({ type, color, isSelected }) => {
    // Base Frame
    const frameClass = clsx(
        "w-full aspect-[210/297] bg-white rounded shadow-sm overflow-hidden relative transition-all duration-300 pointer-events-none",
        isSelected ? "ring-2 ring-indigo-500 ring-offset-2 ring-offset-slate-800" : "opacity-80 group-hover:opacity-100"
    );

    // Common Elements
    const renderLines = (count = 3) => (
        <div className="space-y-1 mt-2">
            {[...Array(count)].map((_, i) => (
                <div key={i} className="h-0.5 bg-gray-200 rounded w-full last:w-2/3" />
            ))}
        </div>
    );

    // 1. STANDARD / MINIMAL (Single Column)
    if (type === 'standard' || type === 'serif') {
        const isSerif = type === 'serif';
        return (
            <div className={frameClass}>
                <div className="p-2 flex flex-col h-full">
                    {/* Header */}
                    <div className="mb-2">
                        <div className={clsx("h-2 w-1/2 mb-1 rounded", isSerif ? "bg-gray-800" : "")} style={{ backgroundColor: isSerif ? undefined : color }} />
                        <div className="h-1 w-1/3 bg-gray-300 rounded" />
                    </div>
                    {/* Body */}
                    <div className="flex-1 space-y-2">
                        <div>
                            <div className="h-1.5 w-1/4 bg-gray-400 mb-1 rounded" />
                            {renderLines(2)}
                        </div>
                        <div>
                            <div className="h-1.5 w-1/4 bg-gray-400 mb-1 rounded" />
                            {renderLines(3)}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // 2. GEOMETRIC / CREATIVE (Blue Grid)
    if (type === 'geometric') {
        return (
            <div className={frameClass}>
                {/* Bg Pattern */}
                <div className="absolute top-0 right-0 w-1/2 h-1/2 opacity-10"
                    style={{ backgroundImage: `linear-gradient(135deg, ${color} 2px, transparent 2px)`, backgroundSize: '8px 8px' }}
                />

                <div className="p-2 h-full flex flex-col">
                    {/* Top Header Split */}
                    <div className="flex gap-2 mb-2 items-center">
                        <div className="w-6 h-6 rounded-full border-2 bg-white z-10" style={{ borderColor: color }} />
                        <div className="flex-1 p-1 rounded text-[0px]" style={{ backgroundColor: color }}>.</div>
                    </div>

                    {/* 2 Cols */}
                    <div className="flex-1 flex gap-2">
                        {/* Left Sidebar */}
                        <div className="w-1/3 space-y-2">
                            <div className="h-full bg-slate-100 rounded p-0.5">
                                <div className="h-1 w-1/2 mb-1 rounded" style={{ backgroundColor: color }} />
                                <div className="h-0.5 bg-gray-300 w-full mb-0.5" />
                                <div className="h-0.5 bg-gray-300 w-2/3" />
                            </div>
                        </div>
                        {/* Right Main */}
                        <div className="w-2/3 space-y-2">
                            <div>
                                <div className="flex items-center gap-1 mb-0.5">
                                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
                                    <div className="h-1 w-1/4 bg-gray-400 rounded" />
                                </div>
                                {renderLines(2)}
                            </div>
                            <div>
                                <div className="flex items-center gap-1 mb-0.5">
                                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
                                    <div className="h-1 w-1/4 bg-gray-400 rounded" />
                                </div>
                                {renderLines(2)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return null;
};

export function ThemeSelector() {
    const { resumeData, updateThemeColor, updateTheme } = useResume();
    const { themeColor, theme } = resumeData;
    const [activeTab, setActiveTab] = useState('standard'); // Default to Standard tab

    return (
        <Card className="p-6">
            <div className="space-y-6">
                <div>
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-slate-100">
                        <Palette className="w-5 h-5 text-indigo-400" /> Theme Color
                    </h3>
                    <div className="flex flex-wrap gap-3">
                        {colors.map((c) => (
                            <button
                                key={c.name}
                                onClick={() => updateThemeColor(c.value)}
                                className={clsx(
                                    "w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110 ring-2 ring-offset-2 ring-offset-slate-900",
                                    themeColor === c.value ? "ring-indigo-500 scale-110" : "ring-transparent hover:ring-slate-700"
                                )}
                                style={{ backgroundColor: c.value }}
                                aria-label={`Select ${c.name} color`}
                            >
                                {themeColor === c.value && <Check className="w-4 h-4 text-white" />}
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-slate-100">
                        <LayoutIcon className="w-5 h-5 text-indigo-400" /> Layout Style
                    </h3>

                    {/* Tabs */}
                    <div className="flex gap-2 mb-4 bg-slate-800/50 p-1 rounded-lg">
                        <button
                            onClick={() => setActiveTab('standard')}
                            className={clsx(
                                "flex-1 py-1.5 px-3 rounded-md text-sm font-medium transition-all flex items-center justify-center gap-2",
                                activeTab === 'standard' ? "bg-indigo-600 text-white shadow" : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
                            )}
                        >
                            <Grid className="w-4 h-4" /> Standard
                        </button>
                        <button
                            onClick={() => setActiveTab('modern')}
                            className={clsx(
                                "flex-1 py-1.5 px-3 rounded-md text-sm font-medium transition-all flex items-center justify-center gap-2 hidden md:flex",
                                activeTab === 'modern' ? "bg-indigo-600 text-white shadow" : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
                            )}
                        >
                            <LayoutIcon className="w-4 h-4" /> Modern (Structure)
                        </button>
                    </div>

                    <div className={clsx(
                        activeTab === 'standard' ? "grid gap-3 grid-cols-2" : "flex gap-4 overflow-x-auto pb-4 -mx-2 px-2 custom-scrollbar snap-x"
                    )}>
                        {(activeTab === 'standard' ? standardThemes : modernThemes).map((t) => {
                            // STANDARD TAB: Text Only
                            if (activeTab === 'standard') {
                                return (
                                    <button
                                        key={t.id}
                                        onClick={() => updateTheme(t.id)}
                                        className={clsx(
                                            "px-3 py-3 rounded-lg text-sm font-medium border transition-all text-left flex items-center justify-between group",
                                            theme === t.id
                                                ? "border-indigo-500 bg-indigo-600/20 text-indigo-300 shadow-lg shadow-indigo-500/10"
                                                : "border-white/10 hover:border-white/20 hover:bg-white/5 text-slate-400 hover:text-slate-200"
                                        )}
                                    >
                                        <span>{t.name}</span>
                                        {theme === t.id && <Check className="w-4 h-4 text-indigo-400" />}
                                    </button>
                                );
                            }

                            // MODERN TAB: Visual Cards
                            return (
                                <button
                                    key={t.id}
                                    onClick={() => updateTheme(t.id)}
                                    className="group text-left"
                                >
                                    <ThemePreview
                                        type={t.type}
                                        color={themeColor}
                                        isSelected={theme === t.id}
                                    />
                                    <div className={clsx(
                                        "mt-2 text-sm font-medium text-center transition-colors",
                                        theme === t.id ? "text-indigo-400" : "text-slate-400 group-hover:text-slate-200"
                                    )}>
                                        {t.name}
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </Card>
    );
}
