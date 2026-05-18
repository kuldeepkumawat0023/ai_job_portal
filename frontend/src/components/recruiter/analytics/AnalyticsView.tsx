'use client';

import React, { useState, useEffect } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area,
  PieChart,
  Pie,
  Cell,
  Legend,
  FunnelChart,
  Funnel,
  LabelList,
  LineChart,
  Line
} from 'recharts';
import { 
  TrendingUp, 
  Users, 
  Star, 
  CheckCircle2, 
  Calendar, 
  Download, 
  Target, 
  BrainCircuit,
  Loader2,
  AlertCircle,
  Info,
  Bolt
} from 'lucide-react';
import { motion } from 'framer-motion';
import { dashboardService } from '@/lib/services/dashboard.services';
import { toast } from 'react-hot-toast';

const COLORS = ['#4648d4', '#8127cf', '#9c48ea', '#c7c4d7', '#e4e1ed'];

const AnalyticsView = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Dynamic stats state initialized with fallback mocks
  const [stats, setStats] = useState({
    avgMatchScore: 84,
    matchScoreChange: "+5.2%",
    timeToHire: 18,
    timeToHireChange: "-2 Days",
    offerAcceptance: 92,
    offerAcceptanceChange: "+3%",
    candidateSatisfaction: 4.9,
    satisfactionChange: "Top 1%",
    responsiveness: 98,
    visibility: "Top 3%"
  });

  const [funnelData, setFunnelData] = useState<any[]>([]);
  const [qualityData, setQualityData] = useState<any[]>([]);
  const [volumeTrend, setVolumeTrend] = useState<any[]>([]);
  const [timeframe, setTimeframe] = useState<'week' | 'month'>('week');

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await dashboardService.getRecruiterAnalytics();
      if (res.success && res.data) {
        setStats(res.data.stats);
        setFunnelData(res.data.funnel);
        setQualityData(res.data.quality);
        setVolumeTrend(res.data.volumeTrend);
      } else {
        setError(res.message || 'Failed to fetch recruiting analytics data.');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while communicating with analytics backend.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, []);

  const handleExportReport = () => {
    toast.success('Hiring report compiled! Downloading CSV...');
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Metric,Value\n"
      + `Avg Match Score,${stats.avgMatchScore}%\n`
      + `Time to Hire,${stats.timeToHire} Days\n`
      + `Offer Acceptance,${stats.offerAcceptance}%\n`
      + `Candidate Satisfaction,${stats.candidateSatisfaction}/5\n`
      + `Recruiter Responsiveness,${stats.responsiveness}%\n`
      + `Platform Visibility,${stats.visibility}\n`;
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Recruiter_Analytics_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] gap-4" id="analytics-loading-screen">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
        <p className="text-on-surface-variant font-black uppercase tracking-widest text-xs">Aggregating Pipeline Analytics...</p>
      </div>
    );
  }

  return (
    <main className="space-y-10 animate-in fade-in duration-700" id="recruiter-analytics-container">
      
      {/* 🚀 SEO & Accessibility Friendly Header Area */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div>
          <h1 className="text-4xl font-black text-on-surface mb-2 tracking-tight">Hiring Analytics</h1>
          <p className="text-on-surface-variant font-medium text-sm">Deep insights into your recruitment pipeline and performance.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-surface-container rounded-2xl text-[10px] font-black uppercase tracking-widest border border-white/10 hover:bg-surface-container-high transition-all" id="btn-select-timeframe">
            <Calendar className="w-3.5 h-3.5" />
            Last 30 Days
          </button>
          <button 
            onClick={handleExportReport}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-on-primary rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-[0.98] transition-all"
            id="btn-export-analytics"
          >
            <Download className="w-3.5 h-3.5" />
            Export Report
          </button>
        </div>
      </header>

      {error && (
        <div className="p-5 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-3xl flex items-center gap-3 text-sm font-semibold" id="analytics-error-banner">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Stats Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" id="analytics-metrics-grid">
        {[
          { label: 'Avg. Match Score', value: `${stats.avgMatchScore}%`, change: stats.matchScoreChange, icon: Target, color: 'text-primary bg-primary/10' },
          { label: 'Time to Hire', value: `${stats.timeToHire} Days`, change: stats.timeToHireChange, icon: Calendar, color: 'text-secondary bg-secondary/10' },
          { label: 'Offer Acceptance', value: `${stats.offerAcceptance}%`, change: stats.offerAcceptanceChange, icon: CheckCircle2, color: 'text-tertiary bg-tertiary/10' },
          { label: 'Candidate Sat.', value: `${stats.candidateSatisfaction}/5`, change: stats.satisfactionChange, icon: Star, color: 'text-emerald-500 bg-emerald-500/10' },
        ].map((stat, i) => (
          <motion.div 
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="glass-card p-6 rounded-3xl hover:-translate-y-1 transition-all duration-300 group shadow-sm border border-white/10"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-2xl ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <span className={`text-[10px] font-black uppercase tracking-widest ${stat.color.split(' ')[0]}`}>{stat.change}</span>
            </div>
            <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-1">{stat.label}</p>
            <h3 className="text-3xl font-black text-on-surface">{stat.value}</h3>
          </motion.div>
        ))}
      </section>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Hiring Funnel */}
        <section className="lg:col-span-8 glass-card p-8 rounded-3xl border border-white/10 shadow-sm overflow-hidden" id="chart-hiring-funnel">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-black text-on-surface flex items-center gap-3">
              <BrainCircuit className="w-6 h-6 text-primary" />
              Hiring Funnel
            </h3>
            <div className="flex gap-2">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-primary"></div>
                <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-tighter">Volume</span>
              </div>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={funnelData}
                margin={{ top: 20, right: 40, left: 40, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis 
                  type="number"
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'var(--on-surface-variant)', fontSize: 10, fontWeight: 700 }}
                />
                <YAxis 
                  type="category"
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'var(--on-surface-variant)', fontSize: 10, fontWeight: 700 }}
                  dx={-10}
                />
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.8)', 
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '16px',
                    fontSize: '12px',
                    fontWeight: 700
                  }}
                />
                <Bar 
                  dataKey="value" 
                  radius={[0, 12, 12, 0]} 
                  barSize={24}
                >
                  <LabelList 
                    position="right" 
                    fill="var(--on-surface)" 
                    stroke="none" 
                    dataKey="value" 
                    style={{ fontSize: '11px', fontWeight: 900, marginLeft: 8 }}
                  />
                  {funnelData.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.fill || COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Candidate Quality Distribution */}
        <section className="lg:col-span-4 glass-card p-8 rounded-3xl border border-white/10 shadow-sm overflow-hidden flex flex-col" id="chart-quality-distribution">
          <h3 className="text-xl font-black text-on-surface mb-8">Candidate Quality</h3>
          <div className="flex-1 h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={qualityData}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {qualityData.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.8)', 
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '16px',
                    fontSize: '12px',
                    fontWeight: 700
                  }}
                />
                <Legend 
                  verticalAlign="bottom" 
                  height={36} 
                  iconType="circle"
                  formatter={(value) => <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-tighter">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 p-4 bg-primary/5 rounded-2xl border border-primary/10">
            <p className="text-[10px] text-on-surface-variant leading-relaxed text-center font-medium">
              <span className="font-black text-primary uppercase mr-1 italic">Insight:</span> 
              Most applicants fall into the 70-89% match range, indicating healthy pool quality.
            </p>
          </div>
        </section>

        {/* Application Volume Trend */}
        <section className="lg:col-span-12 glass-card p-8 rounded-3xl border border-white/10 shadow-sm overflow-hidden" id="chart-volume-trend">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-black text-on-surface flex items-center gap-3">
              <TrendingUp className="w-6 h-6 text-secondary" />
              Application Volume Trend
            </h3>
            <div className="flex items-center bg-surface-container rounded-xl px-2 py-1">
              <button 
                onClick={() => setTimeframe('week')}
                className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${timeframe === 'week' ? 'bg-white/10' : 'text-on-surface-variant/40'}`}
              >
                Week
              </button>
              <button 
                onClick={() => setTimeframe('month')}
                className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${timeframe === 'month' ? 'bg-white/10' : 'text-on-surface-variant/40'}`}
              >
                Month
              </button>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={volumeTrend} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis 
                  dataKey="day" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'var(--on-surface-variant)', fontSize: 10, fontWeight: 700 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'var(--on-surface-variant)', fontSize: 10, fontWeight: 700 }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.8)', 
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '16px',
                    fontSize: '12px',
                    fontWeight: 700
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="applications" 
                  stroke="#8127cf" 
                  strokeWidth={4}
                  dot={{ r: 6, stroke: '#8127cf', strokeWidth: 2, fill: '#fff' }}
                  activeDot={{ r: 8, stroke: '#8127cf', strokeWidth: 2, fill: '#8127cf' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>

      </div>

      {/* Insights Row */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-10" id="analytics-insights-grid">
        <div className="glass-card p-6 rounded-3xl border border-white/10 flex items-center justify-between group hover:bg-surface-container-low transition-colors">
          <div>
            <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-2">Platform Visibility</p>
            <div className="flex items-center gap-3">
              <h3 className="text-3xl font-black text-on-surface">{stats.visibility}</h3>
              <span className="px-2 py-1 bg-primary/10 text-primary rounded-lg text-[9px] font-black border border-primary/20 uppercase tracking-widest italic">High Traffic</span>
            </div>
          </div>
          <div className="p-4 bg-primary/10 text-primary rounded-full group-hover:scale-110 transition-transform">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="glass-card p-6 rounded-3xl border border-white/10 flex items-center justify-between group hover:bg-surface-container-low transition-colors">
          <div>
            <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-2">Recruiter Responsiveness</p>
            <div className="flex items-center gap-3">
              <h3 className="text-3xl font-black text-on-surface">{stats.responsiveness}%</h3>
              <span className="px-2 py-1 bg-emerald-500/10 text-emerald-600 rounded-lg text-[9px] font-black border border-emerald-500/20 uppercase tracking-widest italic">Fast Responder</span>
            </div>
          </div>
          <div className="p-4 bg-emerald-500/10 text-emerald-600 rounded-full group-hover:scale-110 transition-transform">
            <Bolt className="w-6 h-6" />
          </div>
        </div>

        <div className="lg:col-span-2 flex items-start gap-3 bg-primary/5 p-4 rounded-2xl border border-primary/10">
          <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
          <p className="text-xs text-on-surface-variant leading-relaxed">
            <span className="font-bold text-primary">AI Strategy Tip:</span> Your application volume peaked on Friday. Consider posting new job openings on Wednesday afternoons to maximize visibility during peak engagement hours.
          </p>
        </div>
      </section>

    </main>
  );
};

export default AnalyticsView;
