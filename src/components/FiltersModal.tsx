import React from 'react';
import { X, RotateCcw, Check, SlidersHorizontal, Sparkles, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CATEGORIES_DATA, BRANDS_LIST, CITIES_LIST, COLORS_LIST, FABRICS_LIST } from '../data/mockData';

const SIZES_OPTIONS = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Free Size', 'Custom Fit'];
const CONDITIONS_OPTIONS = ['Brand New', 'Like New (Worn Once)', 'Gently Used', 'Vintage Mint'];

export const FiltersModal: React.FC = () => {
  const { activeModal, setActiveModal, filterState, updateFilter, resetFilters, filteredProducts } = useApp();

  if (activeModal !== 'filters') return null;

  const handleToggleSize = (s: string) => {
    const exists = filterState.sizes.includes(s);
    if (exists) {
      updateFilter({ sizes: filterState.sizes.filter((x) => x !== s) });
    } else {
      updateFilter({ sizes: [...filterState.sizes, s] });
    }
  };

  const handleToggleColor = (colorName: string) => {
    const exists = filterState.colors?.includes(colorName);
    if (exists) {
      updateFilter({ colors: filterState.colors.filter((c) => c !== colorName) });
    } else {
      updateFilter({ colors: [...(filterState.colors || []), colorName] });
    }
  };

  const handleToggleFabric = (fabricName: string) => {
    const exists = filterState.fabrics?.includes(fabricName);
    if (exists) {
      updateFilter({ fabrics: filterState.fabrics.filter((f) => f !== fabricName) });
    } else {
      updateFilter({ fabrics: [...(filterState.fabrics || []), fabricName] });
    }
  };

  const handleToggleBrand = (b: string) => {
    const exists = filterState.brands.includes(b);
    if (exists) {
      updateFilter({ brands: filterState.brands.filter((x) => x !== b) });
    } else {
      updateFilter({ brands: [...filterState.brands, b] });
    }
  };

  const handleToggleCondition = (c: string) => {
    const exists = filterState.conditions.includes(c);
    if (exists) {
      updateFilter({ conditions: filterState.conditions.filter((x) => x !== c) });
    } else {
      updateFilter({ conditions: [...filterState.conditions, c] });
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-xl flex justify-center p-2 sm:p-4 lg:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#0a0a0a] rounded-3xl border border-white/10 shadow-2xl overflow-hidden my-auto flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 bg-[#111] border-b border-white/5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37]">
              <SlidersHorizontal className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-serif font-light text-white">Filter & Refine Outfits</h3>
              <p className="text-[11px] text-white/40">{filteredProducts.length} outfits match your criteria</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={resetFilters}
              className="text-xs text-white/60 hover:text-white flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-white/10 bg-white/5 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset All</span>
            </button>
            <button
              onClick={() => setActiveModal(null)}
              className="p-2 rounded-full bg-white/5 text-white/50 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filters Body */}
        <div className="overflow-y-auto p-6 sm:p-8 space-y-6 no-scrollbar">
          
          {/* Listing Type: All / Rent / Buy */}
          <div>
            <label className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider block mb-2.5">
              Listing Mode
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'all', label: 'All (Rent & Buy)' },
                { id: 'rent', label: 'Rent Only' },
                { id: 'buy', label: 'Buy Only' }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => updateFilter({ listingType: item.id as any })}
                  className={`py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                    filterState.listingType === item.id
                      ? 'border border-[#D4AF37] bg-[#D4AF37]/10 text-[#D4AF37]'
                      : 'border border-white/10 bg-white/5 text-white/60 hover:text-white'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Instant Availability Toggle */}
          <div className="p-4 rounded-2xl bg-[#111] border border-white/5 flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="text-xs font-bold text-white flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Instant Booking Available</span>
              </div>
              <p className="text-[11px] text-white/50">Show only outfits ready for immediate rental request / handover</p>
            </div>
            <button
              onClick={() => updateFilter({ availabilityOnly: !filterState.availabilityOnly })}
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                filterState.availabilityOnly ? 'bg-emerald-500' : 'bg-white/10'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                  filterState.availabilityOnly ? 'left-6' : 'left-1'
                }`}
              />
            </button>
          </div>

          {/* City */}
          <div>
            <label className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider block mb-2">
              City / Region
            </label>
            <select
              value={filterState.city}
              onChange={(e) => updateFilter({ city: e.target.value })}
              className="w-full bg-[#111] border border-white/10 rounded-xl p-3 text-xs text-white focus:border-[#D4AF37] focus:outline-none"
            >
              <option value="All Cities" className="bg-[#111] text-white">All India (All Cities)</option>
              {CITIES_LIST.map((c) => (
                <option key={c} value={c} className="bg-[#111] text-white">{c}</option>
              ))}
            </select>
          </div>

          {/* Category */}
          <div>
            <label className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider block mb-2.5">
              Category
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => updateFilter({ category: 'All' })}
                className={`px-3.5 py-1.5 rounded-full text-xs transition-colors cursor-pointer ${
                  filterState.category === 'All'
                    ? 'border border-[#D4AF37] bg-[#D4AF37]/10 text-[#D4AF37] font-bold'
                    : 'border border-white/10 bg-white/5 text-white/60 hover:text-white'
                }`}
              >
                All Categories
              </button>
              {CATEGORIES_DATA.map((cat) => (
                <button
                  key={cat.name}
                  onClick={() => updateFilter({ category: cat.name })}
                  className={`px-3.5 py-1.5 rounded-full text-xs transition-colors cursor-pointer ${
                    filterState.category === cat.name
                      ? 'border border-[#D4AF37] bg-[#D4AF37]/10 text-[#D4AF37] font-bold'
                      : 'border border-white/10 bg-white/5 text-white/60 hover:text-white'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Rent Price Range */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider">
                Max Daily Rent Price:
              </label>
              <span className="text-sm font-serif font-bold text-white">₹{filterState.maxRentPrice.toLocaleString('en-IN')}/day</span>
            </div>
            <input
              type="range"
              min="500"
              max="25000"
              step="500"
              value={filterState.maxRentPrice}
              onChange={(e) => updateFilter({ maxRentPrice: Number(e.target.value) })}
              className="w-full accent-[#D4AF37]"
            />
            <div className="flex justify-between text-[10px] text-white/40 mt-1">
              <span>₹500</span>
              <span>₹12,500</span>
              <span>₹25,000+</span>
            </div>
          </div>

          {/* Color Palettes */}
          <div>
            <label className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider block mb-2.5">
              Colors & Royal Palettes
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {COLORS_LIST.map((col) => {
                const selected = filterState.colors?.includes(col.name);
                return (
                  <button
                    key={col.name}
                    onClick={() => handleToggleColor(col.name)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs transition-all cursor-pointer ${
                      selected
                        ? 'border border-[#D4AF37] bg-[#D4AF37]/15 text-white font-medium'
                        : 'border border-white/10 bg-white/5 text-white/70 hover:text-white'
                    }`}
                  >
                    <span 
                      className="w-3.5 h-3.5 rounded-full border border-white/20 flex-shrink-0" 
                      style={{ backgroundColor: col.hex }} 
                    />
                    <span className="truncate">{col.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Fabrics */}
          <div>
            <label className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider block mb-2.5">
              Fabric & Weave
            </label>
            <div className="flex flex-wrap gap-2">
              {FABRICS_LIST.map((fabric) => {
                const selected = filterState.fabrics?.includes(fabric);
                return (
                  <button
                    key={fabric}
                    onClick={() => handleToggleFabric(fabric)}
                    className={`px-3.5 py-1.5 rounded-full text-xs transition-colors cursor-pointer ${
                      selected
                        ? 'border border-[#D4AF37] bg-[#D4AF37]/10 text-[#D4AF37] font-bold'
                        : 'border border-white/10 bg-white/5 text-white/60 hover:text-white'
                    }`}
                  >
                    {fabric}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sizes */}
          <div>
            <label className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider block mb-2.5">
              Sizes
            </label>
            <div className="flex flex-wrap gap-2">
              {SIZES_OPTIONS.map((sz) => {
                const selected = filterState.sizes.includes(sz);
                return (
                  <button
                    key={sz}
                    onClick={() => handleToggleSize(sz)}
                    className={`px-3.5 py-1.5 rounded-full text-xs transition-colors cursor-pointer ${
                      selected
                        ? 'border border-[#D4AF37] bg-[#D4AF37]/10 text-[#D4AF37] font-bold'
                        : 'border border-white/10 bg-white/5 text-white/60 hover:text-white'
                    }`}
                  >
                    {sz}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Designer Brands */}
          <div>
            <label className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider block mb-2.5">
              Designer & Brand Houses
            </label>
            <div className="flex flex-wrap gap-2">
              {BRANDS_LIST.map((b) => {
                const selected = filterState.brands.includes(b);
                return (
                  <button
                    key={b}
                    onClick={() => handleToggleBrand(b)}
                    className={`px-3.5 py-1.5 rounded-full text-xs transition-colors cursor-pointer ${
                      selected
                        ? 'border border-[#D4AF37] bg-[#D4AF37]/10 text-[#D4AF37] font-bold'
                        : 'border border-white/10 bg-white/5 text-white/60 hover:text-white'
                    }`}
                  >
                    {b}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Condition */}
          <div>
            <label className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider block mb-2.5">
              Garment Condition
            </label>
            <div className="flex flex-wrap gap-2">
              {CONDITIONS_OPTIONS.map((c) => {
                const selected = filterState.conditions.includes(c);
                return (
                  <button
                    key={c}
                    onClick={() => handleToggleCondition(c)}
                    className={`px-3.5 py-1.5 rounded-full text-xs transition-colors cursor-pointer ${
                      selected
                        ? 'border border-[#D4AF37] bg-[#D4AF37]/10 text-[#D4AF37] font-bold'
                        : 'border border-white/10 bg-white/5 text-white/60 hover:text-white'
                    }`}
                  >
                    {c}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sort By */}
          <div>
            <label className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider block mb-2">
              Sort By
            </label>
            <select
              value={filterState.sortBy}
              onChange={(e) => updateFilter({ sortBy: e.target.value as any })}
              className="w-full bg-[#111] border border-white/10 rounded-xl p-3 text-xs text-white focus:border-[#D4AF37] focus:outline-none cursor-pointer"
            >
              <option value="featured" className="bg-[#111] text-white">Featured & Curated</option>
              <option value="newest" className="bg-[#111] text-white">Newly Added Outfits</option>
              <option value="price_low" className="bg-[#111] text-white">Rent Price: Low to High</option>
              <option value="price_high" className="bg-[#111] text-white">Rent Price: High to Low</option>
              <option value="rating" className="bg-[#111] text-white">Top Customer Rated</option>
              <option value="discount" className="bg-[#111] text-white">Highest Retail Discount</option>
              <option value="views" className="bg-[#111] text-white">Most Viewed</option>
              <option value="saved" className="bg-[#111] text-white">Most Wishlisted</option>
            </select>
          </div>

        </div>

        {/* Footer Apply Button */}
        <div className="p-5 bg-[#111] border-t border-white/5 flex gap-3">
          <button
            onClick={() => setActiveModal(null)}
            className="w-full py-3.5 rounded-full bg-[#D4AF37] text-black font-bold uppercase tracking-wider text-xs hover:brightness-110 shadow-lg cursor-pointer flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Show {filteredProducts.length} Matching Outfits</span>
          </button>
        </div>

      </div>
    </div>
  );
};
