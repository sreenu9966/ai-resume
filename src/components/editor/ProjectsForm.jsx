import React from 'react';
import { useResume } from '../../context/ResumeContext';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Plus, Trash2 } from 'lucide-react';

export function ProjectsForm() {
    const { resumeData, addProject, updateProject, removeProject } = useResume();
    const { projects } = resumeData;

    return (
        <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <h3 className="text-lg font-semibold text-slate-100">Projects</h3>
                </div>
                <Button onClick={addProject} variant="primary" size="sm" className="gap-1">
                    <Plus className="w-4 h-4" /> Add
                </Button>
            </div>

            <div className="space-y-4">
                {(projects || []).map((proj) => (
                    <div key={proj.id} className="p-4 border border-white/10 rounded-lg space-y-3 bg-white/5">
                        <div className="flex justify-between gap-4">

                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => removeProject(proj.id)}
                                className="text-red-400 hover:bg-red-500/10"
                            >
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-2">
                                <Input
                                    label="Project Name"
                                    placeholder="e.g. E-commerce Website"
                                    value={proj.name}
                                    onChange={(e) => updateProject(proj.id, 'name', e.target.value)}
                                />
                            </div>
                            <div className="col-span-2">
                                <Input
                                    label="Project Link"
                                    placeholder="e.g. github.com/username/project"
                                    value={proj.link}
                                    onChange={(e) => updateProject(proj.id, 'link', e.target.value)}
                                />
                            </div>
                            <Input
                                label="Date / Duration"
                                placeholder="e.g. Jan 2023 - Present"
                                value={proj.date}
                                onChange={(e) => updateProject(proj.id, 'date', e.target.value)}
                            />
                            <textarea
                                className="w-full rounded-lg glass-input px-3 py-2 text-sm h-24 resize-none"
                                placeholder="Description (Technologies used, etc.)"
                                value={proj.description}
                                onChange={(e) => updateProject(proj.id, 'description', e.target.value)}
                            />
                        </div>

                    </div>
                ))}
            </div>
        </Card>
    );
}
