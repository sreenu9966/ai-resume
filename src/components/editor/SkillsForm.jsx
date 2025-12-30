import React from 'react';
import { useResume } from '../../context/ResumeContext';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Plus, Trash2 } from 'lucide-react';

export function SkillsForm() {
    const { resumeData, updateSkills } = useResume();
    const { skills } = resumeData;

    // Ensure skills is always an array
    const skillsList = Array.isArray(skills) ? skills : [];

    const handleAddSkill = () => {
        updateSkills([...skillsList, '']);
    };

    const handleUpdateSkill = (index, value) => {
        const newSkills = [...skillsList];
        newSkills[index] = value;
        updateSkills(newSkills);
    };

    const handleRemoveSkill = (index) => {
        const newSkills = skillsList.filter((_, i) => i !== index);
        updateSkills(newSkills);
    };

    return (
        <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-100">Skills</h3>
                <Button onClick={handleAddSkill} variant="primary" size="sm" className="gap-1">
                    <Plus className="w-4 h-4" /> Add Line
                </Button>
            </div>

            <div className="space-y-3">
                {skillsList.map((skill, index) => (
                    <div key={index} className="flex gap-2 items-center">
                        <Input
                            placeholder="e.g. Languages: Python, Java, C++"
                            value={skill}
                            onChange={(e) => handleUpdateSkill(index, e.target.value)}
                            className="flex-1"
                        />
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveSkill(index)}
                            className="text-red-400 hover:bg-red-500/10"
                        >
                            <Trash2 className="w-4 h-4" />
                        </Button>
                    </div>
                ))}
                {skillsList.length === 0 && (
                    <div className="text-center py-6 text-slate-400 bg-white/5 rounded-lg border border-dashed border-white/10">
                        No skills added yet. Click "Add Line" to start.
                    </div>
                )}
            </div>
        </Card>
    );
}
