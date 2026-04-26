import React from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "./Card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export function StatCard({ title, value, icon: Icon, trend, className }: StatCardProps) {
  const { t } = useTranslation();
  return (
    <Card className={cn("", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-on-surface-variant">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-on-surface-variant" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold font-heading text-on-surface">{value}</div>
        {trend && (
          <p className={cn(
            "text-xs mt-1 font-medium flex items-center gap-1",
            trend.isPositive ? "text-green-600 dark:text-green-400" : "text-error"
          )}>
            <span dir="ltr">{trend.isPositive ? "+" : "-"}{Math.abs(trend.value)}%</span>
            <span>{t('fromLastMonth')}</span>
          </p>
        )}
      </CardContent>
    </Card>
  );
}
