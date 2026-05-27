'use client';

import React, { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import {
  Users,
  Briefcase,
  DollarSign,
  Star,
  TrendingUp,
  TrendingDown,
  Download,
  Calendar,
  Sparkles,
  AlertTriangle,
  Lightbulb,
  ArrowRight,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { adminService } from '@/lib/services/admin.services';
import StatsCard from '@/components/common/StatsCard';
import Card from '@/components/common/Card';
import StatusBadge from '@/components/common/StatusBadge';
import Button from '@/components/common/Button';

// Mock data in case API is loading or offline
const mockStats = [
  {
    label: 'Total Users',
    value: '42,892',
    change: '+12%',
    positive: true,
    icon: Users,
    lineClass: 'stat-line-blue',
    iconBg: 'bg-primary/10',
    iconColor: 'text-primary',
  },
  {
    label: 'Active Recruiters',
    value: '1,402',
    change: '+5%',
    positive: true,
    icon: Briefcase,
    lineClass: 'stat-line-purple',
    iconBg: 'bg-secondary/10',
    iconColor: 'text-secondary',
  },
  {
    label: 'Monthly Revenue',
    value: '$142.5k',
    change: '+24%',
    positive: true,
    icon: DollarSign,
    lineClass: 'stat-line-orange',
    iconBg: 'bg-amber-500/10',
    iconColor: 'text-amber-600',
  },
  {
    label: 'Premium Users',
    value: '8,211',
    change: '-2%',
    positive: false,
    icon: Star,
    lineClass: 'stat-line-slate',
    iconBg: 'bg-zinc-100 dark:bg-zinc-800',
    iconColor: 'text-zinc-600 dark:text-zinc-400',
  },
];

const mockInsights = [
  {
    icon: TrendingUp,
    iconColor: 'text-primary',
    iconBg: 'bg-primary/10',
    title: 'Revenue Forecast',
    desc: 'High growth expected in Q4 due to increased recruiter onboarding in the EMEA region.',
  },
  {
    icon: AlertTriangle,
    iconColor: 'text-amber-600',
    iconBg: 'bg-amber-500/10',
    title: 'Churn Alert',
    desc: 'Payment failure rates increased by 2.4% last week. Recommended audit on Stripe API integration.',
  },
  {
    icon: Lightbulb,
    iconColor: 'text-secondary',
    iconBg: 'bg-secondary/10',
    title: 'Growth Tip',
    desc: '64% of premium users are asking for "AI Skill Verification". Consider tiered upsell for Q1 launch.',
  },
];

const mockTransactions = [
  {
    name: 'Morgan Maxwell',
    email: 'morgan.maxwell@stripe.com',
    avatar: 'MM',
    plan: 'Enterprise Pro',
    amount: '$499.00',
    date: 'Oct 12, 2024',
    status: 'Successful',
  },
  {
    name: 'Sarah Connor',
    email: 'sarah@jobfit.ai',
    avatar: 'SC',
    plan: 'Monthly Basic',
    amount: '$29.00',
    date: 'Oct 11, 2024',
    status: 'Successful',
  },
  {
    name: 'Victor Sullivan',
    email: 'vsully@globalhire.co',
    avatar: 'VS',
    plan: 'Enterprise Pro',
    amount: '$499.00',
    date: 'Oct 11, 2024',
    status: 'Failed',
  },
];

const chartData = [
  { name: 'Jan', Enterprise: 80, Individual: 40 },
  { name: 'Mar', Enterprise: 95, Individual: 55 },
  { name: 'May', Enterprise: 110, Individual: 50 },
  { name: 'Jul', Enterprise: 130, Individual: 70 },
  { name: 'Sep', Enterprise: 120, Individual: 65 },
  { name: 'Nov', Enterprise: 158, Individual: 80 },
];

export default function DashboardView() {
  const [stats, setStats] = useState<any>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  useEffect(() => {
    async function loadData() {
      try {
        const statsRes = await adminService.getDashboardStats();
        if (statsRes.success) {
          // Map to stats cards model
        }
      } catch (err) {
        console.warn('Dashboard stats API error, using mock data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
    setStats(mockStats);
    setTransactions(mockTransactions);
  }, []);

  return (
    <main className="w-full space-y-6" id="main-admin-dashboard" aria-label="Platform Super Admin Dashboard">
      {/* Page Header */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4" id="dashboard-header">
        <div>
          <h1 className="text-3xl font-bold text-on-surface dark:text-white tracking-tight">Platform Overview</h1>
          <p className="text-sm text-on-surface-variant dark:text-zinc-400 mt-1 font-medium">
            Real-time metrics and system health for AI JobFit ecosystem.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-on-surface-variant" />
            Last 30 Days
          </Button>
          <Button variant="gradient" size="sm" className="flex items-center gap-2 text-white">
            <Download className="w-4 h-4" />
            Export Report
          </Button>
        </div>
      </header>

      {/* Stats Grid */}
      <section className="grid grid-cols-2 xl:grid-cols-4 gap-4" aria-label="Key Performance Indicators">
        {stats.map((stat: any, idx: number) => (
          <StatsCard
            key={idx}
            label={stat.label}
            value={stat.value}
            change={stat.change}
            positive={stat.positive}
            icon={stat.icon}
            lineClass={stat.lineClass}
            iconBg={stat.iconBg}
            iconColor={stat.iconColor}
          />
        ))}
      </section>

      {/* Revenue Chart & AI Insights */}
      <section className="grid grid-cols-1 xl:grid-cols-3 gap-6" aria-label="Revenue Growth and AI Platform Insights">
        {/* Revenue Graph card */}
        <section className="xl:col-span-2 glass-card rounded-2xl border border-outline-variant/30 bg-card text-card-foreground shadow-sm p-6 flex flex-col justify-between" id="revenue-growth-chart">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-on-surface dark:text-white">Revenue Growth</h2>
              <p className="text-[11px] font-semibold uppercase tracking-widest text-on-surface-variant dark:text-zinc-500 mt-0.5">
                Annual Trajectory (USD)
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs font-semibold text-on-surface-variant">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 bg-primary rounded-full inline-block" />
                Enterprise
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 bg-secondary rounded-full inline-block" />
                Individual
              </span>
            </div>
          </div>

          <div className="w-full h-[260px] mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorEnterprise" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4648d4" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#4648d4" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorIndividual" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8127cf" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#8127cf" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? 'rgba(255,255,255,0.08)' : 'rgba(118,117,134,0.1)'} />
                <XAxis dataKey="name" stroke={isDark ? 'rgba(255,255,255,0.4)' : 'rgba(118,117,134,0.5)'} fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke={isDark ? 'rgba(255,255,255,0.4)' : 'rgba(118,117,134,0.5)'} fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    background: isDark ? '#18181b' : '#ffffff',
                    border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.08)',
                    borderRadius: '12px',
                    color: isDark ? '#ffffff' : '#09090b',
                    fontSize: '12px'
                  }}
                />
                <Area type="monotone" dataKey="Enterprise" stroke="#4648d4" strokeWidth={2.5} fillOpacity={1} fill="url(#colorEnterprise)" />
                <Area type="monotone" dataKey="Individual" stroke="#8127cf" strokeWidth={2} strokeDasharray="5 5" fillOpacity={1} fill="url(#colorIndividual)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* AI Insights Card */}
        <article className="glass-card rounded-2xl border border-outline-variant/30 bg-card text-card-foreground shadow-sm p-6 flex flex-col justify-between" id="ai-insights" aria-label="AI Platform Recommendations">
          <div>
            <div className="flex items-center gap-2 mb-6">
              <Sparkles className="w-4 h-4 text-primary ai-pulse-dot" />
              <h2 className="text-base font-bold text-on-surface dark:text-white">AI Insights</h2>
            </div>
            <div className="space-y-5">
              {mockInsights.map((ins: any, idx: number) => {
                const IIcon = ins.icon;
                return (
                  <section key={idx} className="flex gap-3" aria-label={ins.title}>
                    <div className={`w-8 h-8 rounded-xl ${ins.iconBg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                      <IIcon className={`w-4 h-4 ${ins.iconColor}`} />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-on-surface dark:text-white">{ins.title}</h3>
                      <p className="text-xs text-on-surface-variant dark:text-zinc-400 mt-0.5 leading-relaxed">{ins.desc}</p>
                    </div>
                  </section>
                );
              })}
            </div>
          </div>
          <Button variant="outline" className="w-full mt-6 flex items-center justify-center gap-2 text-xs">
            View Comprehensive Audit <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </article>
      </section>

      {/* Recent Transactions List */}
      <section className="glass-card p-6" id="recent-transactions" aria-labelledby="transactions-heading">
        <div className="flex items-center justify-between mb-6">
          <h2 id="transactions-heading" className="text-lg font-bold text-on-surface dark:text-white">Recent Transactions</h2>
          <Button variant="outline" size="sm" className="flex items-center gap-1.5 text-xs">
            <Filter className="w-3.5 h-3.5" /> Filter
          </Button>
        </div>

        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full">
            <thead>
              <tr className="border-b border-outline-variant/20 dark:border-zinc-800">
                {['User / Recruiter', 'Plan', 'Amount', 'Date', 'Status', 'Action'].map((h) => (
                  <th key={h} className="text-left text-[10px] font-black uppercase tracking-widest text-on-surface-variant dark:text-zinc-400 py-2 pb-3 pr-4">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx, idx) => (
                <tr key={idx} className="table-row-hover border-b border-outline-variant/10 dark:border-zinc-800/40 last:border-0">
                  <td className="py-4 pr-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                        {tx.avatar}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-on-surface dark:text-white">{tx.name}</p>
                        <p className="text-xs text-on-surface-variant dark:text-zinc-400">{tx.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 pr-4">
                    <StatusBadge status={tx.plan} className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20" />
                  </td>
                  <td className="py-4 pr-4">
                    <span className="text-sm font-bold text-on-surface dark:text-white">{tx.amount}</span>
                  </td>
                  <td className="py-4 pr-4">
                    <span className="text-xs text-on-surface-variant dark:text-zinc-400 font-medium">{tx.date}</span>
                  </td>
                  <td className="py-4 pr-4">
                    <span className={`flex items-center gap-1.5 text-xs font-semibold ${tx.status === 'Successful' ? 'text-emerald-500' : 'text-red-500'}`}>
                      {tx.status === 'Successful' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                      {tx.status}
                    </span>
                  </td>
                  <td className="py-4">
                    <button className="text-xs font-medium text-primary dark:text-indigo-400 hover:underline">
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
