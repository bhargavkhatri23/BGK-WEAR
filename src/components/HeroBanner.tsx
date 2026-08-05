import React from 'react';
import { 
  Crown, 
  Sparkles, 
  ShieldCheck, 
  Calendar, 
  Tag, 
  ArrowRight, 
  RefreshCw,
  Clock,
  Sparkle
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const HeroBanner: React.FC = () => {
  const { updateFilter, setActiveTab, setActiveModal } = useApp();

  return (
    <div className="relative w-full rounded-3xl overflow-hidden my-4 border border-white/5 shadow-2xl bg-[#1a1a1a] min-h-[380px] sm:min-h-[440px] flex items-center">
      {/* Background with luxury gradient & couture imagery */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1600&q=80"
          alt="Luxury Wedding Couture"
          className="w-full h-full object-cover object-center opacity-30 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent z-10" />
        <div className="absolute inset-0 flex items-center justify-end overflow-hidden pr-8 pointer-events-none opacity-5">
          <div className="text-[120px] font-serif font-black select-none hidden lg:block">COUTURE</div>
        </div>
      </div>

      {/* Foreground Content */}
      <div className="relative z-20 p-6 sm:p-10 lg:p-12 max-w-3xl">
        
        {/* Prestige Tag */}
        <span className="bg-[#D4AF37] text-black px-3 py-1 rounded text-[10px] font-bold uppercase tracking-tighter mb-4 inline-block shadow-sm">
          Premium Collection
        </span>

        {/* Headline */}
        <h1 className="text-3xl sm:text-5xl font-serif font-light mb-3 leading-tight text-white">
          Velvet Zardozi & <br />
          Bridal Masterpieces
        </h1>

        {/* Subtitle */}
        <p className="text-white/60 text-sm max-w-md mb-6 leading-relaxed">
          Experience the epitome of Indian wedding luxury. Sabyasachi, Manish Malhotra & bespoke couture available for rent and purchase with direct seller contact, in-app chat, and zero commission.
        </p>

        {/* Quick CTAs */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-4">
          <button
            onClick={() => {
              updateFilter({ category: 'Bridal Lehenga', listingType: 'rent' });
              setActiveTab('explore');
            }}
            className="px-6 sm:px-8 py-3 bg-[#D4AF37] text-black font-bold rounded-full text-xs sm:text-sm hover:brightness-110 transition-all flex items-center gap-2 shadow-lg cursor-pointer"
            id="hero-rent-bridal-btn"
          >
            <Sparkles className="w-4 h-4" />
            <span>Rent Now @ ₹1,499/day</span>
          </button>

          <button
            onClick={() => {
              updateFilter({ category: 'Groom Sherwani' });
              setActiveTab('explore');
            }}
            className="px-6 sm:px-8 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-xs sm:text-sm font-medium text-white hover:bg-white/20 transition-all flex items-center gap-2 cursor-pointer"
            id="hero-rent-groom-btn"
          >
            <span>Groom Sherwanis</span>
          </button>

          <button
            onClick={() => setActiveModal('upload')}
            className="text-xs sm:text-sm font-bold uppercase tracking-widest text-[#D4AF37] hover:underline underline-offset-4 cursor-pointer ml-2"
            id="hero-sell-outfit-btn"
          >
            List & Earn
          </button>
        </div>

        {/* Trust Badges Bar */}
        <div className="mt-8 pt-6 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-white/70">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#D4AF37] flex-shrink-0" />
            <span>Sanitized & Dry Cleaned</span>
          </div>
          <div className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4 text-[#D4AF37] flex-shrink-0" />
            <span>Direct Buyer-Seller Deal</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#D4AF37] flex-shrink-0" />
            <span>Flexible 3-10 Days Rental</span>
          </div>
          <div className="flex items-center gap-2">
            <Crown className="w-4 h-4 text-[#D4AF37] flex-shrink-0" />
            <span>Verified Luxury Sellers</span>
          </div>
        </div>

      </div>
    </div>
  );
};
