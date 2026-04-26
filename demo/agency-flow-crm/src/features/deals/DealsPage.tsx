import { useState } from "react";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Drawer } from "../../components/ui/Drawer";
import { useCRMStore } from "../../store/crmStore";
import { formatCurrency } from "../../utils/formatters";
import { formatDistanceToNow } from "date-fns";
import { DealFormModal } from "./DealFormModal";
import { Deal } from "../../types/crm";
import { Clock, Plus, Target, User } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function DealsPage() {
  const { deals } = useCRMStore();
  const [isDealModalOpen, setIsDealModalOpen] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const { t } = useTranslation();

  const stages = ["new", "qualified", "proposal", "negotiation", "won", "lost"] as const;

  const getDealsByStage = (stage: string) => deals.filter((d) => d.stage === stage);

  return (
    <div className="flex flex-col h-full bg-background relative">
      <div className="absolute top-4 right-4 z-10 hidden sm:block">
        <Button className="gap-2 shadow-lg" onClick={() => setIsDealModalOpen(true)}>
          <Plus className="w-4 h-4" /> {t('deals.newDeal')}
        </Button>
      </div>
      
      {/* Mobile only add button */}
      <div className="sm:hidden p-4 border-b border-[#E2E8F0] shrink-0">
        <Button className="gap-2 w-full" onClick={() => setIsDealModalOpen(true)}>
          <Plus className="w-4 h-4" /> {t('deals.newDeal')}
        </Button>
      </div>

      <div className="flex-1 overflow-x-auto p-container-padding flex gap-gutter items-start h-full pb-8">
        {stages.map((stage) => {
          const stageDeals = getDealsByStage(stage);
          const stageTotal = stageDeals.reduce((sum, d) => sum + d.value, 0);

          return (
            <div key={stage} className="flex-shrink-0 w-[280px] md:w-80 flex flex-col gap-3 bg-surface-container-low/50 rounded-xl p-3 border border-[#E2E8F0] h-[calc(100vh-250px)] md:h-[calc(100vh-140px)]">
              <div className="flex justify-between items-center px-1 shrink-0">
                <h3 className="font-section-title text-primary capitalize">{stage}</h3>
                <span className="bg-surface-variant text-on-surface-variant font-label-bold px-2 py-0.5 rounded-full text-xs">
                  {stageDeals.length}
                </span>
              </div>
              <div className="px-1 mb-2 font-body-sm text-on-surface-variant shrink-0">
                {formatCurrency(stageTotal)}
              </div>
              
              <div className="flex flex-col gap-3 overflow-y-auto pr-1 pb-1 flex-1 custom-scrollbar">
                {stageDeals.map((deal) => (
                   <div 
                     key={deal.id} 
                     onClick={() => setSelectedDeal(deal)}
                     className="bg-white rounded-lg border border-[#E2E8F0] p-4 shadow-natural hover:shadow-lifted transition-all cursor-pointer group shrink-0"
                   >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-label-bold text-primary truncate pr-2">{deal.title}</h4>
                      </div>
                      <div className="font-body-sm text-on-surface-variant mb-3">{deal.companyName}</div>
                      <div className="flex justify-between items-end">
                        <div className="font-body-main font-semibold text-primary">{formatCurrency(deal.value)}</div>
                        <div className="flex gap-2 items-center text-xs">
                          <span className="text-on-surface-variant">{deal.probability}% probability</span>
                        </div>
                      </div>
                   </div>
                ))}
                {stageDeals.length === 0 && (
                  <div className="p-4 border-2 border-dashed border-[#E2E8F0] rounded-lg text-center font-body-sm text-outline-variant shrink-0">
                    {t('deals.noDeals')}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <DealFormModal isOpen={isDealModalOpen} onClose={() => setIsDealModalOpen(false)} />
      {selectedDeal && (
        <DealDrawer isOpen={!!selectedDeal} onClose={() => setSelectedDeal(null)} deal={selectedDeal} />
      )}
    </div>
  );
}

function DealDrawer({ deal, isOpen, onClose }: { deal: Deal; isOpen: boolean; onClose: () => void }) {
  const { users, moveDealStage } = useCRMStore();
  const owner = users.find((u) => u.id === deal.ownerId);
  const { t } = useTranslation();

  const stages = ["new", "qualified", "proposal", "negotiation", "won", "lost"] as const;

  return (
    <Drawer 
      isOpen={isOpen} 
      onClose={onClose} 
      title={deal.title}
      subtitle={deal.companyName}
      headerContent={
        <div className="flex items-center gap-2 mb-4">
           <Badge variant={deal.stage === "won" ? "success" : deal.stage === "lost" ? "error" : "default"} className="capitalize">
             {deal.stage}
           </Badge>
           <span className="font-body-sm text-on-surface-variant flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> 
              {formatDistanceToNow(new Date(deal.createdAt), { addSuffix: true })}
           </span>
        </div>
      }
    >
      <div className="p-6 space-y-8">
         <div>
           <h3 className="font-label-bold text-on-surface-variant uppercase tracking-wider mb-4 border-b border-[#E2E8F0] pb-2">{t('deals.drawer.changeStage')}</h3>
           <div className="flex flex-wrap gap-2">
             {stages.map(stage => (
               <Button 
                key={stage} 
                variant={deal.stage === stage ? "primary" : "secondary"} 
                size="sm"
                onClick={() => moveDealStage(deal.id, stage)}
                className="capitalize"
               >
                 {stage}
               </Button>
             ))}
           </div>
         </div>

         <div>
           <h3 className="font-label-bold text-on-surface-variant uppercase tracking-wider mb-4 border-b border-[#E2E8F0] pb-2">{t('deals.drawer.dealInfo')}</h3>
           <div className="space-y-4 font-body-main">
             <div className="flex justify-between items-center p-3 rounded-lg bg-surface-container-low">
               <span className="text-on-surface-variant flex items-center gap-2"><Target className="w-4 h-4"/> {t('deals.drawer.value')}</span>
               <span className="font-semibold text-primary">{formatCurrency(deal.value)}</span>
             </div>
             <div className="flex justify-between items-center p-3 rounded-lg bg-surface-container-low">
               <span className="text-on-surface-variant flex items-center gap-2"><User className="w-4 h-4"/> {t('deals.drawer.owner')}</span>
               <span className="text-primary">{owner?.name || t('deals.drawer.unassigned')}</span>
             </div>
             <div className="flex justify-between items-center p-3 rounded-lg bg-surface-container-low">
               <span className="text-on-surface-variant">{t('deals.drawer.probability')}</span>
               <span className="text-primary font-medium">{deal.probability}%</span>
             </div>
             {deal.expectedCloseDate && (
              <div className="flex justify-between items-center p-3 rounded-lg bg-surface-container-low">
                <span className="text-on-surface-variant">{t('deals.drawer.expectedClose')}</span>
                <span className="text-primary">{new Date(deal.expectedCloseDate).toLocaleDateString()}</span>
              </div>
             )}
             <div className="flex justify-between items-center p-3 rounded-lg bg-surface-container-low">
               <span className="text-on-surface-variant">{t('deals.drawer.contact')}</span>
               <span className="text-primary">{deal.contactName}</span>
             </div>
           </div>
         </div>
      </div>
    </Drawer>
  );
}
