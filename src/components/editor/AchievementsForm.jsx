import React from 'react';
import { useResume } from '../../context/ResumeContext';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Plus, Trash2 } from 'lucide-react';

export function AchievementsForm() {
    const { resumeData, addAchievement, updateAchievement, removeAchievement } = useResume();
    const { achievements } = resumeData;

    return (
        <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-100">Achievements</h3>
                <Button onClick={addAchievement} variant="primary" size="sm" className="gap-1">
                    <Plus className="w-4 h-4" /> Add
                </Button>
            </div>

            <div className="space-y-4">
                {(achievements || []).map((ach) => (
                    <div key={ach.id} className="flex gap-2 items-center">
                        <Input
                            placeholder="Achievement (e.g. AIR 756 in JEE Advance)"
                            value={ach.title}
                            onChange={(e) => updateAchievement(ach.id, 'title', e.target.value)}
                            className="flex-1"
                        />
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeAchievement(ach.id)}
                            className="text-red-400 hover:bg-red-500/10"
                        >
                            <Trash2 className="w-4 h-4" />
                        </Button>
                    </div>
                ))}
            </div>
        </Card>
    );
}
