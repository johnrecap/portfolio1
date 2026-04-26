import { useState } from "react";
import { Calendar, Wallet, Users, CheckCircle2, TrendingUp, AlertTriangle } from "lucide-react";
import { Button } from "../../components/ui/Button";
import { Card, CardContent } from "../../components/ui/Card";
import { useCRMStore } from "../../store/crmStore";
import { formatCurrency } from "../../utils/formatters";
import { formatDistanceToNow, isBefore } from "date-fns";
import { DealFormModal } from "../deals/DealFormModal";
import { useTranslation } from "react-i18next";

export default function DashboardPage() {
  const { leads, deals, tasks, activities } = useCRMStore();
  const [isDealModalOpen, setIsDealModalOpen] = useState(false);
  const { t } = useTranslation();

  const pipelineValue = deals
    .filter((d) => d.stage !== "won" && d.stage !== "lost")
    .reduce((sum, d) => sum + d.value, 0);

  const newLeadsCount = leads.length; // Simplified for MVP
  const activeDealsCount = deals.filter((d) => d.stage !== "won" && d.stage !== "lost").length;
  
  const wonDeals = deals.filter((d) => d.stage === "won").length;
  const totalDeals = deals.length;
  const winRate = totalDeals > 0 ? Math.round((wonDeals / totalDeals) * 100) : 0;

  const overdueTasksCount = tasks.filter((t) => t.status !== "completed" && isBefore(new Date(t.dueDate), new Date())).length;
  
  return (
    <div className="p-container-padding max-w-[1440px] mx-auto w-full space-y-stack-lg">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end pb-stack-sm gap-4">
        <div>
          <p className="font-body-main text-on-surface-variant mt-1">{t('dashboard.welcome')}</p>
        </div>
        <Button onClick={() => setIsDealModalOpen(true)} className="w-full sm:w-auto">
          {t('dashboard.newDeal')}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-gutter">
        <Card className="flex flex-col justify-between h-32">
          <CardContent className="p-4">
            <div className="flex justify-between items-start mb-2">
              <span className="font-label-bold text-on-surface-variant uppercase tracking-wider">{t('dashboard.pipelineValue')}</span>
              <div className="w-8 h-8 rounded-full bg-surface-container-low flex items-center justify-center text-secondary">
                <Wallet className="w-[18px] h-[18px]" />
              </div>
            </div>
            <div className="font-kpi-number text-primary">{formatCurrency(pipelineValue)}</div>
          </CardContent>
        </Card>
        
        <Card className="flex flex-col justify-between h-32">
          <CardContent className="p-4">
            <div className="flex justify-between items-start mb-2">
              <span className="font-label-bold text-on-surface-variant uppercase tracking-wider">{t('dashboard.newLeads')}</span>
              <div className="w-8 h-8 rounded-full bg-surface-container-low flex items-center justify-center text-secondary">
                <Users className="w-[18px] h-[18px]" />
              </div>
            </div>
            <div className="font-kpi-number text-primary">{newLeadsCount}</div>
          </CardContent>
        </Card>
        
        <Card className="flex flex-col justify-between h-32">
          <CardContent className="p-4">
            <div className="flex justify-between items-start mb-2">
              <span className="font-label-bold text-on-surface-variant uppercase tracking-wider">{t('dashboard.activeDeals')}</span>
              <div className="w-8 h-8 rounded-full bg-surface-container-low flex items-center justify-center text-secondary">
                <TrendingUp className="w-[18px] h-[18px]" />
              </div>
            </div>
            <div className="font-kpi-number text-primary">{activeDealsCount}</div>
          </CardContent>
        </Card>
        
        <Card className="flex flex-col justify-between h-32">
          <CardContent className="p-4">
            <div className="flex justify-between items-start mb-2">
              <span className="font-label-bold text-on-surface-variant uppercase tracking-wider">{t('dashboard.winRate')}</span>
              <div className="w-8 h-8 rounded-full bg-surface-container-low flex items-center justify-center text-secondary">
                <CheckCircle2 className="w-[18px] h-[18px]" />
              </div>
            </div>
            <div className="font-kpi-number text-primary">{winRate}<span className="text-xl text-on-surface-variant">%</span></div>
          </CardContent>
        </Card>
        
        <Card className="flex flex-col justify-between h-32 border-error/30 bg-error/5">
          <CardContent className="p-4">
            <div className="flex justify-between items-start mb-2">
              <span className="font-label-bold text-error uppercase tracking-wider">{t('dashboard.overdueTasks')}</span>
              <div className="w-8 h-8 rounded-full bg-error/10 flex items-center justify-center text-error">
                <AlertTriangle className="w-[18px] h-[18px]" />
              </div>
            </div>
            <div className="font-kpi-number text-error">{overdueTasksCount}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-gutter">
        <Card className="flex flex-col">
          <div className="p-4 border-b border-[#E2E8F0]">
            <h2 className="font-section-title text-primary">{t('dashboard.recentActivity')}</h2>
          </div>
          <div className="flex-1 divide-y divide-[#E2E8F0] custom-scrollbar overflow-y-auto max-h-[400px]">
            {activities.slice(0, 5).map((activity) => (
              <div key={activity.id} className="p-4 hover:bg-surface-bright transition-colors flex gap-4">
                 <div className="flex-1">
                   <p className="font-body-main text-on-surface">
                     <span className="font-medium text-primary">{activity.title}</span> - {activity.description}
                   </p>
                   <p className="font-body-sm text-on-surface-variant mt-1">
                     {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
                   </p>
                 </div>
              </div>
            ))}
            {activities.length === 0 && (
              <div className="p-8 text-center text-on-surface-variant font-body-main">
                {t('dashboard.noRecentActivity')}
              </div>
            )}
          </div>
        </Card>
        
        <Card className="flex flex-col">
          <div className="p-4 border-b border-[#E2E8F0] flex justify-between items-center">
            <h2 className="font-section-title text-primary">{t('dashboard.upcomingTasks')}</h2>
            <Button variant="ghost" size="sm" className="text-primary hover:text-primary">{t('dashboard.viewAll')}</Button>
          </div>
          <div className="p-4 flex flex-col gap-3 custom-scrollbar overflow-y-auto max-h-[400px]">
             {tasks.filter(t => t.status !== "completed").slice(0, 4).map((task) => (
               <div key={task.id} className="flex items-start gap-3 p-3 rounded-lg border border-[#E2E8F0] hover:border-outline bg-white hover:bg-surface-bright transition-colors group cursor-pointer">
                 <div className="mt-0.5 w-5 h-5 rounded border-2 border-outline-variant flex items-center justify-center group-hover:border-primary transition-colors shrink-0"></div>
                 <div className="flex-1">
                   <h4 className="font-body-main font-medium text-primary">{task.title}</h4>
                   <div className="flex items-center gap-4 mt-1">
                     <span className="flex items-center gap-1 font-body-sm text-on-surface-variant">
                       <Calendar className="w-3.5 h-3.5" />
                       {formatDistanceToNow(new Date(task.dueDate), { addSuffix: true })}
                     </span>
                   </div>
                 </div>
               </div>
             ))}
             {tasks.filter(t => t.status !== "completed").length === 0 && (
               <div className="p-8 text-center text-on-surface-variant font-body-main border border-dashed border-outline-variant rounded-lg">
                 {t('dashboard.allCaughtUp')}
               </div>
             )}
          </div>
        </Card>
      </div>

      <DealFormModal isOpen={isDealModalOpen} onClose={() => setIsDealModalOpen(false)} />
    </div>
  );
}
