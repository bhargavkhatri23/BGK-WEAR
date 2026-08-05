import React, { useState, useEffect } from 'react';
import { X, Heart, Share2, Eye, ShieldCheck, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const StoryViewerModal: React.FC = () => {
  const { activeStory, setActiveStory, setActiveModal, products, setSelectedProduct } = useApp();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!activeStory) return;
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          return 100;
        }
        return prev + 1.5;
      });
    }, 60);

    return () => clearInterval(interval);
  }, [activeStory]);

  if (!activeStory) return null;

  const linkedProduct = products.find((p) => activeStory.featuredProductIds.includes(p.id)) || products[0];

  const handleClose = () => {
    setActiveStory(null);
    setActiveModal(null);
  };

  const handleViewProduct = () => {
    if (linkedProduct) {
      setSelectedProduct(linkedProduct);
      handleClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl flex items-center justify-center p-0 sm:p-4">
      {/* Story container (9:16 mobile aspect ratio feel) */}
      <div className="relative w-full max-w-md h-full sm:h-[88vh] bg-[#0a0a0a] sm:rounded-3xl overflow-hidden flex flex-col justify-between border border-white/10 shadow-2xl">
        
        {/* Background photo */}
        <img
          src={activeStory.coverImage}
          alt={activeStory.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
        
        {/* Vignette Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/70" />

        {/* Top Progress Bars & Header */}
        <div className="relative z-10 p-5 pt-4">
          {/* Progress bar */}
          <div className="w-full bg-white/20 h-1 rounded-full overflow-hidden mb-3.5">
            <div 
              className="bg-[#D4AF37] h-full transition-all duration-75 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={activeStory.avatar}
                alt={activeStory.author}
                className="w-10 h-10 rounded-full border border-[#D4AF37] object-cover"
              />
              <div>
                <h4 className="text-sm font-serif font-semibold text-white leading-none flex items-center gap-1.5">
                  {activeStory.title}
                  <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
                </h4>
                <p className="text-xs text-white/60 mt-0.5">{activeStory.author} • {activeStory.tag}</p>
              </div>
            </div>

            <button
              onClick={handleClose}
              className="w-8 h-8 rounded-full bg-black/60 text-white/70 flex items-center justify-center hover:text-white hover:bg-black/90 transition-colors cursor-pointer"
              id="close-story-btn"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Bottom Outfit Card overlay */}
        <div className="relative z-10 p-5 pb-6 space-y-3">
          {linkedProduct && (
            <div className="bg-[#0a0a0a]/90 backdrop-blur-xl rounded-3xl p-4 border border-white/10 shadow-2xl">
              <div className="flex items-center gap-3">
                <img
                  src={linkedProduct.images[0]}
                  alt={linkedProduct.title}
                  className="w-16 h-20 rounded-2xl object-cover border border-white/10"
                />
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] uppercase font-bold text-[#D4AF37] tracking-wider">
                    {linkedProduct.brand}
                  </span>
                  <h5 className="text-xs font-semibold text-white truncate">
                    {linkedProduct.title}
                  </h5>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-sm font-serif font-bold text-white">
                      ₹{linkedProduct.rentPricePerDay.toLocaleString('en-IN')}<span className="text-[10px] font-sans font-normal text-white/50">/day</span>
                    </span>
                    {linkedProduct.salePrice && (
                      <span className="text-[11px] text-white/50">
                        Buy ₹{linkedProduct.salePrice.toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-white/40 mt-0.5">
                    Security Deposit: ₹{linkedProduct.securityDeposit.toLocaleString('en-IN')} (Refundable)
                  </p>
                </div>
              </div>

              <div className="mt-3 flex gap-2">
                <button
                  onClick={handleViewProduct}
                  className="flex-1 py-3 rounded-full bg-[#D4AF37] hover:brightness-110 text-black text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-lg cursor-pointer"
                  id="rent-story-outfit-btn"
                >
                  <span>Rent or Buy this Look</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
