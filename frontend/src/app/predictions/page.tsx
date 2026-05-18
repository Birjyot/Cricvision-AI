'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Trophy, TrendingUp, Target, Zap, Star, ArrowUpRight,
  ChevronRight, BarChart2, Shield, Swords
} from 'lucide-react';
import {
  RadarChart, PolarGrid, PolarAngleAxis, Radar,
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis,
  Tooltip, CartesianGrid, Cell
} from 'recharts';
import { cn } from '@/lib/utils';

const matchPredictions = [
  {
    id: 1,
    tournament: 'IPL 2024 · Qualifier 1',
    date: 'Today, 7:30 PM',
    team1: { name: 'CSK', color: '#f59e0b', winProb: 62 },
    team2: { name: 'RCB', color: '#ef4444', winProb: 38 },
    confidence: 87,
    keyFactor: 'Toss advantage & home crowd',
    predictedScore: '178–196',
    tip: 'CSK favoured by their death-over specialists (Bumrah, Pathirana) and Dhoni\'s unmatched finishing ability on this surface.',
  },
  {
    id: 2,
    tournament: 'IPL 2024 · Qualifier 2',
    date: 'Tomorrow, 7:30 PM',
    team1: { name: 'MI', color: '#0ea5e9', winProb: 45 },
    team2: { name: 'KKR', color: '#8b5cf6', winProb: 55 },
    confidence: 71,
    keyFactor: 'KKR\'s form in last 5 matches (4W-1L)',
    predictedScore: '165–185',
    tip: 'KKR\'s spinners historically dominate on Eden Gardens, giving them a significant edge in the middle overs.',
  },
];

const playerForecasts = [
  { name: 'V. Kohli', team: 'RCB', predicted: 58, range: [42, 74], last5: [76, 12, 45, 88, 34], sr: 138 },
  { name: 'J. Bumrah', team: 'MI', predicted: '2.4 wkts', range: [1, 4], last5: [3, 1, 2, 4, 2], sr: 7.2 },
  { name: 'M.S. Dhoni', team: 'CSK', predicted: 37, range: [22, 55], last5: [44, 12, 71, 28, 55], sr: 158 },
  { name: 'A. Russell', team: 'KKR', predicted: 42, range: [18, 68], last5: [55, 92, 11, 68, 24], sr: 175 },
];

const radarData = [
  { subject: 'Batting', CSK: 88, RCB: 82 },
  { subject: 'Bowling', CSK: 85, RCB: 74 },
  { subject: 'Fielding', CSK: 79, RCB: 76 },
  { subject: 'Death Overs', CSK: 91, RCB: 68 },
  { subject: 'Powerplay', CSK: 76, RCB: 88 },
  { subject: 'Experience', CSK: 95, RCB: 79 },
];

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 border border-slate-700 rounded-xl p-3 text-sm">
        <p className="text-slate-400 mb-1">{label}</p>
        <p className="text-white font-bold">{payload[0].value} runs</p>
      </div>
    );
  }
  return null;
};

