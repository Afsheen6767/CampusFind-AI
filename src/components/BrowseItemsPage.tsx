import React from 'react';
import { useApp } from '../context/AppContext';
import { Item, ItemCategory } from '../types';
import { CAMPUS_LOCATIONS, ITEM_CATEGORIES } from '../data/mockData';
import {
  Search,
  Filter,
  MapPin,
  Calendar,
  Sparkles,
  ArrowUpDown,
  Tag,
  CheckCircle2,
  AlertCircle,
  Eye,
  XCircle,
} from 'lucide-react';

export const BrowseItemsPage: React.FC = () => {
  const {
    items,
    filters,
    setFilters,
    setSelectedDetailItem,
    setSelectedMatchItem,
    setCurrentView,
  } = useApp();

  // Apply filters
  const filteredItems = items.filter((item) => {
    // Type tab filter
    if (filters.type === 'lost' && item.type !== 'lost') return false;
    if (filters.type === 'found' && item.type !== 'found') return false;

    // Status filter
    if (filters.status === 'active' && item.status !== 'active') return false;
    if (filters.status === 'resolved' && item.status !== 'resolved') return false;

    // Category filter
    if (filters.category && item.category !== filters.category) return false;

    // Location filter
    if (filters.location && !item.location.toLowerCase().includes(filters.location.toLowerCase()))
      return false;

    // Search query
    if (filters.searchQuery) {
      const q = filters.searchQuery.toLowerCase();
      const haystack = `${item.title} ${item.description} ${item.location} ${item.category} ${
        item.color || ''
      } ${item.brand || ''} ${item.uniqueIdentifiers?.join(' ') || ''}`.toLowerCase();
      if (!haystack.includes(q)) return false;
    }

    return true;
  });

  // Sort items
  const sortedItems = [...filteredItems].sort((a, b) => {
    if (filters.sortBy === 'newest') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    if (filters.sortBy === 'oldest') {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    }
    return a.location.localeCompare(b.location);
  });

  const activeLostCount = items.filter((i) => i.type === 'lost' && i.status === 'active').length;
  const activeFoundCount = items.filter((i) => i.type === 'found' && i.status === 'active').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Browse Campus Items</h1>
          <p className="text-xs text-slate-400 mt-1">
            Explore lost belongings and turned-in items across all university hubs.
          </p>
        </div>

        {/* Type Tabs */}
        <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 p-1 rounded-2xl w-fit">
          <button
            onClick={() => setFilters({ ...filters, type: 'all' })}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              filters.type === 'all'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            All Items ({items.length})
          </button>
          <button
            onClick={() => setFilters({ ...filters, type: 'lost' })}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
              filters.type === 'lost'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>Lost Items</span>
            <span className="px-1.5 py-0.2 bg-amber-950 text-amber-300 rounded text-[10px]">
              {activeLostCount}
            </span>
          </button>
          <button
            onClick={() => setFilters({ ...filters, type: 'found' })}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
              filters.type === 'found'
                ? 'bg-emerald-600 text-white font-bold shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>Found Items</span>
            <span className="px-1.5 py-0.2 bg-emerald-950 text-emerald-300 rounded text-[10px]">
              {activeFoundCount}
            </span>
          </button>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Search bar */}
          <div className="md:col-span-5 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={filters.searchQuery}
              onChange={(e) => setFilters({ ...filters, searchQuery: e.target.value })}
              placeholder="Search by title, description, color, brand, stickers..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
            {filters.searchQuery && (
              <button
                onClick={() => setFilters({ ...filters, searchQuery: '' })}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-white text-xs"
              >
                Clear
              </button>
            )}
          </div>

          {/* Category Filter */}
          <div className="md:col-span-3">
            <select
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-blue-500"
            >
              <option value="">All Categories</option>
              {ITEM_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Location Filter */}
          <div className="md:col-span-2">
            <select
              value={filters.location}
              onChange={(e) => setFilters({ ...filters, location: e.target.value })}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-blue-500"
            >
              <option value="">All Locations</option>
              {CAMPUS_LOCATIONS.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div className="md:col-span-2">
            <select
              value={filters.sortBy}
              onChange={(e) =>
                setFilters({ ...filters, sortBy: e.target.value as 'newest' | 'oldest' | 'location' })
              }
              className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="location">By Location</option>
            </select>
          </div>
        </div>

        {/* Quick Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
          <span className="text-slate-400 font-bold shrink-0 mr-1">Category:</span>
          <button
            onClick={() => setFilters({ ...filters, category: '' })}
            className={`px-3 py-1 rounded-lg shrink-0 font-medium ${
              filters.category === ''
                ? 'bg-blue-600 text-white font-bold'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            All
          </button>
          {ITEM_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilters({ ...filters, category: cat })}
              className={`px-3 py-1 rounded-lg shrink-0 font-medium ${
                filters.category === cat
                  ? 'bg-blue-600 text-white font-bold'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Items Cards Grid */}
      {sortedItems.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center space-y-3">
          <AlertCircle className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-lg font-bold text-white">No Matching Campus Items Found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Try resetting your search query or category filters to view all reported items.
          </p>
          <button
            onClick={() =>
              setFilters({
                searchQuery: '',
                category: '',
                location: '',
                color: '',
                type: 'all',
                status: 'all',
                sortBy: 'newest',
              })
            }
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedItems.map((item) => (
            <div
              key={item.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-700 shadow-xl transition-all hover:-translate-y-1 flex flex-col group"
            >
              {/* Card Image */}
              <div className="relative h-48 w-full bg-slate-950 overflow-hidden">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {/* Status Badge */}
                <div className="absolute top-3 left-3 flex items-center gap-1.5">
                  <span
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase tracking-wider shadow-md ${
                      item.type === 'lost'
                        ? 'bg-amber-500 text-slate-950'
                        : 'bg-emerald-600 text-white'
                    }`}
                  >
                    {item.type}
                  </span>

                  {item.status === 'resolved' && (
                    <span className="px-2 py-1 rounded-lg text-[10px] font-extrabold uppercase bg-blue-600 text-white shadow-md flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Reunited
                    </span>
                  )}
                </div>

                {/* Category Badge */}
                <span className="absolute bottom-3 left-3 px-2.5 py-1 rounded-md bg-slate-900/90 backdrop-blur-md text-slate-200 text-[10px] font-semibold border border-slate-700">
                  {item.category}
                </span>
              </div>

              {/* Card Body */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-1.5">
                  <h3 className="font-bold text-sm text-white line-clamp-1 group-hover:text-blue-400 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Tags preview */}
                {item.uniqueIdentifiers && item.uniqueIdentifiers.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {item.uniqueIdentifiers.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded bg-slate-800 text-slate-400 text-[10px] truncate max-w-[120px]"
                      >
                        #{tag}
                      </span>
                    ))}
                    {item.uniqueIdentifiers.length > 2 && (
                      <span className="text-[10px] text-slate-500 font-semibold self-center">
                        +{item.uniqueIdentifiers.length - 2}
                      </span>
                    )}
                  </div>
                )}

                {/* Meta details */}
                <div className="pt-2 border-t border-slate-800/80 text-xs text-slate-400 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1 truncate text-slate-300">
                      <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                      <span className="truncate">{item.location}</span>
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-500" />
                      {item.date}
                    </span>
                    <span>By: {item.userName.split(' ')[0]}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <button
                    onClick={() => setSelectedDetailItem(item)}
                    className="py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Details</span>
                  </button>

                  <button
                    onClick={() => {
                      setSelectedMatchItem(item);
                      setCurrentView('ai_match');
                    }}
                    className="py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold flex items-center justify-center gap-1 shadow-md transition-all"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>AI Match</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
