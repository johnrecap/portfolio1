import React from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useClinicStore } from "@/store/clinicStore";

export default function Reports() {
  const { t } = useTranslation();
  const invoices = useClinicStore((s) => s.invoices);
  
  // Calculate mock data for reports
  const data = React.useMemo(() => {
    const services: Record<string, number> = {};
    invoices.forEach(inv => {
      if(!services[inv.service]) services[inv.service] = 0;
      services[inv.service] += inv.amount;
    });
    
    return Object.entries(services)
      .map(([name, total]) => ({ name, total }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 5); // top 5
  }, [invoices]);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">{t('reports')}</h2>
        <p className="text-on-surface-variant">{t('analyticsClinic')}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-full xl:col-span-1">
          <CardHeader>
            <CardTitle>{t('topRevenueStreams')}</CardTitle>
            <CardDescription>{t('revenueBrokenDown')}</CardDescription>
          </CardHeader>
          <CardContent className="h-[400px]">
             <div dir="ltr" className="w-full h-full">
               <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 60, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="var(--color-outline-variant)" opacity={0.5} />
                  <XAxis type="number" stroke="var(--color-outline)" tickFormatter={(val) => `${val/1000}k`} />
                  <YAxis dataKey="name" type="category" width={100} stroke="var(--color-outline)" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                     cursor={{fill: 'var(--color-surface-container)'}}
                     contentStyle={{ backgroundColor: 'var(--color-surface-container-lowest)', borderColor: 'var(--color-outline-variant)', borderRadius: '8px' }}
                  />
                  <Bar dataKey="total" fill="var(--color-primary)" radius={[0, 4, 4, 0]} barSize={32} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
