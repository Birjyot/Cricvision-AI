'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  Bot, 
  User, 
  Sparkles, 
  History, 
  MessageSquare,
  Trash2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAIChat } from "@/hooks/useAIChat";

const suggestedPrompts = [
  "Analyze RCB's middle-over struggle",
  "Compare Bumrah vs Cummins in death overs",
  "Win probability for today's match?",
  "Best fantasy picks for tomorrow"
];

export default function AIAssistantPage() {
  const { messages, sendMessage, isLoading, clearMessages } = useAIChat();
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    sendMessage(input);
    setInput('');
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-2">
            AI Cricket Analyst <Sparkles className="w-6 h-6 text-sky-400" />
          </h1>
          <p className="text-slate-400 mt-1">Ask questions, get tactical insights, and predict outcomes.</p>
        </div>
        <button
          onClick={clearMessages}
          title="Clear chat"
          className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl hover:bg-slate-800 hover:border-slate-700 transition-all text-slate-500 hover:text-slate-300"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 flex gap-6 overflow-hidden">
        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col bg-slate-900/40 border border-slate-800 rounded-2xl overflow-hidden backdrop-blur-xl">
          <ScrollArea className="flex-1 p-6">
            <div className="space-y-6">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    "flex gap-4 max-w-[80%]",
                    msg.role === 'user' ? "ml-auto flex-row-reverse" : ""
                  )}
                >
                  <div className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                    msg.role === 'assistant' ? "bg-sky-500/20 text-sky-400" : "bg-slate-800 text-slate-400"
                  )}>
                    {msg.role === 'assistant' ? <Bot className="w-5 h-5" /> : <User className="w-5 h-5" />}
                  </div>
                  <div className={cn(
                    "p-4 rounded-2xl text-sm leading-relaxed",
                    msg.role === 'assistant' 
                      ? msg.isError
                        ? "bg-red-500/10 text-red-300 border border-red-500/20"
                        : "bg-slate-800/50 text-slate-200 border border-slate-700/50"
                      : "bg-sky-500 text-white"
                  )}>
                    {msg.content}
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div className="flex gap-1 items-center p-4 bg-slate-800/50 rounded-2xl border border-slate-700/50">
                    <div className="w-1.5 h-1.5 bg-sky-400 rounded-full animate-bounce" />
                    <div className="w-1.5 h-1.5 bg-sky-400 rounded-full animate-bounce delay-100" />
                    <div className="w-1.5 h-1.5 bg-sky-400 rounded-full animate-bounce delay-200" />
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Input Area */}
          <div className="p-6 bg-slate-950/50 border-t border-slate-800">
            <div className="flex gap-3 mb-4">
              {suggestedPrompts.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => setInput(prompt)}
                  className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-full text-xs text-slate-400 hover:border-sky-500/50 hover:text-sky-400 transition-all"
                >
                  {prompt}
                </button>
              ))}
            </div>
            <div className="relative group">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask me anything about cricket..."
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500/50 transition-all pr-12"
              />
              <button 
                onClick={handleSend}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-sky-500 hover:bg-sky-600 text-white rounded-lg transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar History */}
        <div className="w-72 hidden xl:flex flex-col gap-4">
          <div className="p-4 bg-slate-900/40 border border-slate-800 rounded-2xl flex-1 backdrop-blur-xl">
            <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <History className="w-4 h-4 text-slate-500" />
              Recent Analysis
            </h3>
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="group p-3 hover:bg-slate-800/50 rounded-xl cursor-pointer transition-all border border-transparent hover:border-slate-700/50">
                  <p className="text-xs text-slate-400 mb-1 flex items-center justify-between">
                    2 hours ago
                    <Trash2 className="w-3 h-3 opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-500 transition-all" />
                  </p>
                  <p className="text-sm text-slate-300 truncate font-medium">Why did MI lose yesterday?</p>
                </div>
              ))}
            </div>
          </div>
          <div className="p-4 bg-sky-500/10 border border-sky-500/20 rounded-2xl">
            <h3 className="text-sm font-bold text-sky-400 mb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Pro Feature
            </h3>
            <p className="text-xs text-sky-300/70 leading-relaxed">
              Enable advanced predictive models to get ball-by-ball win probability shifts.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
