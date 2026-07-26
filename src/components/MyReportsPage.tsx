import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Item } from '../types';
import {
  CheckCircle2,
  Edit,
  Trash2,
  MapPin,
  Calendar,
  AlertCircle,
  PlusCircle,
  Sparkles,
  Save,
  X,
  Eye,
} from 'lucide-react';

export const MyReportsPage: React.FC = () => {
  const {
    items,
    currentUser,
    updateItem,
    deleteItem,
    markAsResolved,
    setCurrentView,
    setSelectedDetailItem,
    setSelectedMatchItem,
  } = useApp();

  const userItems = currentUser
    ? items.filter((i) => i.userId === currentUser.uid)
    : [];

  // Edit Modal State
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editLocation, setEditLocation] = useState('');

  const handleStartEdit = (item: Item) => {
    setEditingItem(item);
    setEditTitle(item.title);
    setEditDescription(item.description);
    setEditLocation(item.location);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem && editTitle && editDescription) {
      updateItem(editingItem.id, {
        title: editTitle,
        description: editDescription,
        location: editLocation,
      });
      setEditingItem(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">My Campus Reports</h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage your submitted lost and found reports, edit descriptions, run AI matches, or mark items as reunited.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentView('report_lost')}
            className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4" />
            <span>New Lost Report</span>
          </button>
          <button
            onClick={() => setCurrentView('report_found')}
            className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4" />
            <span>New Found Report</span>
          </button>
        </div>
      </div>

      {/* Reports List */}
      {userItems.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-lg font-bold text-white">No Reports Created Yet</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            You haven't submitted any lost or found item reports under this account.
          </p>
          <div className="flex justify-center gap-3 pt-2">
            <button
              onClick={() => setCurrentView('report_lost')}
              className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs"
            >
              Report Lost Item
            </button>
            <button
              onClick={() => setCurrentView('report_found')}
              className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs"
            >
              Report Found Item
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {userItems.map((item) => (
            <div
              key={item.id}
              className={`bg-slate-900 border rounded-3xl p-5 sm:p-6 shadow-xl transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 ${
                item.status === 'resolved'
                  ? 'border-slate-800 opacity-80 bg-slate-950/60'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-start gap-4 flex-1 min-w-0">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-20 h-20 rounded-2xl object-cover ring-1 ring-slate-700 shrink-0"
                />

                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider ${
                        item.type === 'lost'
                          ? 'bg-amber-950 text-amber-300 border border-amber-800'
                          : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      }`}
                    >
                      {item.type}
                    </span>

                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-semibold">
                      {item.category}
                    </span>

                    {item.status === 'resolved' ? (
                      <span className="px-2.5 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800 text-[10px] font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-blue-400" /> Resolved & Reunited
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded bg-amber-950/60 text-amber-400 border border-amber-800/80 text-[10px] font-semibold">
                        Active Listing
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-base text-white truncate">{item.title}</h3>
                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-1">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-blue-400" />
                      {item.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-blue-400" />
                      {item.date}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex sm:flex-col flex-wrap items-end justify-end gap-2 shrink-0 w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-800">
                {item.status !== 'resolved' && (
                  <button
                    onClick={() => markAsResolved(item.id)}
                    className="w-full sm:w-auto px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Mark Reunited 🎉</span>
                  </button>
                )}

                <button
                  onClick={() => {
                    setSelectedMatchItem(item);
                    setCurrentView('ai_match');
                  }}
                  className="w-full sm:w-auto px-3.5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>Run AI Match</span>
                </button>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  <button
                    onClick={() => handleStartEdit(item)}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                    title="Edit Report"
                  >
                    <Edit className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => deleteItem(item.id)}
                    className="p-2 rounded-xl bg-rose-950/60 hover:bg-rose-900 text-rose-300 transition-colors"
                    title="Delete Report"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Item Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-5 animate-slide-up text-slate-100">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="font-bold text-lg text-white">Edit Report Details</h3>
              <button
                onClick={() => setEditingItem(null)}
                className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Item Title
                </label>
                <input
                  type="text"
                  required
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  required
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full p-3.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Campus Location
                </label>
                <input
                  type="text"
                  required
                  value={editLocation}
                  onChange={(e) => setEditLocation(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
                />
              </div>

              <div className="pt-3 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
