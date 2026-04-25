import { Download, TrendingUp } from "lucide-react";
import { Button } from "../../components/ui/Button";
import { Card, CardContent, CardTitle, CardHeader } from "../../components/ui/Card";
import { useCRMStore } from "../../store/crmStore";
import { formatCurrency } from "../../utils/formatters";
import { useTranslation } from "react-i18next";

export default function ReportsPage() {
  const { deals, users, tasks } = useCRMStore();
  const { t } = useTranslation();

  const totalRevenue = deals.filter(d => d.stage === "won").reduce((sum, d) => sum + d.value, 0);
  const potentialRevenue = deals.filter(d => d.stage !== "won" && d.stage !== "lost").reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="p-container-padding max-w-[1440px] mx-auto space-y-stack-lg">
      <div className="flex justify-between items-end">
        <div>
          <p className="font-body-main text-on-surface-variant mt-1">{t('reports.overview')}</p>
        </div>
        <Button variant="secondary" className="gap-2">
          <Download className="w-4 h-4" /> {t('reports.exportCSV')}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <span className="font-label-bold text-on-surface-variant uppercase tracking-wider block mb-2">{t('reports.totalClosedRevenue')}</span>
                <div className="font-kpi-number text-primary">{formatCurrency(totalRevenue)}</div>
              </div>
              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <span className="font-label-bold text-on-surface-variant uppercase tracking-wider block mb-2">{t('reports.openPipelinePotential')}</span>
                <div className="font-kpi-number text-primary">{formatCurrency(potentialRevenue)}</div>
              </div>
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-gutter">
        <Card>
          <CardHeader>
            <CardTitle>{t('reports.teamWorkload')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {users.map(user => {
                const userTasks = tasks.filter(t => t.assignedToId === user.id && t.status !== "completed").length;
                const maxTasks = Math.max(...users.map(u => tasks.filter(t => t.assignedToId === u.id && t.status !== "completed").length), 1);
                const percent = (userTasks / maxTasks) * 100;
                
                return (
                  <div key={user.id} className="flex items-center gap-4">
                    <div className="w-24 font-body-sm truncate">{user.name}</div>
                    <div className="flex-1 h-2 bg-surface-container-high rounded-full overflow-hidden">
                      <div className="h-full bg-primary transition-all" style={{ width: `${percent}%` }} />
                    </div>
                    <div className="w-8 text-right font-body-sm font-semibold">{userTasks}</div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
