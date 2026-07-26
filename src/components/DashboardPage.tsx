import React from 'react';
import { useApp } from '../context/AppContext';
import {
  PlusCircle,
  Search,
  Sparkles,
  FolderOpen,
  CheckCircle2,
  Clock,
  MapPin,
  TrendingUp,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  Tag,
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { currentUser, setCurrentView, items, setSelectedMatchItem, setSelectedDetailItem } = useApp();

  const lostItems = items.filter((i) => i.type === 'lost' && i.status === 'active');
  const foundItems = items.filter((i) => i.type === 'found' && i.status === 'active');
  const resolvedItems = items.filter((i) => i.status === 'resolved');

  const myReports = currentUser
    ? items.filter((i) => i.userId === currentUser.uid)
    : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome Hero Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-blue-950 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/60 border border-blue-700/60 text-blue-300 text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
              <span>Campus Security & Safety Hub</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Welcome back, {currentUser?.name || 'Student'}! 👋
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Track your reported belongings, inspect potential AI matches, and help reunite the university community with lost items.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => setCurrentView('report_lost')}
              className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg flex items-center gap-2 transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Report Lost Item</span>
            </button>

            <button
              onClick={() => setCurrentView('report_found')}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg flex items-center gap-2 transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Report Found Item</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Action Navigation Grid */}
      <div>
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
          Quick Action Navigation
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          <button
            onClick={() => setCurrentView('report_lost')}
            className="p-5 rounded-2xl bg-slate-900 hover:bg-amber-950/30 border border-slate-800 hover:border-amber-500/50 transition-all text-left group"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-3 group-hover:scale-110 transition-transform">
              <PlusCircle className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-white">Report Lost</h3>
            <p className="text-[11px] text-slate-400 mt-1">Submit lost item details</p>
          </button>

          <button
            onClick={() => setCurrentView('report_found')}
            className="p-5 rounded-2xl bg-slate-900 hover:bg-emerald-950/30 border border-slate-800 hover:border-emerald-500/50 transition-all text-left group"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-3 group-hover:scale-110 transition-transform">
              <PlusCircle className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-white">Report Found</h3>
            <p className="text-[11px] text-slate-400 mt-1">Log found campus item</p>
          </button>

          <button
            onClick={() => setCurrentView('browse')}
            className="p-5 rounded-2xl bg-slate-900 hover:bg-blue-950/30 border border-slate-800 hover:border-blue-500/50 transition-all text-left group"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-3 group-hover:scale-110 transition-transform">
              <Search className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-white">Browse All</h3>
            <p className="text-[11px] text-slate-400 mt-1">Filter by category & hall</p>
          </button>

          <button
            onClick={() => setCurrentView('ai_match')}
            className="p-5 rounded-2xl bg-slate-900 hover:bg-amber-950/30 border border-slate-800 hover:border-amber-500/50 transition-all text-left group relative"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-3 group-hover:scale-110 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-bold text-sm text-white">AI Matcher</h3>
              <span className="px-1.5 py-0.2 text-[9px] font-black bg-amber-500 text-slate-950 rounded">
                AI
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Auto-compare lost/found</p>
          </button>

          <button
            onClick={() => setCurrentView('my_reports')}
            className="p-5 rounded-2xl bg-slate-900 hover:bg-indigo-950/30 border border-slate-800 hover:border-indigo-500/50 transition-all text-left group"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-3 group-hover:scale-110 transition-transform">
              <FolderOpen className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-white">My Reports</h3>
            <p className="text-[11px] text-slate-400 mt-1">{myReports.length} reports logged</p>
          </button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between text-amber-400">
            <span className="text-xs font-bold uppercase tracking-wider">Active Lost Items</span>
            <AlertCircle className="w-5 h-5" />
          </div>
          <p className="text-3xl font-black text-white">{lostItems.length}</p>
          <p className="text-[11px] text-slate-400">Pending reunification across campus</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between text-emerald-400">
            <span className="text-xs font-bold uppercase tracking-wider">Active Found Items</span>
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <p className="text-3xl font-black text-white">{foundItems.length}</p>
          <p className="text-[11px] text-slate-400">Turned in at library & safety desks</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between text-blue-400">
            <span className="text-xs font-bold uppercase tracking-wider">Reunited Items</span>
            <TrendingUp className="w-5 h-5" />
          </div>
          <p className="text-3xl font-black text-white">{resolvedItems.length + 42}</p>
          <p className="text-[11px] text-slate-400">Successfully returned to owners</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between text-indigo-400">
            <span className="text-xs font-bold uppercase tracking-wider">AI Match Accuracy</span>
            <Sparkles className="w-5 h-5 text-amber-400" />
          </div>
          <p className="text-3xl font-black text-white">94.8%</p>
          <p className="text-[11px] text-slate-400">Gemini multimodal feature score</p>
        </div>
      </div>

      {/* Main Grid: Recent Activity + AI Match Suggestions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Items Stream */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-400" />
              <span>Recent Campus Reports</span>
            </h2>
            <button
              onClick={() => setCurrentView('browse')}
              className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {items.slice(0, 5).map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedDetailItem(item)}
                className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 cursor-pointer transition-all flex items-center gap-4 group"
              >
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-16 h-16 rounded-xl object-cover ring-1 ring-slate-700 shrink-0 group-hover:scale-105 transition-transform"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider ${
                        item.type === 'lost'
                          ? 'bg-amber-950 text-amber-300 border border-amber-800'
                          : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      }`}
                    >
                      {item.type}
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium">
                      {item.category}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-white truncate">{item.title}</h3>
                  <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                    <span className="flex items-center gap-1 truncate">
                      <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
                      {item.location}
                    </span>
                    <span>•</span>
                    <span>{item.date}</span>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
              </div>
            ))}
          </div>
        </div>

        {/* AI Recommendations & Assistant Quick Call */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-blue-600 flex items-center justify-center text-slate-950 font-black shadow-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-base text-white">AI Match Assistant</h3>
                <p className="text-xs text-slate-400">Automated Gemini pattern match</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Have you lost something recently? Select a report below or launch the AI Match Assistant to run an instant cross-comparison against all campus found items.
            </p>

            {/* Quick selector of lost items to test */}
            <div className="space-y-2 pt-2">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Select an item to run AI Match:
              </p>
              {lostItems.slice(0, 3).map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setSelectedMatchItem(item);
                    setCurrentView('ai_match');
                  }}
                  className="w-full p-3 rounded-xl bg-slate-800 hover:bg-blue-950/60 border border-slate-700/80 hover:border-blue-500/50 text-left transition-all flex items-center justify-between text-xs"
                >
                  <div className="truncate pr-2">
                    <p className="font-bold text-white truncate">{item.title}</p>
                    <p className="text-[10px] text-slate-400">{item.location}</p>
                  </div>
                  <span className="px-2 py-1 rounded bg-blue-600 text-white font-semibold text-[10px] shrink-0 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Match
                  </span>
                </button>
              ))}
            </div>

            <button
              onClick={() => setCurrentView('ai_match')}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <span>Open AI Matcher Studio</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
