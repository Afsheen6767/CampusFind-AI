import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Sparkles,
  Search,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  PlusCircle,
  BrainCircuit,
  MapPin,
  Lock,
  Users,
  Compass,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { setCurrentView, items } = useApp();

  const totalLost = items.filter((i) => i.type === 'lost').length;
  const totalFound = items.filter((i) => i.type === 'found').length;
  const resolvedCount = items.filter((i) => i.status === 'resolved').length;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 border-b border-slate-800">
        {/* Glow effect background */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-blue-600/15 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-[300px] h-[300px] bg-amber-500/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-950/80 border border-blue-800/80 text-blue-300 text-xs font-semibold shadow-inner">
                <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                <span>Next-Gen Gemini AI Lost & Found</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.1]">
                Never lose sight of what matters on campus.
              </h1>

              <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
                CampusFind AI uses multimodal artificial intelligence to instantly match lost personal belongings with found items across university libraries, gyms, dorms, and lecture halls.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
                <button
                  onClick={() => setCurrentView('report_lost')}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <PlusCircle className="w-5 h-5" />
                  <span>Report Lost Item</span>
                </button>

                <button
                  onClick={() => setCurrentView('report_found')}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <PlusCircle className="w-5 h-5" />
                  <span>Report Found Item</span>
                </button>

                <button
                  onClick={() => setCurrentView('browse')}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-sm flex items-center justify-center gap-2 transition-all"
                >
                  <Search className="w-4 h-4 text-blue-400" />
                  <span>Browse Campus Items</span>
                </button>
              </div>

              {/* Login / Register Prompts */}
              <div className="pt-4 flex items-center justify-center lg:justify-start gap-4 text-xs text-slate-400">
                <span>New student or staff member?</span>
                <button
                  onClick={() => setCurrentView('register')}
                  className="text-blue-400 hover:text-blue-300 font-semibold underline underline-offset-4"
                >
                  Register Account
                </button>
                <span>•</span>
                <button
                  onClick={() => setCurrentView('login')}
                  className="text-slate-300 hover:text-white font-semibold underline underline-offset-4"
                >
                  Sign In
                </button>
              </div>
            </div>

            {/* Right Interactive AI Preview Mock */}
            <div className="lg:col-span-5">
              <div className="relative bg-slate-800/90 border border-slate-700/80 rounded-2xl p-6 shadow-2xl space-y-5">
                <div className="flex items-center justify-between border-b border-slate-700/80 pb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-rose-500" />
                    <div className="w-3 h-3 rounded-full bg-amber-500" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  </div>
                  <span className="text-[11px] font-mono text-blue-400 bg-blue-950/80 border border-blue-800/80 px-2.5 py-0.5 rounded-md">
                    Gemini 3.6 Match Engine
                  </span>
                </div>

                {/* Simulated Match Comparison */}
                <div className="space-y-3">
                  <div className="p-3.5 rounded-xl bg-slate-900 border border-amber-500/30 flex items-center gap-3">
                    <img
                      src="https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&w=200&q=80"
                      alt="Lost AirPods"
                      className="w-12 h-12 rounded-lg object-cover ring-2 ring-amber-500/50"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
                          Lost Item
                        </span>
                        <span className="text-[10px] text-slate-400">Library</span>
                      </div>
                      <p className="text-xs font-bold text-white truncate">AirPods Pro Gen 2 in Lime Green Case</p>
                      <p className="text-[11px] text-slate-400 truncate">Scratch on right stem, carabiner clip</p>
                    </div>
                  </div>

                  <div className="flex justify-center">
                    <div className="px-3 py-1 bg-gradient-to-r from-amber-500/20 via-blue-500/20 to-emerald-500/20 border border-blue-500/40 rounded-full flex items-center gap-1.5 text-xs font-bold text-blue-300">
                      <BrainCircuit className="w-4 h-4 text-amber-400 animate-spin" />
                      <span>96% AI Similarity Match</span>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-900 border border-emerald-500/30 flex items-center gap-3">
                    <img
                      src="https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=200&q=80"
                      alt="Found AirPods"
                      className="w-12 h-12 rounded-lg object-cover ring-2 ring-emerald-500/50"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                          Found Item
                        </span>
                        <span className="text-[10px] text-slate-400">Science Desk</span>
                      </div>
                      <p className="text-xs font-bold text-white truncate">Green Cased Earbuds</p>
                      <p className="text-[11px] text-slate-400 truncate">Turned in at library 45 mins after lost</p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setCurrentView('ai_match')}
                  className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors"
                >
                  <span>Launch AI Match Assistant</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Live Campus Stats Bar */}
      <section className="bg-slate-950 border-b border-slate-800 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="space-y-1">
              <p className="text-2xl sm:text-3xl font-extrabold text-blue-400">{totalLost + totalFound + 140}</p>
              <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Total Campus Reports</p>
            </div>
            <div className="space-y-1">
              <p className="text-2xl sm:text-3xl font-extrabold text-emerald-400">89%</p>
              <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Reunification Rate</p>
            </div>
            <div className="space-y-1">
              <p className="text-2xl sm:text-3xl font-extrabold text-amber-400">Under 15m</p>
              <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Avg AI Match Time</p>
            </div>
            <div className="space-y-1">
              <p className="text-2xl sm:text-3xl font-extrabold text-indigo-400">12 Campus Hubs</p>
              <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Active Locations</p>
            </div>
          </div>
        </div>
      </section>

      {/* About the App */}
      <section className="py-16 lg:py-24 border-b border-slate-800 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <h2 className="text-xs font-bold text-blue-400 uppercase tracking-widest">About CampusFind AI</h2>
            <p className="text-3xl sm:text-4xl font-extrabold text-white">
              Built specifically for university campus life.
            </p>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Every semester, thousands of water bottles, laptops, keys, and backpacks are forgotten in classrooms or sports facilities. CampusFind AI eliminates manual scrolling by using artificial intelligence to analyze visual features, locations, and time stamps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-6 space-y-3 hover:border-blue-500/50 transition-all">
              <div className="w-12 h-12 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
                <BrainCircuit className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Multimodal Gemini AI</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Upload a photo or detail unique markings (like laptop stickers or scratches) — Gemini analyzes text and visual patterns simultaneously.
              </p>
            </div>

            <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-6 space-y-3 hover:border-blue-500/50 transition-all">
              <div className="w-12 h-12 rounded-xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Campus Location Proximity</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Maps lost items against library floors, student union desks, recreation centers, and lecture halls for precise physical location alignment.
              </p>
            </div>

            <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-6 space-y-3 hover:border-blue-500/50 transition-all">
              <div className="w-12 h-12 rounded-xl bg-amber-600/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Security & Verified Claims</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Connect safely with item finders or campus security officers with verified student ID credentials and owner validation checks.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 lg:py-24 border-b border-slate-800 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
            <h2 className="text-xs font-bold text-amber-400 uppercase tracking-widest">Step-by-Step Workflow</h2>
            <p className="text-3xl sm:text-4xl font-extrabold text-white">How CampusFind AI Works</p>
            <p className="text-xs sm:text-sm text-slate-400">Simple 4-step process to get your belongings back safely.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative">
              <span className="text-3xl font-black text-slate-700 block mb-3">01</span>
              <h4 className="font-bold text-base text-white mb-2">Submit a Report</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Report a lost item or turn in a found item with location, date, photos, and unique features.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative">
              <span className="text-3xl font-black text-blue-800/80 block mb-3">02</span>
              <h4 className="font-bold text-base text-white mb-2">AI Cross-Analysis</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Gemini AI compares item attributes, brand, color, location proximity, and timestamp ranges.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative">
              <span className="text-3xl font-black text-amber-800/80 block mb-3">03</span>
              <h4 className="font-bold text-base text-white mb-2">Review Matches</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                View candidate matches ordered by similarity percentage with clear AI explanation breakdowns.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative">
              <span className="text-3xl font-black text-emerald-800/80 block mb-3">04</span>
              <h4 className="font-bold text-base text-white mb-2">Reunite & Resolve</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Contact the finder or campus security to claim your item and mark the report as resolved!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="py-16 bg-gradient-to-br from-blue-900 via-indigo-950 to-slate-950 relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 text-center space-y-6 relative z-10">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Ready to find your lost item on campus?
          </h2>
          <p className="text-sm sm:text-base text-blue-200 max-w-xl mx-auto">
            Join hundreds of students and faculty members using CampusFind AI today.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => setCurrentView('register')}
              className="px-6 py-3 rounded-xl bg-blue-500 hover:bg-blue-400 text-slate-950 font-bold text-sm shadow-xl"
            >
              Create Student Account
            </button>
            <button
              onClick={() => setCurrentView('browse')}
              className="px-6 py-3 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-white font-semibold text-sm border border-slate-700"
            >
              Explore Lost & Found Items
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
