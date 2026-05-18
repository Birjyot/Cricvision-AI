'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  TrendingUp, 
  Bot, 
  Zap, 
  Trophy, 
  Settings, 
  ChevronRight 
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { name: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
  { name: 'Analytics', icon: TrendingUp, href: '/analytics' },
  { name: 'AI Assistant', icon: Bot, href: '/ai-assistant' },
  { name: 'Live Scores', icon: Zap, href: '/live' },
  { name: 'Predictions', icon: Trophy, href: '/predictions' },
  { name: 'Settings', icon: Settings, href: '/settings' },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-screen w-64 bg-slate-950 border-r border-slate-800 text-slate-300 p-4">
      <div className="flex items-center gap-3 px-2 mb-10">
        <div className="w-8 h-8 bg-sky-500 rounded-lg flex items-center justify-center">
          <Zap className="text-white w-5 h-5 fill-current" />
        </div>
        <h1 className="text-xl font-bold text-white tracking-tight">CricVision AI</h1>
      </div>

      <nav className="flex-1 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <div
                className={cn(
                  "group relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300",
                  isActive 
                    ? "bg-sky-500/10 text-sky-400" 
                    : "hover:bg-slate-900 hover:text-white"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute inset-0 bg-sky-500/10 rounded-xl border border-sky-500/20"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
                <item.icon className={cn(
                  "w-5 h-5 transition-colors",
                  isActive ? "text-sky-400" : "text-slate-500 group-hover:text-slate-300"
                )} />
                <span className="font-medium">{item.name}</span>
                {isActive && (
                  <ChevronRight className="ml-auto w-4 h-4 text-sky-400" />
                )}
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto p-4 bg-slate-900/50 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-sky-500 to-indigo-500" />
          <div className="overflow-hidden">
            <p className="text-sm font-semibold text-white truncate">Guest User</p>
            <p className="text-xs text-slate-500 truncate">Free Plan</p>
          </div>
        </div>
        <button className="w-full py-2 bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold rounded-lg transition-colors">
          Upgrade to Pro
        </button>
      </div>
    </div>
  );
}
