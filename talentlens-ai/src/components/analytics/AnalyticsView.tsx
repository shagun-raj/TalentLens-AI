import React from 'react';
import { useApp } from '../../context/AppContext';
import { MatchScoreDistribution } from '../dashboard/MatchScoreDistribution';
import { SkillsDistributionChart } from '../dashboard/SkillsDistributionChart';
import { MetricCard } from '../dashboard/MetricCard';
import { BarChart3, TrendingUp, Target, Users, Zap, ShieldCheck } from 'lucide-react';

export const AnalyticsView: React.FC = () => {
  const { candidates, jobs } = useApp();

  const totalCandidates = candidates.length;
  const shortlisted = candidates.filter(c => c.recruiterStatus === 'shortlisted').length;
  const shortlistRate = Math.round((shortlisted / (totalCandidates || 1)) * 100);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="pb-4 border-b border-slate-800">
        <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-indigo-400" />
          <span>Screening Analytics & Talent Intelligence</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Aggregate performance metrics, candidate match distribution, and skill availability trends.
        </p>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Resumes Evaluated"
          value={totalCandidates}
          subtext="Processed by GenAI engine"
          icon={Users}
          accentColor="indigo"
        />
        <MetricCard
          title="Shortlist Progression Rate"
          value={`${shortlistRate}%`}
          subtext="Recruiter interview threshold"
          icon={TrendingUp}
          trend={{ value: '3.5%', isPositive: true }}
          accentColor="emerald"
        />
        <MetricCard
          title="Average Candidate Fit"
          value="82.4%"
          subtext="Composite relevance metric"
          icon={Target}
          accentColor="cyan"
        />
        <MetricCard
          title="Screening Efficiency Gain"
          value="7.8x"
          subtext="Time saved vs manual review"
          icon={Zap}
          accentColor="amber"
        />
      </div>

      {/* Distribution Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MatchScoreDistribution />
        <SkillsDistributionChart />
      </div>

      {/* Responsible AI Metrics */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-3">
        <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4" />
          <span>Fairness & Bias Shield Audits</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          Screening models adhere strictly to job-relevant extraction standards. PII, gender, age indicators, and demographic characteristics are stripped before scoring. Recruiter manual review decisions are logged for quality oversight.
        </p>
      </div>
    </div>
  );
};
