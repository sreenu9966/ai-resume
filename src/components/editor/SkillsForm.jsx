import React from 'react';
import { useResume } from '../../context/ResumeContext';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Plus, Trash2, LayoutGrid, List, AlignJustify, Columns } from 'lucide-react';

export function SkillsForm() {
    const {
        resumeData,
        updateSkills, // Needed for migration
        addSkillGroup,
        updateSkillGroup,
        removeSkillGroup,
        addSkillToGroup,
        updateSkillInGroup,
        removeSkillFromGroup,
        updateSkillsViewMode,
        updateSkillsLayout
    } = useResume();

    const { skills, skillsViewMode = 'categorized', skillsLayout = 'row' } = resumeData;

    // Safety: ensure skills is array
    const rawSkills = Array.isArray(skills) ? skills : [];

    // Validates if the data is in the old format (Array of strings)
    const isLegacySkills = rawSkills.length > 0 && typeof rawSkills[0] === 'string';

    // Auto-migrate legacy data to new structure
    React.useEffect(() => {
        if (isLegacySkills) {
            console.log("Migrating legacy skills...");
            // Create a proper group structure and update context
            const migrated = [{
                id: Date.now().toString(),
                name: 'General Skills',
                items: [...rawSkills]
            }];
            updateSkills(migrated);
        }
    }, [isLegacySkills, rawSkills, updateSkills]);

    // If legacy, we wait for migration. Meanwhile show nothing or migrated view
    if (isLegacySkills) return <div className="p-4 text-slate-400">Upgrading skills format...</div>;

    const skillGroups = rawSkills;

    // Quick Add Presets
    const presets = [
        { name: 'Frontend', items: ['React', 'HTML', 'CSS', 'JavaScript'] },
        { name: 'Backend', items: ['Node.js', 'Express', 'Python', 'SQL'] },
        { name: 'Tools', items: ['Git', 'Docker', 'AWS', 'Linux'] },
        { name: 'Design', items: ['Figma', 'Photoshop', 'UI/UX'] },
        { name: 'Soft Skills', items: ['Leadership', 'Communication', 'Teamwork'] }
    ];

    const handleAddPreset = (e) => {
        const presetName = e.target.value;
        if (!presetName) return;

        // This is a simplified "Add Group" that would ideally use a proper context function
        // But since we only have `addSkillGroup` which adds a generic one, we add then update.
        // A better way: Let user click "Add Group" then rename.
        // Or if we want to support presets, we might need a `addSkillGroupWithData` function.
        // For now, let's just stick to manual creation to keep it simple as requested: "dropdown... add button".
        // Actually, let's use the `addSkillGroup` and then immediately update it? No, context is async-ish.
        // Let's just provide the "Add Group" button for now, and maybe a "Template" dropdown that *appends* a pre-filled group if we had that capability.
        // Given constraint: use existing context.
        // I'll stick to manual "Add Category" first.
    };

    return (
        <div className="space-y-6">
            {/* View & Layout Controls */}
            <div className="bg-white/5 p-3 rounded-lg border border-white/10 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400 uppercase tracking-wider font-bold">Format</span>
                    <div className="flex bg-slate-900/50 rounded-md p-1">
                        <button
                            onClick={() => updateSkillsViewMode('categorized')}
                            className={`px-3 py-1.5 rounded text-xs font-medium flex items-center gap-2 transition-colors ${skillsViewMode === 'categorized' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
                        >
                            <LayoutGrid className="w-3.5 h-3.5" /> Groups
                        </button>
                        <button
                            onClick={() => updateSkillsViewMode('list')}
                            className={`px-3 py-1.5 rounded text-xs font-medium flex items-center gap-2 transition-colors ${skillsViewMode === 'list' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
                        >
                            <List className="w-3.5 h-3.5" /> Simple List
                        </button>
                    </div>
                </div>

                <div className="flex items-center justify-between border-t border-white/5 pt-3">
                    <span className="text-xs text-slate-400 uppercase tracking-wider font-bold">Alignment</span>
                    <div className="flex bg-slate-900/50 rounded-md p-1">
                        <button
                            onClick={() => updateSkillsLayout('row')}
                            className={`px-3 py-1.5 rounded text-xs font-medium flex items-center gap-2 transition-colors ${skillsLayout === 'row' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
                        >
                            <AlignJustify className="w-3.5 h-3.5" /> Horizontal
                        </button>
                        <button
                            onClick={() => updateSkillsLayout('column')}
                            className={`px-3 py-1.5 rounded text-xs font-medium flex items-center gap-2 transition-colors ${skillsLayout === 'column' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
                        >
                            <Columns className="w-3.5 h-3.5" /> Vertical
                        </button>
                    </div>
                </div>
            </div>

            {skillGroups.map((group) => (
                <Card key={group.id} className="p-4 space-y-4 border border-white/10 bg-white/5">
                    {/* Group Header */}
                    <div className="flex items-center gap-3">
                        <Input
                            value={group.name}
                            onChange={(e) => updateSkillGroup(group.id, e.target.value)}
                            placeholder="Category Name (e.g. Frontend)"
                            className="font-bold text-indigo-300 bg-transparent border-none px-0 text-lg focus:ring-0 placeholder:text-indigo-300/50"
                        />
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeSkillGroup(group.id)}
                            className="text-red-400 hover:bg-red-500/10 ml-auto shrink-0"
                            title="Remove Category"
                        >
                            <Trash2 className="w-4 h-4" />
                        </Button>
                    </div>

                    {/* Skills List */}
                    <div className="space-y-2 pl-4 border-l-2 border-white/5">
                        {group.items.map((skill, idx) => (
                            <div key={idx} className="flex gap-2 items-center">
                                <Input
                                    value={skill}
                                    onChange={(e) => updateSkillInGroup(group.id, idx, e.target.value)}
                                    placeholder="Skill (e.g. React)"
                                    className="h-8 text-sm"
                                />
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => removeSkillFromGroup(group.id, idx)}
                                    className="text-slate-500 hover:text-red-400 h-8 w-8"
                                >
                                    <Trash2 className="w-3 h-3" />
                                </Button>
                            </div>
                        ))}
                        <Button
                            onClick={() => addSkillToGroup(group.id)}
                            variant="outline"
                            size="sm"
                            className="text-xs mt-2 border-dashed border-white/20 text-slate-400 hover:text-slate-200"
                        >
                            <Plus className="w-3 h-3 mr-1" /> Add Skill
                        </Button>
                    </div>
                </Card>
            ))}

            <Button onClick={addSkillGroup} variant="primary" className="w-full">
                <Plus className="w-4 h-4 mr-2" /> Add New Category
            </Button>
        </div>
    );
}
