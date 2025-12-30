import React, { useState } from 'react';
import { useResume } from '../../../hooks/useResume';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Plus, Trash2, Sparkles, Loader2 } from 'lucide-react';
import { enhanceTextWithGemini } from '../../services/gemini';

export function ExperienceForm() {
  const { resumeData, addExperience, updateExperience, removeExperience } = useResume();
  const { experience } = resumeData;
  const [enhancingId, setEnhancingId] = useState(null);

  const handleEnhance = async (id, currentText) => {
    if (!currentText) return;
    setEnhancingId(id);
    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      const enhancedText = await enhanceTextWithGemini(currentText, 'experience', apiKey);
      updateExperience(id, 'description', enhancedText);
    } catch (error) {
      console.error("Failed to enhance experience", error);
    } finally {
      setEnhancingId(null);
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-slate-100">Experience</h3>
        <Button onClick={addExperience} variant="primary" size="sm" className="gap-1">
          <Plus className="w-4 h-4" /> Add
        </Button>
      </div>

      <div className="space-y-4">
        {experience.map((exp) => (
          <div key={exp.id} className="p-4 border border-white/10 rounded-lg space-y-3 bg-white/5">
            <div className="grid grid-cols-2 gap-3 mb-2">
              <Input
                placeholder="Job Title"
                value={exp.role}
                onChange={(e) => updateExperience(exp.id, 'role', e.target.value)}
              />
              <Input
                placeholder="Company"
                value={exp.company}
                onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
              />
              <Input
                placeholder="Duration"
                value={exp.duration}
                onChange={(e) => updateExperience(exp.id, 'duration', e.target.value)}
              />

              <div className="flex justify-end pt-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeExperience(exp.id)}
                  className="text-red-400 hover:bg-red-500/10"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="relative">
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-medium text-slate-400">Description</label>
                <button
                  onClick={() => handleEnhance(exp.id, exp.description)}
                  disabled={enhancingId === exp.id || !exp.description}
                  className="flex items-center gap-1.5 text-xs font-medium text-indigo-400 hover:text-indigo-300 disabled:opacity-50 transition-colors"
                >
                  {enhancingId === exp.id ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    <Sparkles className="w-3 h-3" />
                  )}
                  {enhancingId === exp.id ? 'Enhancing...' : 'Enhance with AI'}
                </button>
              </div>
              <textarea
                className="w-full rounded-lg glass-input px-3 py-2 text-sm h-24 resize-none"
                placeholder="Job Description / Achievements"
                value={exp.description}
                onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
              />
            </div>
          </div>
        ))}
        {experience.length === 0 && (
          <div className="text-center py-6 text-slate-400 bg-white/5 rounded-lg border border-dashed border-white/10">
            No experience entries yet. Click "Add" to start.
          </div>
        )}
      </div>
    </Card>
  );
}
