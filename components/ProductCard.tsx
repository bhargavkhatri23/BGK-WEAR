import React, { useState } from 'react';
import { 
  Heart, 
  Star, 
  MapPin, 
  ShieldCheck, 
  Calendar, 
  ChevronLeft, 
  ChevronRight,
  MessageCircle,
  Sparkles,
  ShoppingBag,
  Eye,
  Crown
} from 'lucide-react';
import { Product } from '../types';
import { useApp } from '../context/AppContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { 
    isWishlisted, 
    toggleWishlist, 
    setSelectedProduct, 
    openWhatsApp, 
    setActiveModal, 
    setTargetProduct 
  } = useApp();

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);
  const wish = isWishlisted(product.id);

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
  };

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
  };

  const handleWhatsAppInquiry = (e: React.MouseEvent) => {
    e.stopPropagation();
    const text = `Hello! I am interested in renting/buying "${product.title}" (${product.brand}, Size: ${product.size}) on BGK WEAR. Is it available?`;
    openWhatsApp(product.seller.whatsapp || product.seller.phone, text);
  };

  const discountPercent = product.originalRetailPrice
    ? Math.round(((product.originalRetailPrice - (product.salePrice || product.rentPricePerDay * 3)) / product.originalRetailPrice) * 100)
    : null;

  return (
    <div 
      onClick={() => setSelectedProduct(product)}
      className="group relative bg-[#111] rounded-3xl p-4 sm:p-5 border border-white/5 hover:border-[#D4AF37]/50 transition-all duration-300 shadow-xl flex flex-col justify-between cursor-pointer"
      id={`product-card-${product.id}`}
    >
      <div>
        {/* Top Header Row with Brand & Seller Verification & Wishlist */}
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="text-[#D4AF37] text-xs font-bold uppercase tracking-widest truncate max-w-[130px] sm:max-w-[150px]">
              {product.brand}
            </span>
            {product.seller.isVerified && (
              <span className="inline-flex items-center" title="Verified Designer Boutique">
                <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleWishlist(product.id);
              }}
              className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/40 hover:text-[#D4AF37] hover:bg-white/10 transition-all active:scale-90 cursor-pointer"
              id={`wishlist-btn-${product.id}`}
              aria-label="Wishlist"
            >
              <Heart className={`w-4 h-4 transition-transform duration-200 ${wish ? 'fill-[#D4AF37] text-[#D4AF37] scale-110' : 'group-hover:text-white'}`} />
            </button>
          </div>
        </div>

        {/* Product Image Area */}
        <div className="aspect-[3/4] bg-[#1a1a1a] rounded-2xl mb-3.5 relative overflow-hidden">
          {/* Skeleton placeholder while loading */}
          {!imageLoaded && (
            <div className="absolute inset-0 bg-[#222] animate-pulse" />
          )}

          <img
            src={product.images[currentImageIndex] || product.images[0]}
            alt={product.title}
            onLoad={() => setImageLoaded(true)}
            className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
            loading="lazy"
          />

          {/* Carousel arrows */}
          {product.images.length > 1 && (
            <>
              <button
                onClick={handlePrevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/70 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/90 cursor-pointer z-10"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/70 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/90 cursor-pointer z-10"
                aria-label="Next image"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              {/* Photo Dots Counter */}
              <div className="absolute top-2 right-2 bg-black/80 backdrop-blur-md px-1.5 py-0.5 rounded-full text-[9px] font-bold text-white/80 z-10 border border-white/10">
                {currentImageIndex + 1}/{product.images.length}
              </div>
            </>
          )}

          {/* Top Status & Discount Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
            {discountPercent && discountPercent > 20 && (
              <span className="bg-red-600 text-white px-2 py-0.5 rounded-full text-[9px] font-bold tracking-tight shadow-md flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5" />
                {discountPercent}% OFF Retail
              </span>
            )}
            {product.isFeatured && (
              <span className="bg-[#D4AF37] text-black px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-tighter shadow-sm flex items-center gap-1">
                <Crown className="w-2.5 h-2.5 fill-black" />
                Featured
              </span>
            )}
            {product.listingType === 'both' ? (
              <span className="bg-black/80 text-[#D4AF37] border border-[#D4AF37]/40 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-tighter backdrop-blur-sm">
                Rent & Buy
              </span>
            ) : product.listingType === 'buy' ? (
              <span className="bg-blue-950/80 text-blue-300 border border-blue-500/40 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-tighter backdrop-blur-sm">
                Direct Buy
              </span>
            ) : null}
          </div>

          {/* City & Rating & Views Bar */}
          <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[10px] text-white/90">
            <span className="px-2 py-0.5 rounded-full bg-black/80 backdrop-blur-md border border-white/10 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-[#D4AF37]" />
              <span className="truncate max-w-[80px]">{product.city}</span>
            </span>

            <div className="flex items-center gap-1.5">
              {product.viewsCount ? (
                <span className="px-2 py-0.5 rounded-full bg-black/80 backdrop-blur-md border border-white/10 flex items-center gap-1 text-white/70">
                  <Eye className="w-3 h-3 text-white/50" />
                  <span>{product.viewsCount}</span>
                </span>
              ) : null}
              <span className="px-2 py-0.5 rounded-full bg-black/80 backdrop-blur-md border border-white/10 flex items-center gap-1 text-[#D4AF37] font-bold">
                <Star className="w-3 h-3 fill-[#D4AF37]" />
                <span>{product.rating}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Title and Specs */}
        <h3 className="font-medium text-sm sm:text-base text-white line-clamp-1 group-hover:text-[#D4AF37] transition-colors">
          {product.title}
        </h3>
        <p className="text-white/40 text-xs mt-0.5 truncate">
          Size: {product.size} • {product.category} • {product.color}
        </p>
      </div>

      {/* Pricing and Action Area */}
      <div>
        <div className="flex justify-between items-end mt-3 pt-3 border-t border-white/5">
          <div>
            {product.listingType !== 'buy' ? (
              <div>
                <span className="font-serif text-[#D4AF37] font-bold text-base sm:text-lg">
                  ₹{product.rentPricePerDay.toLocaleString('en-IN')}{' '}
                  <span className="text-xs text-white/40 font-sans font-normal">/ day</span>
                </span>
                {product.originalRetailPrice && (
                  <p className="text-[10px] text-white/40 line-through">
                    Retail ₹{product.originalRetailPrice.toLocaleString('en-IN')}
                  </p>
                )}
              </div>
            ) : (
              <div>
                <span className="font-serif text-white font-bold text-base sm:text-lg">
                  ₹{product.salePrice?.toLocaleString('en-IN')}
                </span>
                {product.originalRetailPrice && (
                  <p className="text-[10px] text-white/40 line-through">
                    Retail ₹{product.originalRetailPrice.toLocaleString('en-IN')}
                  </p>
                )}
              </div>
            )}
          </div>

          <button 
            onClick={(e) => {
              e.stopPropagation();
              setSelectedProduct(product);
            }}
            className="text-xs font-bold uppercase tracking-wider text-[#D4AF37] hover:underline"
          >
            Quick View
          </button>
        </div>

        {/* Action Buttons Row */}
        <div className="mt-3 grid grid-cols-2 gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedProduct(product);
            }}
            className="w-full bg-[#D4AF37] text-black hover:brightness-110 font-bold py-2 rounded-full text-xs uppercase tracking-wider flex items-center justify-center gap-1 shadow-sm transition-all cursor-pointer"
            id={`rent-now-btn-${product.id}`}
          >
            {product.listingType === 'buy' ? (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Buy</span>
              </>
            ) : (
              <>
                <Calendar className="w-3.5 h-3.5" />
                <span>Rent</span>
              </>
            )}
          </button>

          <button
            onClick={handleWhatsAppInquiry}
            className="w-full bg-white/5 hover:bg-white/10 text-white/90 border border-white/10 py-2 rounded-full text-xs font-medium flex items-center justify-center gap-1 transition-colors cursor-pointer"
            id={`whatsapp-btn-${product.id}`}
            title="Chat on WhatsApp"
          >
            <MessageCircle className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Chat</span>
          </button>
        </div>
      </div>

    </div>
  );
};
