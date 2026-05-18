'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  BarChart3, 
  Target, 
  Zap, 
  Flame,
  ChevronRight,
  Loader2,
  Trophy,
  MapPin
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';

const playerData = [
  { subject: 'Strike Rate', A: 145, B: 132, fullMark: 200 },
  { subject: 'Average', A: 48, B: 52, fullMark: 100 },
  { subject: 'Boundaries', A: 85, B: 78, fullMark: 100 },
  { subject: 'Consistency', A: 72, B: 88, fullMark: 100 },
  { subject: 'Powerplay', A: 92, B: 65, fullMark: 100 },
  { subject: 'Death Overs', A: 68, B: 95, fullMark: 100 },
];

const trendData = [
  { match: 'M1', runs: 45 },
  { match: 'M2', runs: 12 },
  { match: 'M3', runs: 88 },
  { match: 'M4', runs: 34 },
  { match: 'M5', runs: 102 },
  { match: 'M6', runs: 56 },
];

const teamsList = ["CSK", "RCB", "MI", "KKR", "DC", "SRH", "PBKS", "RR", "GT", "LSG"];
const venuesList = ["MA Chidambaram Stadium", "Wankhede Stadium", "Eden Gardens", "M Chinnaswamy Stadium", "Arun Jaitley Stadium"];

