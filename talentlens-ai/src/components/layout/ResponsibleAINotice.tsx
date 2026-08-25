import React, { useState } from 'react';
import { ShieldCheck, Info, X } from 'lucide-react';

export const ResponsibleAINotice: React.FC = () => {
  const [isDismissed, setIsDismissed] = useState<boolean>(false);

  if (isDismissed) return null;

  return (
    <div className="bg-slate-900/90 border-b border-indigo-500/20 px-4 py-2.5 sm:px-6 flex items-center justify-between text-xs text-slate-300">
      <div className="flex items-center gap-2.5 max-w-5xl">
        <div className="flex items-center justify-center w-5 h-5 rounded-full bg-indigo-500/10 text-indigo-400 shrink-0">
          <ShieldCheck className="w-3.5 h-3.5" />
        </div>
        <p className="leading-tight">
          <strong className="text-indigo-300 font-semibold">Human-in-the-Loop Recruitment:</strong> AI-generated screening insights and compatibility scores are decision-support indicators. Final hiring verdicts always remain with the human recruiter. Protected characteristics are never evaluated.
        </p>
      </div>
      <button
        onClick={() => setIsDismissed(true)}
        className="text-slate-400 hover:text-slate-200 p-1 rounded transition-colors ml-4 shrink-0"
        title="Dismiss notice"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
