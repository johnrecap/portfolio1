import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useInventoryStore } from '../store/inventoryStore';
import { formatCurrency, formatNumber } from '../utils/formatters';
import { formatDate } from '../utils/dates';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export function Reports() {
  const { t } = useTranslation();
  const { products, salesOrders, settings } = useInventoryStore();

  const inventoryValueByCategory = products.reduce((acc, product) => {
    const value = product.stock * product.unitCost;
    acc[product.categoryName] = (acc[product.categoryName] || 0) + value;
    return acc;
  }, {} as Record<string, number>);

  const pieChartData = Object.keys(inventoryValueByCategory).map(key => ({
    name: key,
    value: inventoryValueByCategory[key]
  })).sort((a, b) => b.value - a.value).slice(0, 5); // Top 5 categories

  const recentOrders = salesOrders.slice(0, 7).reverse();
  const lineChartData = recentOrders.map(order => ({
    name: formatDate(order.createdAt, settings.language).split(',')[0],
    sales: order.subtotal,
    profit: order.estimatedProfit
  }));

  const topSellingProducts = products
    .filter(p => p.stock < p.reorderLevel * 2 && p.status !== 'discontinued') // Just to simulate some data
    .sort((a, b) => (b.sellingPrice - b.unitCost) - (a.sellingPrice - a.unitCost))
    .slice(0, 5)
    .map(p => ({
      name: p.name.substring(0, 15),
      stock: p.stock,
      margin: p.sellingPrice - p.unitCost
    }));

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-on-surface">{t('app.reports')}</h1>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t('reports.inventoryValueByCategory')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => formatCurrency(value)} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('reports.recentSalesTrend')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={lineChartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} tickFormatter={(val) => `$${val/1000}k`} />
                  <Tooltip formatter={(value: number) => formatCurrency(value)} />
                  <Line type="monotone" dataKey="sales" stroke="#3b82f6" strokeWidth={2} name={t('reports.sales')} />
                  <Line type="monotone" dataKey="profit" stroke="#10b981" strokeWidth={2} name={t('reports.profit')} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>{t('reports.stockVsProfit')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topSellingProducts}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis yAxisId="left" axisLine={false} tickLine={false} />
                  <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Bar yAxisId="left" dataKey="margin" fill="#8b5cf6" name={t('reports.profitMargin')} radius={[4, 4, 0, 0]} />
                  <Bar yAxisId="right" dataKey="stock" fill="#f59e0b" name={t('reports.currentStock')} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
