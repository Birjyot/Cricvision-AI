'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Zap, 
  Bot, 
  TrendingUp, 
  Shield, 
  ArrowRight,
  Globe,
  Cpu
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#020617] text-white selection:bg-sky-500/30 selection:text-sky-200 overflow-hidden">
      {/* Background Gradients */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-sky-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-[120px]" />
      </div>

      {/* Nav */}
      <nav className="relative z-50 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-sky-500 rounded-lg flex items-center justify-center">
            <Zap className="w-5 h-5 fill-current" />
          </div>
          <span className="text-xl font-bold tracking-tight">CricVision AI</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
          <Link href="#features" className="hover:text-white transition-colors">Features</Link>
          <Link href="#analytics" className="hover:text-white transition-colors">Analytics</Link>
          <Link href="#ai" className="hover:text-white transition-colors">AI Intelligence</Link>
        </div>
        <Link href="/dashboard">
          <button className="px-5 py-2 bg-white text-black text-sm font-bold rounded-full hover:bg-slate-200 transition-all flex items-center gap-2">
            Go to Dashboard <ArrowRight className="w-4 h-4" />
          </button>
        </Link>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 pt-24 pb-32 px-8 max-w-5xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="px-4 py-1.5 bg-sky-500/10 border border-sky-500/20 rounded-full text-xs font-bold text-sky-400 uppercase tracking-widest mb-8 inline-block">
            Next-Gen Cricket Intelligence
          </span>
          <h1 className="text-6xl md:text-8xl font-bold tracking-tighter mb-8 bg-gradient-to-b from-white to-slate-500 bg-clip-text text-transparent">
            Decode the game with AI precision.
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed">
            Go beyond raw scores. CricVision AI provides real-time predictive analytics, tactical deep-dives, and an intelligent assistant powered by GROQ.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/dashboard">
              <button className="w-full sm:w-auto px-8 py-4 bg-sky-500 hover:bg-sky-600 text-white font-bold rounded-2xl transition-all shadow-lg shadow-sky-500/20 flex items-center justify-center gap-2">
                Get Started Free <ArrowRight className="w-5 h-5" />
              </button>
            </Link>
            <button className="w-full sm:w-auto px-8 py-4 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-white font-bold rounded-2xl transition-all flex items-center justify-center gap-2">
              View Demo
            </button>
          </div>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section id="features" className="relative z-10 py-32 px-8 max-w-7xl mx-auto border-t border-slate-900">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            {
              title: "Predictive Analytics",
              desc: "Real-time win probability and player performance forecasting using state-of-the-art ML models.",
              icon: TrendingUp,
              color: "text-sky-400"
            },
            {
              title: "AI-Powered Insights",
              desc: "Get explainable analytics. Ask why a team won or lost and receive tactical breakdowns in seconds.",
              icon: Bot,
              color: "text-indigo-400"
            },
            {
              title: "Modern UX",
              desc: "Experience cricket data through a premium, glassmorphic dashboard designed for speed and clarity.",
              icon: Globe,
              color: "text-emerald-400"
            }
          ].map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              className="group p-8 bg-slate-900/40 border border-slate-800 rounded-3xl hover:border-slate-700 transition-all backdrop-blur-xl"
            >
              <div className="w-12 h-12 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-center mb-6 group-hover:border-sky-500/30 transition-colors">
                <feature.icon className={`w-6 h-6 ${feature.color}`} />
              </div>
              <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
              <p className="text-slate-400 leading-relaxed">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative z-10 py-32 bg-slate-950/50 border-y border-slate-900">
        <div className="max-w-7xl mx-auto px-8 grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
          {[
            { label: "Matches Analyzed", value: "450k+" },
            { label: "AI Queries/Day", value: "1.2M" },
            { label: "Prediction Accuracy", value: "92%" },
            { label: "Data Latency", value: "<15ms" },
          ].map((stat, i) => (
            <div key={stat.label}>
              <h4 className="text-4xl font-black text-white mb-2">{stat.value}</h4>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-12 px-8 max-w-7xl mx-auto border-t border-slate-900 text-center">
        <p className="text-slate-500 text-sm">
          © 2024 CricVision AI. Built for the future of cricket.
        </p>
      </footer>
    </div>
  );
}
