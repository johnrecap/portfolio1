import React, { useMemo } from 'react';
import { Users, Briefcase, FileText, CheckCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { useTranslation } from 'react-i18next';

export const Dashboard = () => {
  const { candidates, jobs } = useStore();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const metrics = [
    { name: t('dashboard.totalCandidates', 'Total Candidates'), value: candidates.length, icon: Users },
    { name: t('dashboard.activeJobs', 'Active Jobs'), value: jobs.filter(j => j.status === 'active').length, icon: Briefcase },
    { name: t('dashboard.interviewsScheduled', 'Interviews Scheduled'), value: candidates.filter(c => c.status === 'interview').length, icon: FileText },
    { name: t('dashboard.hiredCandidates', 'Hired Candidates'), value: candidates.filter(c => c.status === 'hired').length, icon: CheckCircle },
  ];

  const chartData = useMemo(() => {
    const counts: Record<string, number> = {};
    candidates.forEach(c => {
      const d = new Date(c.dateApplied);
      // We'll use the month name based on the current locale
      const monthStr = d.toLocaleString(i18n.language === 'ar' ? 'ar-EG' : 'en-US', { month: 'short' });
      counts[monthStr] = (counts[monthStr] || 0) + 1;
    });

    return Object.entries(counts).map(([name, count]) => ({
      name,
      candidates: count
    }));
  }, [candidates, i18n.language]);

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">{t('dashboard.title', 'Dashboard')}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{t('dashboard.overview', 'Overview of your recruitment pipeline and activities.')}</p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => (
          <div key={metric.name} className="bg-card p-6 rounded-xl border border-border shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-muted-foreground">{metric.name}</p>
              <div className="p-2 bg-primary-50 rounded-lg">
                <metric.icon className="w-5 h-5 text-primary-600" />
              </div>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <p className="text-3xl font-semibold text-foreground">{metric.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-card p-6 rounded-xl border border-border shadow-sm">
          <h2 className="text-lg font-semibold text-foreground mb-6">{t('dashboard.candidateApplications', 'Candidate Applications')}</h2>
          <div className="h-80 w-full text-foreground text-sm" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData.length > 0 ? chartData : [{name: t('jobs.all', 'All'), candidates: 0}]}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--muted-foreground)' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--muted-foreground)' }} allowDecimals={false} />
                <Tooltip 
                  cursor={{ fill: 'var(--muted)' }}
                  contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: '0.5rem', color: 'var(--foreground)' }}
                  labelStyle={{ color: 'var(--foreground)' }}
                  itemStyle={{ color: 'var(--foreground)' }}
                />
                <Bar dataKey="candidates" fill="var(--color-primary-500)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-card p-6 rounded-xl border border-border shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-foreground">{t('dashboard.recentCandidates', 'Recent Candidates')}</h2>
            <button onClick={() => navigate('/candidates')} className="text-sm font-medium text-primary-600 hover:text-primary-700">{t('dashboard.viewAll', 'View All')}</button>
          </div>
          <div className="space-y-6 flex-1">
            {[...candidates].sort((a,b) => new Date(b.dateApplied).getTime() - new Date(a.dateApplied).getTime()).slice(0, 5).map((candidate) => (
              <div key={candidate.id} className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-sm shrink-0">
                  {candidate.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{candidate.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{candidate.role}</p>
                </div>
                <div className="text-xs font-medium px-2.5 py-1 rounded-full bg-muted text-muted-foreground capitalize whitespace-nowrap">
                  {t(`pipeline.stages.${candidate.status}`, candidate.status)}
                </div>
              </div>
            ))}
            {candidates.length === 0 && (
               <div className="text-center text-muted-foreground py-8 text-sm">
                 {t('candidates.noCandidates', 'No candidates found.')}
               </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
