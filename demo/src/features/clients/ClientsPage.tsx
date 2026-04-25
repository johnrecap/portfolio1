import { useState } from "react";
import { Building2, Plus, Search } from "lucide-react";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { useCRMStore } from "../../store/crmStore";
import { formatCurrency, getInitials } from "../../utils/formatters";
import { ClientFormModal } from "./ClientFormModal";
import { useTranslation } from "react-i18next";

export default function ClientsPage() {
  const { clients } = useCRMStore();
  const [search, setSearch] = useState("");
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const { t } = useTranslation();

  const filteredClients = clients.filter((c) =>
    c.companyName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-container-padding flex flex-col h-full gap-stack-md max-w-[1440px] mx-auto overflow-hidden">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-[#E2E8F0] rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
            placeholder={t('clients.search')}
          />
        </div>
        <Button className="gap-2 w-full sm:w-auto" onClick={() => setIsClientModalOpen(true)}>
          <Plus className="w-4 h-4" /> {t('clients.addClient')}
        </Button>
      </div>

      <div className="bg-white rounded-[16px] border border-[#E2E8F0] shadow-natural overflow-hidden flex-1 flex flex-col">
        <div className="overflow-x-auto flex-1 custom-scrollbar">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead className="bg-surface sticky top-0 z-10 border-b border-[#E2E8F0]">
              <tr>
                <th className="px-4 py-3 font-label-bold text-on-surface-variant uppercase tracking-wider">{t('clients.table.client')}</th>
                <th className="px-4 py-3 font-label-bold text-on-surface-variant uppercase tracking-wider hidden sm:table-cell">{t('clients.table.industry')}</th>
                <th className="px-4 py-3 font-label-bold text-on-surface-variant uppercase tracking-wider">{t('clients.table.health')}</th>
                <th className="px-4 py-3 font-label-bold text-on-surface-variant uppercase tracking-wider text-right">{t('clients.table.retainer')}</th>
                <th className="px-4 py-3 font-label-bold text-on-surface-variant uppercase tracking-wider">{t('clients.table.activeProjects')}</th>
              </tr>
            </thead>
            <tbody className="font-body-main text-on-surface divide-y divide-[#E2E8F0]">
              {filteredClients.map((client) => {
                let badgeVariant: "success" | "warning" | "error" = "success";
                if (client.health === "needs_attention") badgeVariant = "warning";
                if (client.health === "at_risk") badgeVariant = "error";

                return (
                  <tr key={client.id} className="hover:bg-surface-container-low transition-colors group cursor-pointer">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-primary-fixed text-on-primary-fixed flex items-center justify-center font-bold text-xs shrink-0">
                          {getInitials(client.companyName)}
                        </div>
                        <div className="font-semibold text-primary">{client.companyName}</div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell text-on-surface-variant">{client.industry}</td>
                    <td className="px-4 py-3">
                      <Badge variant={badgeVariant} className="capitalize">
                        {client.health.replace("_", " ")}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-right font-medium">{formatCurrency(client.monthlyRetainer)}/mo</td>
                    <td className="px-4 py-3 text-on-surface-variant text-center">{client.activeProjects}</td>
                  </tr>
                );
              })}
              {filteredClients.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-on-surface-variant">
                    {t('clients.noClients')}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ClientFormModal isOpen={isClientModalOpen} onClose={() => setIsClientModalOpen(false)} />
    </div>
  );
}
