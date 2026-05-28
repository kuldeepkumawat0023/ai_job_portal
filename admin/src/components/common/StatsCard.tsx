import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/utils/cn';

interface StatsCardProps {
  label: string;
  value: string | number;
  change?: string;
  positive?: boolean;
  icon: LucideIcon;
  lineClass?: 'stat-line-blue' | 'stat-line-purple' | 'stat-line-orange' | 'stat-line-slate' | string;
  iconBg?: string;
  iconColor?: string;
  progressPercent?: number;
}

export default function StatsCard({
  label,
  value,
  change,
  positive = true,
  icon: Icon,
  lineClass = 'stat-line-blue',
  iconBg = 'bg-primary/10',
  iconColor = 'text-primary',
  progressPercent = 65
}: StatsCardProps) {
  return (
    <div className="glass-card rounded-2xl p-5 w-full">
      <div className="flex items-center justify-between mb-4">
        <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0', iconBg)}>
          <Icon className={cn('w-5 h-5', iconColor)} />
        </div>
        {change && (
          <span
            className={cn(
              'flex items-center gap-0.5 sm:gap-1 text-[10px] sm:text-xs font-bold px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full',
              positive ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'
            )}
          >
            {positive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {change}
          </span>
        )}
      </div>
      <p className="text-[9px] sm:text-[11px] font-semibold uppercase tracking-widest text-on-surface-variant mb-1 truncate">
        {label}
      </p>
      <p className="text-lg sm:text-2xl font-black text-on-surface truncate">{value}</p>
      {/* Progress line */}
      <div className="mt-4 h-1 rounded-full bg-outline-variant/20">
        <div className={cn('h-1 rounded-full', lineClass)} style={{ width: `${progressPercent}%` }} />
      </div>
    </div>
  );
}
