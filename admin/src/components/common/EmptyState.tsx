import React from 'react';
import { HelpCircle } from 'lucide-react';
import { cn } from '@/utils/cn';

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ComponentType<any>;
  className?: string;
}

export default function EmptyState({
  title = "No data found",
  description = "There are no entries matching your current filters or query.",
  icon: Icon = HelpCircle,
  className
}: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center p-8 text-center bg-surface border border-outline-variant/30 rounded-2xl min-h-[300px]", className)}>
      <div className="w-16 h-16 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 dark:text-zinc-500 mb-4">
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-base font-bold text-on-surface mb-1">{title}</h3>
      <p className="text-xs text-on-surface-variant max-w-sm leading-relaxed">{description}</p>
    </div>
  );
}
