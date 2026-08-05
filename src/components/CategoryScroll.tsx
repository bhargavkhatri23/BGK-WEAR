import React from 'react';
import { CATEGORIES_DATA } from '../data/mockData';
import { useApp } from '../context/AppContext';
import { OutfitCategory } from '../types';
import { Sparkles, ArrowRight } from 'lucide-react';

export const CategoryScroll: React.FC = () => {
  const { filterState, updateFilter, setActiveTab } = useApp();

  const handleSelectCategory = (catName: string) => {
    if (filterState.category === catName) {
      updateFilter({ category: 'All' });
    } else {
      updateFilter({ category: catName });
      setActiveTab('explore');
    }
  };

  return (
    <section className="my-6 space-y-4">
      {/* Category Pills Row as specified in Sleek Interface Design */}
      <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
        <button
          onClick={() => {
            updateFilter({ category: 'All' });
            setActiveTab('explore');
          }}
          className={`flex-shrink-0 px-6 py-2 rounded-full text-sm font-medium transition-all ${
            filterState.category === 'All'
              ? 'border border-[#D4AF37] bg-[#D4AF37]/10 text-[#D4AF37]'
              : 'border border-white/10 bg-white/5 text-white/70 hover:border-[#D4AF37]/40'
          }`}
        >
          All Collections
        </button>

        {CATEGORIES_DATA.map((cat) => {
          const isSelected = filterState.category === cat.name;
          return (
            <button
              key={cat.name}
              onClick={() => handleSelectCategory(cat.name)}
              className={`flex-shrink-0 px-6 py-2 rounded-full text-sm font-medium transition-all ${
                isSelected
                  ? 'border border-[#D4AF37] bg-[#D4AF37]/10 text-[#D4AF37]'
                  : 'border border-white/10 bg-white/5 text-white/70 hover:border-[#D4AF37]/40'
              }`}
            >
              {cat.name}
            </button>
          );
        })}
      </div>

      {/* Visual Category Cards Carousel */}
      <div className="flex gap-4 overflow-x-auto no-scrollbar py-2">
        {CATEGORIES_DATA.map((cat) => {
          const isSelected = filterState.category === cat.name;

          return (
            <div
              key={cat.name}
              onClick={() => handleSelectCategory(cat.name)}
              className={`flex-shrink-0 w-36 sm:w-44 group cursor-pointer rounded-3xl overflow-hidden border transition-all duration-300 ${
                isSelected 
                  ? 'border-[#D4AF37] ring-1 ring-[#D4AF37]/40 shadow-lg shadow-[#D4AF37]/20 scale-[1.02]' 
                  : 'border-white/5 bg-[#111] hover:border-[#D4AF37]/40'
              }`}
              id={`cat-card-${cat.name.toLowerCase().replace(/\s+/g, '-')}`}
            >
              {/* Category Image with gradient overlay */}
              <div className="relative h-32 sm:h-40 w-full overflow-hidden bg-[#222]">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-transparent to-transparent" />
                <span className="absolute top-2.5 right-2.5 text-[10px] font-bold px-2 py-0.5 rounded-full bg-black/80 text-[#D4AF37] border border-[#D4AF37]/30">
                  {cat.count}+ Outfits
                </span>
              </div>

              {/* Title & info */}
              <div className="p-3.5 bg-[#111]">
                <h4 className="text-xs sm:text-sm font-serif font-bold text-white group-hover:text-[#D4AF37] truncate">
                  {cat.name}
                </h4>
                <p className="text-[10px] text-white/50 truncate mt-0.5 uppercase tracking-wider">
                  Rent & Buy
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
