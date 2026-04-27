import { useState } from 'react';
import { useStore } from '../../store';
import { formatCurrency } from '../../lib/utils';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Search, ChevronDown } from 'lucide-react';
import { OrderStatus } from '../../types';

export function OrdersAdmin() {
  const { orders, updateOrderStatus } = useStore();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredOrders = orders.filter(o => 
    o.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
    o.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.customerEmail.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    updateOrderStatus(orderId, newStatus);
  };

  const statuses: OrderStatus[] = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tighter text-slate-900">Orders</h2>
        <p className="text-slate-500 mt-1">View and manage customer orders.</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-[20px] shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center gap-2 bg-slate-50/50">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input 
              placeholder="Search orders..." 
              className="pl-9 bg-white" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-600">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
              <tr>
                <th scope="col" className="px-6 py-3 font-medium">Order ID</th>
                <th scope="col" className="px-6 py-3 font-medium">Date</th>
                <th scope="col" className="px-6 py-3 font-medium">Customer</th>
                <th scope="col" className="px-6 py-3 font-medium">Total</th>
                <th scope="col" className="px-6 py-3 font-medium">Status</th>
                <th scope="col" className="px-6 py-3 font-medium text-right">Items</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {filteredOrders.length > 0 ? filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-900">
                    {order.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(order.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-900">{order.customerName}</div>
                    <div className="text-xs text-slate-500">{order.customerEmail}</div>
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-900">
                    {formatCurrency(order.total)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="relative inline-block w-36">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                        className={`block w-full appearance-none rounded-full border px-3 py-1 pr-8 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                          order.status === 'Delivered' ? 'border-green-200 bg-green-50 text-green-700' :
                          order.status === 'Processing' ? 'border-blue-200 bg-blue-50 text-blue-700' :
                          order.status === 'Pending' ? 'border-amber-200 bg-amber-50 text-amber-700' :
                          order.status === 'Cancelled' ? 'border-red-200 bg-red-50 text-red-700' :
                          'border-slate-200 bg-slate-50 text-slate-700'
                        }`}
                      >
                        {statuses.map(status => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
                        <ChevronDown className="h-3 w-3" />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-slate-500">
                      {order.items.reduce((sum, item) => sum + item.quantity, 0)} items
                    </span>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    No orders found matching "{searchTerm}"
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
