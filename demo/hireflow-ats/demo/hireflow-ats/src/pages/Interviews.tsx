import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Calendar as CalendarIcon, Clock, Video, MoreHorizontal, Plus } from 'lucide-react';
import { useStore } from '../store/useStore';

export const Interviews = () => {
  const { t, i18n } = useTranslation();
  const { candidates } = useStore();
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const [joiningId, setJoiningId] = useState<string | null>(null);
  const [reschedulingId, setReschedulingId] = useState<string | null>(null);

  const dynamicInterviews = useMemo(() => {
    return candidates
      .filter(c => c.status === 'interview' || c.status === 'offer' || c.status === 'hired' || c.status === 'rejected')
      .map(c => {
        const isUpcoming = c.status === 'interview';
        // Add pseudo-random deterministic date
        const dateOffset = isUpcoming ? 2 : -5;
        const date = new Date();
        date.setDate(date.getDate() + dateOffset);

        return {
          id: c.id,
          candidate: c.name,
          role: c.role,
          date: date.toISOString(),
          time: '10:00 AM - 11:00 AM',
          type: 'Video Call',
          status: isUpcoming ? 'upcoming' : 'completed'
        };
      });
  }, [candidates]);

  const filteredInterviews = dynamicInterviews.filter(inv => 
    activeTab === 'upcoming' ? inv.status === 'upcoming' : inv.status === 'completed'
  );

  const handleJoin = (id: string) => {
    setJoiningId(id);
    setTimeout(() => {
      setJoiningId(null);
    }, 2000);
  };

  const handleReschedule = (id: string) => {
    setReschedulingId(id);
    setTimeout(() => {
      setReschedulingId(null);
    }, 2000);
  };

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto h-full flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t('interviews.title', 'Interviews')}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{t('interviews.description', 'Manage and schedule candidate interviews.')}</p>
        </div>
        <button className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 flex items-center gap-2 rounded-lg font-medium text-sm transition-colors shadow-sm shrink-0">
          <Plus className="w-4 h-4" />
          {t('interviews.schedule', 'Schedule Interview')}
        </button>
      </div>

      <div className="bg-card border border-border shadow-sm rounded-xl overflow-hidden flex-1 flex flex-col">
        <div className="border-b border-border bg-muted/20 px-4 py-2 flex gap-4">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'upcoming' 
                ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/30' 
                : 'text-muted-foreground hover:bg-muted'
            }`}
          >
            {t('interviews.upcoming', 'Upcoming')}
          </button>
          <button
            onClick={() => setActiveTab('past')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'past' 
                ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/30' 
                : 'text-muted-foreground hover:bg-muted'
            }`}
          >
            {t('interviews.past', 'Past')}
          </button>
        </div>

        <div className="flex-1 overflow-auto p-4 sm:p-6 space-y-4">
          {filteredInterviews.length > 0 ? (
            filteredInterviews.map((interview) => (
              <div key={interview.id} className="border border-border rounded-xl p-5 hover:border-primary-300 transition-colors bg-background flex flex-col sm:flex-row gap-6">
                <div className="flex flex-col sm:items-center justify-center sm:w-32 sm:border-r border-border pr-6 shrink-0">
                  <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">
                    {new Date(interview.date).toLocaleDateString(i18n.language === 'ar' ? 'ar-EG' : 'en-US', { month: 'short' })}
                  </p>
                  <p className="text-3xl font-bold text-foreground">
                    {new Date(interview.date).toLocaleDateString(i18n.language === 'ar' ? 'ar-EG' : 'en-US', { day: '2-digit' })}
                  </p>
                </div>
                
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-semibold text-foreground">{interview.candidate}</h3>
                    <button className="text-muted-foreground hover:text-foreground">
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
                  </div>
                  <p className="text-sm font-medium text-primary-600 mb-4">{interview.role}</p>
                  
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4 shrink-0" />
                      {interview.time}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Video className="w-4 h-4 shrink-0" />
                      {interview.type}
                    </div>
                  </div>
                </div>

                {activeTab === 'upcoming' && (
                  <div className="flex flex-row sm:flex-col gap-2 shrink-0 justify-center">
                    <button 
                      onClick={() => handleJoin(interview.id)}
                      disabled={joiningId === interview.id}
                      className="flex-1 sm:flex-none px-4 py-2 bg-primary-50 text-primary-700 hover:bg-primary-100 rounded-lg text-sm font-medium transition-colors border border-primary-200 disabled:opacity-50"
                    >
                      {joiningId === interview.id ? t('interviews.joining', 'Joining...') : t('interviews.join', 'Join')}
                    </button>
                    <button 
                      onClick={() => handleReschedule(interview.id)}
                      disabled={reschedulingId === interview.id}
                      className="flex-1 sm:flex-none px-4 py-2 bg-background border border-border text-foreground hover:bg-muted rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                    >
                      {reschedulingId === interview.id ? t('interviews.rescheduling', 'Rescheduling...') : t('interviews.reschedule', 'Reschedule')}
                    </button>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-muted-foreground py-12 text-center px-4">
              <CalendarIcon className="w-12 h-12 mb-4 opacity-20" />
              <p>{t('interviews.noInterviews', `No ${activeTab} interviews found.`, { tab: activeTab === 'upcoming' ? t('interviews.upcoming') : t('interviews.past') })}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
