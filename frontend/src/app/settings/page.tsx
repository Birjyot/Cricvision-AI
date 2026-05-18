'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Settings, User, Bell, Shield, Palette, Database,
  Key, ChevronRight, Check, Moon, Zap, Globe, Lock
} from 'lucide-react';
import { cn } from '@/lib/utils';

const sidebarSections = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'appearance', label: 'Appearance', icon: Palette },
  { id: 'api', label: 'API & Integrations', icon: Key },
  { id: 'privacy', label: 'Privacy & Security', icon: Shield },
  { id: 'data', label: 'Data Management', icon: Database },
];

const notifOptions = [
  { id: 'live', label: 'Live match alerts', desc: 'Get notified when a match you follow goes live', enabled: true },
  { id: 'wicket', label: 'Wicket alerts', desc: 'Instant push when a key player is dismissed', enabled: true },
  { id: 'win', label: 'Win probability shifts', desc: 'Alert when probability changes by >15%', enabled: false },
  { id: 'fantasy', label: 'Fantasy pick updates', desc: 'Daily fantasy team suggestions before matches', enabled: true },
  { id: 'news', label: 'Team news & XI announcements', desc: 'Playing XI leaks and official announcements', enabled: false },
];

const accentColors = [
  { name: 'Sky Blue', value: 'sky', hex: '#0ea5e9' },
  { name: 'Indigo', value: 'indigo', hex: '#6366f1' },
  { name: 'Emerald', value: 'emerald', hex: '#10b981' },
  { name: 'Violet', value: 'violet', hex: '#8b5cf6' },
  { name: 'Amber', value: 'amber', hex: '#f59e0b' },
  { name: 'Rose', value: 'rose', hex: '#f43f5e' },
];

