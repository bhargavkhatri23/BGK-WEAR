import React from 'react';
import { 
  Sparkles, 
  Flame, 
  MapPin, 
  Crown, 
  ArrowRight, 
  ShieldCheck, 
  MessageSquare,
  Users, 
  Clock, 
  Lock,
  Heart,
  Plus,
  SlidersHorizontal,
  Search,
  CheckCircle,
  Tag,
  Star,
  Layers,
  ChevronRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { StoryReels } from './StoryReels';
import { HeroBanner } from './HeroBanner';
import { CategoryScroll } from './CategoryScroll';
import { ProductCard } from './ProductCard';
import { FEATURED_DESIGNER_HOUSES, POPULAR_SEARCHES } from '../data/mockData';

export const HomeFeed: React.FC = () => {
  const { 
    products, 
    filterState, 
    updateFilter, 
    setActiveTab, 
    setActiveModal, 
    user,
    selectedCity 
  } = useApp();

  // Featured Outfits
  const featuredProducts = products.filter((p) => p.isFeatured);
  
  // Trending Wedding Outfits
  const trendingOutfits = products.filter(
    (p) => p.category === 'Bridal Lehenga' || p.category === 'Groom Sherwani' || p.category === 'Gown'
  );

  // Ready for Instant Rental
  const readyRentalOutfits = products.filter(
    (p) => p.listingType !== 'buy' && p.status === 'active'
  );

  // Nearby outfits (matching user city or Mumbai default)
  const nearbyCity = selectedCity !== 'All Cities' ? selectedCity : (user.city || 'Mumbai');
  const nearbyProducts = products.filter(
    (p) => p.city.toLowerCase() === nearbyCity.toLowerCase()
  );

  // Recently Added outfits (sorted by creation date)
  const recentlyAdded = [...products]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 4);

  // Premium Collections (Couture value >= 1 Lakh or Sabyasachi/Manish Malhotra)
  const premiumCollections = products.filter(
    (p) => (p.originalRetailPrice && p.originalRetailPrice >= 90000) || p.brand.includes('Sabyasachi') || p.brand.includes('Manish') || p.brand.includes('Tarun')
  ).slice(0, 4);

  // Best Rental Deals (High luxury at affordable rent rate under ₹3500/day)
  const bestRentalDeals = [...products]
    .filter((p) => p.rentPricePerDay <= 3500)
    .sort((a, b) => a.rentPricePerDay - b.rentPricePerDay)
    .slice(0, 4);

  // Recommended For You (Top rated outfits with high customer reviews)
  const recommendedForYou = [...products]
    .sort((a, b) => (b.rating * (b.reviewsCount || 1)) - (a.rating * (a.reviewsCount || 1)))
    .slice(0, 4);

  // Fine Jewelry & Accessories
  const jewelryAndAccessories = products.filter(
    (p) => p.category === 'Jewelry' || p.category === 'Accessories'
  );

  const handlePopularSearch = (query: string) => {
    updateFilter({ searchQuery: query });
    setActiveTab('explore');
  };

  const handleDesignerFilter = (brandName: string) => {
    updateFilter({ brands: [brandName], searchQuery: '' });
    setActiveTab('explore');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-4 sm:py-6 space-y-10">
      
      {/* Instagram-style Story Reels */}
      <section>
        <StoryReels />
      </section>

      {/* Category Pills & Visual Carousel */}
      <section>
        <CategoryScroll />
      </section>

      {/* Popular Discovery Quick Tags */}
      <section className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 text-xs">
        <span className="text-[#D4AF37] font-bold uppercase tracking-wider text-[11px] whitespace-nowrap flex items-center gap-1 flex-shrink-0">
          <Sparkles className="w-3.5 h-3.5" />
          Trending Searches:
        </span>
        {POPULAR_SEARCHES.map((query) => (
          <button
            key={query}
            onClick={() => handlePopularSearch(query)}
            className="px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-white/10 text-white/80 border border-white/10 hover:border-[#D4AF37]/50 whitespace-nowrap transition-colors cursor-pointer text-[11px] flex-shrink-0"
          >
            {query}
          </button>
        ))}
      </section>

      {/* Featured Hero Banner & Quick Seller Highlight Row */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-8 flex flex-col">
          <HeroBanner />
        </div>

        {/* Side Grid as in Sleek Interface Design */}
        <div className="lg:col-span-4 flex flex-col gap-5 justify-between">
          {/* Nearby Listing Highlight Card */}
          {nearbyProducts[0] ? (
            <div className="bg-[#111] rounded-3xl p-5 border border-white/5 flex flex-col justify-between shadow-xl flex-1">
              <div>
                <div className="flex justify-between items-start mb-3">
                  <span className="text-[#D4AF37] text-xs font-bold uppercase tracking-widest flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    Available in {nearbyCity}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-[#D4AF37]" />
                  </div>
                </div>

                <div className="h-32 sm:h-36 bg-[#222] rounded-2xl mb-3.5 relative overflow-hidden">
                  <img 
                    src={nearbyProducts[0].images[0]} 
                    alt={nearbyProducts[0].title} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-transparent to-transparent" />
                </div>

                <h3 className="font-medium text-base text-white truncate">
                  {nearbyProducts[0].title}
                </h3>
                <p className="text-white/40 text-xs mt-0.5">
                  Same-day trial available in {nearbyProducts[0].city}
                </p>
              </div>

              <div className="flex justify-between items-center mt-4 pt-4 border-t border-white/5">
                <span className="font-serif text-[#D4AF37] font-bold text-base">
                  ₹{nearbyProducts[0].rentPricePerDay.toLocaleString('en-IN')}{' '}
                  <span className="text-xs text-white/30 font-sans font-normal">/ rent</span>
                </span>
                <button 
                  onClick={() => {
                    updateFilter({ city: nearbyCity });
                    setActiveTab('explore');
                  }}
                  className="text-xs font-bold uppercase underline tracking-widest text-[#D4AF37] cursor-pointer"
                >
                  View City Outfits
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-[#111] rounded-3xl p-5 border border-white/5 flex flex-col justify-between shadow-xl flex-1">
              <div className="space-y-2">
                <span className="text-[#D4AF37] text-xs font-bold uppercase tracking-widest">
                  VIP Concierge
                </span>
                <h3 className="text-base font-serif text-white font-light">
                  Bridal Fitting & Personal Styling
                </h3>
                <p className="text-xs text-white/50">
                  Connect with our certified bridal stylists for personalized outfit matching and custom measurements.
                </p>
              </div>
              <button
                onClick={() => setActiveTab('explore')}
                className="mt-4 py-2.5 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-white hover:bg-white/10 transition-colors"
              >
                Browse Catalog
              </button>
            </div>
          )}

          {/* Quick Seller / Earn Promo Card */}
          <div className="bg-[#D4AF37] rounded-3xl p-6 flex items-center gap-4 text-black shadow-xl">
            <div className="w-14 h-14 rounded-full bg-black/20 flex items-center justify-center border border-black/10 flex-shrink-0">
              <Plus className="w-7 h-7 stroke-[3] text-black" />
            </div>
            <div>
              <div className="text-sm font-bold uppercase tracking-tight">Earn as you celebrate</div>
              <div className="text-xs opacity-80 mb-2 leading-snug">List your premium wedding wear and start earning up to ₹50,000/mo.</div>
              <button 
                onClick={() => setActiveModal('upload')}
                className="text-[10px] font-black uppercase bg-black text-white px-3.5 py-1.5 rounded-full hover:bg-neutral-900 transition-colors cursor-pointer"
              >
                + List Your Outfit
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges Banner */}
      <section className="p-6 sm:p-8 rounded-3xl bg-[#111] border border-white/5 shadow-xl grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
        <div className="flex flex-col items-center gap-2 p-2">
          <div className="w-11 h-11 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#D4AF37]">
            <Lock className="w-5 h-5" />
          </div>
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">Direct Buyer-Seller Deals</h4>
          <p className="text-[11px] text-white/50">Direct contact & local pickup with 0% commission</p>
        </div>

        <div className="flex flex-col items-center gap-2 p-2">
          <div className="w-11 h-11 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#D4AF37]">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">Verified Designers</h4>
          <p className="text-[11px] text-white/50">Original couture directly from bridal curators</p>
        </div>

        <div className="flex flex-col items-center gap-2 p-2">
          <div className="w-11 h-11 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#D4AF37]">
            <MessageSquare className="w-5 h-5" />
          </div>
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">Direct In-App Chat</h4>
          <p className="text-[11px] text-white/50">Chat & negotiate prices directly with curators</p>
        </div>

        <div className="flex flex-col items-center gap-2 p-2">
          <div className="w-11 h-11 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#D4AF37]">
            <Users className="w-5 h-5" />
          </div>
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">Direct Handover & Pickup</h4>
          <p className="text-[11px] text-white/50">Flexible local pickup & buyer-seller coordination</p>
        </div>
      </section>

      {/* Featured Bridal & Royal Collections */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[#D4AF37] text-xs font-bold uppercase tracking-widest">
              Curated Masterpieces
            </span>
            <h2 className="text-lg sm:text-2xl font-serif font-light text-white">
              Featured Bridal & Royal Collections
            </h2>
          </div>

          <button
            onClick={() => {
              updateFilter({ sortBy: 'featured' });
              setActiveTab('explore');
            }}
            className="text-xs font-bold uppercase underline tracking-widest text-[#D4AF37] hover:brightness-125 cursor-pointer"
          >
            View All ({featuredProducts.length})
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {featuredProducts.slice(0, 4).map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      </section>

      {/* Trending Wedding Outfits */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[#D4AF37] text-xs font-bold uppercase tracking-widest">
              Season Favorites
            </span>
            <h2 className="text-lg sm:text-2xl font-serif font-light text-white">
              Trending for Wedding Season 2025-26
            </h2>
          </div>

          <button
            onClick={() => setActiveTab('explore')}
            className="text-xs font-bold uppercase underline tracking-widest text-[#D4AF37] hover:brightness-125 cursor-pointer"
          >
            Explore All
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {trendingOutfits.slice(0, 4).map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      </section>

      {/* Premium Designer Houses & Verified Boutique Vaults */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[#D4AF37] text-xs font-bold uppercase tracking-widest">
              Couture Houses
            </span>
            <h2 className="text-lg sm:text-2xl font-serif font-light text-white">
              Verified Designer Boutiques & Collections
            </h2>
          </div>
          <span className="text-xs text-white/40 hidden sm:inline-block">
            Curated Designer Collections
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {FEATURED_DESIGNER_HOUSES.map((house) => (
            <div
              key={house.id}
              onClick={() => handleDesignerFilter(house.designer)}
              className="group relative rounded-3xl bg-[#111] border border-white/5 hover:border-[#D4AF37]/40 p-5 space-y-4 cursor-pointer transition-all duration-300 shadow-xl overflow-hidden flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="aspect-[16/10] rounded-2xl overflow-hidden relative bg-[#222]">
                  <img
                    src={house.image}
                    alt={house.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/80 backdrop-blur-md border border-[#D4AF37]/30 text-[10px] text-[#D4AF37] font-bold uppercase">
                    <Crown className="w-3 h-3" />
                    Verified Atelier
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <img
                    src={house.avatar}
                    alt={house.designer}
                    className="w-10 h-10 rounded-full object-cover border border-[#D4AF37]/40 flex-shrink-0"
                  />
                  <div className="min-w-0">
                    <h3 className="font-bold text-white text-sm truncate group-hover:text-[#D4AF37] transition-colors">
                      {house.name}
                    </h3>
                    <p className="text-xs text-white/50 truncate">{house.location}</p>
                  </div>
                </div>

                <p className="text-xs text-white/60 line-clamp-2 leading-relaxed">
                  {house.tagline}
                </p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-white/5 text-xs">
                <span className="text-[#D4AF37] font-semibold">{house.totalOutfits} Outfits</span>
                <span className="text-white/40 flex items-center gap-1 group-hover:text-white transition-colors">
                  Explore <ChevronRight className="w-3.5 h-3.5 text-[#D4AF37]" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Available for Instant Rental */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[#D4AF37] text-xs font-bold uppercase tracking-widest">
              Instant Booking Ready
            </span>
            <h2 className="text-lg sm:text-2xl font-serif font-light text-white">
              Rental Available Outfits Ready for Direct Handover
            </h2>
          </div>

          <button
            onClick={() => {
              updateFilter({ listingType: 'rent' });
              setActiveTab('explore');
            }}
            className="text-xs font-bold uppercase underline tracking-widest text-[#D4AF37] hover:brightness-125 cursor-pointer"
          >
            View All Rentals
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {readyRentalOutfits.slice(0, 4).map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      </section>

      {/* Nearby Listings in User City */}
      {nearbyProducts.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[#D4AF37] text-xs font-bold uppercase tracking-widest">
                Local Express Trials
              </span>
              <h2 className="text-lg sm:text-2xl font-serif font-light text-white">
                Available Near You in {nearbyCity}
              </h2>
            </div>

            <button
              onClick={() => {
                updateFilter({ city: nearbyCity });
                setActiveTab('explore');
              }}
              className="text-xs font-bold uppercase underline tracking-widest text-[#D4AF37] hover:brightness-125 cursor-pointer"
            >
              See All ({nearbyProducts.length})
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {nearbyProducts.slice(0, 4).map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        </section>
      )}

      {/* Recently Added Outfits */}
      {recentlyAdded.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[#D4AF37] text-xs font-bold uppercase tracking-widest">
                Fresh Arrivals
              </span>
              <h2 className="text-lg sm:text-2xl font-serif font-light text-white">
                Recently Added Couture
              </h2>
            </div>

            <button
              onClick={() => {
                updateFilter({ sortBy: 'newest' });
                setActiveTab('explore');
              }}
              className="text-xs font-bold uppercase underline tracking-widest text-[#D4AF37] hover:brightness-125 cursor-pointer"
            >
              View Newest
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {recentlyAdded.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        </section>
      )}

      {/* Premium Collections (Couture Vault) */}
      {premiumCollections.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[#D4AF37] text-xs font-bold uppercase tracking-widest">
                Haute Couture Atelier
              </span>
              <h2 className="text-lg sm:text-2xl font-serif font-light text-white">
                Premium Designer Collections
              </h2>
            </div>

            <button
              onClick={() => {
                updateFilter({ sortBy: 'price_high' });
                setActiveTab('explore');
              }}
              className="text-xs font-bold uppercase underline tracking-widest text-[#D4AF37] hover:brightness-125 cursor-pointer"
            >
              Explore Collection
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {premiumCollections.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        </section>
      )}

      {/* Best Rental Deals */}
      {bestRentalDeals.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[#D4AF37] text-xs font-bold uppercase tracking-widest">
                Pocket-Friendly Glamour
              </span>
              <h2 className="text-lg sm:text-2xl font-serif font-light text-white">
                Best Rental Deals Under ₹3,500/day
              </h2>
            </div>

            <button
              onClick={() => {
                updateFilter({ maxRentPrice: 3500, sortBy: 'price_low' });
                setActiveTab('explore');
              }}
              className="text-xs font-bold uppercase underline tracking-widest text-[#D4AF37] hover:brightness-125 cursor-pointer"
            >
              See All Deals
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {bestRentalDeals.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        </section>
      )}

      {/* Recommended For You */}
      {recommendedForYou.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[#D4AF37] text-xs font-bold uppercase tracking-widest">
                Tailored Selections
              </span>
              <h2 className="text-lg sm:text-2xl font-serif font-light text-white">
                Recommended For You
              </h2>
            </div>

            <button
              onClick={() => {
                updateFilter({ sortBy: 'rating' });
                setActiveTab('explore');
              }}
              className="text-xs font-bold uppercase underline tracking-widest text-[#D4AF37] hover:brightness-125 cursor-pointer"
            >
              See Recommendations
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {recommendedForYou.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        </section>
      )}

      {/* Royal Jewelry & Accessories */}
      {jewelryAndAccessories.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[#D4AF37] text-xs font-bold uppercase tracking-widest">
                Heirloom Collection
              </span>
              <h2 className="text-lg sm:text-2xl font-serif font-light text-white">
                Royal Jewelry & Heritage Accessories
              </h2>
            </div>

            <button
              onClick={() => {
                updateFilter({ category: 'Jewelry' });
                setActiveTab('explore');
              }}
              className="text-xs font-bold uppercase underline tracking-widest text-[#D4AF37] hover:brightness-125 cursor-pointer"
            >
              View Jewelry
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {jewelryAndAccessories.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        </section>
      )}

      {/* Earn with BGK WEAR Promo Banner */}
      <section className="relative rounded-3xl overflow-hidden bg-[#111] border border-white/5 shadow-2xl p-6 sm:p-10">
        <div className="relative z-10 max-w-xl space-y-4">
          <span className="bg-[#D4AF37] text-black px-3 py-1 rounded text-[10px] font-bold uppercase tracking-tighter inline-block">
            For Brides & Wardrobe Owners
          </span>
          <h3 className="text-2xl sm:text-3xl font-serif font-light text-white leading-tight">
            Turn Your Wedding Outfits into Steady Rental Income
          </h3>
          <p className="text-xs sm:text-sm text-white/60 leading-relaxed">
            Don't let your designer bridal lehengas sit in suitcases. Rent or sell directly to verified brides and fashion lovers across India with 0% platform commission.
          </p>
          <div className="pt-2">
            <button
              onClick={() => setActiveModal('upload')}
              className="px-8 py-3.5 bg-[#D4AF37] text-black font-bold rounded-full text-xs uppercase tracking-wider shadow-xl flex items-center gap-2 hover:brightness-110 transition-all cursor-pointer"
              id="home-cta-list-outfit"
            >
              <Sparkles className="w-4 h-4" />
              <span>List Your Wedding Outfit (Free)</span>
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};

