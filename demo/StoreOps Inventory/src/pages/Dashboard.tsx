import React from 'react';
import { useTranslation } from 'react-i18next';
import { useInventoryStore } from '../store/inventoryStore';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { formatCurrency, formatNumber } from '../utils/formatters';
import { formatRelativeTime } from '../utils/dates';
import { Package, AlertTriangle, DollarSign, ArrowDownUp, ShoppingCart } from 'lucide-react';
import { Badge } from '../components/ui/Badge';

export function Dashboard() {
  const { t } = useTranslation();
  const { products, activity, settings } = useInventoryStore();

  const totalProducts = products.length;
  const lowStockProducts = products.filter(p => p.status === 'lowStock').length;
  const outOfStockProducts = products.filter(p => p.status === 'outOfStock').length;
  const totalValue = products.reduce((sum, p) => sum + (p.stock * p.unitCost), 0);

  const stats = [
    { 
      title: t('dashboard.totalProducts'), 
      value: formatNumber(totalProducts), 
      icon: Package, 
      color: 'text-blue-500', 
      bg: 'bg-blue-100 dark:bg-blue-900/30' 
    },
    { 
      title: t('dashboard.lowStock'), 
      value: formatNumber(lowStockProducts), 
      icon: AlertTriangle, 
      color: 'text-yellow-500', 
      bg: 'bg-yellow-100 dark:bg-yellow-900/30' 
    },
    { 
      title: t('dashboard.outOfStock'), 
      value: formatNumber(outOfStockProducts), 
      icon: ArrowDownUp, 
      color: 'text-red-500', 
      bg: 'bg-red-100 dark:bg-red-900/30' 
    },
    { 
      title: t('dashboard.totalValue'), 
      value: formatCurrency(totalValue), 
      icon: DollarSign, 
      color: 'text-green-500', 
      bg: 'bg-green-100 dark:bg-green-900/30' 
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <Card key={i}>
            <CardContent className="p-6 flex items-center gap-4">
              <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                <stat.icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-on-surface-variant">{stat.title}</p>
                <p className="text-2xl font-bold text-on-surface">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t('dashboard.inventoryStatus')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {products.filter(p => p.status !== 'inStock' && p.status !== 'discontinued').slice(0, 5).map(product => (
                <div key={product.id} className="flex items-center justify-between border-b border-surface-container-highest pb-4 last:border-0 last:pb-0">
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-on-surface-variant">{product.sku}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant={product.status === 'outOfStock' ? 'danger' : 'warning'}>
                      {t(`products.${product.status}`)}
                    </Badge>
                    <p className="text-sm mt-1 whitespace-nowrap">
                      {product.stock} / {product.reorderLevel} {product.unit}
                    </p>
                  </div>
                </div>
              ))}
              {products.filter(p => p.status !== 'inStock' && p.status !== 'discontinued').length === 0 && (
                <p className="text-on-surface-variant text-center py-4">{t('dashboard.allSufficient')}</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('dashboard.recentActivity')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:ml-[1.15rem] md:before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-surface-container-highest before:to-transparent">
              {activity.slice(0, 5).map((item) => (
                <div key={item.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border border-surface-container-highest bg-surface-container-lowest text-on-surface-variant shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm z-10">
                    {item.type === 'order' && <ShoppingCart className="h-4 w-4" />}
                    {item.type === 'inventory' && <ArrowDownUp className="h-4 w-4" />}
                    {item.type === 'product' && <Package className="h-4 w-4" />}
                    {item.type === 'supplier' && <Package className="h-4 w-4" />}
                    {item.type === 'system' && <Package className="h-4 w-4" />}
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-surface-container-highest bg-surface-container-lowest shadow-sm">
                    <p className="font-medium text-sm text-on-surface">{item.message}</p>
                    <p className="text-xs text-on-surface-variant mt-1">
                      {formatRelativeTime(item.timestamp, settings.language)}
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
