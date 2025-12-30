import React, { useState } from 'react';
import { useResume } from '../../context/ResumeContext';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Plus, Trash2, Edit2, Check } from 'lucide-react';

export function ExtrasForm() {
    const { resumeData, addExtra, updateExtra, removeExtra, updateExtrasTitle } = useResume();
    const { extras, extrasTitle } = resumeData;
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [tempTitle, setTempTitle] = useState(extrasTitle);

    const handleSaveTitle = () => {
        updateExtrasTitle(tempTitle);
        setIsEditingTitle(false);
    };

    const boldExtras = (extras || []).filter(e => e.type === 'bold');
    const normalExtras = (extras || []).filter(e => e.type === 'normal');

    return (
        <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    {isEditingTitle ? (
                        <div className="flex items-center gap-2">
                            <Input
                                value={tempTitle}
                                onChange={(e) => setTempTitle(e.target.value)}
                                className="w-40 h-8 text-sm"
                                autoFocus
                            />
                            <Button size="icon" variant="ghost" onClick={handleSaveTitle}>
                                <Check className="w-4 h-4 text-green-400" />
                            </Button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <h3 className="text-lg font-semibold text-slate-100">{extrasTitle || 'Activities'}</h3>
                            <Button size="icon" variant="ghost" onClick={() => {
                                setTempTitle(extrasTitle || 'Activities');
                                setIsEditingTitle(true);
                            }}>
                                <Edit2 className="w-3 h-3 text-slate-400" />
                            </Button>
                        </div>
                    )}
                </div>
            </div>

            <div className="space-y-6">
                {/* Bold Items Section */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium text-slate-300">Bold Items</h4>
                        <Button onClick={() => addExtra('bold')} variant="outline" size="sm" className="gap-1 h-7 border-white/10 text-slate-300 hover:text-white">
                            <Plus className="w-3 h-3" /> Add Bold
                        </Button>
                    </div>
                    <div className="space-y-2">
                        {boldExtras.map((extra) => (
                            <div key={extra.id} className="flex gap-2">
                                <Input
                                    value={extra.text}
                                    onChange={(e) => updateExtra(extra.id, e.target.value)}
                                    placeholder="Bold Item (e.g. Coding)"
                                    className="font-semibold"
                                />
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => removeExtra(extra.id)}
                                    className="text-red-400 hover:bg-red-500/10"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="border-t border-white/10" />

                {/* Normal Items Section */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium text-slate-300">Normal Items</h4>
                        <Button onClick={() => addExtra('normal')} variant="outline" size="sm" className="gap-1 h-7 border-white/10 text-slate-300 hover:text-white">
                            <Plus className="w-3 h-3" /> Add Normal
                        </Button>
                    </div>
                    <div className="space-y-2">
                        {normalExtras.map((extra) => (
                            <div key={extra.id} className="flex gap-2">
                                <Input
                                    value={extra.text}
                                    onChange={(e) => updateExtra(extra.id, e.target.value)}
                                    placeholder="Normal Item (e.g. Reading)"
                                />
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => removeExtra(extra.id)}
                                    className="text-red-400 hover:bg-red-500/10"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </Card>
    );
}
