import React, { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { Search, Filter, Trash2, Plus, Mail } from 'lucide-react';
import { cn } from '../utils/cn';
import { AddCandidateModal } from '../components/modals/AddCandidateModal';
import { useTranslation } from 'react-i18next';

export const Candidates = () => {
  const { candidates, deleteCandidate } = useStore();
  const { t, i18n } = useTranslation();
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const itemsPerPage = 8;

  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter]);

  const filteredCandidates = candidates.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
                          c.role.toLowerCase().includes(search.toLowerCase()) ||
                          c.email.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredCandidates.length / itemsPerPage);
  const Math_max = Math.max;
  const Math_min = Math.min;
  const paginatedCandidates = filteredCandidates.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePreviousPage = () => {
    setCurrentPage(prev => Math_max(1, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math_min(totalPages, prev + 1));
  };

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto flex flex-col h-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t('candidates.title', 'Candidates')}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{t('candidates.description', 'Manage all candidate applications across all jobs.')}</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 flex items-center gap-2 rounded-lg font-medium text-sm transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          {t('candidates.addCandidate', 'Add Candidate')}
        </button>
      </div>

      <div className="bg-card border border-border shadow-sm rounded-xl flex-1 flex flex-col min-h-0">
        <div className="p-4 border-b border-border flex flex-col sm:flex-row gap-4 justify-between items-center bg-muted/20 relative">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              type="text"
              placeholder={t('candidates.search', 'Search candidates by name, role or email...')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-shadow"
            />
          </div>
          <div className="relative w-full sm:w-auto">
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-3 py-2 border border-border rounded-lg text-sm font-medium hover:bg-muted text-foreground transition-colors shrink-0 w-full justify-center"
            >
              <Filter className="w-4 h-4" />
              {t('candidates.filters', 'More Filters')}
            </button>
            {showFilters && (
              <div className="absolute top-full right-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-lg z-20 p-2">
                <div className="text-xs font-semibold text-muted-foreground mb-2 px-2 uppercase tracking-wider">{t('candidates.status', 'Status')}</div>
                <select 
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full bg-background border border-border rounded-md px-2 py-1.5 text-sm text-foreground focus:outline-none focus:border-primary-500"
                >
                  <option value="all">{t('jobs.all', 'All')}</option>
                  <option value="applied">{t('pipeline.stages.applied', 'Applied')}</option>
                  <option value="screening">{t('pipeline.stages.screening', 'Screening')}</option>
                  <option value="interview">{t('pipeline.stages.interview', 'Interview')}</option>
                  <option value="offer">{t('pipeline.stages.offer', 'Offer')}</option>
                  <option value="hired">{t('pipeline.stages.hired', 'Hired')}</option>
                  <option value="rejected">{t('pipeline.stages.rejected', 'Rejected')}</option>
                </select>
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-muted/40 text-muted-foreground sticky top-0 z-10 box-border border-b border-border">
              <tr>
                <th className="font-semibold py-3 px-6">{t('candidates.name', 'Name')}</th>
                <th className="font-semibold py-3 px-6">{t('candidates.role', 'Role')}</th>
                <th className="font-semibold py-3 px-6">{t('candidates.status', 'Status')}</th>
                <th className="font-semibold py-3 px-6">{t('candidates.dateApplied', 'Date Applied')}</th>
                <th className="font-semibold py-3 px-6 text-right">{t('candidates.actions', 'Actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {paginatedCandidates.map(candidate => (
                <tr key={candidate.id} className="hover:bg-muted/30 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold">
                        {candidate.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{candidate.name}</p>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                          <Mail className="w-3 h-3" />
                          {candidate.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-foreground">{candidate.role}</td>
                  <td className="py-4 px-6">
                    <span className={cn(
                      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize",
                      candidate.status === 'hired' ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" :
                      candidate.status === 'rejected' ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400" :
                      candidate.status === 'offer' ? "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400" :
                      candidate.status === 'interview' ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400" :
                      "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300"
                    )}>
                      {t(`pipeline.stages.${candidate.status}`, candidate.status)}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-muted-foreground">
                    {new Date(candidate.dateApplied).toLocaleDateString(i18n.language === 'ar' ? 'ar-EG' : 'en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button 
                      onClick={() => deleteCandidate(candidate.id)} 
                      className="text-muted-foreground hover:text-red-500 p-1 rounded-md hover:bg-red-50 dark:hover:bg-red-950 transition-colors"
                      title="Delete Candidate"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredCandidates.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-muted-foreground">
                    {t('candidates.noCandidates', 'No candidates found.')}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        <div className="p-4 border-t border-border flex items-center justify-between text-sm text-muted-foreground bg-muted/10">
          <p>{t('candidates.showing', 'Showing')} <span className="font-medium text-foreground">{paginatedCandidates.length}</span> {t('candidates.results', 'results')}</p>
          <div className="flex items-center gap-2">
            <button onClick={handlePreviousPage} disabled={currentPage === 1} className="px-3 py-1 border border-border rounded-md hover:bg-muted disabled:opacity-50">{t('candidates.previous', 'Previous')}</button>
            <button onClick={handleNextPage} disabled={currentPage === totalPages || totalPages === 0} className="px-3 py-1 border border-border rounded-md hover:bg-muted disabled:opacity-50">{t('candidates.next', 'Next')}</button>
          </div>
        </div>
      </div>
      <AddCandidateModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};
