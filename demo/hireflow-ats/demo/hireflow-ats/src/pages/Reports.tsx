import React from 'react';
import { useTranslation } from 'react-i18next';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';

const timeToHireData = [
  { month: 'Jan', days: 24 },
  { month: 'Feb', days: 22 },
  { month: 'Mar', days: 28 },
  { month: 'Apr', days: 19 },
  { month: 'May', days: 21 },
  { month: 'Jun', days: 18 },
];

const sourceData = [
  { source: 'LinkedIn', hires: 45, applicants: 120 },
  { source: 'Referral', hires: 30, applicants: 50 },
  { source: 'Career Site', hires: 15, applicants: 200 },
  { source: 'Indeed', hires: 10, applicants: 150 },
];

export const Reports = () => {
  const { t } = useTranslation();

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">{t('reports.title', 'Reports')}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{t('reports.description', 'Analytics and recruitment performance reports.')}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card border border-border shadow-sm rounded-xl p-6">
          <h2 className="text-lg font-semibold text-foreground mb-6">{t('reports.timeToHire', 'Time to Hire')}</h2>
          <div className="h-72 w-full text-foreground text-sm" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timeToHireData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorDays" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-primary-500)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--color-primary-500)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: 'var(--muted-foreground)' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--muted-foreground)' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: '0.5rem', color: 'var(--foreground)' }}
                />
                <Area type="monotone" dataKey="days" stroke="var(--color-primary-500)" strokeWidth={3} fillOpacity={1} fill="url(#colorDays)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-card border border-border shadow-sm rounded-xl p-6">
          <h2 className="text-lg font-semibold text-foreground mb-6">{t('reports.sourceEffectiveness', 'Source Effectiveness')}</h2>
          <div className="h-72 w-full text-foreground text-sm" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sourceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--border)" />
                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: 'var(--muted-foreground)' }} />
                <YAxis dataKey="source" type="category" axisLine={false} tickLine={false} tick={{ fill: 'var(--muted-foreground)' }} width={80} />
                <Tooltip 
                  cursor={{ fill: 'var(--muted)' }}
                  contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: '0.5rem', color: 'var(--foreground)' }}
                />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                <Bar dataKey="applicants" name="Total Applicants" fill="var(--muted-foreground)" radius={[0, 4, 4, 0]} barSize={12} />
                <Bar dataKey="hires" name="Hires" fill="var(--color-primary-500)" radius={[0, 4, 4, 0]} barSize={12} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
