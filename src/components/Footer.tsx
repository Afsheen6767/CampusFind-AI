import React from 'react';
import { useApp } from '../context/AppContext';
import { GraduationCap, ShieldCheck, Sparkles, Database, Lock, Mail, Phone, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setCurrentView } = useApp();

  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand info */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="font-bold text-lg text-white">CampusFind AI</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Official university lost and found platform powered by Gemini AI visual & location matching to quickly reconnect students with lost belongings.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-slate-300 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg w-fit">
              <ShieldCheck className="w-4 h-4 text-blue-400" />
              <span>Campus Security Verified</span>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-4">
              Quick Navigation
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => setCurrentView('dashboard')}
                  className="hover:text-blue-400 transition-colors"
                >
                  Student Dashboard
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('report_lost')}
                  className="hover:text-amber-400 transition-colors"
                >
                  Report Lost Item
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('report_found')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Report Found Item
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('browse')}
                  className="hover:text-blue-400 transition-colors"
                >
                  Browse Campus Items
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('ai_match')}
                  className="hover:text-amber-300 font-semibold text-amber-400 flex items-center gap-1"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>AI Match Assistant</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Campus Support & Locations */}
          <div>
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-4">
              Campus Central Office
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <span>Student Union Center, Suite 102, Main Campus Quad</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-blue-400 shrink-0" />
                <span>(555) 019-LOST (5678)</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-400 shrink-0" />
                <span>lostandfound@university.edu</span>
              </li>
            </ul>
          </div>

          {/* Tech Readiness & Firebase / AI status */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-2">
              System Architecture
            </h4>
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 space-y-2 text-xs">
              <div className="flex items-center gap-2 text-amber-400">
                <Sparkles className="w-4 h-4" />
                <span className="font-semibold">Gemini 3.6 Flash</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-snug">
                Multimodal AI cross-references color, brand, location proximity, timestamps & unique identifiers.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 space-y-2 text-xs">
              <div className="flex items-center gap-2 text-blue-400">
                <Database className="w-4 h-4" />
                <span className="font-semibold">Firebase Prepared</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-snug">
                Firestore database, Firebase Auth, and Storage schema definitions initialized.
              </p>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-slate-800/80 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 CampusFind AI — University Student & Safety Services. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-400 cursor-pointer">Campus Terms</span>
            <span className="hover:text-slate-400 cursor-pointer">Safety Guidelines</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
