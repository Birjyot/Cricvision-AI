'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Zap, Radio, Clock, ChevronRight, Target, Shield,
  TrendingUp, Activity, Users
} from 'lucide-react';
import { cn } from '@/lib/utils';

const liveMatches = [
  {
    id: 1,
    status: 'LIVE',
    tournament: 'IPL 2024',
    team1: { name: 'CSK', fullName: 'Chennai Super Kings', score: '187/4', overs: '18.3', color: '#f59e0b' },
    team2: { name: 'RCB', fullName: 'Royal Challengers Bangalore', score: '145/6', overs: '15.0', color: '#ef4444' },
    currentBatting: 1,
    venue: 'M. A. Chidambaram Stadium, Chennai',
    winProb: { team1: 72, team2: 28 },
    crr: '9.8',
    rrr: '14.2',
    lastBall: '4',
  },
  {
    id: 2,
    status: 'LIVE',
    tournament: 'IPL 2024',
    team1: { name: 'MI', fullName: 'Mumbai Indians', score: '204/3', overs: '20.0', color: '#0ea5e9' },
    team2: { name: 'KKR', fullName: 'Kolkata Knight Riders', score: '168/8', overs: '17.2', color: '#8b5cf6' },
    currentBatting: 2,
    venue: 'Wankhede Stadium, Mumbai',
    winProb: { team1: 89, team2: 11 },
    crr: '9.7',
    rrr: '21.6',
    lastBall: 'W',
  },
];

const ballByBall = [
  { ball: '18.3', event: '4', desc: 'Kohli drives through covers for a boundary', type: 'boundary' },
  { ball: '18.2', event: '1', desc: 'Dhoni nudges to fine leg, rotates strike', type: 'run' },
  { ball: '18.1', event: '6', desc: 'Massive hit over long-on! Into the stands!', type: 'six' },
  { ball: '17.6', event: 'W', desc: 'OUT! Caught at deep mid-wicket. Dhruv Jurel departs.', type: 'wicket' },
  { ball: '17.5', event: '2', desc: 'Pushed to long-on, they come back for two', type: 'run' },
  { ball: '17.4', event: '0', desc: 'Dot ball! Full and straight, defended back.', type: 'dot' },
  { ball: '17.3', event: '4', desc: 'Edged and runs away through third man', type: 'boundary' },
  { ball: '17.2', event: '6', desc: 'Maximum! Pulled over square leg!', type: 'six' },
];

const currentPlayers = [
  { name: 'V. Kohli', role: 'Batting', runs: 72, balls: 48, fours: 7, sixes: 2, sr: '150.0' },
  { name: 'M.S. Dhoni', role: 'Batting', runs: 31, balls: 18, fours: 2, sixes: 2, sr: '172.2' },
  { name: 'J. Bumrah', role: 'Bowling', wickets: 2, overs: '3.3', runs: 28, economy: '8.0', balls: '' },
];

function BallEvent({ event, type }: { event: string; type: string }) {
  const styles: Record<string, string> = {
    six: 'bg-purple-500 text-white border-purple-400',
    boundary: 'bg-sky-500 text-white border-sky-400',
    wicket: 'bg-red-500 text-white border-red-400',
    dot: 'bg-slate-700 text-slate-400 border-slate-600',
    run: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  };
  return (
    <div className={cn('w-9 h-9 rounded-full border-2 flex items-center justify-center text-sm font-bold shrink-0', styles[type] || styles.run)}>
      {event}
    </div>
  );
}

