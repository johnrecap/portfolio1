import React from "react";
import { useTranslation } from "react-i18next";
import { useClinicStore } from "@/store/clinicStore";
import { StatCard } from "@/components/ui/StatCard";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Users, Calendar as CalendarIcon, CreditCard, Activity } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell, Legend } from "recharts";
import { formatCurrency } from "@/lib/utils";

export default function Dashboard() {
  const { t } = useTranslation();
  const appointments = useClinicStore((s) => s.appointments);
  const patients = useClinicStore((s) => s.patients);
  const invoices = useClinicStore((s) => s.invoices);
  const activity = useClinicStore((s) => s.activity);

  // Stats
  const today = new Date().toISOString().split('T')[0];
  const todayAppointments = appointments.filter(a => a.date === today);
  const totalPatients = patients.length;
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  const monthlyRevenue = invoices
    .filter(i => {
      const date = new Date(i.issueDate);
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    })
    .reduce((sum, inv) => sum + inv.amountPaid, 0);

  const pendingPayments = invoices
    .filter(inv => inv.status !== 'paid')
    .reduce((sum, inv) => sum + (inv.amount - inv.amountPaid), 0);

  // Chart data
  const revenueData = React.useMemo(() => {
    // Generate last 6 months data for demo
    const data = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      data.push({
        name: d.toLocaleString('default', { month: 'short' }),
        total: Math.floor(Math.random() * 50000) + 20000
      });
    }
    // Set current month to actual
    data[5].total = monthlyRevenue;
    return data;
  }, [monthlyRevenue]);

  const appointmentStatusData = React.useMemo(() => {
    const counts = { completed: 0, pending: 0, confirmed: 0, cancelled: 0 };
    appointments.forEach(a => counts[a.status]++);
    return [
      { name: t('completed'), value: counts.completed, color: '#10b981' },
      { name: t('scheduled'), value: counts.confirmed, color: '#3b82f6' },
      { name: t('pending'), value: counts.pending, color: '#f59e0b' },
      { name: t('cancelled'), value: counts.cancelled, color: '#ef4444' },
    ];
  }, [appointments, t]);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">{t('dashboard')}</h2>
        <p className="text-on-surface-variant">{t('overviewDaily')}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title={t('dailyAppointments')}
          value={todayAppointments.length}
          icon={CalendarIcon}
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard
          title={t('totalPatients')}
          value={totalPatients}
          icon={Users}
          trend={{ value: 4, isPositive: true }}
        />
        <StatCard
          title={t('monthlyRevenue')}
          value={formatCurrency(monthlyRevenue)}
          icon={CreditCard}
          trend={{ value: 8.5, isPositive: true }}
        />
        <StatCard
          title={t('pendingPayments')}
          value={formatCurrency(pendingPayments)}
          icon={Activity}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-7">
        <Card className="md:col-span-4">
          <CardHeader>
            <CardTitle>{t('revenueTrend')}</CardTitle>
            <CardDescription>{t('revenueAcross')}</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <div dir="ltr" className="w-full h-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-outline-variant)" opacity={0.5} />
                  <XAxis dataKey="name" stroke="var(--color-outline)" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis 
                    stroke="var(--color-outline)" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false} 
                    tickFormatter={(value) => `${value/1000}k`}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--color-surface-container-lowest)', borderColor: 'var(--color-outline-variant)', borderRadius: '8px' }}
                    itemStyle={{ color: 'var(--color-on-surface)' }}
                    formatter={(value: number) => formatCurrency(value)}
                  />
                  <Area type="monotone" dataKey="total" stroke="var(--color-primary)" strokeWidth={2} fillOpacity={1} fill="url(#colorTotal)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>{t('appointmentStatus')}</CardTitle>
            <CardDescription>{t('distAppointments')}</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center">
            <div dir="ltr" className="w-full h-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={appointmentStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {appointmentStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--color-surface-container-lowest)', borderColor: 'var(--color-outline-variant)', borderRadius: '8px' }}
                  />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
         <Card>
          <CardHeader>
            <CardTitle>{t('upcomingAppointments')}</CardTitle>
            <CardDescription>{t('appointmentsNext7')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {appointments
                .filter(a => new Date(a.date) >= new Date() && a.status === 'confirmed')
                .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                .slice(0, 5)
                .map(app => (
                  <div key={app.id} className="flex items-center justify-between border-b border-outline-variant pb-2 last:border-0">
                    <div>
                      <p className="font-medium">{app.patientName}</p>
                      <p className="text-xs text-on-surface-variant">{app.date} {t('at')} {app.time} - {app.doctorName}</p>
                    </div>
                    <div className="text-sm font-medium">{app.specialty}</div>
                  </div>
                ))
              }
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('recentActivity')}</CardTitle>
            <CardDescription>{t('latestActions')}</CardDescription>
          </CardHeader>
          <CardContent>
             <div className="space-y-6">
              {activity.slice(0, 5).map(act => (
                <div key={act.id} className="flex gap-4">
                  <div className="mt-0.5 relative">
                     <div className="w-2 h-2 mt-1.5 rounded-full bg-primary" />
                     {/* Connector line could go here */}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{act.message}</p>
                    <p className="text-xs text-on-surface-variant">
                      {new Date(act.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
