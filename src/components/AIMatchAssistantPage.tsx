import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Item, AIMatchCandidate } from '../types';
import { matchItemWithAI } from '../services/api';
import {
  Sparkles,
  BrainCircuit,
  MapPin,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowRight,
  ShieldCheck,
  Tag,
  Mail,
  Phone,
  RefreshCw,
  Info,
} from 'lucide-react';

export const AIMatchAssistantPage: React.FC = () => {
  const {
    items,
    selectedMatchItem,
    setSelectedMatchItem,
    setSelectedDetailItem,
    setCurrentView,
  } = useApp();

  // All active items that can be matched
  const lostItems = items.filter((i) => i.type === 'lost' && i.status === 'active');
  const foundItems = items.filter((i) => i.type === 'found' && i.status === 'active');

  // Currently target item
  const [targetItem, setTargetItem] = useState<Item | null>(() => {
    if (selectedMatchItem) return selectedMatchItem;
    return lostItems[0] || items[0] || null;
  });

  // Candidate items to compare against
  const candidatePool = targetItem
    ? items.filter((i) => i.type !== targetItem.type && i.id !== targetItem.id)
    : [];

  // Match Results
  const [matchResults, setMatchResults] = useState<AIMatchCandidate[]>([]);
  const [isMatching, setIsMatching] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Trigger Gemini AI Matching when targetItem changes
  const runAIMatch = async (item: Item) => {
    const candidates = items.filter((i) => i.type !== item.type && i.id !== item.id);
    if (candidates.length === 0) {
      setMatchResults([]);
      return;
    }

    setIsMatching(true);
    setErrorMsg(null);
    try {
      const matches = await matchItemWithAI(item, candidates);
      setMatchResults(matches);
    } catch (err) {
      console.error('AI match failed:', err);
      setErrorMsg('Could not complete AI match scan.');
    } finally {
      setIsMatching(false);
    }
  };

  useEffect(() => {
    if (targetItem) {
      runAIMatch(targetItem);
    }
  }, [targetItem?.id]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span>Gemini 3.6 Multimodal Neural Matcher</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white">AI Match Assistant</h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
              Select any reported item on campus. Gemini AI cross-analyzes title, category, description, colors, brand, unique markings, timestamps, and campus location proximity to identify potential matches.
            </p>
          </div>

          {targetItem && (
            <button
              onClick={() => runAIMatch(targetItem)}
              disabled={isMatching}
              className="px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg flex items-center gap-2 shrink-0 transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isMatching ? 'animate-spin' : ''}`} />
              <span>Re-run AI Match Analysis</span>
            </button>
          )}
        </div>
      </div>

      {/* Item Selector Tabs */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
          <BrainCircuit className="w-4 h-4 text-blue-400" />
          <span>Step 1: Select Item to Match</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {items.map((item) => {
            const isSelected = targetItem?.id === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setTargetItem(item);
                  setSelectedMatchItem(item);
                }}
                className={`p-3.5 rounded-xl text-left border transition-all flex items-center gap-3 ${
                  isSelected
                    ? 'bg-blue-950/80 border-blue-500 shadow-md ring-2 ring-blue-500/30'
                    : 'bg-slate-800/80 border-slate-700/80 hover:bg-slate-800 text-slate-300'
                }`}
              >
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-12 h-12 rounded-lg object-cover shrink-0 ring-1 ring-slate-700"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span
                      className={`px-1.5 py-0.2 rounded text-[9px] font-bold uppercase tracking-wider ${
                        item.type === 'lost'
                          ? 'bg-amber-950 text-amber-300 border border-amber-800'
                          : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      }`}
                    >
                      {item.type}
                    </span>
                    <span className="text-[10px] text-slate-400 truncate">{item.category}</span>
                  </div>
                  <p className="font-bold text-xs text-white truncate">{item.title}</p>
                  <p className="text-[10px] text-slate-400 truncate">{item.location}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Step 2 & 3: Match Analysis Output */}
      {targetItem && (
        <div className="space-y-6">
          {/* Target Item Overview Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row items-center gap-6">
            <img
              src={targetItem.imageUrl}
              alt={targetItem.title}
              className="w-28 h-28 rounded-2xl object-cover ring-2 ring-blue-500/50 shadow-md shrink-0"
            />
            <div className="flex-1 min-w-0 text-center md:text-left space-y-2">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                    targetItem.type === 'lost'
                      ? 'bg-amber-500 text-slate-950'
                      : 'bg-emerald-600 text-white'
                  }`}
                >
                  Target Item ({targetItem.type})
                </span>
                <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-semibold border border-slate-700">
                  {targetItem.category}
                </span>
              </div>
              <h2 className="text-xl font-bold text-white">{targetItem.title}</h2>
              <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
                {targetItem.description}
              </p>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs text-slate-400 pt-1">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-blue-400" />
                  {targetItem.location}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-blue-400" />
                  {targetItem.date}
                </span>
                {targetItem.color && <span>Color: {targetItem.color}</span>}
                {targetItem.brand && <span>Brand: {targetItem.brand}</span>}
              </div>
            </div>
          </div>

          {/* AI Scanner Header */}
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <span>
                Gemini Match Candidates ({candidatePool.length} {targetItem.type === 'lost' ? 'Found' : 'Lost'} items scanned)
              </span>
            </h2>
            {isMatching && (
              <div className="flex items-center gap-2 text-xs font-semibold text-amber-400">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Comparing multi-modal features...</span>
              </div>
            )}
          </div>

          {/* Results List */}
          {isMatching ? (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center space-y-4">
              <BrainCircuit className="w-12 h-12 text-amber-400 animate-pulse mx-auto" />
              <h3 className="text-lg font-bold text-white">Running Gemini Multimodal Analysis...</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Scanning item color spectra, brand markings, unique identifiers, campus geographic proximity, and date alignment.
              </p>
            </div>
          ) : matchResults.length === 0 ? (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-10 text-center space-y-3">
              <Info className="w-10 h-10 text-slate-500 mx-auto" />
              <h3 className="text-base font-bold text-white">No Potential Matches Identified Yet</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                No active counterpart reports currently share visual or location traits with this item. As new reports are submitted, Gemini will automatically evaluate them!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {matchResults.map((candidate) => {
                const itemObj = items.find((i) => i.id === candidate.itemId);
                if (!itemObj) return null;

                const isHigh = candidate.score >= 80;
                const isMed = candidate.score >= 60 && candidate.score < 80;

                return (
                  <div
                    key={candidate.itemId}
                    className={`bg-slate-900 border rounded-3xl p-6 shadow-xl transition-all space-y-4 ${
                      isHigh
                        ? 'border-emerald-500/60 bg-emerald-950/10'
                        : isMed
                        ? 'border-amber-500/60 bg-amber-950/10'
                        : 'border-slate-800'
                    }`}
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
                      {/* Left Item Details */}
                      <div className="flex items-center gap-4">
                        <img
                          src={itemObj.imageUrl}
                          alt={itemObj.title}
                          className="w-16 h-16 rounded-xl object-cover ring-1 ring-slate-700 shrink-0"
                        />
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                                itemObj.type === 'lost'
                                  ? 'bg-amber-950 text-amber-300'
                                  : 'bg-emerald-950 text-emerald-300'
                              }`}
                            >
                              {itemObj.type}
                            </span>
                            <span className="text-xs text-slate-400">{itemObj.category}</span>
                          </div>
                          <h3 className="text-base font-bold text-white">{itemObj.title}</h3>
                          <div className="flex items-center gap-3 text-xs text-slate-400 mt-0.5">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-blue-400" />
                              {itemObj.location}
                            </span>
                            <span>•</span>
                            <span>{itemObj.date}</span>
                          </div>
                        </div>
                      </div>

                      {/* Right Match Gauge Score */}
                      <div className="flex items-center gap-4 shrink-0">
                        <div className="text-right">
                          <div
                            className={`text-2xl font-black ${
                              isHigh
                                ? 'text-emerald-400'
                                : isMed
                                ? 'text-amber-400'
                                : 'text-slate-400'
                            }`}
                          >
                            {candidate.score}% Match
                          </div>
                          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                            {candidate.confidence}
                          </p>
                        </div>

                        <div className="w-14 h-14 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center p-1">
                          <div
                            className={`w-full h-full rounded-xl flex items-center justify-center font-black text-xs ${
                              isHigh
                                ? 'bg-emerald-600 text-white'
                                : isMed
                                ? 'bg-amber-500 text-slate-950'
                                : 'bg-slate-700 text-slate-300'
                            }`}
                          >
                            {candidate.score}%
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Gemini Reasoning Paragraph */}
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                        <BrainCircuit className="w-4 h-4 text-amber-400" />
                        <span>Gemini AI Reason Breakdown</span>
                      </h4>
                      <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
                        {candidate.reasoning}
                      </p>
                    </div>

                    {/* Key Similarities Tags */}
                    {candidate.keySimilarities && candidate.keySimilarities.length > 0 && (
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[11px] font-semibold text-slate-400">
                          Identified Similarities:
                        </span>
                        {candidate.keySimilarities.map((sim, i) => (
                          <span
                            key={i}
                            className="px-2.5 py-1 rounded-lg bg-blue-950/80 border border-blue-800 text-blue-300 text-xs font-medium"
                          >
                            ✓ {sim}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
                      <div className="text-xs text-slate-400 flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-emerald-400" />
                        <span>Reported by: {itemObj.userName} ({itemObj.contactEmail})</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedDetailItem(itemObj)}
                          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
                        >
                          View Full Details
                        </button>
                        <button
                          onClick={() => setSelectedDetailItem(itemObj)}
                          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md flex items-center gap-1.5"
                        >
                          <Mail className="w-3.5 h-3.5" />
                          <span>Contact / Claim Belonging</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
