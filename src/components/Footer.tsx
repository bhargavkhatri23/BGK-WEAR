import React from 'react';
import { Crown, Sparkles, ShieldCheck, Heart, MapPin, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Footer: React.FC = () => {
  const { setActiveTab, setActiveModal, updateFilter } = useApp();

  return (
    <footer className="bg-[#0a0a0a] border-t border-white/10 pt-12 pb-24 md:pb-12 mt-16 text-xs text-white/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-10">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Col */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#D4AF37] flex items-center justify-center text-black font-bold">
                <Crown className="w-4 h-4" />
              </div>
              <span className="font-serif text-lg font-bold tracking-widest text-white">
                BGK <span className="text-[#D4AF37]">WEAR</span>
              </span>
            </div>
            <p className="text-[11px] leading-relaxed text-white/50">
              India's premier luxury wedding marketplace. Rent, buy, sell and monetise authentic designer bridal lehengas, royal sherwanis, sarees, and fine heirloom jewelry.
            </p>
            <div className="flex items-center gap-2 text-xs text-[#D4AF37] font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>Direct Peer-to-Peer Marketplace</span>
            </div>
          </div>

          {/* Quick Categories */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-serif font-bold text-white uppercase tracking-wider">
              Wedding Categories
            </h4>
            <ul className="space-y-1.5 text-xs text-white/60">
              <li>
                <button
                  onClick={() => { updateFilter({ category: 'Bridal Lehenga' }); setActiveTab('explore'); }}
                  className="hover:text-[#D4AF37] transition-colors cursor-pointer"
                >
                  Bridal Lehengas
                </button>
              </li>
              <li>
                <button
                  onClick={() => { updateFilter({ category: 'Groom Sherwani' }); setActiveTab('explore'); }}
                  className="hover:text-[#D4AF37] transition-colors cursor-pointer"
                >
                  Groom Sherwanis & Safas
                </button>
              </li>
              <li>
                <button
                  onClick={() => { updateFilter({ category: 'Saree' }); setActiveTab('explore'); }}
                  className="hover:text-[#D4AF37] transition-colors cursor-pointer"
                >
                  Kanjeevaram & Banarasi Sarees
                </button>
              </li>
              <li>
                <button
                  onClick={() => { updateFilter({ category: 'Gown' }); setActiveTab('explore'); }}
                  className="hover:text-[#D4AF37] transition-colors cursor-pointer"
                >
                  Cocktail & Reception Gowns
                </button>
              </li>
              <li>
                <button
                  onClick={() => { updateFilter({ category: 'Jewelry' }); setActiveTab('explore'); }}
                  className="hover:text-[#D4AF37] transition-colors cursor-pointer"
                >
                  Polki & Kundan Bridal Jewelry
                </button>
              </li>
            </ul>
          </div>

          {/* Cities & Local hubs */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-serif font-bold text-white uppercase tracking-wider">
              Top City Marketplaces
            </h4>
            <ul className="space-y-1.5 text-xs text-white/60">
              <li>Mumbai & Navi Mumbai</li>
              <li>Delhi NCR & Gurgaon</li>
              <li>Bangalore & Hyderabad</li>
              <li>Jaipur & Udaipur</li>
              <li>Ahmedabad & Surat</li>
              <li>Kolkata & Chennai</li>
            </ul>
          </div>

          {/* Peer-to-Peer Highlights */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-serif font-bold text-white uppercase tracking-wider">
              Marketplace Trust
            </h4>
            <ul className="space-y-2 text-[11px] text-white/60">
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                <span>Verified Buyer & Seller Profiles</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                <span>In-app Realtime Chat & Audio Calls</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                <span>Direct WhatsApp Inquiries & Safe Handovers</span>
              </li>
            </ul>
            <button
              onClick={() => setActiveModal('upload')}
              className="mt-3 text-xs font-bold text-[#D4AF37] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>List Your Outfit & Monetize</span>
            </button>
          </div>

        </div>

        <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px]">
          <p>© 2025-2026 BGK WEAR Luxury Marketplaces. All rights reserved.</p>
          <p className="flex items-center gap-1 text-[#D4AF37]">
            Crafted with royal elegance for Indian weddings.
          </p>
        </div>

      </div>
    </footer>
  );
};
