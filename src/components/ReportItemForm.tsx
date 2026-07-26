import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ItemCategory, ItemType } from '../types';
import { CAMPUS_LOCATIONS, ITEM_CATEGORIES } from '../data/mockData';
import { generateSmartDescription } from '../services/api';
import {
  PlusCircle,
  Sparkles,
  Upload,
  Image as ImageIcon,
  Tag,
  MapPin,
  Calendar,
  User,
  Mail,
  Phone,
  CheckCircle2,
  ArrowRight,
  Info,
  X,
  Loader2,
} from 'lucide-react';

export const ReportItemForm: React.FC<{ type: ItemType }> = ({ type }) => {
  const { addItem, currentUser, setCurrentView, setSelectedMatchItem } = useApp();

  const isLost = type === 'lost';

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ItemCategory>('Electronics');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('');
  const [brand, setBrand] = useState('');
  const [location, setLocation] = useState(CAMPUS_LOCATIONS[0]);
  const [customLocation, setCustomLocation] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('14:00');

  // Contact Info
  const [contactName, setContactName] = useState(currentUser?.name || '');
  const [contactEmail, setContactEmail] = useState(currentUser?.email || '');
  const [contactPhone, setContactPhone] = useState(currentUser?.phone || '(555) 019-1234');

  // Identifiers Tags
  const [tagInput, setTagInput] = useState('');
  const [uniqueIdentifiers, setUniqueIdentifiers] = useState<string[]>([]);

  // Image Upload
  const [imageUrl, setImageUrl] = useState(
    isLost
      ? 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80'
      : 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80'
  );
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // AI Enhancer & Submitting states
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleAddTag = () => {
    if (tagInput.trim() && !uniqueIdentifiers.includes(tagInput.trim())) {
      setUniqueIdentifiers([...uniqueIdentifiers, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setUniqueIdentifiers(uniqueIdentifiers.filter((t) => t !== tag));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImageUrl(result);
        setImagePreview(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAIEnhance = async () => {
    if (!title) return;
    setIsEnhancing(true);
    try {
      const result = await generateSmartDescription({
        title,
        category,
        rawText: description,
        imageBase64: imagePreview || undefined,
      });

      if (result.enhancedDescription) {
        setDescription(result.enhancedDescription);
      }
      if (result.suggestedColor && !color) {
        setColor(result.suggestedColor);
      }
      if (result.suggestedBrand && !brand) {
        setBrand(result.suggestedBrand);
      }
      if (result.suggestedIdentifiers && result.suggestedIdentifiers.length > 0) {
        const merged = Array.from(new Set([...uniqueIdentifiers, ...result.suggestedIdentifiers]));
        setUniqueIdentifiers(merged);
      }
    } catch (e) {
      console.error('Enhance failed:', e);
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const finalLocation = location === 'Other / Custom Location' ? customLocation : location;

      const imageSourceToUpload = selectedFile || imageUrl;

      const newItem = await addItem(
        {
          type,
          title,
          category,
          description,
          color: color || undefined,
          brand: brand || undefined,
          location: finalLocation || 'Main Campus',
          date,
          time,
          contactName,
          contactEmail,
          contactPhone,
          imageUrl,
          uniqueIdentifiers: uniqueIdentifiers.length > 0 ? uniqueIdentifiers : undefined,
        },
        imageSourceToUpload
      );

      if (type === 'lost') {
        setSelectedMatchItem(newItem);
        setCurrentView('ai_match');
      } else {
        setCurrentView('browse');
      }
    } catch (err) {
      console.error('Failed to publish report:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Sample quick image presets
  const sampleImages = isLost
    ? [
        { label: 'AirPods/Earbuds', url: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&w=800&q=80' },
        { label: 'Water Bottle', url: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=800&q=80' },
        { label: 'Laptop/Tablet', url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80' },
        { label: 'Keys/Fob', url: 'https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&w=800&q=80' },
      ]
    : [
        { label: 'Found Earbuds', url: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80' },
        { label: 'Found Wallet', url: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=80' },
        { label: 'Found Watch', url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80' },
        { label: 'Found Glasses', url: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=800&q=80' },
      ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl text-slate-100">
        {/* Header */}
        <div className="flex items-center gap-3 border-b border-slate-800 pb-6 mb-8">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold shadow-lg ${
              isLost
                ? 'bg-amber-500/20 border border-amber-500/40 text-amber-400'
                : 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-400'
            }`}
          >
            <PlusCircle className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold text-white">
                {isLost ? 'Report Lost Item' : 'Report Found Item'}
              </h1>
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                  isLost
                    ? 'bg-amber-950 text-amber-300 border border-amber-800'
                    : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                }`}
              >
                {type}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {isLost
                ? 'Detail what you lost on campus so Gemini AI can cross-match with reported found items.'
                : 'Turn in or report an item found on campus to help return it to its rightful owner.'}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Section 1: Item Basic Details */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-blue-400 uppercase tracking-wider flex items-center gap-2">
              <Tag className="w-4 h-4" />
              <span>Item Identification</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
              <div className="sm:col-span-8">
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Item Name / Title <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={
                    isLost
                      ? 'e.g. AirPods Pro Gen 2 in Lime Green Case'
                      : 'e.g. Green Cased Wireless Earbuds'
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="sm:col-span-4">
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Category <span className="text-rose-400">*</span>
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as ItemCategory)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-blue-500"
                >
                  {ITEM_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Description with Gemini AI Enhancer */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-300">
                  Detailed Description <span className="text-rose-400">*</span>
                </label>
                <button
                  type="button"
                  onClick={handleAIEnhance}
                  disabled={!title || isEnhancing}
                  className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-[11px] font-bold flex items-center gap-1.5 transition-all disabled:opacity-50"
                >
                  {isEnhancing ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  )}
                  <span>✨ AI Enhance Description</span>
                </button>
              </div>

              <textarea
                required
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe condition, exact features, circumstances, scratches, sticker details, battery state..."
                className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 leading-relaxed"
              />
            </div>

            {/* Color, Brand, Unique Identifiers */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Primary Color
                </label>
                <input
                  type="text"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  placeholder="e.g. Navy Blue / Silver"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Brand / Manufacturer
                </label>
                <input
                  type="text"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  placeholder="e.g. Apple, Sony, Hydro Flask, Fossil"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* Unique Identifiers Tags */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Unique Identifiers / Markings (e.g., stickers, scratches, custom initials)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                  placeholder="Type identifier & press Enter (e.g., 'Octocat sticker')"
                  className="flex-1 px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="px-3.5 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-xs font-semibold text-white"
                >
                  Add Tag
                </button>
              </div>

              {uniqueIdentifiers.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {uniqueIdentifiers.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-950/80 border border-blue-800 text-blue-300 text-xs font-medium"
                    >
                      <span>{tag}</span>
                      <button type="button" onClick={() => handleRemoveTag(tag)}>
                        <X className="w-3 h-3 hover:text-white" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Section 2: Location & Time */}
          <div className="space-y-4 pt-4 border-t border-slate-800">
            <h3 className="text-xs font-bold text-blue-400 uppercase tracking-wider flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>Campus Location & Time</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
              <div className="sm:col-span-6">
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Campus Landmark / Hall <span className="text-rose-400">*</span>
                </label>
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-blue-500"
                >
                  {CAMPUS_LOCATIONS.map((loc) => (
                    <option key={loc} value={loc}>
                      {loc}
                    </option>
                  ))}
                  <option value="Other / Custom Location">Other / Custom Location</option>
                </select>
              </div>

              {location === 'Other / Custom Location' && (
                <div className="sm:col-span-6">
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Custom Campus Location Detail
                  </label>
                  <input
                    type="text"
                    required
                    value={customLocation}
                    onChange={(e) => setCustomLocation(e.target.value)}
                    placeholder="e.g. Outdoor shuttle stop #3"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
                  />
                </div>
              )}

              <div className="sm:col-span-3">
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {isLost ? 'Date Lost' : 'Date Found'}
                </label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
                />
              </div>

              <div className="sm:col-span-3">
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Approx. Time
                </label>
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Contact Info */}
          <div className="space-y-4 pt-4 border-t border-slate-800">
            <h3 className="text-xs font-bold text-blue-400 uppercase tracking-wider flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>Contact Information</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Full Name <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  University Email <span className="text-rose-400">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Phone / Text Contact
                </label>
                <input
                  type="text"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  placeholder="(555) 019-5678"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Image Attachment */}
          <div className="space-y-4 pt-4 border-t border-slate-800">
            <h3 className="text-xs font-bold text-blue-400 uppercase tracking-wider flex items-center gap-2">
              <ImageIcon className="w-4 h-4" />
              <span>Item Photo Upload (Optional)</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
              <div className="sm:col-span-7 space-y-3">
                <label className="block border-2 border-dashed border-slate-700 hover:border-blue-500/80 rounded-2xl p-6 text-center cursor-pointer transition-colors bg-slate-850">
                  <Upload className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                  <p className="text-xs font-bold text-white">Click or drag photo here (Optional)</p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Upload clear photo for AI visual matching (JPG, PNG) or skip to use default
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>

                {/* Preset quick samples */}
                <div>
                  <p className="text-[11px] font-semibold text-slate-400 mb-1.5">
                    Or select sample photo:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {sampleImages.map((s) => (
                      <button
                        key={s.label}
                        type="button"
                        onClick={() => setImageUrl(s.url)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-all ${
                          imageUrl === s.url
                            ? 'bg-blue-600 text-white border-blue-500 font-bold'
                            : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                        }`}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Photo Preview */}
              <div className="sm:col-span-5 flex flex-col items-center justify-center">
                <div className="w-full h-44 rounded-2xl overflow-hidden border border-slate-700 bg-slate-950 relative shadow-inner">
                  <img
                    src={imageUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-slate-900/80 text-[10px] text-slate-300 font-mono">
                    Photo Attached
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-slate-400 flex items-center gap-1.5">
              <Info className="w-4 h-4 text-blue-400 shrink-0" />
              <span>Report will be listed immediately and prepared for Gemini AI matching.</span>
            </p>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-sm shadow-xl flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 ${
                isLost
                  ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/20'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/20'
              }`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving Report to Firestore...</span>
                </>
              ) : (
                <>
                  <span>{isLost ? 'Submit Lost Item & Run AI Match' : 'Publish Found Item Report'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
