import { useMemo } from 'react';
import { ShoppingBag, TrendingUp, Users, DollarSign } from 'lucide-react';
import { useStore } from '../../store';
import { formatCurrency } from '../../lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function Overview() {
  const { orders, products } = useStore();

  const metrics = useMemo(() => {
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    const totalOrders = orders.length;
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    
    // Mock user growth
    const activeCustomers = Math.round(totalOrders * 0.8) + 124; 
    
    return {
      totalRevenue,
      totalOrders,
      avgOrderValue,
      activeCustomers
    };
  }, [orders]);

  const recentOrders = orders.slice(0, 5);

  const chartData = [
    { name: 'Mon', total: Math.floor(Math.random() * 5000) + 1000 },
    { name: 'Tue', total: Math.floor(Math.random() * 5000) + 1000 },
    { name: 'Wed', total: Math.floor(Math.random() * 5000) + 1000 },
    { name: 'Thu', total: Math.floor(Math.random() * 5000) + 1000 },
    { name: 'Fri', total: Math.floor(Math.random() * 5000) + 1000 },
    { name: 'Sat', total: Math.floor(Math.random() * 5000) + 1000 },
    { name: 'Sun', total: metrics.totalRevenue }, // Current data
  ];

  return (
    <div className="space-y-8">
      <div>
        <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-3 inline-block">Made by Mohamed Saied</span>
        <h2 className="text-2xl font-bold tracking-tighter text-slate-900">Dashboard Overview</h2>
        <p className="text-slate-500 mt-1">Here's what's happening with your store today.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white p-5 rounded-[24px] shadow-sm border border-slate-100">
          <div className="flex items-center justify-between">
            <div className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">Total Revenue</div>
            <DollarSign className="h-4 w-4 text-slate-400 mb-2" />
          </div>
          <div className="text-3xl font-bold text-slate-900">{formatCurrency(metrics.totalRevenue)}</div>
          <div className="text-emerald-500 text-xs mt-1 font-semibold flex items-center gap-1">
            <TrendingUp className="h-3 w-3" /> +20.1% this month
          </div>
        </div>

        <div className="bg-white p-5 rounded-[24px] shadow-sm border border-slate-100">
          <div className="flex items-center justify-between">
            <div className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">Orders</div>
            <ShoppingBag className="h-4 w-4 text-slate-400 mb-2" />
          </div>
          <div className="text-3xl font-bold text-slate-900">+{metrics.totalOrders}</div>
          <div className="text-emerald-500 text-xs mt-1 font-semibold flex items-center gap-1">
            <TrendingUp className="h-3 w-3" /> +12% this month
          </div>
        </div>

        <div className="bg-white p-5 rounded-[24px] shadow-sm border border-slate-100">
          <div className="flex items-center justify-between">
            <div className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">Active Customers</div>
            <Users className="h-4 w-4 text-slate-400 mb-2" />
          </div>
          <div className="text-3xl font-bold text-slate-900">+{metrics.activeCustomers}</div>
          <div className="text-emerald-500 text-xs mt-1 font-semibold flex items-center gap-1">
            <TrendingUp className="h-3 w-3" /> +8.2% this month
          </div>
        </div>

        <div className="bg-emerald-600 text-white p-5 rounded-[24px] shadow-lg flex flex-col justify-between">
          <div>
            <div className="text-emerald-200 text-xs font-bold uppercase tracking-widest mb-2">Avg. Order Value</div>
            <div className="text-3xl font-bold">{formatCurrency(metrics.avgOrderValue)}</div>
          </div>
          <div className="text-emerald-200 text-xs mt-1 font-semibold flex items-center gap-1">
            Stable progress
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#6B7280', fontSize: 12 }} 
                    dy={10} 
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#6B7280', fontSize: 12 }} 
                    tickFormatter={(value) => `$${value}`} 
                  />
                  <Tooltip 
                    cursor={{ fill: 'transparent' }} 
                    contentStyle={{ borderRadius: '8px', border: '1px solid #E5E7EB', boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)' }} 
                  />
                  <Bar dataKey="total" fill="#4F46E5" radius={[4, 4, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {recentOrders.length > 0 ? recentOrders.map(order => (
                <div key={order.id} className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-slate-900">{order.customerName}</span>
                    <span className="text-xs text-slate-500">{order.customerEmail}</span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-sm font-medium text-slate-900">{formatCurrency(order.total)}</span>
                    <span className={`text-xs mt-1 px-2 py-0.5 rounded-full font-medium ${
                      order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                      order.status === 'Processing' ? 'bg-blue-100 text-blue-700' :
                      order.status === 'Pending' ? 'bg-amber-100 text-amber-700' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              )) : (
                <p className="text-sm text-slate-500 text-center py-4">No recent orders.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
