import React from "react";
import { useTranslation } from "react-i18next";
import { useClinicStore } from "@/store/clinicStore";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Drawer } from "@/components/ui/Drawer";
import { InvoiceForm } from "@/components/forms/InvoiceForm";
import { Plus, Download, CheckCircle } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export default function Billing() {
  const { t } = useTranslation();
  const invoices = useClinicStore((s) => s.invoices);
  const updateInvoiceStatus = useClinicStore((s) => s.updateInvoiceStatus);
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  
  const getStatusBadgeVariant = (status: string) => {
    switch(status) {
      case "paid": return "success";
      case "unpaid": return "destructive";
      case "partial": return "warning";
      default: return "outline";
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{t('billing')}</h2>
          <p className="text-on-surface-variant">{t('manageBilling')}</p>
        </div>
        <Button className="shrink-0 gap-2" onClick={() => setIsDrawerOpen(true)}>
          <Plus className="w-4 h-4" />
          {t('createInvoice')}
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-on-surface-variant uppercase bg-surface-container-low border-b border-outline-variant">
                <tr>
                  <th className="px-6 py-4 font-medium">{t('table.invoiceNo')}</th>
                  <th className="px-6 py-4 font-medium">{t('table.patient')}</th>
                  <th className="px-6 py-4 font-medium">{t('table.date')}</th>
                  <th className="px-6 py-4 font-medium">{t('table.amount')}</th>
                  <th className="px-6 py-4 font-medium">{t('table.status')}</th>
                  <th className="px-6 py-4 font-medium text-right print:hidden">{t('table.actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {invoices.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-surface-container-lowest/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-primary cursor-pointer hover:underline">
                      {invoice.invoiceNumber}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-on-surface">{invoice.patientName}</div>
                      <div className="text-xs text-on-surface-variant">{invoice.service}</div>
                    </td>
                    <td className="px-6 py-4 text-on-surface-variant">
                      {invoice.issueDate}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium">{formatCurrency(invoice.amount)}</div>
                      {invoice.status === 'partial' && (
                        <div className="text-xs text-on-surface-variant">
                          {t('paidStatus')} {formatCurrency(invoice.amountPaid)}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={getStatusBadgeVariant(invoice.status)}>
                        {t(invoice.status)}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right print:hidden flex justify-end gap-1">
                       {invoice.status !== 'paid' && (
                         <Button variant="ghost" size="icon" title={t('markPaid')} onClick={() => updateInvoiceStatus(invoice.id, 'paid')}>
                           <CheckCircle className="w-4 h-4 text-green-500" />
                         </Button>
                       )}
                       <Button variant="ghost" size="icon" title={t('downloadInvoice')} onClick={handlePrint}>
                         <Download className="w-4 h-4" />
                       </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      
      <Drawer open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} title={t('createInvoice')}>
        <InvoiceForm onClose={() => setIsDrawerOpen(false)} />
      </Drawer>
    </div>
  );
}
