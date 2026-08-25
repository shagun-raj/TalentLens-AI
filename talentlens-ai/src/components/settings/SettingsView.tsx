import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Settings, Sliders, ShieldCheck, Check, Save } from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { addToast } = useApp();

  const [skillsWeight, setSkillsWeight] = useState(40);
  const [expWeight, setExpWeight] = useState(30);
  const [eduWeight, setEduWeight] = useState(15);
  const [projectsWeight, setProjectsWeight] = useState(15);

  const [strictPiiShield, setStrictPiiShield] = useState(true);
  const [autoFlagGaps, setAutoFlagGaps] = useState(true);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    addToast({
      type: 'success',
      title: 'Scoring Preferences Saved',
      description: 'AI Screening weights and fairness policies updated.'
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="pb-4 border-b border-slate-800">
        <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <Settings className="w-5 h-5 text-indigo-400" />
          <span>Screening Configuration & Scoring Weights</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Adjust the relative weightings used by the GenAI engine to compute composite compatibility scores.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Scoring Weights */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider text-indigo-400 flex items-center gap-2">
              <Sliders className="w-4 h-4" />
              <span>Composite Match Score Weights</span>
            </h3>
            <span className="text-xs font-mono font-bold text-indigo-300">
              Total: {skillsWeight + expWeight + eduWeight + projectsWeight}%
            </span>
          </div>

          <div className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <div className="flex justify-between font-semibold text-slate-200">
                <span>Technical Skills Relevance</span>
                <span className="font-mono text-indigo-400">{skillsWeight}%</span>
              </div>
              <input
                type="range"
                min={10}
                max={70}
                value={skillsWeight}
                onChange={(e) => setSkillsWeight(Number(e.target.value))}
                className="w-full accent-indigo-500 cursor-pointer"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between font-semibold text-slate-200">
                <span>Work Experience Duration & Seniority</span>
                <span className="font-mono text-indigo-400">{expWeight}%</span>
              </div>
              <input
                type="range"
                min={10}
                max={60}
                value={expWeight}
                onChange={(e) => setExpWeight(Number(e.target.value))}
                className="w-full accent-indigo-500 cursor-pointer"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between font-semibold text-slate-200">
                <span>Academic & Degree Requirements</span>
                <span className="font-mono text-indigo-400">{eduWeight}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={40}
                value={eduWeight}
                onChange={(e) => setEduWeight(Number(e.target.value))}
                className="w-full accent-indigo-500 cursor-pointer"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between font-semibold text-slate-200">
                <span>Domain Projects & Portfolio</span>
                <span className="font-mono text-indigo-400">{projectsWeight}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={40}
                value={projectsWeight}
                onChange={(e) => setProjectsWeight(Number(e.target.value))}
                className="w-full accent-indigo-500 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Responsible AI & Fairness Governance */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider text-indigo-400 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4" />
            <span>Responsible AI & Bias Guardrails</span>
          </h3>

          <div className="space-y-3 text-xs">
            <label className="flex items-start gap-3 cursor-pointer p-3 rounded-lg bg-slate-950/60 border border-slate-800 hover:border-slate-700">
              <input
                type="checkbox"
                checked={strictPiiShield}
                onChange={(e) => setStrictPiiShield(e.target.checked)}
                className="mt-0.5 accent-indigo-500 rounded"
              />
              <div>
                <p className="font-bold text-slate-200">Enforce Strict PII & Demographic Shield</p>
                <p className="text-slate-400 text-[11px] mt-0.5">
                  Masks candidate names, gender pronouns, demographic indicators, and dates of birth during model inference.
                </p>
              </div>
            </label>

            <label className="flex items-start gap-3 cursor-pointer p-3 rounded-lg bg-slate-950/60 border border-slate-800 hover:border-slate-700">
              <input
                type="checkbox"
                checked={autoFlagGaps}
                onChange={(e) => setAutoFlagGaps(e.target.checked)}
                className="mt-0.5 accent-indigo-500 rounded"
              />
              <div>
                <p className="font-bold text-slate-200">Automatically Surface Skill Gaps & Ramp-Up Notes</p>
                <p className="text-slate-400 text-[11px] mt-0.5">
                  Generates constructive interview questions and missing tech stack alerts for recruiter review.
                </p>
              </div>
            </label>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Configuration</span>
          </button>
        </div>
      </form>
    </div>
  );
};
