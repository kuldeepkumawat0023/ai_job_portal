'use client';

import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  AreaChart, 
  Area,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { 
  TrendingUp, 
  Users, 
  Star, 
  CheckCircle2, 
  Briefcase, 
  Bolt, 
  Info,
  Calendar,
  Filter,
  Download,
  Target,
  BrainCircuit
} from 'lucide-react';
import { motion } from 'framer-motion';

// Mock Data
const funnelData = [
  { name: 'Applied', value: 1482, fill: '#4648d4' },
  { name: 'Shortlisted', value: 456, fill: '#8127cf' },
  { name: 'Interviewing', value: 124, fill: '#9c48ea' },
  { name: 'Hired', value: 12, fill: '#10b981' },
];

const volumeData = [
  { day: 'Mon', applications: 120 },
  { day: 'Tue', applications: 150 },
  { day: 'Wed', applications: 280 },
  { day: 'Thu', applications: 200 },
  { day: 'Fri', applications: 340 },
  { day: 'Sat', applications: 180 },
  { day: 'Sun', applications: 210 },
];

const qualityData = [
  { name: '90-100%', value: 15, color: '#4648d4' },
  { name: '80-89%', value: 25, color: '#8127cf' },
  { name: '70-79%', value: 35, color: '#9c48ea' },
  { name: '50-69%', value: 20, color: '#c7c4d7' },
  { name: 'Below 50%', value: 5, color: '#e4e1ed' },
];

const COLORS = ['#4648d4', '#8127cf', '#9c48ea', '#c7c4d7', '#e4e1ed'];

const AnalyticsView = () => {
  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-black text-on-surface mb-2 tracking-tight">Hiring Analytics</h1>
          <p className="text-on-surface-variant font-medium text-sm">Deep insights into your recruitment pipeline and performance.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-surface-container rounded-2xl text-[10px] font-black uppercase tracking-widest border border-white/10 hover:bg-surface-container-high transition-all">
            <Calendar className="w-3.5 h-3.5" />
            Last 30 Days
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-on-primary rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-[0.98] transition-all">
            <Download className="w-3.5 h-3.5" />
            Export Report
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Avg. Match Score', value: '84%', change: '+5.2%', icon: Target, color: 'text-primary bg-primary/10' },
          { label: 'Time to Hire', value: '18 Days', change: '-2 Days', icon: Calendar, color: 'text-secondary bg-secondary/10' },
          { label: 'Offer Acceptance', value: '92%', change: '+3%', icon: CheckCircle2, color: 'text-tertiary bg-tertiary/10' },
          { label: 'Candidate Sat.', value: '4.9/5', change: 'Top 1%', icon: Star, color: 'text-emerald-500 bg-emerald-500/10' },
        ].map((stat, i) => (
          <motion.div 
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
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
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Hiring Funnel */}
        <div className="lg:col-span-8 glass-card p-8 rounded-3xl border border-white/10 shadow-sm overflow-hidden">
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
              <BarChart data={funnelData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis 
                  dataKey="name" 
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
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
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
                  radius={[10, 10, 0, 0]} 
                  barSize={60}
                >
                  {funnelData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Candidate Quality Distribution */}
        <div className="lg:col-span-4 glass-card p-8 rounded-3xl border border-white/10 shadow-sm overflow-hidden flex flex-col">
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
                  {qualityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
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
        </div>

        {/* Application Volume Trend */}
        <div className="lg:col-span-12 glass-card p-8 rounded-3xl border border-white/10 shadow-sm overflow-hidden">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-black text-on-surface flex items-center gap-3">
              <TrendingUp className="w-6 h-6 text-secondary" />
              Application Volume Trend
            </h3>
            <div className="flex items-center bg-surface-container rounded-xl px-2 py-1">
              <button className="px-3 py-1 bg-white/10 rounded-lg text-[9px] font-black uppercase tracking-widest">Week</button>
              <button className="px-3 py-1 text-[9px] font-black uppercase tracking-widest text-on-surface-variant/40">Month</button>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={volumeData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorApps" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8127cf" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8127cf" stopOpacity={0}/>
                  </linearGradient>
                </defs>
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
                <Area 
                  type="monotone" 
                  dataKey="applications" 
                  stroke="#8127cf" 
                  strokeWidth={4}
                  fillOpacity={1} 
                  fill="url(#colorApps)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Insights Row (Mirrored from Dashboard but specialized) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-10">
        <div className="glass-card p-6 rounded-3xl border border-white/10 flex items-center justify-between group hover:bg-surface-container-low transition-colors">
          <div>
            <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-2">Platform Visibility</p>
            <div className="flex items-center gap-3">
              <h3 className="text-3xl font-black text-on-surface">Top 3%</h3>
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
              <h3 className="text-3xl font-black text-on-surface">98%</h3>
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
      </div>

    </div>
  );
};

export default AnalyticsView;
