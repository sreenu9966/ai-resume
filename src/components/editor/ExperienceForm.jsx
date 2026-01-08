import React, { useState } from 'react';
import { useResume } from '../../context/ResumeContext';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Plus, Trash2 } from 'lucide-react';

export function ExperienceForm() {
  const {
    resumeData,
    addExperience,
    updateExperience,
    removeExperience,
    setShowPaymentModal,
    updateExperienceType,
    updateExperienceTitle,
    updateFresherSummary
  } = useResume();

  // Default to 'experienced' if undefined (backward compatibility)
  const experienceType = resumeData.experienceType || 'experienced';
  const experienceTitle = resumeData.experienceTitle || 'Experience';
  const fresherSummary = resumeData.fresherSummary || '';
  const { experience } = resumeData;

  return (
    <Card className="p-6 transition-all duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="relative group">
            <Input
              value={experienceTitle}
              onChange={(e) => updateExperienceTitle(e.target.value)}
              className="text-xl font-bold text-white tracking-tight bg-transparent border-none p-0 focus:ring-0 w-auto min-w-[120px] placeholder:text-slate-500 focus:bg-transparent"
              placeholder="Section Title"
            />
            <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-indigo-500/30 scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
            <span className="absolute -top-3 left-0 text-[10px] text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity">Edit Title</span>
          </div>

          <div className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-medium border border-indigo-500/30">
            {experienceType === 'experienced' ? 'Pro' : 'Entry Level'}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Premium Toggle Switch */}
          {/* Fresher Mode Toggle */}
          <button
            onClick={() => updateExperienceType(experienceType === 'experienced' ? 'fresher' : 'experienced')}
            className={`
              relative flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all
              ${experienceType === 'fresher'
                ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/30'
                : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-slate-300 border border-white/5'}
            `}
          >
            <span className={`w-2 h-2 rounded-full transition-colors ${experienceType === 'fresher' ? 'bg-white' : 'bg-slate-500'}`} />
            {experienceType === 'experienced' ? 'Fresher' : 'Experienced'}
          </button>
        </div>
      </div>

      {experienceType === 'experienced' ? (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
          <div className="flex justify-between items-center px-1">
            <p className="text-sm text-slate-400">Add your past work history.</p>
            <Button onClick={addExperience} variant="primary" size="sm" className="gap-2 shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 transition-all">
              <Plus className="w-4 h-4" /> Add Role
            </Button>
          </div>

          {experience.map((exp, index) => (
            <div key={exp.id} className="group p-5 border border-white/5 rounded-xl space-y-4 bg-gradient-to-br from-white/5 to-white/[0.02] hover:border-white/10 transition-all">
              <div className="flex justify-between items-start">
                <div className="text-xs font-medium text-indigo-400 mb-2 uppercase tracking-wider">Role {index + 1}</div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeExperience(exp.id)}
                  className="text-slate-500 hover:text-red-400 hover:bg-red-500/10 -mt-2 -mr-2 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-400">Job Title</label>
                  <Input
                    placeholder="e.g. Senior Product Designer"
                    value={exp.role}
                    onChange={(e) => updateExperience(exp.id, 'role', e.target.value)}
                    className="bg-black/20 focus:bg-black/40 border-white/5 focus:border-indigo-500/50 transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-400">Company Name</label>
                  <Input
                    placeholder="e.g. Google"
                    value={exp.company}
                    onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                    className="bg-black/20 focus:bg-black/40 border-white/5 focus:border-indigo-500/50 transition-all"
                  />
                </div>
                <div className="space-y-1.5 md:col-span-2">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-slate-400">Location</label>
                      <Input
                        placeholder="e.g. New York, NY"
                        value={exp.location || ''}
                        onChange={(e) => updateExperience(exp.id, 'location', e.target.value)}
                        className="bg-black/20 focus:bg-black/40 border-white/5 focus:border-indigo-500/50 transition-all"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-slate-400">Duration</label>
                      <Input
                        placeholder="e.g. Jan 2022 - Present"
                        value={exp.date || ''}
                        onChange={(e) => updateExperience(exp.id, 'date', e.target.value)}
                        className="bg-black/20 focus:bg-black/40 border-white/5 focus:border-indigo-500/50 transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-medium text-slate-400">Achievements & Responsibilities</label>
                </div>
                <textarea
                  className="w-full rounded-xl bg-black/20 border border-white/10 focus:border-indigo-500/50 focus:bg-black/30 focus:ring-1 focus:ring-indigo-900/50 p-4 text-sm min-h-[120px] resize-y transition-all text-slate-200 placeholder:text-slate-600 leading-relaxed scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent"
                  placeholder="• Led cross-functional team of 5 developers&#10;• Increased system performance by 30%&#10;• Mentored junior developers..."
                  value={exp.description}
                  onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                />
              </div>
            </div>
          ))}
          {experience.length === 0 && (
            <div className="flex flex-col items-center justify-center py-10 px-4 text-center rounded-xl border-2 border-dashed border-white/10 bg-white/5">
              <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-3">
                <Plus className="w-5 h-5 text-slate-400" />
              </div>
              <h4 className="text-slate-200 font-medium mb-1">No Experience Added</h4>
              <p className="text-slate-500 text-sm mb-4">Add your relevant work experience to stand out.</p>
              <Button onClick={addExperience} variant="outline" size="sm">
                Add Role
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
          <div className="p-6 border border-indigo-500/20 rounded-xl bg-indigo-500/[0.02] space-y-4">
            <div className="flex justify-between items-center">
              <div className="space-y-1">
                <h4 className="text-base font-semibold text-white">Fresher Summary & Internships</h4>
                <p className="text-xs text-indigo-300/80">Highlight your academic potential and early career steps.</p>
              </div>
            </div>

            <div className="relative">
              <textarea
                className="w-full rounded-xl bg-black/20 border border-white/10 focus:border-indigo-500/50 focus:bg-black/30 focus:ring-1 focus:ring-indigo-900/50 p-5 text-sm min-h-[200px] resize-none transition-all text-slate-200 placeholder:text-slate-600 leading-7"
                placeholder="I am a motivated Graduate with a strong foundation in..."
                value={fresherSummary}
                onChange={(e) => updateFresherSummary(e.target.value)}
              />
              {/* Decorative gradient corner */}
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-indigo-500/10 to-transparent rounded-tr-xl pointer-events-none" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-3 rounded-lg bg-white/5 border border-white/5">
                <h5 className="text-xs font-semibold text-indigo-300 mb-1">💡 What to include?</h5>
                <ul className="text-xs text-slate-400 space-y-1 list-disc list-inside">
                  <li>Degree & CGPA (if high)</li>
                  <li>Key projects & technologies</li>
                  <li>Internships & roles</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
