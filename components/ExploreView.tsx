import React, { useState } from 'react';
import { 
  Search, 
  SlidersHorizontal, 
  Sparkles, 
  RotateCcw, 
  Grid, 
  Layers, 
  Check,
  ChevronDown,
  X,
  MapPin,
  Flame,
  ArrowUpDown,
  Tag
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ProductCard } from './ProductCard';
import { CATEGORIES_DATA, POPULAR_SEARCHES, CITIES_LIST } from '../data/mockData';

export const ExploreView: React.FC = () => {
  const { 
    filteredProducts, 
    filterState, 
    updateFilter, 
    resetFilters, 
    setActiveModal,
    selectedCity,
    setSelectedCity 
  } = useApp();

  const [searchInput, setSearchInput] = useState(filterState.searchQuery || '');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilter({ searchQuery: searchInput.trim() });
  };

  const handleClearSearch = () => {
    setSearchInput('');
    updateFilter({ searchQuery: '' });
  };

  const activeFiltersCount = [
    filterState.searchQuery ? 1 : 0,
    filterState.category !== 'All' ? 1 : 0,
    filterState.listingType !== 'all' ? 1 : 0,
    filterState.city !== 'All Cities' || selectedCity !== 'All Cities' ? 1 : 0,
    filterState.sizes.length,
    filterState.colors.length,
    filterState.fabrics.length,
    filterState.brands.length,
    filterState.conditions.length,
    filterState.maxRentPrice < 25000 ? 1 : 0,
    filterState.availabilityOnly ? 1 : 0
  ].reduce((a, b) => a + b, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6 space-y-6">
      
      {/* Top Header Row with Title & Quick Search Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <span className="text-[#D4AF37] text-xs font-bold uppercase tracking-widest flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            The Haute Couture Collection
          </span>
          <h1 className="text-xl sm:text-3xl font-serif font-light text-white tracking-wide">
            Explore Wedding & Designer Outfits
          </h1>
          <p className="text-xs text-white/50 mt-1">
            Showing <strong className="text-white">{filteredProducts.length}</strong> designer creations available directly from verified sellers across India
          </p>
        </div>

        {/* Global Keyword Search in Explore */}
        <form onSubmit={handleSearchSubmit} className="relative max-w-md w-full">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => {
              setSearchInput(e.target.value);
              updateFilter({ searchQuery: e.target.value });
            }}
            placeholder="Search by lehenga, designer, fabric, city..."
            className="w-full bg-[#111] text-xs sm:text-sm text-white placeholder-white/40 pl-10 pr-10 py-3 rounded-full border border-white/10 focus:outline-none focus:border-[#D4AF37] transition-all"
            id="explore-search-input"
          />
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
          {searchInput && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </form>
      </div>

      {/* Filter & Sort Controls Row */}
      <div className="flex items-center justify-between gap-3 flex-wrap bg-[#111] p-3 rounded-2xl border border-white/5 shadow-md">
        {/* Listing Mode Chips (All / Rent / Buy) */}
        <div className="flex bg-black/60 p-1 rounded-full border border-white/10">
          {(['all', 'rent', 'buy'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => updateFilter({ listingType: mode })}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer ${
                filterState.listingType === mode
                  ? 'bg-[#D4AF37] text-black font-bold shadow-sm'
                  : 'text-white/50 hover:text-white'
              }`}
            >
              {mode === 'all' ? 'All' : mode === 'rent' ? 'Rent' : 'Buy'}
            </button>
          ))}
        </div>

        {/* Quick City Dropdown */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-white/80">
            <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
            <select
              value={selectedCity}
              onChange={(e) => {
                setSelectedCity(e.target.value);
                updateFilter({ city: e.target.value });
              }}
              className="bg-transparent text-xs text-white focus:outline-none cursor-pointer"
            >
              <option value="All Cities" className="bg-[#111] text-white">All India</option>
              {CITIES_LIST.map((c) => (
                <option key={c} value={c} className="bg-[#111] text-white">{c}</option>
              ))}
            </select>
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-white/80">
            <ArrowUpDown className="w-3.5 h-3.5 text-[#D4AF37]" />
            <select
              value={filterState.sortBy}
              onChange={(e) => updateFilter({ sortBy: e.target.value as any })}
              className="bg-transparent text-xs text-white focus:outline-none cursor-pointer"
            >
              <option value="featured" className="bg-[#111] text-white">Featured First</option>
              <option value="newest" className="bg-[#111] text-white">Newly Added</option>
              <option value="price_low" className="bg-[#111] text-white">Price: Low to High</option>
              <option value="price_high" className="bg-[#111] text-white">Price: High to Low</option>
              <option value="rating" className="bg-[#111] text-white">Top Customer Rated</option>
              <option value="discount" className="bg-[#111] text-white">Highest % Discount</option>
              <option value="views" className="bg-[#111] text-white">Most Viewed</option>
              <option value="saved" className="bg-[#111] text-white">Most Wishlisted</option>
            </select>
          </div>

          {/* Detailed Filters Modal Trigger */}
          <button
            onClick={() => setActiveModal('filters')}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#D4AF37] text-black text-xs font-bold hover:brightness-110 transition-all cursor-pointer shadow-sm"
            id="explore-filters-btn"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filters</span>
            {activeFiltersCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-black text-white text-[10px] flex items-center justify-center font-bold">
                {activeFiltersCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Category Horizontal Pills */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
        <button
          onClick={() => updateFilter({ category: 'All' })}
          className={`px-4 py-2 rounded-full text-xs font-medium flex-shrink-0 transition-all cursor-pointer ${
            filterState.category === 'All'
              ? 'border border-[#D4AF37] bg-[#D4AF37]/15 text-[#D4AF37] font-bold'
              : 'border border-white/10 bg-white/5 text-white/70 hover:border-[#D4AF37]/40'
          }`}
        >
          All Categories
        </button>

        {CATEGORIES_DATA.map((c) => (
          <button
            key={c.name}
            onClick={() => updateFilter({ category: c.name })}
            className={`px-4 py-2 rounded-full text-xs font-medium flex-shrink-0 transition-all cursor-pointer flex items-center gap-1.5 ${
              filterState.category === c.name
                ? 'border border-[#D4AF37] bg-[#D4AF37]/15 text-[#D4AF37] font-bold'
                : 'border border-white/10 bg-white/5 text-white/70 hover:border-[#D4AF37]/40'
            }`}
          >
            <span>{c.name}</span>
            <span className="text-[10px] text-white/40">({c.count})</span>
          </button>
        ))}
      </div>

      {/* Active Filter Badges with Quick Dismiss */}
      {activeFiltersCount > 0 && (
        <div className="flex items-center gap-2 flex-wrap text-xs pt-1">
          <span className="text-white/40 flex items-center gap-1">
            <Tag className="w-3.5 h-3.5 text-[#D4AF37]" />
            Active ({activeFiltersCount}):
          </span>

          {filterState.searchQuery && (
            <span className="px-3 py-1 rounded-full bg-[#111] text-white border border-white/10 flex items-center gap-1.5">
              <span>"{filterState.searchQuery}"</span>
              <button onClick={handleClearSearch} className="text-white/50 hover:text-white cursor-pointer">✕</button>
            </span>
          )}

          {filterState.category !== 'All' && (
            <span className="px-3 py-1 rounded-full bg-[#111] text-[#D4AF37] border border-[#D4AF37]/40 flex items-center gap-1.5">
              <span>{filterState.category}</span>
              <button onClick={() => updateFilter({ category: 'All' })} className="text-[#D4AF37]/70 hover:text-[#D4AF37] cursor-pointer">✕</button>
            </span>
          )}

          {(filterState.city !== 'All Cities' || selectedCity !== 'All Cities') && (
            <span className="px-3 py-1 rounded-full bg-[#111] text-[#D4AF37] border border-[#D4AF37]/40 flex items-center gap-1.5">
              <span>City: {selectedCity !== 'All Cities' ? selectedCity : filterState.city}</span>
              <button onClick={() => { setSelectedCity('All Cities'); updateFilter({ city: 'All Cities' }); }} className="text-[#D4AF37]/70 hover:text-[#D4AF37] cursor-pointer">✕</button>
            </span>
          )}

          {filterState.sizes.map((s) => (
            <span key={s} className="px-3 py-1 rounded-full bg-[#111] text-white/80 border border-white/10 flex items-center gap-1">
              <span>Size {s}</span>
              <button onClick={() => updateFilter({ sizes: filterState.sizes.filter((x) => x !== s) })} className="text-white/40 hover:text-white cursor-pointer">✕</button>
            </span>
          ))}

          {filterState.colors.map((c) => (
            <span key={c} className="px-3 py-1 rounded-full bg-[#111] text-white/80 border border-white/10 flex items-center gap-1">
              <span>Color: {c}</span>
              <button onClick={() => updateFilter({ colors: filterState.colors.filter((x) => x !== c) })} className="text-white/40 hover:text-white cursor-pointer">✕</button>
            </span>
          ))}

          {filterState.fabrics.map((f) => (
            <span key={f} className="px-3 py-1 rounded-full bg-[#111] text-white/80 border border-white/10 flex items-center gap-1">
              <span>Fabric: {f}</span>
              <button onClick={() => updateFilter({ fabrics: filterState.fabrics.filter((x) => x !== f) })} className="text-white/40 hover:text-white cursor-pointer">✕</button>
            </span>
          ))}

          {filterState.brands.map((b) => (
            <span key={b} className="px-3 py-1 rounded-full bg-[#111] text-[#D4AF37] border border-[#D4AF37]/30 flex items-center gap-1">
              <span>{b}</span>
              <button onClick={() => updateFilter({ brands: filterState.brands.filter((x) => x !== b) })} className="text-[#D4AF37]/70 hover:text-[#D4AF37] cursor-pointer">✕</button>
            </span>
          ))}

          <button
            onClick={() => {
              setSearchInput('');
              setSelectedCity('All Cities');
              resetFilters();
            }}
            className="text-[#D4AF37] font-semibold hover:underline ml-2 flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            Reset All
          </button>
        </div>
      )}

      {/* Outfits Grid or High-End Empty State */}
      {filteredProducts.length === 0 ? (
        <div className="py-16 text-center rounded-3xl bg-[#111] border border-white/10 p-8 space-y-5 max-w-lg mx-auto shadow-2xl">
          <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-[#D4AF37]">
            <Search className="w-7 h-7" />
          </div>
          <div className="space-y-1.5">
            <h3 className="text-lg font-serif font-bold text-white">No Matching Outfits Found</h3>
            <p className="text-xs text-white/50 leading-relaxed">
              We couldn't find any designer creations matching your active search and filter criteria. Try broadening your keywords or resetting filters.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => {
                setSearchInput('');
                setSelectedCity('All Cities');
                resetFilters();
              }}
              className="w-full sm:w-auto px-6 py-2.5 bg-[#D4AF37] text-black rounded-full text-xs font-bold uppercase tracking-wider cursor-pointer hover:brightness-110"
            >
              Reset All Filters
            </button>
            <button
              onClick={() => {
                setSearchInput('');
                updateFilter({ category: 'Bridal Lehenga', searchQuery: '' });
              }}
              className="w-full sm:w-auto px-6 py-2.5 bg-white/10 text-white rounded-full text-xs font-bold uppercase tracking-wider cursor-pointer hover:bg-white/15"
            >
              Browse Bridal Lehengas
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {filteredProducts.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      )}

    </div>
  );
};
