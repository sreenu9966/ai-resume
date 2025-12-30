import React from 'react';
import { useResume } from '../../context/ResumeContext';
import { Card } from '../ui/Card';
import { Check, Palette, Layout as LayoutIcon } from 'lucide-react';
import { clsx } from 'clsx';

const colors = [
    { name: 'Blue', value: '#2563eb' },
    { name: 'Purple', value: '#9333ea' },
    { name: 'Red', value: '#dc2626' },
    { name: 'Green', value: '#16a34a' },
    { name: 'Slate', value: '#475569' },
    { name: 'Black', value: '#000000' },
];

const themes = [
    { id: 'modern', name: 'Modern' },
    { id: 'classic', name: 'Classic' },
    { id: 'minimal', name: 'Minimal' },
    { id: 'professional', name: 'Professional' },
    { id: 'elegant', name: 'Elegant' },
];

export function ThemeSelector() {
    const { resumeData, updateThemeColor, updateTheme } = useResume();
    const { themeColor, theme } = resumeData;

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
                    <div className="grid grid-cols-3 gap-3">
                        {themes.map((t) => (
                            <button
                                key={t.id}
                                onClick={() => updateTheme(t.id)}
                                className={clsx(
                                    "px-3 py-2 rounded-lg text-sm font-medium border transition-all",
                                    theme === t.id
                                        ? "border-indigo-500 bg-indigo-600 text-white shadow-lg shadow-indigo-500/20"
                                        : "border-white/10 hover:border-white/20 hover:bg-white/5 text-slate-400 hover:text-slate-200"
                                )}
                            >
                                {t.name}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </Card>
    );
}