export default function PredictionsPage() {
  const [activePred, setActivePred] = useState(matchPredictions[0]);

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
            <Trophy className="w-7 h-7 text-amber-400" />
            Predictions
          </h1>
          <p className="text-slate-400 mt-1">AI-powered match forecasts, player projections & winning probabilities.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-full">
          <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
          <span className="text-xs font-bold text-amber-400">AI Confidence: 84%</span>
        </div>
      </div>

      {/* Match Prediction Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {matchPredictions.map((pred, i) => (
          <motion.div
            key={pred.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            onClick={() => setActivePred(pred)}
            className={cn(
              'p-6 rounded-2xl border cursor-pointer transition-all backdrop-blur-xl',
              activePred.id === pred.id
                ? 'bg-slate-900/60 border-sky-500/30 shadow-lg shadow-sky-500/10'
                : 'bg-slate-900/40 border-slate-800 hover:border-slate-700'
            )}
          >
            {/* Match Info */}
            <div className="flex items-center justify-between mb-5">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{pred.tournament}</span>
              <span className="text-xs font-medium text-slate-400 flex items-center gap-1">
                <Zap className="w-3 h-3 text-sky-400" />
                {pred.date}
              </span>
            </div>

            {/* Teams vs */}
            <div className="flex items-center gap-4 mb-5">
              <div className="flex-1 text-center">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-black text-white mx-auto mb-2"
                  style={{ backgroundColor: pred.team1.color + '22', border: `2px solid ${pred.team1.color}44` }}>
                  {pred.team1.name}
                </div>
                <p className="text-xl font-black" style={{ color: pred.team1.color }}>{pred.team1.winProb}%</p>
                <p className="text-xs text-slate-500">Win prob.</p>
              </div>
              <div className="flex flex-col items-center gap-1">
                <Swords className="w-6 h-6 text-slate-600" />
                <span className="text-xs font-bold text-slate-600">VS</span>
              </div>
              <div className="flex-1 text-center">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-black text-white mx-auto mb-2"
                  style={{ backgroundColor: pred.team2.color + '22', border: `2px solid ${pred.team2.color}44` }}>
                  {pred.team2.name}
                </div>
                <p className="text-xl font-black" style={{ color: pred.team2.color }}>{pred.team2.winProb}%</p>
                <p className="text-xs text-slate-500">Win prob.</p>
              </div>
            </div>

            {/* Probability bar */}
            <div className="h-2 bg-slate-800 rounded-full overflow-hidden flex mb-4">
              <div className="h-full transition-all duration-700" style={{ width: `${pred.team1.winProb}%`, backgroundColor: pred.team1.color }} />
              <div className="h-full flex-1" style={{ backgroundColor: pred.team2.color }} />
            </div>

            {/* Info row */}
            <div className="flex items-center justify-between text-sm">
              <div>
                <p className="text-xs text-slate-500">Predicted Score</p>
                <p className="font-bold text-white">{pred.predictedScore}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-500">AI Confidence</p>
                <p className="font-bold text-emerald-400">{pred.confidence}%</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Deep Analysis Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Team Radar Comparison */}
        <div className="lg:col-span-1 bg-slate-900/40 border border-slate-800 rounded-2xl backdrop-blur-xl p-5">
          <h3 className="font-bold text-white mb-1 flex items-center gap-2">
            <Shield className="w-4 h-4 text-indigo-400" />
            Team Comparison
          </h3>
          <p className="text-xs text-slate-500 mb-4">{activePred.team1.name} vs {activePred.team2.name}</p>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="#1e293b" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 11 }} />
                <Radar name={activePred.team1.name} dataKey="CSK" stroke={activePred.team1.color} fill={activePred.team1.color} fillOpacity={0.15} strokeWidth={2} />
                <Radar name={activePred.team2.name} dataKey="RCB" stroke={activePred.team2.color} fill={activePred.team2.color} fillOpacity={0.15} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 text-xs">
            <span className="flex items-center gap-1.5"><div className="w-3 h-0.5 rounded" style={{ backgroundColor: activePred.team1.color }} /><span className="text-slate-400">{activePred.team1.name}</span></span>
            <span className="flex items-center gap-1.5"><div className="w-3 h-0.5 rounded" style={{ backgroundColor: activePred.team2.color }} /><span className="text-slate-400">{activePred.team2.name}</span></span>
          </div>
        </div>

        {/* AI Insight + Player Forecasts */}
        <div className="lg:col-span-2 space-y-4">
          {/* AI Insight */}
          <div className="p-5 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-2xl">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-md bg-indigo-500/20 flex items-center justify-center">
                <TrendingUp className="w-3.5 h-3.5 text-indigo-400" />
              </div>
              <p className="text-sm font-bold text-indigo-300">AI Match Analysis</p>
              <span className="ml-auto text-xs text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/20">KEY FACTOR: {activePred.keyFactor}</span>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">{activePred.tip}</p>
          </div>

          {/* Player Forecasts */}
          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl backdrop-blur-xl overflow-hidden">
            <div className="p-4 border-b border-slate-800">
              <h3 className="font-bold text-white flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-sky-400" />
                Player Projections
              </h3>
            </div>
            <div className="divide-y divide-slate-800/50">
              {playerForecasts.map((player, i) => (
                <motion.div
                  key={player.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="p-4 flex items-center gap-4"
                >
                  <div>
                    <p className="font-semibold text-white text-sm">{player.name}</p>
                    <p className="text-xs text-slate-500">{player.team}</p>
                  </div>
                  {/* Sparkline */}
                  <div className="flex-1 h-10">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={player.last5.map((v, idx) => ({ v, idx }))}>
                        <Bar dataKey="v" radius={[2, 2, 0, 0]}>
                          {player.last5.map((_, idx) => (
                            <Cell key={idx} fill={idx === player.last5.length - 1 ? '#0ea5e9' : '#1e293b'} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-lg font-black text-white">{player.predicted}</p>
                    <p className="text-xs text-slate-500">Projected</p>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-emerald-400 shrink-0" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
