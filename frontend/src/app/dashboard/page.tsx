'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Users, 
  Trophy, 
  Zap, 
  ArrowUpRight, 
  Search,
  Filter,
  Bot
} from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

const data = [
  { name: 'Overs 1-5', prob: 45 },
  { name: 'Overs 6-10', prob: 52 },
  { name: 'Overs 11-15', prob: 48 },
  { name: 'Overs 16-20', prob: 61 },
  { name: 'Overs 21-25', prob: 55 },
  { name: 'Overs 26-30', prob: 67 },
];

const stats = [
  { name: 'Live Win Prob', value: '67%', icon: Zap, color: 'text-sky-500', trend: '+12%' },
  { name: 'Projected Score', value: '184', icon: TrendingUp, color: 'text-emerald-500', trend: '+4' },
  { name: 'Active Users', value: '1,284', icon: Users, color: 'text-indigo-500', trend: '+18%' },
  { name: 'Matches Tracked', value: '458', icon: Trophy, color: 'text-amber-500', trend: '+2' },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Match Intelligence</h1>
          <p className="text-slate-400 mt-1">Real-time predictive analytics and AI insights.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-sky-400 transition-colors" />
            <input 
              type="text" 
              placeholder="Search matches, players..." 
              className="bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500/50 w-64 transition-all"
            />
          </div>
          <button className="p-2 bg-slate-900 border border-slate-800 rounded-xl hover:bg-slate-800 transition-colors">
            <Filter className="w-5 h-5 text-slate-400" />
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="bg-slate-900/40 border-slate-800 hover:border-slate-700/50 transition-all group backdrop-blur-xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-2 rounded-lg bg-slate-950 border border-slate-800 group-hover:border-sky-500/30 transition-colors`}>
                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                  <span className="text-xs font-medium text-emerald-400 flex items-center gap-1">
                    {stat.trend} <ArrowUpRight className="w-3 h-3" />
                  </span>
                </div>
                <p className="text-sm font-medium text-slate-500">{stat.name}</p>
                <h3 className="text-2xl font-bold text-white mt-1">{stat.value}</h3>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart */}
        <Card className="lg:col-span-2 bg-slate-900/40 border-slate-800 backdrop-blur-xl">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-white">Win Probability Trend</CardTitle>
                <CardDescription className="text-slate-400">RCB vs CSK - IPL 2024</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 px-3 py-1 bg-sky-500/10 border border-sky-500/20 rounded-full">
                  <div className="w-2 h-2 rounded-full bg-sky-500 animate-pulse" />
                  <span className="text-xs font-semibold text-sky-400 uppercase tracking-wider">Live</span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id="colorProb" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                  <XAxis 
                    dataKey="name" 
                    stroke="#475569" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false}
                    dy={10}
                  />
                  <YAxis 
                    stroke="#475569" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false}
                    tickFormatter={(val) => `${val}%`}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#0f172a', 
                      borderColor: '#1e293b', 
                      borderRadius: '12px',
                      color: '#f1f5f9'
                    }} 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="prob" 
                    stroke="#0ea5e9" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorProb)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* AI Insight Card */}
        <Card className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border-indigo-500/20 backdrop-blur-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Bot className="w-24 h-24 text-white" />
          </div>
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Bot className="w-5 h-5 text-indigo-400" />
              AI Tactical Insight
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-slate-950/50 rounded-xl border border-slate-800">
              <p className="text-sm text-slate-300 leading-relaxed">
                "RCB is currently dominating the middle overs. Win probability shifted by <span className="text-emerald-400 font-bold">12%</span> after Kohli's aggressive intent against spinners. CSK needs a wicket in the next 2 overs to break the momentum."
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Key Factor</p>
              <div className="flex items-center gap-2 text-sm text-white">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                Spinners Economy: <span className="text-indigo-400 font-semibold">9.4 RPO</span>
              </div>
            </div>
            <button className="w-full py-2.5 bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 text-sm font-semibold rounded-xl border border-indigo-500/30 transition-all">
              Ask AI for full report
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
