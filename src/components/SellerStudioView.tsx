import React, { useState } from 'react';
import { 
  PlusCircle, 
  Sparkles, 
  DollarSign, 
  ShieldCheck, 
  TrendingUp, 
  Truck, 
  CheckCircle, 
  Calculator,
  ArrowRight,
  Crown,
  Eye,
  Heart,
  Edit3,
  Trash2,
  Filter,
  Search,
  AlertCircle,
  Clock,
  ShoppingBag,
  Calendar,
  Layers,
  MapPin,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Product } from '../types';

export const SellerStudioView: React.FC = () => {
  const { 
    setActiveModal, 
    user, 
    products, 
    setEditingProduct, 
    setSelectedProduct, 
    deleteProduct, 
    updateProductStatus,
    showToast 
  } = useApp();

  // Tab State
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'pending' | 'rented' | 'sold' | 'analytics'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [deletingProductId, setDeletingProductId] = useState<string | null>(null);

  // Earnings Calculator State
  const [estimatedOutfitValue, setEstimatedOutfitValue] = useState<number>(85000);
  const [projectedRentals, setProjectedRentals] = useState<number>(6);

  const rentPerRental = Math.round(estimatedOutfitValue * 0.05); // ~5% per 3-day rental
  const annualEarnings = rentPerRental * projectedRentals;

  // Filter listings for this user
  const myListings = products.filter(
    (p) => p.seller.id === user.id || p.seller.name.toLowerCase() === user.name.toLowerCase()
  );

  const activeListings = myListings.filter((p) => p.status === 'active');
  const pendingListings = myListings.filter((p) => p.status === 'pending_approval');
  const rentedListings = myListings.filter((p) => p.status === 'rented');
  const soldListings = myListings.filter((p) => p.status === 'sold');

  // Filtered by current tab
  const getTabListings = () => {
    let list: Product[] = [];
    switch (activeTab) {
      case 'active':
        list = activeListings;
        break;
      case 'pending':
        list = pendingListings;
        break;
      case 'rented':
        list = rentedListings;
        break;
      case 'sold':
        list = soldListings;
        break;
      case 'all':
      default:
        list = myListings;
        break;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }
    return list;
  };

  const displayedListings = getTabListings();

  const handleEdit = (prod: Product) => {
    setEditingProduct(prod);
    setActiveModal('upload');
  };

  const handleDeleteConfirm = (id: string) => {
    deleteProduct(id);
    setDeletingProductId(null);
  };

  const getStatusBadge = (status: Product['status']) => {
    switch (status) {
      case 'active':
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold uppercase tracking-wider border border-emerald-500/30 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Active Listing
          </span>
        );
      case 'pending_approval':
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 text-[10px] font-bold uppercase tracking-wider border border-amber-500/30 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Pending Verification
          </span>
        );
      case 'rented':
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-300 text-[10px] font-bold uppercase tracking-wider border border-purple-500/30 flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            Out for Wedding Rental
          </span>
        );
      case 'sold':
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-300 text-[10px] font-bold uppercase tracking-wider border border-blue-500/30 flex items-center gap-1">
            <ShoppingBag className="w-3 h-3" />
            Sold Out
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-white/60 text-[10px] font-bold uppercase tracking-wider border border-white/20">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6 space-y-8">
      
      {/* Studio Header Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-[#111] border border-white/10 shadow-2xl p-6 sm:p-10">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-3">
            <span className="px-3.5 py-1 rounded-full bg-[#D4AF37]/10 text-[#D4AF37] text-xs font-bold uppercase tracking-wider border border-[#D4AF37]/30 flex items-center gap-1.5 w-fit">
              <Crown className="w-4 h-4 text-[#D4AF37]" />
              BGK WEAR Seller Studio
            </span>

            <h1 className="text-2xl sm:text-4xl font-serif font-light text-white leading-tight">
              Seller & Designer Wardrobe Management
            </h1>

            <p className="text-xs sm:text-sm text-white/60">
              Manage your designer bridal wear, sherwanis, and luxury couture. Accept direct rental inquiries with 0% platform fee.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
            <button
              onClick={() => {
                setEditingProduct(null);
                setActiveModal('upload');
              }}
              className="px-8 py-4 bg-[#D4AF37] text-black hover:brightness-110 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-2xl cursor-pointer transition-transform active:scale-95"
              id="seller-studio-list-btn"
            >
              <PlusCircle className="w-4 h-4" />
              <span>+ List New Outfit</span>
            </button>
          </div>
        </div>

        {/* Studio Summary Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-8 pt-6 border-t border-white/5">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-1">
            <span className="text-[11px] text-white/50 block">Total Listed Outfits</span>
            <div className="text-xl sm:text-2xl font-serif font-bold text-white">{myListings.length}</div>
            <span className="text-[10px] text-emerald-400 font-semibold">{activeListings.length} Active in Catalog</span>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-1">
            <span className="text-[11px] text-white/50 block">Currently Rented</span>
            <div className="text-xl sm:text-2xl font-serif font-bold text-[#D4AF37]">{rentedListings.length}</div>
            <span className="text-[10px] text-white/40">Active Rentals</span>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-1">
            <span className="text-[11px] text-white/50 block">Direct Purchases</span>
            <div className="text-xl sm:text-2xl font-serif font-bold text-white">{soldListings.length}</div>
            <span className="text-[10px] text-blue-400">Completed Sales</span>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-1">
            <span className="text-[11px] text-white/50 block">Pending Verification</span>
            <div className="text-xl sm:text-2xl font-serif font-bold text-amber-400">{pendingListings.length}</div>
            <span className="text-[10px] text-white/40">Curation Review</span>
          </div>
        </div>
      </div>

      {/* Tabs & Search Bar */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 border-b border-white/5 pb-4">
          
          {/* Status Tabs */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {[
              { id: 'all', label: `My Listings (${myListings.length})`, icon: Layers },
              { id: 'active', label: `Active (${activeListings.length})`, icon: CheckCircle },
              { id: 'pending', label: `Pending Approval (${pendingListings.length})`, icon: Clock },
              { id: 'rented', label: `Rented Items (${rentedListings.length})`, icon: Calendar },
              { id: 'sold', label: `Sold Items (${soldListings.length})`, icon: ShoppingBag },
              { id: 'analytics', label: `Earnings Calculator`, icon: Calculator }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
                    activeTab === tab.id
                      ? 'border border-[#D4AF37] bg-[#D4AF37]/10 text-[#D4AF37]'
                      : 'border border-white/10 bg-white/5 text-white/60 hover:text-white'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Search Listings */}
          {activeTab !== 'analytics' && (
            <div className="relative min-w-[240px]">
              <Search className="w-4 h-4 text-white/40 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search by title, brand, category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#111] border border-white/10 rounded-full pl-9 pr-4 py-2 text-xs text-white placeholder:text-white/30 focus:border-[#D4AF37] focus:outline-none"
              />
            </div>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      {activeTab === 'analytics' ? (
        /* Interactive Rental Earnings Calculator & Benefits */
        <div className="space-y-8">
          <section className="p-6 sm:p-10 rounded-3xl bg-[#111] border border-white/10 shadow-2xl space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-white/5 border border-white/10 text-[#D4AF37]">
                <Calculator className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-serif font-light text-white">
                  Interactive Rental Return Calculator
                </h3>
                <p className="text-xs text-white/50">
                  Estimate your passive return on investment for bridal and groom couture
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-xs mb-2">
                    <span className="text-white/70">Original Outfit Purchase Price:</span>
                    <span className="text-[#D4AF37] font-bold text-sm">₹{estimatedOutfitValue.toLocaleString('en-IN')}</span>
                  </div>
                  <input
                    type="range"
                    min="20000"
                    max="400000"
                    step="5000"
                    value={estimatedOutfitValue}
                    onChange={(e) => setEstimatedOutfitValue(Number(e.target.value))}
                    className="w-full accent-[#D4AF37] cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-white/40 mt-1">
                    <span>₹20,000</span>
                    <span>₹2,00,000</span>
                    <span>₹4,00,000+</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-2">
                    <span className="text-white/70">Expected Rentals per Year:</span>
                    <span className="text-[#D4AF37] font-bold text-sm">{projectedRentals} Weddings / Events</span>
                  </div>
                  <input
                    type="range"
                    min="2"
                    max="15"
                    step="1"
                    value={projectedRentals}
                    onChange={(e) => setProjectedRentals(Number(e.target.value))}
                    className="w-full accent-[#D4AF37] cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-white/40 mt-1">
                    <span>2 Bookings</span>
                    <span>8 Bookings</span>
                    <span>15 Bookings</span>
                  </div>
                </div>
              </div>

              <div className="p-8 rounded-3xl bg-[#0a0a0a] border border-white/10 flex flex-col justify-center text-center space-y-3 shadow-inner">
                <span className="text-xs text-white/40 uppercase tracking-widest font-semibold">Your Estimated Annual Earnings</span>
                <div className="text-3xl sm:text-5xl font-serif font-bold text-[#D4AF37]">
                  ₹{annualEarnings.toLocaleString('en-IN')}
                </div>
                <p className="text-xs text-white/50">
                  (~₹{rentPerRental.toLocaleString('en-IN')} per rental booking)
                </p>
                <div className="pt-4">
                  <button
                    onClick={() => {
                      setEditingProduct(null);
                      setActiveModal('upload');
                    }}
                    className="px-7 py-3 bg-[#D4AF37] text-black rounded-full text-xs font-bold uppercase tracking-wider hover:brightness-110 cursor-pointer"
                  >
                    List This Outfit Now
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* How it works steps */}
          <section className="space-y-6">
            <div className="text-center space-y-1">
              <span className="text-[#D4AF37] text-xs font-bold uppercase tracking-widest">
                Simple Process
              </span>
              <h2 className="text-lg sm:text-2xl font-serif font-light text-white">
                How BGK WEAR Protects & Monetizes Your Outfits
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
              <div className="p-8 rounded-3xl bg-[#111] border border-white/5 space-y-3 shadow-xl">
                <div className="w-10 h-10 rounded-2xl bg-[#D4AF37]/10 text-[#D4AF37] flex items-center justify-center font-serif font-bold text-lg border border-[#D4AF37]/20">
                  1
                </div>
                <h3 className="text-base font-serif font-bold text-white">Upload in 2 Minutes</h3>
                <p className="text-xs text-white/50 leading-relaxed">
                  Snap photos of your bridal lehenga, sherwani, or gown. Set your daily rent price, selling price, and refundable security deposit.
                </p>
              </div>

              <div className="p-8 rounded-3xl bg-[#111] border border-white/5 space-y-3 shadow-xl">
                <div className="w-10 h-10 rounded-2xl bg-[#D4AF37]/10 text-[#D4AF37] flex items-center justify-center font-serif font-bold text-lg border border-[#D4AF37]/20">
                  2
                </div>
                <h3 className="text-base font-serif font-bold text-white">Accept Direct Inquiries</h3>
                <p className="text-xs text-white/50 leading-relaxed">
                  Chat directly on WhatsApp or phone. Agree on rental dates and security deposit directly.
                </p>
              </div>

              <div className="p-8 rounded-3xl bg-[#111] border border-white/5 space-y-3 shadow-xl">
                <div className="w-10 h-10 rounded-2xl bg-[#D4AF37]/10 text-[#D4AF37] flex items-center justify-center font-serif font-bold text-lg border border-[#D4AF37]/20">
                  3
                </div>
                <h3 className="text-base font-serif font-bold text-white">Direct Handover & Payout</h3>
                <p className="text-xs text-white/50 leading-relaxed">
                  Coordinate fitting and convenient handover directly with the buyer. Receive 100% of your earnings with 0% platform commission.
                </p>
              </div>
            </div>
          </section>
        </div>
      ) : (
        /* Listings Management Grid */
        <div className="space-y-4">
          {displayedListings.length === 0 ? (
            <div className="py-16 text-center rounded-3xl bg-[#111] border border-white/5 p-8 space-y-4 max-w-xl mx-auto">
              <div className="w-14 h-14 rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/20 text-[#D4AF37] flex items-center justify-center mx-auto">
                <Sparkles className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-serif font-light text-white">
                {searchQuery ? `No listings match "${searchQuery}"` : 'No outfits found in this section'}
              </h3>
              <p className="text-xs text-white/50">
                {searchQuery
                  ? 'Try adjusting your search keywords or clear the filter.'
                  : 'Start earning rental returns by publishing your luxury bridal or groom outfits.'}
              </p>
              <button
                onClick={() => {
                  setEditingProduct(null);
                  setActiveModal('upload');
                }}
                className="px-6 py-3 bg-[#D4AF37] text-black font-bold uppercase rounded-full text-xs hover:brightness-110 cursor-pointer"
              >
                + List First Outfit
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {displayedListings.map((prod) => (
                <div
                  key={prod.id}
                  className="rounded-3xl bg-[#111] border border-white/5 hover:border-white/20 transition-all overflow-hidden flex flex-col justify-between shadow-xl"
                >
                  <div className="p-5 sm:p-6 space-y-4">
                    
                    {/* Top Row: Thumbnail + Info */}
                    <div className="flex gap-4">
                      <div 
                        onClick={() => setSelectedProduct(prod)}
                        className="relative w-24 sm:w-28 aspect-[3/4] rounded-2xl overflow-hidden bg-black flex-shrink-0 cursor-pointer group"
                      >
                        <img
                          src={prod.images[0]}
                          alt={prod.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                        <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/80 text-white text-[9px] font-bold">
                          {prod.images.length} photos
                        </span>
                      </div>

                      <div className="flex-1 min-w-0 space-y-1.5">
                        <div className="flex items-center justify-between gap-2">
                          <span className="px-2 py-0.5 rounded-full bg-[#D4AF37]/10 text-[#D4AF37] text-[10px] font-bold uppercase tracking-wider border border-[#D4AF37]/20 truncate">
                            {prod.category}
                          </span>
                          {getStatusBadge(prod.status)}
                        </div>

                        <h4 
                          onClick={() => setSelectedProduct(prod)}
                          className="text-sm sm:text-base font-bold text-white truncate cursor-pointer hover:text-[#D4AF37] transition-colors"
                        >
                          {prod.title}
                        </h4>

                        <p className="text-xs text-white/50">
                          {prod.brand} • Size {prod.size} • {prod.color}
                        </p>

                        <div className="flex items-center gap-2 text-xs text-white/40 pt-0.5">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-[#D4AF37]" />
                            {prod.city}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1 text-white/60">
                            <Eye className="w-3 h-3" />
                            {prod.viewsCount} views
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Pricing Breakdown Card */}
                    <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 grid grid-cols-3 gap-2 text-center text-xs">
                      <div>
                        <span className="text-[10px] text-white/40 block">Rent / Day</span>
                        <span className="font-bold text-[#D4AF37]">
                          {prod.listingType !== 'buy' ? `₹${prod.rentPricePerDay?.toLocaleString('en-IN')}` : 'N/A'}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-white/40 block">Security Deposit</span>
                        <span className="font-bold text-emerald-400">
                          {prod.listingType !== 'buy' ? `₹${prod.securityDeposit?.toLocaleString('en-IN')}` : 'N/A'}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-white/40 block">Purchase Price</span>
                        <span className="font-bold text-white">
                          {prod.salePrice ? `₹${prod.salePrice?.toLocaleString('en-IN')}` : 'Rent Only'}
                        </span>
                      </div>
                    </div>

                    {/* Quick Status Selector */}
                    <div className="flex items-center justify-between text-xs pt-1 border-t border-white/5">
                      <span className="text-white/50 text-[11px]">Availability Status:</span>
                      <select
                        value={prod.status}
                        onChange={(e) => {
                          updateProductStatus(prod.id, e.target.value as any);
                          showToast(`Status updated to ${e.target.value.replace('_', ' ')}`, 'info');
                        }}
                        className="bg-[#0a0a0a] border border-white/10 rounded-xl px-2.5 py-1 text-xs text-white focus:border-[#D4AF37] focus:outline-none cursor-pointer"
                      >
                        <option value="active">Active (Available)</option>
                        <option value="rented">Currently Rented</option>
                        <option value="sold">Sold Out</option>
                        <option value="pending_approval">Pending Approval</option>
                      </select>
                    </div>

                  </div>

                  {/* Footer Action Buttons */}
                  <div className="px-5 sm:px-6 py-3.5 bg-[#0a0a0a] border-t border-white/5 flex items-center justify-between gap-2">
                    <button
                      onClick={() => setSelectedProduct(prod)}
                      className="text-xs text-white/60 hover:text-white font-medium flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Preview</span>
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(prod)}
                        className="px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-white/10 text-white/80 border border-white/10 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span>Edit</span>
                      </button>

                      <button
                        onClick={() => setDeletingProductId(prod.id)}
                        className="px-3.5 py-1.5 rounded-full bg-red-600/10 hover:bg-red-600/20 text-red-400 border border-red-500/20 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingProductId && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-sm rounded-3xl bg-[#111] border border-white/10 p-6 space-y-4 shadow-2xl text-center">
            <div className="w-12 h-12 rounded-2xl bg-red-500/10 text-red-400 border border-red-500/30 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-serif font-bold text-white">Delete Outfit Listing?</h3>
              <p className="text-xs text-white/50 mt-1">
                This action will remove the outfit from the BGK WEAR catalog. Any active rental bookings will remain documented.
              </p>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => handleDeleteConfirm(deletingProductId)}
                className="flex-1 py-2.5 rounded-full bg-red-600 hover:bg-red-500 text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setDeletingProductId(null)}
                className="flex-1 py-2.5 rounded-full bg-white/5 hover:bg-white/10 text-white/70 text-xs font-semibold transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
