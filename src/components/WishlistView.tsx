import React from 'react';
import { 
  Heart, 
  Share2, 
  Sparkles, 
  ArrowRight, 
  Trash2, 
  Calendar,
  ShoppingBag,
  MessageCircle,
  ShieldCheck,
  Zap,
  TrendingDown
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ProductCard } from './ProductCard';

export const WishlistView: React.FC = () => {
  const { wishlist, products, toggleWishlist, setActiveTab, showToast, openWhatsApp } = useApp();

  const wishlistedProducts = products.filter((p) => wishlist.includes(p.id));

  const totalRentEstimate = wishlistedProducts.reduce(
    (sum, p) => sum + p.rentPricePerDay * 3, 
    0
  );

  const totalOriginalRetail = wishlistedProducts.reduce(
    (sum, p) => sum + (p.originalRetailPrice || p.rentPricePerDay * 20),
    0
  );

  const totalSaved = totalOriginalRetail - totalRentEstimate;

  const handleShareWishlist = () => {
    if (navigator.share) {
      navigator.share({
        title: 'My BGK WEAR Wedding Wishlist',
        text: `Check out the dream couture outfits I've shortlisted on BGK WEAR! Total ${wishlistedProducts.length} items.`,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('Wishlist link copied to clipboard! 📋', 'info');
    }
  };

  const handleConciergeInquiry = () => {
    const outfitNames = wishlistedProducts.map((p) => `• ${p.title} (${p.brand}, Size ${p.size})`).join('\n');
    const text = `Hello BGK WEAR Concierge! I have shortlisted ${wishlistedProducts.length} outfits in my wishlist:\n\n${outfitNames}\n\nCan you assist me with scheduling bridal trials and fitting dates?`;
    openWhatsApp('+91 98200 12345', text);
  };

  const handleClearAllWishlist = () => {
    if (window.confirm('Are you sure you want to remove all saved outfits from your wishlist?')) {
      wishlistedProducts.forEach((p) => toggleWishlist(p.id));
      showToast('Wishlist cleared', 'info');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6 space-y-8">
      
      {/* Top Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#111] border border-white/10 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <span className="text-[#D4AF37] text-xs font-bold uppercase tracking-widest flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            Curated Wardrobe Shortlist
          </span>
          <div className="flex items-center gap-2 mt-1">
            <Heart className="w-5 h-5 fill-[#D4AF37] text-[#D4AF37]" />
            <h1 className="text-xl sm:text-3xl font-serif font-light text-white">
              My Saved Outfits
            </h1>
          </div>
          <p className="text-xs text-white/50 mt-1">
            {wishlistedProducts.length} Luxury outfits shortlisted for your upcoming wedding festivities & celebrations
          </p>
        </div>

        {wishlistedProducts.length > 0 && (
          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={handleConciergeInquiry}
              className="px-4 py-2.5 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-500/30 text-xs font-bold hover:bg-emerald-900/60 transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Book Stylist Trial</span>
            </button>

            <button
              onClick={handleShareWishlist}
              className="px-4 py-2.5 rounded-full bg-white/10 text-white border border-white/20 text-xs font-bold hover:bg-white/20 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Share2 className="w-4 h-4 text-[#D4AF37]" />
              <span>Share Wishlist</span>
            </button>

            <button
              onClick={handleClearAllWishlist}
              className="p-2.5 rounded-full bg-white/5 text-white/40 hover:text-red-400 hover:bg-red-950/30 border border-white/5 transition-colors cursor-pointer"
              title="Clear all saved items"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Value & Budget Calculator Bar if items exist */}
      {wishlistedProducts.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-[#111] border border-white/5 space-y-1">
            <span className="text-[11px] text-white/40 uppercase font-semibold">Estimated 3-Day Rental Budget</span>
            <div className="text-xl sm:text-2xl font-serif font-bold text-[#D4AF37]">
              ₹{totalRentEstimate.toLocaleString('en-IN')}
            </div>
            <p className="text-[10px] text-white/50">Direct rental from seller at 0% platform commission</p>
          </div>

          <div className="p-5 rounded-2xl bg-[#111] border border-white/5 space-y-1">
            <span className="text-[11px] text-white/40 uppercase font-semibold">Total Original Retail Worth</span>
            <div className="text-xl sm:text-2xl font-serif font-bold text-white">
              ₹{totalOriginalRetail.toLocaleString('en-IN')}
            </div>
            <p className="text-[10px] text-white/50">Authentic boutique retail pricing</p>
          </div>

          <div className="p-5 rounded-2xl bg-emerald-950/30 border border-emerald-500/20 space-y-1">
            <span className="text-[11px] text-emerald-400 uppercase font-semibold flex items-center gap-1">
              <TrendingDown className="w-3.5 h-3.5" />
              Smart Fashion Savings
            </span>
            <div className="text-xl sm:text-2xl font-serif font-bold text-emerald-300">
              ₹{totalSaved.toLocaleString('en-IN')} (92% Saved)
            </div>
            <p className="text-[10px] text-emerald-400/70">By renting luxury on BGK WEAR</p>
          </div>
        </div>
      )}

      {/* Wishlist Grid */}
      {wishlistedProducts.length === 0 ? (
        <div className="py-20 text-center rounded-3xl bg-[#111] border border-white/5 p-8 space-y-5 max-w-md mx-auto shadow-2xl">
          <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-[#D4AF37]">
            <Heart className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-serif font-bold text-white">Your Saved Wardrobe is Empty</h3>
            <p className="text-xs text-white/50 leading-relaxed">
              Explore heritage bridal lehengas, royal groom sherwanis, and fine jewelry to bookmark your favorite looks.
            </p>
          </div>
          <div className="pt-2 flex flex-col gap-2">
            <button
              onClick={() => setActiveTab('explore')}
              className="w-full py-3 bg-[#D4AF37] text-black rounded-full text-xs font-bold uppercase tracking-wider hover:brightness-110 cursor-pointer shadow-lg"
            >
              Explore Designer Wear
            </button>
            <button
              onClick={() => setActiveTab('home')}
              className="w-full py-3 bg-white/5 text-white/70 hover:text-white rounded-full text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
            >
              Back to Home Feed
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {wishlistedProducts.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      )}

    </div>
  );
};
