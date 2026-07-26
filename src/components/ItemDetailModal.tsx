import React from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  MapPin,
  Calendar,
  User,
  Mail,
  Phone,
  Sparkles,
  ShieldCheck,
  Tag,
  CheckCircle2,
  Clock,
  Building,
} from 'lucide-react';

export const ItemDetailModal: React.FC = () => {
  const {
    selectedDetailItem,
    setSelectedDetailItem,
    setSelectedMatchItem,
    setCurrentView,
    markAsResolved,
    currentUser,
  } = useApp();

  if (!selectedDetailItem) return null;

  const item = selectedDetailItem;
  const isOwner = currentUser?.uid === item.userId;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 relative text-slate-100 my-8 animate-slide-up">
        {/* Close Button */}
        <button
          onClick={() => setSelectedDetailItem(null)}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider ${
                item.type === 'lost'
                  ? 'bg-amber-500 text-slate-950'
                  : 'bg-emerald-600 text-white'
              }`}
            >
              {item.type} Item Report
            </span>

            <span className="px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-xs font-semibold">
              {item.category}
            </span>

            {item.status === 'resolved' && (
              <span className="px-3 py-1 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Reunited & Closed
              </span>
            )}
          </div>

          <h2 className="text-2xl font-extrabold text-white pr-8">{item.title}</h2>
        </div>

        {/* Image Display */}
        <div className="w-full h-64 sm:h-72 rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 relative">
          <img
            src={item.imageUrl}
            alt={item.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-3 left-3 px-3 py-1.5 rounded-xl bg-slate-900/90 backdrop-blur-md border border-slate-700 text-xs text-slate-300 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-blue-400" />
            <span>{item.location}</span>
          </div>
        </div>

        {/* Item Metadata */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-850 p-4 rounded-2xl border border-slate-800 text-xs">
          <div>
            <p className="text-[10px] text-slate-400 uppercase font-bold">Primary Color</p>
            <p className="font-semibold text-white mt-0.5">{item.color || 'Unspecified'}</p>
          </div>
          <div>
            <p className="text-[10px] text-slate-400 uppercase font-bold">Brand / Make</p>
            <p className="font-semibold text-white mt-0.5">{item.brand || 'Unspecified'}</p>
          </div>
          <div>
            <p className="text-[10px] text-slate-400 uppercase font-bold">
              {item.type === 'lost' ? 'Date Lost' : 'Date Found'}
            </p>
            <p className="font-semibold text-white mt-0.5">{item.date}</p>
          </div>
          <div>
            <p className="text-[10px] text-slate-400 uppercase font-bold">Approx Time</p>
            <p className="font-semibold text-white mt-0.5">{item.time || '12:00 PM'}</p>
          </div>
        </div>

        {/* Description & Identifiers */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-blue-400 uppercase tracking-wider">
            Detailed Description
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80">
            {item.description}
          </p>

          {item.uniqueIdentifiers && item.uniqueIdentifiers.length > 0 && (
            <div className="space-y-1.5 pt-1">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Unique Identifiers & Markings
              </p>
              <div className="flex flex-wrap gap-1.5">
                {item.uniqueIdentifiers.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 rounded-lg bg-blue-950/80 border border-blue-800 text-blue-300 text-xs font-medium"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Contact & Verification Box */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-blue-400" />
              <span>Finder / Owner Contact Details</span>
            </span>
            <span className="text-[10px] text-blue-400 bg-blue-950 px-2 py-0.5 rounded border border-blue-800">
              Campus ID Verified
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <p className="text-[10px] text-slate-400">Reporter Name</p>
              <p className="font-semibold text-white mt-0.5">{item.userName}</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-400">University Email</p>
              <a
                href={`mailto:${item.contactEmail}`}
                className="font-semibold text-blue-400 hover:underline mt-0.5 block truncate"
              >
                {item.contactEmail}
              </a>
            </div>
            <div>
              <p className="text-[10px] text-slate-400">Phone / Text</p>
              <p className="font-semibold text-white mt-0.5">{item.contactPhone || 'Provided via Email'}</p>
            </div>
          </div>
        </div>

        {/* Actions Footer */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
          {item.status !== 'resolved' && isOwner && (
            <button
              onClick={() => {
                markAsResolved(item.id);
                setSelectedDetailItem(null);
              }}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Mark as Reunited 🎉</span>
            </button>
          )}

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={() => {
                setSelectedMatchItem(item);
                setSelectedDetailItem(null);
                setCurrentView('ai_match');
              }}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Run AI Matcher</span>
            </button>

            <a
              href={`mailto:${item.contactEmail}?subject=CampusFind AI Inquiry regarding: ${encodeURIComponent(item.title)}`}
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-lg"
            >
              <Mail className="w-4 h-4" />
              <span>Send Message</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
