import React from 'react';
import { useResume } from '../../context/ResumeContext';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Plus, Trash2 } from 'lucide-react';

export function EducationForm() {
    const { resumeData, addEducation, updateEducation, removeEducation } = useResume();
    const { education } = resumeData;

    return (
        <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-100">Education</h3>
                <Button onClick={addEducation} variant="primary" size="sm" className="gap-1">
                    <Plus className="w-4 h-4" /> Add
                </Button>
            </div>

            <div className="space-y-4">
                {education.map((edu) => (
                    <div key={edu.id} className="p-4 border border-white/10 rounded-lg space-y-3 bg-white/5">
                        <div className="flex justify-between gap-4">
                            <Input
                                placeholder="School / University"
                                value={edu.school}
                                onChange={(e) => updateEducation(edu.id, 'school', e.target.value)}
                                className="flex-1"
                            />
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => removeEducation(edu.id)}
                                className="text-red-400 hover:bg-red-500/10"
                            >
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <Input
                                placeholder="Degree / Major"
                                value={edu.degree}
                                onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                            />
                            <Input
                                placeholder="Year (e.g. 2020 - 2024)"
                                value={edu.year}
                                onChange={(e) => updateEducation(edu.id, 'year', e.target.value)}
                            />
                        </div>
                        <Input
                            placeholder="Description (Optional)"
                            value={edu.description || ''}
                            onChange={(e) => updateEducation(edu.id, 'description', e.target.value)}
                        />
                    </div>
                ))}

                {education.length === 0 && (
                    <div className="text-center py-6 text-slate-400 bg-white/5 rounded-lg border border-dashed border-white/10">
                        No education entries yet. Click "Add" to start.
                    </div>
                )}
            </div>
        </Card>
    );
}
