import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { FileCode, Star, Clock, FileText } from 'lucide-react';
import { cn } from '../utils/cn';
import { useStore } from '../store/useStore';

export const Evaluations = () => {
  const { t, i18n } = useTranslation();
  const { candidates } = useStore();
  const [activeTab, setActiveTab] = useState<'pending' | 'completed'>('pending');
  const [reviewingId, setReviewingId] = useState<string | null>(null);

  const dynamicEvaluations = useMemo(() => {
    return candidates
      .filter(c => c.status === 'screening' || c.status === 'interview' || c.status === 'offer' || c.status === 'hired')
      .map((c, index) => {
        const isPending = c.status === 'screening';
        
        const dateOffset = isPending ? -1 : -6;
        const date = new Date();
        date.setDate(date.getDate() + dateOffset);

        return {
          id: c.id,
          candidate: c.name,
          role: c.role,
          testName: index % 2 === 0 ? 'React & TypeScript Assessment' : 'Systems Design Challenge',
          status: isPending ? 'pending' : 'completed',
          score: isPending ? null : (80 + (c.id.length % 20)),
          date: date.toISOString(),
        };
      });
  }, [candidates]);

  const filteredEvaluations = dynamicEvaluations.filter(ev => 
    activeTab === 'pending' ? ev.status === 'pending' : ev.status === 'completed'
  );

  const handleReview = (id: string) => {
    setReviewingId(id);
    setTimeout(() => {
        setReviewingId(null);
    }, 2000);
  };

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto h-full flex flex-col">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">{t('evaluations.title', 'Evaluations')}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{t('evaluations.description', 'Review technical assignments and candidate assessments.')}</p>
      </div>

      <div className="bg-card border border-border shadow-sm rounded-xl flex-1 flex flex-col overflow-hidden">
        <div className="border-b border-border bg-muted/20 px-4 py-2 flex gap-4">
          <button
            onClick={() => setActiveTab('pending')}
            className={cn(
              "px-4 py-2 text-sm font-medium rounded-md transition-colors",
              activeTab === 'pending' 
                ? "bg-primary-50 text-primary-700 dark:bg-primary-900/30" 
                : "text-muted-foreground hover:bg-muted"
            )}
          >
            {t('evaluations.pending', 'Pending')}
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={cn(
              "px-4 py-2 text-sm font-medium rounded-md transition-colors",
              activeTab === 'completed' 
                ? "bg-primary-50 text-primary-700 dark:bg-primary-900/30" 
                : "text-muted-foreground hover:bg-muted"
            )}
          >
            {t('evaluations.completed', 'Completed')}
          </button>
        </div>

        <div className="flex-1 overflow-auto p-4 sm:p-6 space-y-4">
          {filteredEvaluations.length > 0 ? (
            filteredEvaluations.map((evaluation) => (
              <div key={evaluation.id} className="border border-border rounded-xl p-5 hover:border-primary-300 transition-colors bg-background flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                
                <div className="w-12 h-12 rounded-lg bg-primary-50 flex items-center justify-center shrink-0 text-primary-600">
                  <FileCode className="w-6 h-6" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-semibold text-foreground truncate">{evaluation.testName}</h3>
                    {evaluation.status === 'completed' && evaluation.score && (
                      <span className={cn(
                        "px-2 py-0.5 rounded text-xs font-bold",
                         evaluation.score >= 90 ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                      )}>
                        {evaluation.score}%
                      </span>
                    )}
                  </div>
                  <p className="text-sm font-medium text-muted-foreground mb-3">{evaluation.candidate} • {evaluation.role}</p>
                  
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      {new Date(evaluation.date).toLocaleDateString(i18n.language === 'ar' ? 'ar-EG' : 'en-US')}
                    </div>
                  </div>
                </div>

                <div className="shrink-0 w-full sm:w-auto">
                  <button 
                    onClick={() => handleReview(evaluation.id)}
                    disabled={reviewingId === evaluation.id}
                    className="w-full sm:w-auto px-4 py-2 bg-background border border-border text-foreground hover:bg-muted rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <FileText className="w-4 h-4" />
                    {reviewingId === evaluation.id ? t('evaluations.reviewing', 'Reviewing...') : t('evaluations.review', 'Review')}
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-muted-foreground py-12 text-center px-4">
              <Star className="w-12 h-12 mb-4 opacity-20" />
              <p>{t('evaluations.noEvaluations', `No ${activeTab} evaluations found.`, { tab: activeTab === 'pending' ? t('evaluations.pending') : t('evaluations.completed') })}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
