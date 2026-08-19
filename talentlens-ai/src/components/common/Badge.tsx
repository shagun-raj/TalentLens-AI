import React from 'react';
import { RecommendationStatus, RecruiterCandidateStatus } from '../../types';
import { CheckCircle2, Clock, AlertTriangle, XCircle, Sparkles } from 'lucide-react';

interface RecommendationBadgeProps {
  status: RecommendationStatus;
  size?: 'sm' | 'md' | 'lg';
}

export const RecommendationBadge: React.FC<RecommendationBadgeProps> = ({
  status,
  size = 'md'
}) => {
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs font-semibold px-2.5 py-1 gap-1.5',
    lg: 'text-sm font-semibold px-3 py-1.5 gap-2',
  }[size];

  const normalized = (status || '').toLowerCase().replace(/\s+/g, '_');

  switch (normalized) {
    case 'strong_match':
      return (
        <span className={`inline-flex items-center rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 ${sizeClasses} whitespace-nowrap`}>
          <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span>Strong Match</span>
        </span>
      );
    case 'good_match':
      return (
        <span className={`inline-flex items-center rounded-full bg-blue-950/80 border border-blue-500/30 text-blue-300 ${sizeClasses} whitespace-nowrap`}>
          <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
          <span>Good Match</span>
        </span>
      );
    case 'needs_review':
      return (
        <span className={`inline-flex items-center rounded-full bg-amber-950/80 border border-amber-500/30 text-amber-300 ${sizeClasses} whitespace-nowrap`}>
          <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span>Needs Review</span>
        </span>
      );
    case 'low_match':
      return (
        <span className={`inline-flex items-center rounded-full bg-rose-950/80 border border-rose-500/30 text-rose-300 ${sizeClasses} whitespace-nowrap`}>
          <XCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
          <span>Low Match</span>
        </span>
      );
    default:
      return (
        <span className={`inline-flex items-center rounded-full bg-slate-800 border border-slate-700 text-slate-300 ${sizeClasses} whitespace-nowrap`}>
          <span>{status}</span>
        </span>
      );
  }
};

interface RecruiterStatusBadgeProps {
  status: RecruiterCandidateStatus;
}

export const RecruiterStatusBadge: React.FC<RecruiterStatusBadgeProps> = ({ status }) => {
  const config = {
    applied: {
      label: 'Applied',
      color: 'bg-slate-800 border-slate-700 text-slate-300',
      icon: Clock
    },
    screened: {
      label: 'AI Screened',
      color: 'bg-indigo-950/80 border-indigo-500/30 text-indigo-300',
      icon: Sparkles
    },
    shortlisted: {
      label: 'Shortlisted',
      color: 'bg-emerald-950/90 border-emerald-500/40 text-emerald-300',
      icon: CheckCircle2
    },
    in_review: {
      label: 'In Review',
      color: 'bg-amber-950/80 border-amber-500/30 text-amber-300',
      icon: AlertTriangle
    },
    rejected: {
      label: 'Archived / Passed',
      color: 'bg-rose-950/70 border-rose-500/30 text-rose-300',
      icon: XCircle
    },
    interview_scheduled: {
      label: 'Interviewing',
      color: 'bg-cyan-950/80 border-cyan-500/40 text-cyan-300',
      icon: CheckCircle2
    }
  }[status] || {
    label: status,
    color: 'bg-slate-800 border-slate-700 text-slate-300',
    icon: Clock
  };

  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md border text-xs font-medium ${config.color} whitespace-nowrap`}>
      <Icon className="w-3 h-3 shrink-0" />
      <span>{config.label}</span>
    </span>
  );
};
