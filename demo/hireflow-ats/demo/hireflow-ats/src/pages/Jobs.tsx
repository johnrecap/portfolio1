import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { Plus, Users, MapPin, Clock, Search, Trash2 } from 'lucide-react';
import { cn } from '../utils/cn';
import { AddJobModal } from '../components/modals/AddJobModal';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export const Jobs = () => {
  const { jobs, deleteJob, candidates } = useStore();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'draft'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(search.toLowerCase()) || 
                          job.department.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || job.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t('jobs.title', 'Jobs')}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{t('jobs.description', 'Manage active job postings and requisitions.')}</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 flex items-center gap-2 rounded-lg font-medium text-sm transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          {t('jobs.addJob', 'Post New Job')}
        </button>
      </div>

      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input 
            type="text"
            placeholder={t('jobs.search', 'Search jobs...')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-card border border-border rounded-lg text-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 shadow-sm text-foreground"
          />
        </div>
        <div className="flex gap-2 text-sm">
          <button 
            onClick={() => setStatusFilter('all')}
            className={cn(
              "px-4 py-2 rounded-lg font-medium shadow-sm transition-colors border",
              statusFilter === 'all' 
                ? "bg-primary-50 border-primary-200 text-primary-700 dark:bg-primary-900/30 dark:border-primary-800 dark:text-primary-400"
                : "bg-card border-border text-foreground hover:bg-muted"
            )}
          >{t('jobs.all', 'All')}</button>
          <button 
            onClick={() => setStatusFilter('active')}
            className={cn(
              "px-4 py-2 rounded-lg font-medium shadow-sm transition-colors border",
              statusFilter === 'active' 
                ? "bg-primary-50 border-primary-200 text-primary-700 dark:bg-primary-900/30 dark:border-primary-800 dark:text-primary-400"
                : "bg-card border-border text-foreground hover:bg-muted"
            )}
          >{t('jobs.active', 'Active')}</button>
          <button 
            onClick={() => setStatusFilter('draft')}
            className={cn(
              "px-4 py-2 rounded-lg font-medium shadow-sm transition-colors border",
              statusFilter === 'draft' 
                ? "bg-primary-50 border-primary-200 text-primary-700 dark:bg-primary-900/30 dark:border-primary-800 dark:text-primary-400"
                : "bg-card border-border text-foreground hover:bg-muted"
            )}
          >{t('jobs.drafts', 'Drafts')}</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredJobs.map(job => (
          <div key={job.id} className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow group flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <div className={cn(
                "px-2.5 py-1 rounded-full text-xs font-medium uppercase tracking-wider",
                job.status === 'active' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                job.status === 'draft' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400'
              )}>
                {job.status === 'active' ? t('jobs.active', 'Active') : t('jobs.drafts', 'Draft')}
              </div>
              <button 
                onClick={() => deleteJob(job.id)}
                className="text-muted-foreground hover:text-red-500 p-1 opacity-0 group-hover:opacity-100 transition-all rounded hover:bg-red-50 dark:hover:bg-red-950"
                title="Delete Job"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
            
            <h3 className="text-lg font-semibold text-foreground mb-1">{job.title}</h3>
            <p className="text-sm text-muted-foreground mb-4">{job.department}</p>
            
            <div className="space-y-2 mb-6 flex-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4 shrink-0" />
                {job.location}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="w-4 h-4 shrink-0" />
                {job.type}
              </div>
            </div>
            
            <div className="pt-4 border-t border-border flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                <Users className="w-4 h-4 text-primary-500" />
                {candidates.filter(c => c.role.toLowerCase() === job.title.toLowerCase()).length} {t('jobs.candidates', 'Candidates')}
              </div>
              <button onClick={() => navigate(`/pipeline?role=${encodeURIComponent(job.title)}`)} className="text-sm font-medium text-primary-600 hover:text-primary-700">{t('jobs.viewPipeline', 'View Pipeline')}</button>
            </div>
          </div>
        ))}
        {filteredJobs.length === 0 && (
          <div className="col-span-full py-12 text-center text-muted-foreground bg-card border border-border rounded-xl border-dashed">
            {t('jobs.noJobs', 'No jobs found matching your criteria.')}
          </div>
        )}
      </div>
      <AddJobModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};
