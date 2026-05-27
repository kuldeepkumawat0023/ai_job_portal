import React from 'react';
import { cn } from '@/utils/cn';

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export default function StatusBadge({ status, className }: StatusBadgeProps) {
  const normalized = status?.toLowerCase() || '';

  const getStyle = () => {
    switch (normalized) {
      case 'active':
      case 'success':
      case 'successful':
      case 'approved':
      case 'completed':
        return 'bg-emerald-50 text-emerald-600 border border-emerald-200/50';
      case 'failed':
      case 'error':
      case 'suspended':
      case 'deactivated':
      case 'rejected':
        return 'bg-red-50 text-red-500 border border-red-200/50';
      case 'pending':
      case 'processing':
      case 'warning':
        return 'bg-amber-50 text-amber-600 border border-amber-200/50';
      default:
        return 'bg-zinc-100 text-zinc-600 border border-zinc-200';
    }
  };

  return (
    <span
      className={cn(
        'inline-flex items-center text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border',
        getStyle(),
        className
      )}
    >
      {status}
    </span>
  );
}
