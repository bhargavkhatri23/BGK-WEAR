import React, { useState } from 'react';
import { 
  Search, 
  Heart, 
  Bell, 
  MapPin, 
  PlusCircle, 
  ShieldCheck, 
  Crown, 
  Menu, 
  X, 
  SlidersHorizontal,
  ChevronDown,
  MessageSquare,
  ShoppingBag
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CITIES_LIST } from '../data/mockData';

export const Navbar: React.FC = () => {
  const { 
    user, 
    wishlist, 
    notifications, 
    totalUnreadChats,
    rentalBookings,
    purchaseOrders,
    selectedCity, 
    setSelectedCity, 
    activeTab, 
    setActiveTab, 
    filterState, 
    updateFilter, 
    setActiveModal,
    setUserRole
  } = useApp();

  const [cityDropdownOpen, setCityDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const unreadNotifs = notifications.filter((n) => !n.read).length;
  const activeOrdersCount = rentalBookings.filter((r) => r.status !== 'Completed').length + purchaseOrders.length;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab !== 'explore') {
      setActiveTab('explore');
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#050505]/95 backdrop-blur-xl border-b border-[#D4AF37]/20 shadow-lg">
      {/* Top micro-announcement banner */}
      <div className="bg-[#0a0a0a] border-b border-[#D4AF37]/15 py-1 px-4 text-center text-xs text-[#D4AF37] flex items-center justify-center gap-2">
        <Crown className="w-3.5 h-3.5 text-[#D4AF37] animate-pulse" />
        <span className="font-medium tracking-wide">
          India's Premier Bridal & Wedding Wear Marketplace • Direct Buyer-Seller Connect • 0% Commission
        </span>
        <span className="hidden md:inline-block text-[#D4AF37] font-semibold underline cursor-pointer ml-1 hover:brightness-110" onClick={() => setActiveModal('upload')}>
          List Your Outfit & Earn up to ₹50,000/mo
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-3 sm:gap-6">
          
          {/* Brand Logo & Crown */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => { setActiveTab('home'); }}
              className="flex items-center gap-2.5 text-left group focus:outline-none"
              id="brand-logo-btn"
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#D4AF37]/15 border border-[#D4AF37]/40 flex items-center justify-center group-hover:border-[#D4AF37] transition-all">
                <Crown className="w-5 h-5 text-[#D4AF37]" />
              </div>
              <div>
                <span className="text-xl sm:text-2xl font-bold tracking-widest text-[#D4AF37] font-serif uppercase">
                  BGK Wear
                </span>
                <p className="text-[9px] text-white/50 font-sans tracking-widest uppercase -mt-0.5 hidden sm:block">
                  Luxury Wedding Couture
                </p>
              </div>
            </button>

            {/* City Selector */}
            <div className="relative ml-2 sm:ml-4 hidden md:block">
              <button
                onClick={() => setCityDropdownOpen(!cityDropdownOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#111] border border-[#D4AF37]/30 text-xs text-white/80 hover:border-[#D4AF37] transition-colors"
                id="city-selector-btn"
              >
                <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span className="font-medium max-w-[100px] truncate">{selectedCity}</span>
                <ChevronDown className="w-3 h-3 text-white/50" />
              </button>

              {cityDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-[#111] border border-[#D4AF37]/30 rounded-2xl shadow-2xl py-2 z-50 max-h-60 overflow-y-auto">
                  <div className="px-3 py-1 text-[11px] font-semibold text-[#D4AF37] uppercase tracking-wider">
                    Select Your City
                  </div>
                  {CITIES_LIST.map((city) => (
                    <button
                      key={city}
                      onClick={() => {
                        setSelectedCity(city);
                        setCityDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-white/5 transition-colors ${
                        selectedCity === city ? 'text-[#D4AF37] font-bold bg-[#D4AF37]/10' : 'text-white/70'
                      }`}
                    >
                      <span>{city}</span>
                      {selectedCity === city && <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-xl mx-2 hidden sm:block">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                placeholder="Search for Bridal Lehenga, Sherwani, Saree..."
                value={filterState.searchQuery}
                onChange={(e) => {
                  updateFilter({ searchQuery: e.target.value });
                  if (activeTab !== 'explore' && e.target.value.length > 2) {
                    setActiveTab('explore');
                  }
                }}
                className="w-full bg-[#111] border border-[#D4AF37]/30 rounded-full px-5 pl-10 pr-10 py-2.5 text-sm text-white placeholder-white/40 focus:outline-none focus:border-[#D4AF37] transition-all"
                id="search-input-desktop"
              />
              <Search className="w-4 h-4 text-[#D4AF37] opacity-70 absolute left-4 top-3.5" />
              {filterState.searchQuery && (
                <button
                  type="button"
                  onClick={() => updateFilter({ searchQuery: '' })}
                  className="absolute right-3.5 top-3 text-white/50 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </form>
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-3 sm:gap-5">
            {/* Filter Drawer Trigger for mobile */}
            <button
              onClick={() => setActiveModal('filters')}
              className="p-2 sm:hidden rounded-full bg-[#111] border border-white/10 text-[#D4AF37]"
              title="Open Filters"
              id="mobile-filters-trigger"
            >
              <SlidersHorizontal className="w-4 h-4 text-[#D4AF37]" />
            </button>

            {/* List Outfit / Sell Button */}
            <button
              onClick={() => setActiveModal('upload')}
              className="px-6 py-2 bg-[#D4AF37] text-black font-bold rounded-full text-xs uppercase tracking-wider hidden md:flex items-center gap-1.5 shadow-md hover:brightness-110 transition-all cursor-pointer"
              id="list-outfit-navbar-btn"
            >
              <PlusCircle className="w-4 h-4" />
              <span>List Outfit</span>
            </button>

            {/* Chat Concierge button */}
            <button
              onClick={() => setActiveTab('chat')}
              className={`relative p-2.5 rounded-full border transition-all ${
                activeTab === 'chat' 
                  ? 'bg-[#D4AF37]/20 border-[#D4AF37] text-[#D4AF37]' 
                  : 'bg-[#111] border-white/10 text-white/70 hover:text-[#D4AF37] hover:border-[#D4AF37]/40'
              }`}
              title="Chat & Negotiation Concierge"
              id="chat-nav-btn"
            >
              <MessageSquare className="w-4 h-4" />
              {totalUnreadChats > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#D4AF37] text-black text-[10px] font-extrabold rounded-full flex items-center justify-center shadow-sm">
                  {totalUnreadChats}
                </span>
              )}
            </button>

            {/* Orders & Bookings button */}
            <button
              onClick={() => setActiveTab('orders')}
              className={`relative p-2.5 rounded-full border transition-all ${
                activeTab === 'orders' 
                  ? 'bg-[#D4AF37]/20 border-[#D4AF37] text-[#D4AF37]' 
                  : 'bg-[#111] border-white/10 text-white/70 hover:text-[#D4AF37] hover:border-[#D4AF37]/40'
              }`}
              title="My Bookings & Orders"
              id="orders-nav-btn"
            >
              <ShoppingBag className="w-4 h-4" />
              {activeOrdersCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 text-black text-[10px] font-extrabold rounded-full flex items-center justify-center shadow-sm">
                  {activeOrdersCount}
                </span>
              )}
            </button>

            {/* Wishlist button */}
            <button
              onClick={() => setActiveTab('wishlist')}
              className={`relative p-2.5 rounded-full border transition-all ${
                activeTab === 'wishlist' 
                  ? 'bg-[#D4AF37]/20 border-[#D4AF37] text-[#D4AF37]' 
                  : 'bg-[#111] border-white/10 text-white/70 hover:text-[#D4AF37] hover:border-[#D4AF37]/40'
              }`}
              title="Saved Wishlist"
              id="wishlist-nav-btn"
            >
              <Heart className={`w-4 h-4 ${wishlist.length > 0 ? 'fill-[#D4AF37] text-[#D4AF37]' : ''}`} />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#D4AF37] text-black text-[10px] font-extrabold rounded-full flex items-center justify-center shadow-sm">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Notifications button */}
            <button
              onClick={() => setActiveModal('notifications')}
              className="relative p-2.5 rounded-full bg-[#111] border border-white/10 text-[#D4AF37] hover:border-[#D4AF37]/50 transition-all"
              title="Notifications"
              id="notifications-nav-btn"
            >
              <Bell className="w-4 h-4 text-[#D4AF37]" />
              {unreadNotifs > 0 && (
                <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full"></span>
              )}
            </button>

            {/* Role switch / Profile Avatar */}
            <div className="relative">
              <button
                onClick={() => setActiveTab('profile')}
                className={`flex items-center gap-2 p-0.5 rounded-full transition-all ${
                  activeTab === 'profile'
                    ? 'ring-2 ring-[#D4AF37]'
                    : ''
                }`}
                id="profile-nav-btn"
              >
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border-2 border-[#D4AF37] overflow-hidden">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </button>
            </div>

            {/* Quick Demo Switcher (Buyer/Seller/Admin) */}
            <div className="hidden xl:flex items-center bg-[#111] rounded-full p-1 border border-white/10">
              {(['buyer', 'seller', 'admin'] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => {
                    setUserRole(r);
                    if (r === 'admin') setActiveTab('admin');
                  }}
                  className={`px-3 py-1 text-[10px] font-bold rounded-full uppercase tracking-wider transition-colors ${
                    user.role === r 
                      ? 'bg-[#D4AF37] text-black shadow-sm' 
                      : 'text-white/50 hover:text-white'
                  }`}
                  id={`role-switch-${r}`}
                >
                  {r}
                </button>
              ))}
            </div>

            {/* Mobile menu hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 md:hidden rounded-lg bg-[#111] border border-white/10 text-white/70"
              id="mobile-menu-toggle"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5 text-[#D4AF37]" />}
            </button>
          </div>

        </div>

        {/* Mobile Search Bar row */}
        <div className="pb-3 sm:hidden">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="Search for Bridal Lehenga, Sherwani..."
              value={filterState.searchQuery}
              onChange={(e) => {
                updateFilter({ searchQuery: e.target.value });
                if (activeTab !== 'explore' && e.target.value.length > 2) {
                  setActiveTab('explore');
                }
              }}
              className="w-full bg-[#111] border border-[#D4AF37]/30 text-xs text-white placeholder-white/40 pl-9 pr-8 py-2 rounded-full focus:border-[#D4AF37] focus:outline-none"
              id="search-input-mobile"
            />
            <Search className="w-3.5 h-3.5 text-[#D4AF37] opacity-70 absolute left-3.5 top-2.5" />
          </form>
        </div>

        {/* Mobile Drawer Navigation Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/10 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex items-center justify-between px-2 pb-2 border-b border-white/10">
              <span className="text-xs text-white/50">Current City:</span>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="bg-[#111] text-xs text-[#D4AF37] font-semibold border border-[#D4AF37]/30 rounded-full px-3 py-1"
              >
                {CITIES_LIST.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-3 gap-2 px-1">
              {(['buyer', 'seller', 'admin'] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => {
                    setUserRole(r);
                    if (r === 'admin') setActiveTab('admin');
                    setMobileMenuOpen(false);
                  }}
                  className={`py-2 rounded-full text-xs font-bold uppercase ${
                    user.role === r ? 'bg-[#D4AF37] text-black' : 'bg-[#111] text-white/70 border border-white/10'
                  }`}
                >
                  {r} Mode
                </button>
              ))}
            </div>

            {/* Navigation links */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={() => {
                  setActiveTab('chat');
                  setMobileMenuOpen(false);
                }}
                className={`py-2 px-3 rounded-2xl text-xs font-semibold flex items-center justify-between border transition-all ${
                  activeTab === 'chat'
                    ? 'bg-[#D4AF37]/20 border-[#D4AF37] text-[#D4AF37]'
                    : 'bg-[#111] border-white/10 text-white/80'
                }`}
              >
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Chat Concierge</span>
                </div>
                {totalUnreadChats > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full bg-[#D4AF37] text-black text-[9px] font-bold">
                    {totalUnreadChats}
                  </span>
                )}
              </button>

              <button
                onClick={() => {
                  setActiveTab('orders');
                  setMobileMenuOpen(false);
                }}
                className={`py-2 px-3 rounded-2xl text-xs font-semibold flex items-center justify-between border transition-all ${
                  activeTab === 'orders'
                    ? 'bg-[#D4AF37]/20 border-[#D4AF37] text-[#D4AF37]'
                    : 'bg-[#111] border-white/10 text-white/80'
                }`}
              >
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Bookings & Orders</span>
                </div>
                {activeOrdersCount > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full bg-emerald-400 text-black text-[9px] font-bold">
                    {activeOrdersCount}
                  </span>
                )}
              </button>
            </div>

            <button
              onClick={() => {
                setActiveModal('upload');
                setMobileMenuOpen(false);
              }}
              className="w-full bg-[#D4AF37] text-black py-2.5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-lg"
            >
              <PlusCircle className="w-4 h-4" />
              <span>List Your Wedding Outfit</span>
            </button>
          </div>
        )}

      </div>
    </header>
  );
};
