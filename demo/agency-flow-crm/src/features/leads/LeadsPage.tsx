import { useState } from "react";
import { Filter, UserPlus, MoreVertical, Search } from "lucide-react";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { Drawer } from "../../components/ui/Drawer";
import { useCRMStore } from "../../store/crmStore";
import { formatCurrency, getInitials } from "../../utils/formatters";
import { formatDistanceToNow } from "date-fns";
import { Lead } from "../../types/crm";
import { LeadFormModal } from "./LeadFormModal";
import { useTranslation } from "react-i18next";

export default function LeadsPage() {
  const { leads, users } = useCRMStore();
  const [search, setSearch] = useState("");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const { t } = useTranslation();

  const filteredLeads = leads.filter(
    (l) =>
      l.fullName.toLowerCase().includes(search.toLowerCase()) ||
      l.companyName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-container-padding flex flex-col h-full gap-stack-md max-w-[1440px] mx-auto overflow-hidden">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0">
        <div className="flex gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-72">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
             <input
               value={search}
               onChange={(e) => setSearch(e.target.value)}
               className="w-full pl-9 pr-4 py-2 bg-white border border-[#E2E8F0] rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
               placeholder={t('leads.search')}
             />
          </div>
          <Button variant="secondary" className="gap-2 hidden sm:flex">
            <Filter className="w-4 h-4" /> {t('leads.filter')}
          </Button>
        </div>
        <Button className="gap-2 w-full sm:w-auto" onClick={() => setIsLeadModalOpen(true)}>
          <UserPlus className="w-4 h-4" /> {t('leads.addLead')}
        </Button>
      </div>

      <div className="bg-white rounded-[16px] border border-[#E2E8F0] shadow-natural overflow-hidden flex-1 flex flex-col">
        <div className="overflow-x-auto flex-1 custom-scrollbar">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead className="bg-surface sticky top-0 z-10 shadow-sm border-b border-[#E2E8F0]">
              <tr>
                <th className="px-4 py-3 font-label-bold text-on-surface-variant uppercase tracking-wider">{t('leads.table.lead')}</th>
                <th className="px-4 py-3 font-label-bold text-on-surface-variant uppercase tracking-wider">{t('leads.table.company')}</th>
                <th className="px-4 py-3 font-label-bold text-on-surface-variant uppercase tracking-wider">{t('leads.table.source')}</th>
                <th className="px-4 py-3 font-label-bold text-on-surface-variant uppercase tracking-wider">{t('leads.table.status')}</th>
                <th className="px-4 py-3 font-label-bold text-on-surface-variant uppercase tracking-wider text-right">{t('leads.table.value')}</th>
                <th className="px-4 py-3 font-label-bold text-on-surface-variant uppercase tracking-wider">{t('leads.table.owner')}</th>
                <th className="px-4 py-3 font-label-bold text-on-surface-variant uppercase tracking-wider">{t('leads.table.lastContact')}</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="font-body-main text-on-surface divide-y divide-[#E2E8F0]">
              {filteredLeads.map((lead) => {
                const owner = users.find((u) => u.id === lead.ownerId);
                return (
                  <tr 
                    key={lead.id} 
                    onClick={() => setSelectedLead(lead)}
                    className="hover:bg-surface-container-low transition-colors group cursor-pointer"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-primary-fixed text-on-primary-fixed flex items-center justify-center font-bold text-xs">
                          {getInitials(lead.fullName)}
                        </div>
                        <span className="font-medium">{lead.fullName}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">{lead.companyName}</td>
                    <td className="px-4 py-3 capitalize text-on-surface-variant">{lead.source.replace("_", " ")}</td>
                    <td className="px-4 py-3">
                      <Badge variant={lead.status === "new" ? "secondary" : lead.status === "qualified" ? "success" : "default"}>
                        {lead.status.replace("_", " ")}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-right font-medium">{formatCurrency(lead.estimatedValue)}</td>
                    <td className="px-4 py-3 text-on-surface-variant">{owner?.name || t('leads.unassigned')}</td>
                    <td className="px-4 py-3 text-on-surface-variant">
                      {lead.lastContactedAt ? formatDistanceToNow(new Date(lead.lastContactedAt), { addSuffix: true }) : t('leads.never')}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button className="text-on-surface-variant hover:text-primary transition-colors opacity-0 group-hover:opacity-100 p-1 rounded-full hover:bg-slate-200" onClick={(e) => e.stopPropagation()}>
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
              {filteredLeads.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-on-surface-variant">
                    {t('leads.noLeads')}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <LeadFormModal isOpen={isLeadModalOpen} onClose={() => setIsLeadModalOpen(false)} />
      {selectedLead && (
        <LeadDrawer 
          lead={selectedLead} 
          isOpen={!!selectedLead} 
          onClose={() => setSelectedLead(null)} 
        />
      )}
    </div>
  );
}

function LeadDrawer({ lead, isOpen, onClose }: { lead: Lead; isOpen: boolean; onClose: () => void }) {
  const { users, convertLeadToDeal } = useCRMStore();
  const owner = users.find((u) => u.id === lead.ownerId);
  const { t } = useTranslation();

  const handleConvert = () => {
    convertLeadToDeal(lead.id);
    onClose();
  };

  return (
    <Drawer 
      isOpen={isOpen} 
      onClose={onClose} 
      title={lead.fullName}
      subtitle={`${lead.companyName} • ${lead.email}`}
      headerContent={
        <div className="w-12 h-12 rounded-xl bg-primary-fixed flex items-center justify-center font-bold text-lg mb-4 text-primary">
          {getInitials(lead.fullName)}
        </div>
      }
    >
      <div className="p-6 space-y-6">
         <div className="flex gap-3">
           <Button className="flex-1" onClick={handleConvert}>{t('leads.drawer.convertToDeal')}</Button>
           <Button variant="secondary" className="flex-1">{t('leads.drawer.sendEmail')}</Button>
         </div>

         <div>
           <h3 className="font-label-bold text-on-surface-variant uppercase tracking-wider mb-4 border-b border-[#E2E8F0] pb-2">{t('leads.drawer.about')}</h3>
           <div className="space-y-4 font-body-main">
             <div className="flex justify-between">
               <span className="text-on-surface-variant">{t('leads.drawer.estValue')}</span>
               <span className="font-semibold text-primary">{formatCurrency(lead.estimatedValue)}</span>
             </div>
             <div className="flex justify-between">
               <span className="text-on-surface-variant">{t('leads.drawer.source')}</span>
               <span className="capitalize text-primary">{lead.source.replace("_", " ")}</span>
             </div>
             <div className="flex justify-between">
               <span className="text-on-surface-variant">{t('leads.drawer.owner')}</span>
               <span className="text-primary">{owner?.name || t('leads.unassigned')}</span>
             </div>
           </div>
         </div>
      </div>
    </Drawer>
  );
}
