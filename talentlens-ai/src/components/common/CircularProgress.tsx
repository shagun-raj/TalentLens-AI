import React from 'react';

interface CircularProgressProps {
  score?: number;
  value?: number;
  size?: number;
  strokeWidth?: number;
  showLabel?: boolean;
  labelSize?: string;
  subLabel?: string;
}

export const CircularProgress: React.FC<CircularProgressProps> = ({
  score,
  value,
  size = 64,
  strokeWidth = 5,
  showLabel = true,
  labelSize = 'text-base',
  subLabel,
}) => {
  const rawScore = typeof score === 'number' ? score : (typeof value === 'number' ? value : 0);
  const numScore = !isNaN(rawScore) ? rawScore : 0;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clampedScore = Math.min(100, Math.max(0, Math.round(numScore)));
  const offset = circumference - (clampedScore / 100) * circumference;

  // Determine stroke and text color based on score bracket
  let strokeColor = 'stroke-emerald-400';
  let textColor = 'text-emerald-400';

  if (clampedScore >= 85) {
    strokeColor = 'stroke-emerald-500';
    textColor = 'text-emerald-400';
  } else if (clampedScore >= 75) {
    strokeColor = 'stroke-indigo-500';
    textColor = 'text-indigo-400';
  } else if (clampedScore >= 60) {
    strokeColor = 'stroke-amber-500';
    textColor = 'text-amber-400';
  } else {
    strokeColor = 'stroke-rose-500';
    textColor = 'text-rose-400';
  }

  return (
    <div className="relative inline-flex items-center justify-center shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          className="text-slate-800"
          strokeWidth={strokeWidth}
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          className={`${strokeColor} transition-all duration-500 ease-out`}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
      </svg>
      {showLabel && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className={`font-bold font-mono ${labelSize} ${textColor} leading-none`}>
            {clampedScore}%
          </span>
          {subLabel && (
            <span className="text-[10px] text-slate-400 font-medium mt-0.5 uppercase tracking-wider">
              {subLabel}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