function Toggle({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className={cn(
        'w-11 h-6 rounded-full transition-all duration-300 relative',
        enabled ? 'bg-sky-500' : 'bg-slate-700'
      )}
    >
      <div className={cn(
        'absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-all duration-300',
        enabled ? 'left-5' : 'left-0.5'
      )} />
    </button>
  );
}

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState('profile');
  const [notifications, setNotifications] = useState(
    Object.fromEntries(notifOptions.map(n => [n.id, n.enabled]))
  );
  const [accentColor, setAccentColor] = useState('sky');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const toggleNotif = (id: string) => {
    setNotifications(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
          <Settings className="w-7 h-7 text-slate-400" />
          Settings
        </h1>
        <p className="text-slate-400 mt-1">Manage your account, preferences, and integrations.</p>
      </div>

      <div className="flex gap-8">
        {/* Sidebar */}
        <div className="w-56 shrink-0 space-y-1">
          {sidebarSections.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveSection(id)}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
                activeSection === id
                  ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              )}
            >
              <Icon className="w-4 h-4" />
              {label}
              {activeSection === id && <ChevronRight className="w-3.5 h-3.5 ml-auto" />}
            </button>
          ))}
        </div>

        {/* Content Panel */}
        <motion.div
          key={activeSection}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex-1 bg-slate-900/40 border border-slate-800 rounded-2xl backdrop-blur-xl p-6"
        >
          {/* Profile Section */}
          {activeSection === 'profile' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-bold text-white mb-1">Profile Information</h2>
                <p className="text-sm text-slate-500">Update your personal details and preferences.</p>
              </div>
              {/* Avatar */}
              <div className="flex items-center gap-5">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-500 flex items-center justify-center text-3xl font-black text-white">G</div>
                <div>
                  <p className="text-sm font-semibold text-white">Guest User</p>
                  <p className="text-xs text-slate-500 mt-0.5">Free Plan · Member since May 2024</p>
                  <button className="mt-2 text-xs text-sky-400 hover:text-sky-300 transition-colors font-medium">Change avatar</button>
                </div>
              </div>
              {/* Form */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { label: 'Display Name', placeholder: 'Guest User' },
                  { label: 'Email', placeholder: 'guest@example.com', type: 'email' },
                  { label: 'Favourite Team', placeholder: 'e.g. CSK, RCB, MI...' },
                  { label: 'Country', placeholder: 'India' },
                ].map(({ label, placeholder, type }) => (
                  <div key={label}>
                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest block mb-2">{label}</label>
                    <input
                      type={type || 'text'}
                      defaultValue={placeholder}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500/40 focus:border-sky-500/40 transition-all"
                    />
                  </div>
                ))}
              </div>
              <div className="pt-2">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest block mb-2">Bio</label>
                <textarea
                  rows={3}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500/40 focus:border-sky-500/40 transition-all resize-none"
                  placeholder="Cricket analyst, fantasy player enthusiast..."
                />
              </div>
            </div>
          )}

          {/* Notifications Section */}
          {activeSection === 'notifications' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-bold text-white mb-1">Notification Preferences</h2>
                <p className="text-sm text-slate-500">Control which alerts you receive and when.</p>
              </div>
              <div className="space-y-2">
                {notifOptions.map((opt) => (
                  <div key={opt.id} className="flex items-center justify-between p-4 bg-slate-950/50 rounded-xl border border-slate-800 hover:border-slate-700 transition-colors">
                    <div className="flex items-center gap-3">
                      <Bell className={cn('w-4 h-4', notifications[opt.id] ? 'text-sky-400' : 'text-slate-600')} />
                      <div>
                        <p className="text-sm font-semibold text-white">{opt.label}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{opt.desc}</p>
                      </div>
                    </div>
                    <Toggle enabled={notifications[opt.id]} onToggle={() => toggleNotif(opt.id)} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Appearance Section */}
          {activeSection === 'appearance' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-bold text-white mb-1">Appearance</h2>
                <p className="text-sm text-slate-500">Customize how CricVision looks for you.</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Theme</p>
                <div className="flex gap-3">
                  {[
                    { label: 'Dark', icon: Moon, active: true },
                    { label: 'System', icon: Globe, active: false },
                  ].map(({ label, icon: Icon, active }) => (
                    <button key={label} className={cn(
                      'flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all',
                      active ? 'bg-sky-500/10 border-sky-500/30 text-sky-400' : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    )}>
                      <Icon className="w-4 h-4" />
                      {label}
                      {active && <Check className="w-3.5 h-3.5 ml-1" />}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Accent Color</p>
                <div className="flex flex-wrap gap-3">
                  {accentColors.map((color) => (
                    <button
                      key={color.value}
                      onClick={() => setAccentColor(color.value)}
                      title={color.name}
                      className="w-9 h-9 rounded-xl border-2 transition-all flex items-center justify-center"
                      style={{
                        backgroundColor: color.hex + '33',
                        borderColor: accentColor === color.value ? color.hex : 'transparent',
                      }}
                    >
                      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: color.hex }} />
                      {accentColor === color.value && (
                        <div className="absolute">
                          <Check className="w-3 h-3 text-white" style={{ filter: 'drop-shadow(0 0 2px rgba(0,0,0,0.8))' }} />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Density</p>
                <div className="flex gap-3">
                  {['Compact', 'Default', 'Spacious'].map((d) => (
                    <button key={d} className={cn(
                      'px-4 py-2 rounded-xl border text-sm font-medium transition-all',
                      d === 'Default' ? 'bg-sky-500/10 border-sky-500/30 text-sky-400' : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    )}>{d}</button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* API Section */}
          {activeSection === 'api' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-bold text-white mb-1">API & Integrations</h2>
                <p className="text-sm text-slate-500">Manage your connected services and API keys.</p>
              </div>
              <div className="space-y-3">
                {[
                  { name: 'GROQ AI', desc: 'LLaMA 3.3-70B for cricket analysis', connected: true, icon: Zap, color: 'text-purple-400' },
                  { name: 'Supabase', desc: 'Real-time database & authentication', connected: true, icon: Database, color: 'text-emerald-400' },
                  { name: 'CricAPI', desc: 'Live scores & ball-by-ball data feed', connected: false, icon: Globe, color: 'text-sky-400' },
                ].map((service) => (
                  <div key={service.name} className="flex items-center gap-4 p-4 bg-slate-950/50 border border-slate-800 rounded-xl">
                    <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center">
                      <service.icon className={cn('w-5 h-5', service.color)} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-white">{service.name}</p>
                      <p className="text-xs text-slate-500">{service.desc}</p>
                    </div>
                    <span className={cn(
                      'text-xs font-bold px-2.5 py-1 rounded-full border',
                      service.connected
                        ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                        : 'text-slate-500 bg-slate-900 border-slate-700'
                    )}>
                      {service.connected ? '✓ Connected' : 'Connect'}
                    </span>
                  </div>
                ))}
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest block mb-2">Your API Key</label>
                <div className="flex gap-3">
                  <input
                    type="password"
                    defaultValue="gsk_••••••••••••••••••••••••••"
                    readOnly
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-400 font-mono focus:outline-none"
                  />
                  <button className="px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm font-medium text-slate-300 hover:bg-slate-700 transition-colors flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    Reveal
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Privacy Section */}
          {activeSection === 'privacy' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-bold text-white mb-1">Privacy & Security</h2>
                <p className="text-sm text-slate-500">Control your data and account security settings.</p>
              </div>
              <div className="space-y-3">
                {[
                  { label: 'Two-Factor Authentication', desc: 'Add an extra layer of security to your account', enabled: false },
                  { label: 'Analytics Sharing', desc: 'Help us improve CricVision by sharing anonymized usage data', enabled: true },
                  { label: 'Public Profile', desc: 'Allow others to view your predictions and analysis', enabled: false },
                  { label: 'Email Communications', desc: 'Receive weekly cricket analytics digest via email', enabled: true },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-slate-950/50 border border-slate-800 rounded-xl">
                    <div className="flex items-center gap-3">
                      <Shield className="w-4 h-4 text-slate-500" />
                      <div>
                        <p className="text-sm font-semibold text-white">{item.label}</p>
                        <p className="text-xs text-slate-500">{item.desc}</p>
                      </div>
                    </div>
                    <Toggle enabled={item.enabled} onToggle={() => {}} />
                  </div>
                ))}
              </div>
              <div className="p-4 bg-red-500/5 border border-red-500/20 rounded-xl">
                <p className="text-sm font-semibold text-red-400 mb-1">Danger Zone</p>
                <p className="text-xs text-slate-500 mb-3">Permanently delete your account and all associated data. This action cannot be undone.</p>
                <button className="text-xs font-bold text-red-400 border border-red-500/20 px-4 py-2 rounded-lg hover:bg-red-500/10 transition-colors">
                  Delete Account
                </button>
              </div>
            </div>
          )}

          {/* Data Section */}
          {activeSection === 'data' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-bold text-white mb-1">Data Management</h2>
                <p className="text-sm text-slate-500">Export, import, or clear your cricket analytics data.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { label: 'Export Analytics Data', desc: 'Download all your saved insights as CSV', action: 'Export CSV', color: 'text-sky-400 border-sky-500/20 hover:bg-sky-500/10' },
                  { label: 'Export Predictions History', desc: 'Get a full history of AI predictions made', action: 'Export JSON', color: 'text-indigo-400 border-indigo-500/20 hover:bg-indigo-500/10' },
                  { label: 'Clear Chat History', desc: 'Remove all AI conversation history', action: 'Clear', color: 'text-amber-400 border-amber-500/20 hover:bg-amber-500/10' },
                  { label: 'Reset Preferences', desc: 'Restore all settings to their defaults', action: 'Reset', color: 'text-red-400 border-red-500/20 hover:bg-red-500/10' },
                ].map(({ label, desc, action, color }) => (
                  <div key={label} className="p-4 bg-slate-950/50 border border-slate-800 rounded-xl">
                    <p className="text-sm font-semibold text-white mb-1">{label}</p>
                    <p className="text-xs text-slate-500 mb-3">{desc}</p>
                    <button className={cn('text-xs font-bold px-3 py-1.5 rounded-lg border transition-colors', color)}>{action}</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Save Button */}
          {['profile', 'notifications', 'appearance'].includes(activeSection) && (
            <div className="mt-8 flex justify-end gap-3">
              <button className="px-4 py-2.5 text-sm font-medium text-slate-400 hover:text-white transition-colors">
                Cancel
              </button>
              <motion.button
                onClick={handleSave}
                whileTap={{ scale: 0.97 }}
                className={cn(
                  'px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2',
                  saved
                    ? 'bg-emerald-500 text-white'
                    : 'bg-sky-500 hover:bg-sky-600 text-white'
                )}
              >
                {saved ? (
                  <><Check className="w-4 h-4" /> Saved!</>
                ) : (
                  'Save Changes'
                )}
              </motion.button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
