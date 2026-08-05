import React, { useState } from 'react';
import { 
  X, 
  Heart, 
  Share2, 
  Star, 
  ShieldCheck, 
  MapPin, 
  Calendar as CalendarIcon, 
  Clock, 
  Phone, 
  MessageCircle, 
  MessageSquare,
  Ruler, 
  Sparkles, 
  CheckCircle2, 
  ChevronLeft, 
  ChevronRight,
  ShoppingBag,
  Info,
  Truck,
  Award,
  Lock,
  Plus,
  ZoomIn,
  Flag,
  AlertTriangle
} from 'lucide-react';
import { Product, Review } from '../types';
import { useApp } from '../context/AppContext';
import { nativeShare, triggerHaptic } from '../services/nativeService';

export const ProductDetailModal: React.FC = () => {
  const { 
    selectedProduct, 
    setSelectedProduct, 
    isWishlisted, 
    toggleWishlist, 
    openWhatsApp, 
    openCall,
    openChatWithSeller,
    setActiveModal,
    setTargetSeller,
    showToast,
    addReview,
    products
  } = useApp();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const [selectedDays, setSelectedDays] = useState<number>(3);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('Inaccurate Details');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewComment, setNewReviewComment] = useState('');
  const [newReviewFit, setNewReviewFit] = useState<'True to Size' | 'Runs Small' | 'Runs Large' | 'Perfect Custom Fit'>('True to Size');
  const [newReviewOccasion, setNewReviewOccasion] = useState('Wedding Reception');

  if (!selectedProduct) return null;

  const wish = isWishlisted(selectedProduct.id);

  // Similar Outfits
  const similarProducts = products
    .filter((p) => p.id !== selectedProduct.id && (p.category === selectedProduct.category || p.brand === selectedProduct.brand))
    .slice(0, 4);

  const handleShare = async () => {
    triggerHaptic('light');
    const shared = await nativeShare(
      selectedProduct.title,
      `Check out this luxury ${selectedProduct.title} on BGK WEAR!`,
      window.location.href
    );
    if (!shared) {
      showToast('Listing link copied to clipboard! 📋', 'info');
    }
  };

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowReportModal(false);
    showToast(`Listing flagged for review (${reportReason}). Our Trust & Safety team will inspect within 2 hours.`, 'info');
  };

  const handleStartRental = () => {
    setActiveModal('checkout_rent');
  };

  const handleStartBuy = () => {
    setActiveModal('checkout_buy');
  };

  const handleWhatsAppChat = () => {
    const text = `Namaste! I am inquiring about "${selectedProduct.title}" (Brand: ${selectedProduct.brand}, Size: ${selectedProduct.size}, Listed at ₹${selectedProduct.rentPricePerDay}/day) on BGK WEAR. Please confirm availability for my wedding dates.`;
    openWhatsApp(selectedProduct.seller.whatsapp || selectedProduct.seller.phone, text);
  };

  const handleCallSeller = () => {
    setTargetSeller(selectedProduct.seller);
    setActiveModal('call_seller');
  };

  const handleInAppChat = async () => {
    await openChatWithSeller(selectedProduct.seller, selectedProduct);
    setSelectedProduct(null);
  };

  const handleAddReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewComment.trim()) return;
    
    addReview(selectedProduct.id, {
      userName: 'Verified Guest Renter',
      userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      userCity: selectedProduct.city,
      rating: newReviewRating,
      comment: newReviewComment,
      fitFeedback: newReviewFit,
      occasion: newReviewOccasion
    });

    setNewReviewComment('');
    setShowReviewModal(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-xl flex justify-center p-0 sm:p-4 lg:p-6 animate-in fade-in duration-200">
      
      {/* Modal Container */}
      <div className="relative w-full max-w-5xl bg-[#0a0a0a] sm:rounded-3xl border border-white/10 shadow-2xl overflow-hidden my-auto flex flex-col max-h-[96vh]">
        
        {/* Top Header Bar */}
        <div className="sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6 py-4 bg-[#0a0a0a]/95 backdrop-blur-md border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded text-[10px] font-bold uppercase tracking-tighter bg-[#D4AF37] text-black">
              {selectedProduct.category}
            </span>
            <span className="text-xs text-white/40 hidden sm:inline font-mono">
              REF #{selectedProduct.id.slice(-6).toUpperCase()}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowReportModal(true)}
              className="p-2 rounded-full bg-white/5 text-white/70 hover:text-red-400 border border-white/10 transition-colors cursor-pointer"
              title="Report Listing"
              id="detail-report-btn"
            >
              <Flag className="w-4 h-4" />
            </button>

            <button
              onClick={() => toggleWishlist(selectedProduct.id)}
              className="p-2 rounded-full bg-white/5 text-white/70 hover:text-[#D4AF37] border border-white/10 transition-colors cursor-pointer"
              title="Save to Wishlist"
              id="detail-wishlist-toggle"
            >
              <Heart className={`w-4 h-4 ${wish ? 'fill-[#D4AF37] text-[#D4AF37]' : ''}`} />
            </button>

            <button
              onClick={handleShare}
              className="p-2 rounded-full bg-white/5 text-white/70 hover:text-[#D4AF37] border border-white/10 transition-colors cursor-pointer"
              title="Share Listing"
              id="detail-share-btn"
            >
              <Share2 className="w-4 h-4" />
            </button>

            <button
              onClick={() => setSelectedProduct(null)}
              className="p-2 rounded-full bg-white/5 text-white/70 hover:text-white border border-white/10 transition-colors ml-1 cursor-pointer"
              id="detail-close-btn"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-8 no-scrollbar">
          
          {/* Top Section: Gallery + Core Info */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
            
            {/* Left: Multi-Image Gallery (7 cols) */}
            <div className="lg:col-span-7 space-y-3">
              {/* Main Active Image with Zoom look */}
              <div className="relative aspect-[4/5] w-full rounded-3xl overflow-hidden bg-[#111] border border-white/10 shadow-xl group">
                <img
                  src={selectedProduct.images[activeImageIndex] || selectedProduct.images[0]}
                  alt={selectedProduct.title}
                  className="w-full h-full object-cover"
                />

                {/* Left/Right arrow navigation */}
                {selectedProduct.images.length > 1 && (
                  <>
                    <button
                      onClick={() => setActiveImageIndex((prev) => (prev - 1 + selectedProduct.images.length) % selectedProduct.images.length)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/70 text-white flex items-center justify-center hover:bg-black"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setActiveImageIndex((prev) => (prev + 1) % selectedProduct.images.length)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/70 text-white flex items-center justify-center hover:bg-black"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}

                {/* Badges on image */}
                <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                  <span className="px-3 py-1 rounded text-[10px] font-bold uppercase tracking-tighter bg-black/80 text-[#D4AF37] border border-[#D4AF37]/30 backdrop-blur-md">
                    {selectedProduct.condition}
                  </span>
                  <span className="px-3 py-1 rounded text-[10px] font-bold uppercase tracking-tighter bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 backdrop-blur-md flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Dry Cleaned & Sanitized
                  </span>
                </div>

                {/* Zoom In Action Button */}
                <button
                  type="button"
                  onClick={() => setIsZoomOpen(true)}
                  className="absolute bottom-3 right-3 p-2.5 rounded-full bg-black/75 hover:bg-black text-[#D4AF37] border border-[#D4AF37]/40 shadow-lg backdrop-blur-md transition-all group-hover:scale-105 flex items-center gap-1.5 text-xs font-semibold cursor-pointer z-10"
                  id="detail-zoom-btn"
                  title="Zoom HD Image"
                >
                  <ZoomIn className="w-4 h-4" />
                  <span className="text-[11px] hidden sm:inline font-sans">Zoom HD</span>
                </button>
              </div>

              {/* Thumbnails Row */}
              {selectedProduct.images.length > 1 && (
                <div className="flex gap-2.5 overflow-x-auto no-scrollbar py-1">
                  {selectedProduct.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative w-20 h-24 rounded-2xl overflow-hidden flex-shrink-0 border-2 transition-all cursor-pointer ${
                        activeImageIndex === idx 
                          ? 'border-[#D4AF37] ring-1 ring-[#D4AF37]/40 scale-105' 
                          : 'border-white/10 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Specifications & Pricing (5 cols) */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-5">
              
              <div>
                {/* Brand & Designer */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-widest text-[#D4AF37]">
                    {selectedProduct.brand}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-[#D4AF37] font-bold">
                    <Star className="w-3.5 h-3.5 fill-[#D4AF37]" />
                    <span>{selectedProduct.rating}</span>
                    <span className="text-white/40 font-normal">({selectedProduct.reviewsCount} Reviews)</span>
                  </span>
                </div>

                {/* Title */}
                <h1 className="text-xl sm:text-3xl font-serif font-light text-white mt-1 leading-snug">
                  {selectedProduct.title}
                </h1>

                {/* Location */}
                <div className="flex items-center gap-2 mt-2 text-xs text-white/50">
                  <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>{selectedProduct.city}, {selectedProduct.state}</span>
                </div>

                {/* Price Breakdown Card */}
                <div className="mt-4 p-5 rounded-3xl bg-[#111] border border-white/5 shadow-xl space-y-3">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider font-bold text-white/40">Rental Rate</span>
                      <div className="text-2xl sm:text-3xl font-serif font-bold text-[#D4AF37]">
                        ₹{selectedProduct.rentPricePerDay.toLocaleString('en-IN')}
                        <span className="text-xs font-sans text-white/40 font-normal"> / day</span>
                      </div>
                    </div>

                    {selectedProduct.salePrice && (
                      <div className="text-right">
                        <span className="text-[10px] uppercase tracking-wider font-bold text-white/40">Or Buy Outright</span>
                        <div className="text-base font-bold text-white">
                          ₹{selectedProduct.salePrice.toLocaleString('en-IN')}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs">
                    <span className="text-white/50 flex items-center gap-1">
                      <Lock className="w-3.5 h-3.5 text-[#D4AF37]" />
                      Refundable Security Deposit:
                    </span>
                    <span className="font-bold text-emerald-400">
                      ₹{selectedProduct.securityDeposit.toLocaleString('en-IN')}
                    </span>
                  </div>

                  {selectedProduct.originalRetailPrice && (
                    <div className="text-[11px] text-white/40 flex items-center justify-between">
                      <span>Original Retail Value:</span>
                      <span className="line-through text-white/30">
                        ₹{selectedProduct.originalRetailPrice.toLocaleString('en-IN')}
                      </span>
                    </div>
                  )}
                </div>

                {/* Key Attributes Tags Grid */}
                <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                  <div className="p-3 rounded-2xl bg-[#111] border border-white/5">
                    <span className="text-white/40 block text-[10px] uppercase tracking-wider font-semibold">Size</span>
                    <span className="font-bold text-white">{selectedProduct.size}</span>
                  </div>

                  <div className="p-3 rounded-2xl bg-[#111] border border-white/5">
                    <span className="text-white/40 block text-[10px] uppercase tracking-wider font-semibold">Color</span>
                    <div className="flex items-center gap-1.5 font-bold text-white mt-0.5">
                      <span className="w-3 h-3 rounded-full border border-white/30" style={{ backgroundColor: selectedProduct.colorHex }} />
                      <span className="truncate">{selectedProduct.color}</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-[#111] border border-white/5">
                    <span className="text-white/40 block text-[10px] uppercase tracking-wider font-semibold">Fabric</span>
                    <span className="font-medium text-white truncate block">{selectedProduct.fabric}</span>
                  </div>

                  <div className="p-3 rounded-2xl bg-[#111] border border-white/5">
                    <span className="text-white/40 block text-[10px] uppercase tracking-wider font-semibold">Condition</span>
                    <span className="font-medium text-[#D4AF37] truncate block">{selectedProduct.condition}</span>
                  </div>
                </div>

                {/* Measurements Details */}
                {selectedProduct.measurements && (
                  <div className="mt-3 p-3.5 rounded-2xl bg-[#111] border border-white/5 text-xs">
                    <div className="flex items-center gap-1.5 font-bold text-[#D4AF37] mb-1.5">
                      <Ruler className="w-3.5 h-3.5" />
                      <span className="uppercase tracking-wider text-[11px]">Fittings & Measurements</span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-white/70">
                      {selectedProduct.measurements.bust && <div>Bust/Chest: <span className="text-white font-semibold">{selectedProduct.measurements.bust}</span></div>}
                      {selectedProduct.measurements.waist && <div>Waist: <span className="text-white font-semibold">{selectedProduct.measurements.waist}</span></div>}
                      {selectedProduct.measurements.length && <div>Length: <span className="text-white font-semibold">{selectedProduct.measurements.length}</span></div>}
                      {selectedProduct.measurements.alterationMargin && <div className="col-span-2 text-[#D4AF37]">Allowance: {selectedProduct.measurements.alterationMargin}</div>}
                    </div>
                  </div>
                )}
              </div>

              {/* Primary Call to Action Buttons */}
              <div className="space-y-2.5 pt-2">
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={handleStartRental}
                    className="py-3.5 bg-[#D4AF37] text-black hover:brightness-110 font-bold rounded-full text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg cursor-pointer transition-all"
                    id="modal-rent-now-btn"
                  >
                    <CalendarIcon className="w-4 h-4" />
                    <span>Rent Outfit</span>
                  </button>

                  {selectedProduct.salePrice ? (
                    <button
                      onClick={handleStartBuy}
                      className="bg-white/10 hover:bg-white/20 text-white border border-white/20 py-3.5 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer"
                      id="modal-buy-now-btn"
                    >
                      <ShoppingBag className="w-4 h-4 text-[#D4AF37]" />
                      <span>Buy Now</span>
                    </button>
                  ) : (
                    <button
                      onClick={handleStartRental}
                      className="bg-white/10 hover:bg-white/20 text-white border border-white/20 py-3.5 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer"
                    >
                      <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                      <span>Book Try-On</span>
                    </button>
                  )}
                </div>

                {/* Seller direct contact buttons: In-App Chat, WhatsApp & Call */}
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={handleInAppChat}
                    className="bg-[#D4AF37]/15 hover:bg-[#D4AF37] text-[#D4AF37] hover:text-black border border-[#D4AF37]/40 py-2.5 rounded-full text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    id="modal-chat-inapp-btn"
                    title="Direct Chat & Price Negotiation"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>In-App Chat</span>
                  </button>

                  <button
                    onClick={handleWhatsAppChat}
                    className="bg-white/5 hover:bg-white/10 text-white border border-white/10 py-2.5 rounded-full text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    id="modal-chat-whatsapp-btn"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>WhatsApp</span>
                  </button>

                  <button
                    onClick={handleCallSeller}
                    className="bg-white/5 hover:bg-white/10 text-white border border-white/10 py-2.5 rounded-full text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    id="modal-call-seller-btn"
                  >
                    <Phone className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>Call</span>
                  </button>
                </div>
              </div>

            </div>
          </div>

          {/* Middle Section: Detailed Description & Occasions */}
          <div className="border-t border-white/10 pt-6 space-y-4">
            <h3 className="text-lg font-serif font-light text-white">Outfit Description & Story</h3>
            <p className="text-sm text-white/70 leading-relaxed whitespace-pre-line font-sans">
              {selectedProduct.description}
            </p>

            <div className="flex flex-wrap gap-2 pt-2">
              <span className="text-xs text-white/40 font-medium py-1">Recommended Occasions:</span>
              {selectedProduct.occasion.map((occ) => (
                <span
                  key={occ}
                  className="px-3 py-1 rounded-full bg-[#111] text-[#D4AF37] text-xs font-semibold border border-[#D4AF37]/30"
                >
                  ✨ {occ}
                </span>
              ))}
            </div>
          </div>

          {/* Seller Information Card */}
          <div className="border-t border-white/10 pt-6">
            <h3 className="text-lg font-serif font-light text-white mb-4">Verified Closet Curator & Seller</h3>
            
            <div className="rounded-3xl p-5 border border-white/5 bg-[#111] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
              <div className="flex items-center gap-4">
                <img
                  src={selectedProduct.seller.avatar}
                  alt={selectedProduct.seller.name}
                  className="w-14 h-14 rounded-full object-cover border-2 border-[#D4AF37]"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-sm font-bold text-white">{selectedProduct.seller.name}</h4>
                    {selectedProduct.seller.isVerified && (
                      <span className="px-2 py-0.5 rounded-full bg-[#D4AF37]/10 text-[#D4AF37] text-[10px] font-bold flex items-center gap-1 border border-[#D4AF37]/40">
                        <ShieldCheck className="w-3 h-3" />
                        Verified Boutique
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-white/50 mt-0.5">{selectedProduct.seller.bio}</p>
                  <div className="flex items-center gap-3 text-[11px] text-white/60 mt-1.5">
                    <span className="flex items-center gap-1 text-[#D4AF37] font-bold">
                      <Star className="w-3 h-3 fill-[#D4AF37]" />
                      {selectedProduct.seller.rating} ({selectedProduct.seller.totalReviews} reviews)
                    </span>
                    <span>• {selectedProduct.seller.totalListings} Outfits Listed</span>
                    <span>• Replies {selectedProduct.seller.responseTime}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                <button
                  onClick={handleInAppChat}
                  className="flex-1 sm:flex-initial px-4 py-2.5 rounded-full bg-[#D4AF37] text-black text-xs font-bold flex items-center justify-center gap-1.5 hover:brightness-110 cursor-pointer shadow-md"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Chat with Seller</span>
                </button>
                <button
                  onClick={handleWhatsAppChat}
                  className="flex-1 sm:flex-initial px-3.5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-400" />
                  <span>WhatsApp</span>
                </button>
                <button
                  onClick={handleCallSeller}
                  className="flex-1 sm:flex-initial px-3.5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call</span>
                </button>
              </div>
            </div>
          </div>

          {/* Customer Reviews & Ratings Section */}
          <div className="border-t border-white/10 pt-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-serif font-light text-white flex items-center gap-2">
                  <span>Customer Reviews & Photos</span>
                  <span className="text-xs font-normal text-white/40">({selectedProduct.reviews.length})</span>
                </h3>
                <p className="text-xs text-white/50 mt-0.5">Real feedback from brides, grooms & event attendees</p>
              </div>

              <button
                onClick={() => setShowReviewModal(!showReviewModal)}
                className="px-4 py-2 rounded-full bg-[#D4AF37] text-black text-xs font-bold hover:brightness-110 transition-colors flex items-center gap-1 cursor-pointer"
                id="write-review-btn"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Write Review</span>
              </button>
            </div>

            {/* Add Review Inline Form */}
            {showReviewModal && (
              <form onSubmit={handleAddReviewSubmit} className="mb-6 p-5 rounded-3xl bg-[#111] border border-[#D4AF37]/40 space-y-3">
                <h4 className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider">Share Your Experience</h4>
                
                <div className="flex items-center gap-2">
                  <span className="text-xs text-white/70">Your Rating:</span>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setNewReviewRating(star)}
                        className="text-lg cursor-pointer"
                      >
                        <Star className={`w-5 h-5 ${star <= newReviewRating ? 'fill-[#D4AF37] text-[#D4AF37]' : 'text-neutral-600'}`} />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="text-white/60 block mb-1">Fit Feedback</label>
                    <select
                      value={newReviewFit}
                      onChange={(e) => setNewReviewFit(e.target.value as any)}
                      className="w-full bg-[#050505] border border-white/10 rounded-xl p-2.5 text-white/90"
                    >
                      <option value="True to Size">True to Size</option>
                      <option value="Runs Small">Runs Small</option>
                      <option value="Runs Large">Runs Large</option>
                      <option value="Perfect Custom Fit">Perfect Custom Fit</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-white/60 block mb-1">Occasion</label>
                    <input
                      type="text"
                      value={newReviewOccasion}
                      onChange={(e) => setNewReviewOccasion(e.target.value)}
                      placeholder="e.g. Sangeet Night, Sister's Wedding"
                      className="w-full bg-[#050505] border border-white/10 rounded-xl p-2.5 text-white/90"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-white/60 block text-xs mb-1">Your Review</label>
                  <textarea
                    rows={3}
                    value={newReviewComment}
                    onChange={(e) => setNewReviewComment(e.target.value)}
                    placeholder="Tell us about the fabric quality, embroidery finish, seller coordination experience..."
                    className="w-full bg-[#050505] border border-white/10 rounded-xl p-2.5 text-xs text-white/90 focus:border-[#D4AF37] focus:outline-none"
                    required
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowReviewModal(false)}
                    className="px-4 py-2 text-xs text-white/50 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#D4AF37] text-black rounded-full text-xs font-bold uppercase tracking-wider"
                  >
                    Submit Review
                  </button>
                </div>
              </form>
            )}

            {/* Reviews List */}
            {selectedProduct.reviews.length === 0 ? (
              <div className="p-6 rounded-3xl bg-[#111] border border-white/5 text-center text-xs text-white/40">
                Be the first to review this royal outfit! Rent or buy to share your wedding look.
              </div>
            ) : (
              <div className="space-y-3">
                {selectedProduct.reviews.map((rev) => (
                  <div key={rev.id} className="p-4 rounded-2xl bg-[#111] border border-white/5 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img src={rev.userAvatar} alt={rev.userName} className="w-8 h-8 rounded-full object-cover" />
                        <div>
                          <div className="text-xs font-bold text-white flex items-center gap-1.5">
                            <span>{rev.userName}</span>
                            <span className="text-[10px] text-white/40 font-normal">• {rev.userCity}</span>
                          </div>
                          <p className="text-[10px] text-white/40">{rev.date} • Occasion: {rev.occasion}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 text-[#D4AF37]">
                        {Array.from({ length: rev.rating }).map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-[#D4AF37]" />
                        ))}
                      </div>
                    </div>

                    <p className="text-xs text-white/70 leading-relaxed font-sans">{rev.comment}</p>

                    <div className="flex items-center gap-2 text-[10px]">
                      <span className="px-2.5 py-0.5 rounded-full bg-white/5 text-[#D4AF37] border border-white/10">
                        Fit: {rev.fitFeedback}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Similar Products Section */}
          {similarProducts.length > 0 && (
            <div className="border-t border-white/10 pt-8 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[#D4AF37] text-xs font-bold uppercase tracking-widest">
                    Curated Alternatives
                  </span>
                  <h3 className="text-lg font-serif font-light text-white">
                    Similar Designer Outfits
                  </h3>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                {similarProducts.map((simProd) => (
                  <div
                    key={simProd.id}
                    onClick={() => {
                      setSelectedProduct(simProd);
                      setActiveImageIndex(0);
                    }}
                    className="group relative rounded-2xl overflow-hidden bg-[#111] border border-white/10 hover:border-[#D4AF37]/50 transition-all cursor-pointer flex flex-col justify-between"
                  >
                    <div className="relative aspect-[3/4] w-full overflow-hidden">
                      <img
                        src={simProd.images[0]}
                        alt={simProd.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-2 left-2 px-2 py-0.5 rounded text-[9px] font-bold bg-black/80 text-[#D4AF37] border border-[#D4AF37]/30">
                        {simProd.brand}
                      </div>
                    </div>
                    <div className="p-3 space-y-1">
                      <h4 className="text-xs font-serif font-medium text-white truncate group-hover:text-[#D4AF37] transition-colors">
                        {simProd.title}
                      </h4>
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-[#D4AF37] font-bold">
                          ₹{simProd.rentPricePerDay.toLocaleString()}/day
                        </span>
                        <span className="text-white/40 text-[10px]">
                          {simProd.city}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>

      {/* Fullscreen HD Zoom Modal */}
      {isZoomOpen && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center p-4">
          <button
            onClick={() => setIsZoomOpen(false)}
            className="absolute top-5 right-5 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer z-10"
            title="Close Zoom"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="relative max-w-4xl max-h-[85vh] w-full flex items-center justify-center">
            <img
              src={selectedProduct.images[activeImageIndex] || selectedProduct.images[0]}
              alt={selectedProduct.title}
              className="max-h-[85vh] max-w-full object-contain rounded-2xl shadow-2xl border border-white/10"
            />

            {/* Previous image */}
            {selectedProduct.images.length > 1 && (
              <button
                onClick={() =>
                  setActiveImageIndex(
                    (prev) => (prev - 1 + selectedProduct.images.length) % selectedProduct.images.length
                  )
                }
                className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/80 hover:bg-black text-white border border-white/20 cursor-pointer"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}

            {/* Next image */}
            {selectedProduct.images.length > 1 && (
              <button
                onClick={() =>
                  setActiveImageIndex((prev) => (prev + 1) % selectedProduct.images.length)
                }
                className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/80 hover:bg-black text-white border border-white/20 cursor-pointer"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            )}
          </div>

          <div className="mt-4 flex items-center gap-2">
            {selectedProduct.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImageIndex(idx)}
                className={`w-12 h-14 rounded-lg overflow-hidden border-2 transition-all ${
                  activeImageIndex === idx ? 'border-[#D4AF37] scale-110' : 'border-white/20 opacity-50'
                }`}
              >
                <img src={img} alt="Thumb" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Report Listing Modal */}
      {showReportModal && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#111] border border-white/10 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                <AlertTriangle className="w-5 h-5" />
                <span>Report Listing</span>
              </div>
              <button
                onClick={() => setShowReportModal(false)}
                className="p-1 rounded-full text-white/50 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-white/60">
              Help us keep the BGK WEAR couture marketplace authentic, verified, and secure. Why are you reporting this outfit?
            </p>

            <form onSubmit={handleReportSubmit} className="space-y-4">
              <div className="space-y-2">
                {[
                  'Inaccurate Details / Misrepresented Size',
                  'Potential Counterfeit / Replica',
                  'Unreasonable Security Deposit or Fee',
                  'Inappropriate Photos or Content',
                  'Seller Unresponsive / Suspicious Behavior',
                  'Other Policy Violation'
                ].map((reason) => (
                  <label
                    key={reason}
                    className={`flex items-center gap-3 p-3 rounded-xl border text-xs cursor-pointer transition-colors ${
                      reportReason === reason
                        ? 'bg-[#D4AF37]/10 border-[#D4AF37] text-white'
                        : 'bg-[#181818] border-white/5 text-white/70 hover:border-white/20'
                    }`}
                  >
                    <input
                      type="radio"
                      name="reportReason"
                      value={reason}
                      checked={reportReason === reason}
                      onChange={() => setReportReason(reason)}
                      className="accent-[#D4AF37]"
                    />
                    <span>{reason}</span>
                  </label>
                ))}
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowReportModal(false)}
                  className="px-4 py-2 text-xs text-white/60 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-red-600 hover:bg-red-500 text-white text-xs font-bold uppercase tracking-wider"
                >
                  Submit Flag
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