export default function LiveScoresPage() {
  const [selectedMatch, setSelectedMatch] = useState(liveMatches[0]);
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setPulse(p => !p);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
            <Radio className={cn('w-7 h-7 text-red-400 transition-opacity', pulse ? 'opacity-100' : 'opacity-30')} />
            Live Scores
          </h1>
          <p className="text-slate-400 mt-1">Real-time match updates, ball-by-ball commentary & win probabilities.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-full">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span className="text-xs font-bold text-red-400 uppercase tracking-widest">{liveMatches.length} Live Matches</span>
        </div>
      </div>

      {/* Match Selector Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {liveMatches.map((match) => (
          <motion.div
            key={match.id}
            whileHover={{ scale: 1.01 }}
            onClick={() => setSelectedMatch(match)}
            className={cn(
              'p-5 rounded-2xl border cursor-pointer transition-all backdrop-blur-xl',
              selectedMatch.id === match.id
                ? 'bg-sky-500/10 border-sky-500/30 shadow-lg shadow-sky-500/10'
                : 'bg-slate-900/40 border-slate-800 hover:border-slate-700'
            )}
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{match.tournament} · {match.venue.split(',')[0]}</span>
              <span className="flex items-center gap-1.5 text-xs font-bold text-red-400 bg-red-500/10 px-2.5 py-1 rounded-full border border-red-500/20">
                <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                LIVE
              </span>
            </div>
            <div className="space-y-3">
              {[match.team1, match.team2].map((team, idx) => (
                <div key={team.name} className={cn('flex items-center justify-between', match.currentBatting === idx + 1 ? '' : 'opacity-60')}>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black text-white" style={{ backgroundColor: team.color + '33', border: `1px solid ${team.color}55` }}>
                      {team.name.slice(0, 2)}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">{team.name}</p>
                      <p className="text-xs text-slate-500">{team.fullName}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={cn('text-xl font-black', match.currentBatting === idx + 1 ? 'text-white' : 'text-slate-400')}>{team.score}</p>
                    <p className="text-xs text-slate-500">{team.overs} ov</p>
                  </div>
                </div>
              ))}
            </div>
            {/* Win Probability Bar */}
            <div className="mt-4">
              <div className="flex justify-between text-xs text-slate-500 mb-1.5">
                <span className="font-semibold" style={{ color: match.team1.color }}>{match.team1.name} {match.winProb.team1}%</span>
                <span className="font-semibold" style={{ color: match.team2.color }}>{match.team2.name} {match.winProb.team2}%</span>
              </div>
              <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden flex">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: match.team1.color }}
                  initial={{ width: 0 }}
                  animate={{ width: `${match.winProb.team1}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                />
                <motion.div
                  className="h-full rounded-full flex-1"
                  style={{ backgroundColor: match.team2.color }}
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Detailed Match View */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedMatch.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          {/* Ball-by-Ball Feed */}
          <div className="lg:col-span-2 bg-slate-900/40 border border-slate-800 rounded-2xl backdrop-blur-xl overflow-hidden">
            <div className="p-5 border-b border-slate-800 flex items-center justify-between">
              <h2 className="font-bold text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-sky-400" />
                Ball-by-Ball Feed
              </h2>
              <div className="flex items-center gap-4 text-sm">
                <div className="text-center">
                  <p className="text-xs text-slate-500">CRR</p>
                  <p className="font-bold text-emerald-400">{selectedMatch.crr}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-slate-500">RRR</p>
                  <p className="font-bold text-red-400">{selectedMatch.rrr}</p>
                </div>
              </div>
            </div>

            {/* Last ball highlight */}
            <div className="p-5 border-b border-slate-800 flex items-center gap-4 bg-slate-950/30">
              <BallEvent event={ballByBall[0].event} type={ballByBall[0].type} />
              <div>
                <p className="text-xs text-slate-500 font-mono mb-0.5">Over {ballByBall[0].ball}</p>
                <p className="text-sm text-white font-medium">{ballByBall[0].desc}</p>
              </div>
            </div>

            {/* Feed list */}
            <div className="divide-y divide-slate-800/50">
              {ballByBall.slice(1).map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center gap-4 p-4 hover:bg-slate-800/20 transition-colors"
                >
                  <BallEvent event={item.event} type={item.type} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-slate-500 font-mono">Over {item.ball}</p>
                    <p className="text-sm text-slate-300 truncate">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right Panel */}
          <div className="space-y-4">
            {/* Current Players */}
            <div className="bg-slate-900/40 border border-slate-800 rounded-2xl backdrop-blur-xl overflow-hidden">
              <div className="p-4 border-b border-slate-800">
                <h3 className="font-bold text-white flex items-center gap-2">
                  <Users className="w-4 h-4 text-indigo-400" />
                  On the Field
                </h3>
              </div>
              <div className="divide-y divide-slate-800/50">
                {currentPlayers.map((player) => (
                  <div key={player.name} className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="text-sm font-semibold text-white">{player.name}</p>
                        <p className={cn('text-xs font-medium', player.role === 'Bowling' ? 'text-amber-400' : 'text-sky-400')}>{player.role}</p>
                      </div>
                      {player.role !== 'Bowling' ? (
                        <div className="text-right">
                          <p className="text-lg font-black text-white">{player.runs}<span className="text-slate-500 text-sm font-normal">({player.balls})</span></p>
                          <p className="text-xs text-slate-500">SR: <span className="text-emerald-400">{player.sr}</span></p>
                        </div>
                      ) : (
                        <div className="text-right">
                          <p className="text-lg font-black text-white">{player.wickets}/<span className="text-slate-400 text-base">{player.runs}</span></p>
                          <p className="text-xs text-slate-500">Eco: <span className="text-amber-400">{player.economy}</span></p>
                        </div>
                      )}
                    </div>
                    {player.role !== 'Bowling' && (
                      <div className="flex gap-3 text-xs text-slate-500">
                        <span><span className="text-sky-400 font-semibold">{player.fours}</span> fours</span>
                        <span><span className="text-purple-400 font-semibold">{player.sixes}</span> sixes</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Match Stats */}
            <div className="bg-slate-900/40 border border-slate-800 rounded-2xl backdrop-blur-xl p-4 space-y-3">
              <h3 className="font-bold text-white flex items-center gap-2 mb-3">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                Match Stats
              </h3>
              {[
                { label: 'Partnership', value: '73 runs (38 balls)', icon: Target },
                { label: 'Last 5 Overs', value: '62 runs · 2 wkts', icon: Clock },
                { label: 'Powerplay', value: '58/0 (6 overs)', icon: Shield },
              ].map(({ label, value, icon: Icon }) => (
                <div key={label} className="flex items-center gap-3 p-3 bg-slate-950/50 rounded-xl">
                  <Icon className="w-4 h-4 text-slate-500 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-slate-500">{label}</p>
                    <p className="text-sm font-semibold text-white">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