export default function AnalyticsPage() {
  const [teamA, setTeamA] = useState('CSK');
  const [teamB, setTeamB] = useState('MI');
  const [venue, setVenue] = useState('Wankhede Stadium');
  const [winProb, setWinProb] = useState<any>(null);
  const [loadingProb, setLoadingProb] = useState(false);

  const calculateProb = async () => {
    setLoadingProb(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/ml/win-probability`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ team_a: teamA, team_b: teamB, venue })
      });
      const data = await res.json();
      setWinProb(data);
    } catch (e) {
      console.error(e);
    }
    setLoadingProb(false);
  };

  return (
    <div className="space-y-8 pb-10">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Advanced Analytics</h1>
        <p className="text-slate-400 mt-1">Deep dive into player and team performance metrics.</p>
      </div>

      <Tabs defaultValue="players" className="w-full">
        <TabsList className="bg-slate-900 border border-slate-800 p-1 rounded-xl mb-8 flex flex-wrap gap-2 h-auto">
          <TabsTrigger value="players" className="data-[state=active]:bg-sky-500 data-[state=active]:text-white rounded-lg px-6 py-2 transition-all">
            Player Analysis
          </TabsTrigger>
          <TabsTrigger value="teams" className="data-[state=active]:bg-sky-500 data-[state=active]:text-white rounded-lg px-6 py-2 transition-all">
            Team Comparison
          </TabsTrigger>
          <TabsTrigger value="venues" className="data-[state=active]:bg-sky-500 data-[state=active]:text-white rounded-lg px-6 py-2 transition-all">
            Venue Impact
          </TabsTrigger>
        </TabsList>

        <TabsContent value="players" className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="bg-slate-900/40 border-slate-800 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-white text-lg">Compare Players</CardTitle>
                <CardDescription className="text-slate-400">Select players to visualize performance.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-slate-950/50 rounded-xl border border-sky-500/20 flex items-center justify-between group cursor-pointer hover:bg-slate-900 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-sky-400 font-bold border border-sky-500/30">VK</div>
                    <div>
                      <p className="text-sm font-semibold text-white">Virat Kohli</p>
                      <p className="text-xs text-slate-500">RCB • Batter</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-sky-400" />
                </div>
                <div className="p-4 bg-slate-950/50 rounded-xl border border-emerald-500/20 flex items-center justify-between group cursor-pointer hover:bg-slate-900 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-emerald-400 font-bold border border-emerald-500/30">MS</div>
                    <div>
                      <p className="text-sm font-semibold text-white">MS Dhoni</p>
                      <p className="text-xs text-slate-500">CSK • Wicketkeeper</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-emerald-400" />
                </div>
                <button className="w-full py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:border-slate-700 transition-all">
                  + Add Player
                </button>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2 bg-slate-900/40 border-slate-800 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-white">Performance Radar</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[400px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={playerData}>
                      <PolarGrid stroke="#1e293b" />
                      <PolarAngleAxis dataKey="subject" stroke="#64748b" fontSize={12} />
                      <PolarRadiusAxis angle={30} domain={[0, 200]} stroke="#1e293b" tick={false} />
                      <Radar name="Virat Kohli" dataKey="A" stroke="#0ea5e9" fill="#0ea5e9" fillOpacity={0.3} />
                      <Radar name="MS Dhoni" dataKey="B" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
                      <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '12px' }} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="bg-slate-900/40 border-slate-800 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-white">Run Distribution (Last 6 Matches)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[250px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={trendData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                      <XAxis dataKey="match" stroke="#475569" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="#475569" fontSize={12} tickLine={false} axisLine={false} />
                      <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '12px' }} />
                      <Bar dataKey="runs" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Avg Strike Rate', value: '148.4', icon: Zap, color: 'text-sky-500' },
                { label: 'Consistency Score', value: '82/100', icon: Target, color: 'text-indigo-500' },
                { label: 'High Impact Plays', value: '12', icon: Flame, color: 'text-orange-500' },
                { label: 'Team Win Contrib.', value: '24%', icon: Users, color: 'text-emerald-500' },
              ].map((m, i) => (
                <Card key={i} className="bg-slate-900/40 border-slate-800 hover:border-slate-700/50 transition-all group backdrop-blur-xl">
                  <CardContent className="p-6">
                    <m.icon className={`w-5 h-5 ${m.color} mb-3`} />
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">{m.label}</p>
                    <h4 className="text-xl font-bold text-white mt-1">{m.value}</h4>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="teams" className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="bg-slate-900/40 border-slate-800 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2"><Trophy className="w-5 h-5 text-amber-400"/> AI Win Probability Calculator</CardTitle>
                <CardDescription className="text-slate-400">Select teams and venue to get a real-time ML prediction.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Team A</label>
                    <select value={teamA} onChange={(e) => setTeamA(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500/40 transition-all appearance-none">
                      {teamsList.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Team B</label>
                    <select value={teamB} onChange={(e) => setTeamB(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500/40 transition-all appearance-none">
                      {teamsList.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Venue</label>
                  <select value={venue} onChange={(e) => setVenue(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500/40 transition-all appearance-none">
                    {venuesList.map(v => <option key={v} value={v}>{v}</option>)}
                  </select>
                </div>
                <button onClick={calculateProb} disabled={loadingProb} className="w-full mt-4 bg-sky-500 hover:bg-sky-600 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2">
                  {loadingProb ? <Loader2 className="w-5 h-5 animate-spin" /> : "Calculate Win Probability"}
                </button>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/40 border-slate-800 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-white">Prediction Results</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col justify-center h-[280px]">
                {winProb ? (
                  <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
                    <div className="flex items-center justify-between text-center">
                      <div className="space-y-1">
                        <p className="text-3xl font-black text-white">{winProb.probability_a}%</p>
                        <p className="text-xs text-slate-500 uppercase font-bold">{winProb.team_a}</p>
                      </div>
                      <div className="text-slate-600 font-black">VS</div>
                      <div className="space-y-1">
                        <p className="text-3xl font-black text-white">{winProb.probability_b}%</p>
                        <p className="text-xs text-slate-500 uppercase font-bold">{winProb.team_b}</p>
                      </div>
                    </div>
                    <div className="h-3 bg-slate-800 rounded-full overflow-hidden flex">
                      <motion.div className="h-full bg-sky-500" initial={{ width: 0 }} animate={{ width: `${winProb.probability_a}%` }} transition={{ duration: 1 }} />
                      <motion.div className="h-full bg-indigo-500 flex-1" />
                    </div>
                    <div className="p-4 bg-slate-950/50 rounded-xl border border-slate-800 space-y-2">
                      <p className="text-xs font-bold text-slate-400 uppercase mb-2">Key Factors</p>
                      {winProb.key_factors.map((factor: string, idx: number) => (
                        <div key={idx} className="flex items-center gap-2 text-sm text-slate-300">
                          <Target className="w-4 h-4 text-sky-400" /> {factor}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ) : (
                  <div className="flex flex-col items-center justify-center text-slate-500 h-full">
                    <BarChart3 className="w-12 h-12 mb-3 opacity-20" />
                    <p>Select teams and calculate to see results.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="venues" className="space-y-8">
          <Card className="bg-slate-900/40 border-slate-800 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2"><MapPin className="w-5 h-5 text-emerald-400"/> Venue Impact Analysis</CardTitle>
              <CardDescription className="text-slate-400">Historical data on how venues favor batting or bowling.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {venuesList.map((venue, i) => (
                  <div key={venue} className="flex items-center justify-between p-4 bg-slate-950/50 border border-slate-800 rounded-xl hover:border-slate-700 transition-colors">
                    <div>
                      <p className="font-bold text-white">{venue}</p>
                      <p className="text-xs text-slate-500 mt-1">Average 1st Innings: {160 + (i * 5)}</p>
                    </div>
                    <div className="flex gap-4">
                      <div className="text-center">
                        <p className="text-xs text-slate-500">Pace</p>
                        <p className="font-semibold text-sky-400">{45 + i * 2}%</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-slate-500">Spin</p>
                        <p className="font-semibold text-emerald-400">{55 - i * 2}%</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

      </Tabs>
    </div>
  );
}
