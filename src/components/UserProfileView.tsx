import React, { useState } from 'react';
import { 
  User, 
  MapPin, 
  Phone, 
  MessageCircle, 
  ShieldCheck, 
  Edit3, 
  PlusCircle, 
  ShoppingBag, 
  Calendar, 
  Heart, 
  DollarSign, 
  Trash2, 
  Eye, 
  Clock, 
  CheckCircle2,
  Lock,
  ArrowRight,
  Sparkles,
  Bookmark,
  Settings,
  LogOut,
  Bell,
  Sliders,
  Camera
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ProductCard } from './ProductCard';

export const UserProfileView: React.FC = () => {
  const { 
    user, 
    setUser,
    updateUserProfile, 
    products, 
    rentalBookings, 
    purchaseOrders, 
    wishlist, 
    setActiveModal, 
    setSelectedProduct, 
    deleteProduct,
    setUserRole,
    updateFilter,
    setActiveTab,
    showToast
  } = useApp();

  const [activeProfileTab, setActiveProfileTab] = useState<'listings' | 'rentals' | 'orders' | 'wishlist' | 'searches' | 'earnings' | 'settings'>('listings');
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(user.name);
  const [editCity, setEditCity] = useState(user.city);
  const [editState, setEditState] = useState(user.state);
  const [editBio, setEditBio] = useState(user.bio);
  const [editPhone, setEditPhone] = useState(user.phone);
  const [editWhatsapp, setEditWhatsapp] = useState(user.whatsapp);
  const [editAvatar, setEditAvatar] = useState(user.avatar);
  const [coverBanner, setCoverBanner] = useState('https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1600&q=80');

  // Sample saved searches
  const savedSearches = [
    { id: '1', title: 'Sabyasachi Bridal Lehengas under ₹8,000/day', query: 'Sabyasachi', category: 'Bridal Lehenga', maxPrice: 8000 },
    { id: '2', title: 'Groom Silk Sherwanis in Mumbai', query: 'Sherwani', category: 'Groom Sherwani', city: 'Mumbai' },
    { id: '3', title: 'Tarun Tahiliani Cocktail Gowns', query: 'Tarun Tahiliani', category: 'Gown' },
    { id: '4', title: '24K Gold Kundan Jewellery Sets', query: 'Kundan', category: 'Jewellery' }
  ];

  const myListings = products.filter((p) => p.seller.id === user.id || p.seller.name.toLowerCase() === user.name.toLowerCase());
  const wishlistedProducts = products.filter((p) => wishlist.includes(p.id));

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      name: editName,
      city: editCity,
      state: editState,
      bio: editBio,
      phone: editPhone,
      whatsapp: editWhatsapp,
      avatar: editAvatar
    });
    setIsEditing(false);
  };

  const handleLogout = () => {
    setUser({
      id: 'guest',
      name: 'Guest Explorer',
      email: '',
      phone: '+91 99999 00000',
      whatsapp: '+919999900000',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      role: 'buyer',
      city: 'Mumbai',
      state: 'Maharashtra',
      bio: 'Exploring traditional wedding couture collections on BGK WEAR.',
      balanceEarnings: 0,
      isGuest: true
    });
    showToast('Signed out. You are now exploring as Guest.', 'info');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6 space-y-6">
      
      {/* Profile Header with Cover Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-[#111] border border-white/10 shadow-2xl">
        
        {/* Royal Cover Banner */}
        <div className="relative h-40 sm:h-52 w-full overflow-hidden bg-gradient-to-r from-black via-[#1c160c] to-black">
          <img
            src={coverBanner}
            alt="Profile Cover"
            className="w-full h-full object-cover opacity-45"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-[#111]/40 to-transparent" />
          
          <button
            type="button"
            onClick={() => {
              const newUrl = prompt('Enter image URL for your cover banner:', coverBanner);
              if (newUrl) setCoverBanner(newUrl);
            }}
            className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-black/60 hover:bg-black text-white/80 border border-white/20 text-[11px] font-semibold flex items-center gap-1.5 backdrop-blur-md transition-colors cursor-pointer"
          >
            <Camera className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Change Cover</span>
          </button>
        </div>

        <div className="p-6 sm:p-8 pt-0 relative -mt-16 sm:-mt-20">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6">
            
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 sm:gap-6">
              <div className="relative">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-4 border-[#111] ring-2 ring-[#D4AF37] shadow-2xl bg-black"
                />
                <span className="absolute bottom-1 right-1 w-6 h-6 rounded-full bg-[#D4AF37] text-black flex items-center justify-center text-xs font-black shadow-md">
                  ✓
                </span>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl sm:text-3xl font-serif font-light text-white">{user.name}</h1>
                  <span className="px-3 py-0.5 rounded-full bg-[#D4AF37]/10 text-[#D4AF37] text-[10px] font-bold uppercase tracking-wider border border-[#D4AF37]/40 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Verified {user.role.toUpperCase()}
                  </span>
                </div>

                <p className="text-xs text-white/60 max-w-md">{user.bio}</p>

                <div className="flex flex-wrap items-center gap-3 text-xs text-white/40 pt-1">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
                    {user.city}, {user.state}
                  </span>
                  <span className="flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-[#D4AF37]" />
                    {user.phone}
                  </span>
                  <span className="flex items-center gap-1 text-emerald-400">
                    <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                    WA: {user.whatsapp}
                  </span>
                </div>
              </div>
            </div>

            {/* Edit Profile & Action buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full sm:w-auto">
              <button
                onClick={() => setIsEditing(true)}
                className="px-5 py-2.5 rounded-full bg-white/5 text-white/80 border border-white/10 hover:border-[#D4AF37] text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                id="edit-profile-btn"
              >
                <Edit3 className="w-4 h-4" />
                <span>Edit Profile</span>
              </button>

              <button
                onClick={() => setActiveModal('upload')}
                className="px-5 py-2.5 bg-[#D4AF37] text-black hover:brightness-110 rounded-full text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-lg cursor-pointer"
                id="list-new-outfit-profile-btn"
              >
                <PlusCircle className="w-4 h-4" />
                <span>+ List Outfit</span>
              </button>
            </div>

          </div>

          {/* Role Quick Toggle */}
          <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-xs text-white/40">
            <span>Account Role Preview:</span>
            <div className="flex gap-1.5">
              {(['buyer', 'seller', 'admin'] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setUserRole(r)}
                  className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase transition-colors cursor-pointer ${
                    user.role === r ? 'bg-[#D4AF37] text-black' : 'bg-white/5 text-white/50 border border-white/10 hover:text-white'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0a0a0a] border border-white/10 rounded-3xl p-6 max-w-lg w-full space-y-4 shadow-2xl">
            <h3 className="text-lg font-serif font-light text-white">Edit Profile Details</h3>
            
            <form onSubmit={handleSaveProfile} className="space-y-3 text-xs">
              <div>
                <label className="text-white/60 block mb-1">Full Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-[#111] border border-white/10 rounded-xl p-2.5 text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-white/60 block mb-1">City</label>
                  <input
                    type="text"
                    value={editCity}
                    onChange={(e) => setEditCity(e.target.value)}
                    className="w-full bg-[#111] border border-white/10 rounded-xl p-2.5 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="text-white/60 block mb-1">State</label>
                  <input
                    type="text"
                    value={editState}
                    onChange={(e) => setEditState(e.target.value)}
                    className="w-full bg-[#111] border border-white/10 rounded-xl p-2.5 text-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-white/60 block mb-1">Bio / Boutique Description</label>
                <textarea
                  rows={2}
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  className="w-full bg-[#111] border border-white/10 rounded-xl p-2.5 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-white/60 block mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    className="w-full bg-[#111] border border-white/10 rounded-xl p-2.5 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="text-white/60 block mb-1">WhatsApp Number</label>
                  <input
                    type="tel"
                    value={editWhatsapp}
                    onChange={(e) => setEditWhatsapp(e.target.value)}
                    className="w-full bg-[#111] border border-white/10 rounded-xl p-2.5 text-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-white/60 block mb-1">Avatar Photo URL</label>
                <input
                  type="url"
                  value={editAvatar}
                  onChange={(e) => setEditAvatar(e.target.value)}
                  className="w-full bg-[#111] border border-white/10 rounded-xl p-2.5 text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 text-white/50 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#D4AF37] text-black rounded-full font-bold uppercase text-xs"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tabs Navigation */}
      <div className="flex gap-2.5 border-b border-white/5 pb-3 overflow-x-auto no-scrollbar">
        {[
          { id: 'listings', label: `My Outfits (${myListings.length})`, icon: Sparkles },
          { id: 'rentals', label: `Rentals (${rentalBookings.length})`, icon: Calendar },
          { id: 'orders', label: `Orders (${purchaseOrders.length})`, icon: ShoppingBag },
          { id: 'wishlist', label: `Wishlist (${wishlist.length})`, icon: Heart },
          { id: 'searches', label: `Saved Searches (${savedSearches.length})`, icon: Bookmark },
          { id: 'earnings', label: `Earnings (₹${(user.balanceEarnings || 0).toLocaleString('en-IN')})`, icon: DollarSign },
          { id: 'settings', label: `Settings`, icon: Settings }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveProfileTab(tab.id as any)}
              className={`px-4 py-2 rounded-full text-xs font-medium uppercase tracking-wider whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeProfileTab === tab.id
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

      {/* Tab 1: My Listings */}
      {activeProfileTab === 'listings' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-serif font-light text-white">Your Listed Outfits</h3>
            <button
              onClick={() => setActiveModal('upload')}
              className="text-xs text-[#D4AF37] font-bold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Add Another Outfit</span>
            </button>
          </div>

          {myListings.length === 0 ? (
            <div className="py-14 text-center rounded-3xl bg-[#111] border border-white/5 p-6 space-y-3">
              <p className="text-xs text-white/50">You haven't listed any wedding outfits yet.</p>
              <button
                onClick={() => setActiveModal('upload')}
                className="px-6 py-2.5 bg-[#D4AF37] text-black rounded-full text-xs font-bold uppercase"
              >
                List Your First Outfit
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {myListings.map((prod) => (
                <div key={prod.id} className="relative group">
                  <ProductCard product={prod} />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteProduct(prod.id);
                    }}
                    className="absolute top-2 left-2 p-1.5 rounded-full bg-red-600/90 text-white shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-20 cursor-pointer"
                    title="Delete Outfit"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Rentals History & Security Deposits */}
      {activeProfileTab === 'rentals' && (
        <div className="space-y-4">
          <h3 className="text-lg font-serif font-light text-white">Active & Past Rental Bookings</h3>

          {rentalBookings.length === 0 ? (
            <div className="py-14 text-center rounded-3xl bg-[#111] border border-white/5 p-6">
              <p className="text-xs text-white/50">No rental bookings yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {rentalBookings.map((booking) => (
                <div key={booking.id} className="p-4 sm:p-5 rounded-3xl bg-[#111] border border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={booking.productImage}
                      alt={booking.productTitle}
                      className="w-16 h-20 rounded-2xl object-cover border border-white/10 flex-shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[#D4AF37] bg-[#D4AF37]/10 text-[10px] font-bold uppercase">
                          {booking.status}
                        </span>
                        <span className="text-xs text-white/40">ID: #{booking.id}</span>
                      </div>
                      <h4 className="text-xs sm:text-sm font-bold text-white mt-1 line-clamp-1">
                        {booking.productTitle}
                      </h4>
                      <div className="text-xs text-white/60 mt-1 flex flex-wrap gap-3">
                        <span>Period: <strong className="text-white">{booking.startDate} to {booking.endDate} ({booking.totalDays} Days)</strong></span>
                        <span>Total Paid: <strong className="text-[#D4AF37]">₹{booking.totalPaid.toLocaleString('en-IN')}</strong></span>
                      </div>
                      <div className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
                        <Lock className="w-3 h-3 text-[#D4AF37]" />
                        <span>Security Deposit (₹{booking.securityDeposit.toLocaleString('en-IN')}): {booking.depositRefundStatus}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 w-full sm:w-auto">
                    <button 
                      onClick={() => setActiveTab('orders')}
                      className="flex-1 sm:flex-initial px-4 py-2 rounded-full bg-white/5 hover:bg-[#D4AF37]/20 hover:text-[#D4AF37] text-xs font-bold text-white/80 border border-white/10 transition-colors cursor-pointer"
                    >
                      Manage Booking
                    </button>
                    <button 
                      onClick={() => setSelectedProduct(products.find(p => p.id === booking.productId) || products[0])}
                      className="flex-1 sm:flex-initial px-5 py-2 rounded-full bg-[#D4AF37] text-black text-xs font-bold uppercase cursor-pointer hover:brightness-110 transition-all"
                    >
                      View Outfit
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Purchase Orders */}
      {activeProfileTab === 'orders' && (
        <div className="space-y-4">
          <h3 className="text-lg font-serif font-light text-white">Purchase Orders</h3>
          {purchaseOrders.length === 0 ? (
            <div className="py-14 text-center rounded-3xl bg-[#111] border border-white/5 p-6">
              <p className="text-xs text-white/50">No purchases yet. Browse catalog to buy outfits.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {purchaseOrders.map((order) => (
                <div key={order.id} className="p-4 rounded-3xl bg-[#111] border border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <img src={order.productImage} alt={order.productTitle} className="w-16 h-20 rounded-2xl object-cover border border-white/10 flex-shrink-0" />
                    <div>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-blue-950 text-blue-300 font-bold uppercase">
                        {order.status}
                      </span>
                      <h4 className="text-xs sm:text-sm font-bold text-white mt-1">{order.productTitle}</h4>
                      <p className="text-xs text-white/40 mt-0.5">Ordered on {order.orderDate} • Paid: ₹{order.totalPaid.toLocaleString('en-IN')}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="px-4 py-2 rounded-full bg-white/5 hover:bg-[#D4AF37]/20 hover:text-[#D4AF37] text-xs font-bold text-white/80 border border-white/10 transition-colors cursor-pointer"
                  >
                    Manage Purchase & Chat
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Earnings & Summary */}
      {activeProfileTab === 'earnings' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-6 rounded-3xl bg-[#111] border border-white/5">
              <span className="text-xs text-white/40 uppercase tracking-wider font-semibold">Available Wallet Balance</span>
              <div className="text-2xl sm:text-3xl font-serif font-bold text-[#D4AF37] mt-1">
                ₹{(user.balanceEarnings || 0).toLocaleString('en-IN')}
              </div>
              <p className="text-[11px] text-emerald-400 mt-1">✓ Direct rental earnings</p>
            </div>

            <div className="p-6 rounded-3xl bg-[#111] border border-white/5">
              <span className="text-xs text-white/40 uppercase tracking-wider font-semibold">Active Security Deposits</span>
              <div className="text-2xl sm:text-3xl font-serif font-bold text-white mt-1">
                ₹16,000
              </div>
              <p className="text-[11px] text-white/40 mt-1">Coordinated directly with borrowers</p>
            </div>

            <div className="p-6 rounded-3xl bg-[#111] border border-white/5">
              <span className="text-xs text-white/40 uppercase tracking-wider font-semibold">Completed Deals</span>
              <div className="text-2xl sm:text-3xl font-serif font-bold text-white mt-1">
                12 Orders
              </div>
              <p className="text-[11px] text-white/40 mt-1">5.0 Star Seller Rating</p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Wishlist */}
      {activeProfileTab === 'wishlist' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-serif font-light text-white">Your Saved Outfits ({wishlistedProducts.length})</h3>
            <button
              onClick={() => setActiveTab('explore')}
              className="text-xs text-[#D4AF37] font-bold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Explore More Designs</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {wishlistedProducts.length === 0 ? (
            <div className="py-14 text-center rounded-3xl bg-[#111] border border-white/5 p-6 space-y-3">
              <p className="text-xs text-white/50">Your wishlist is currently empty. Tap the heart icon on any outfit to save it.</p>
              <button
                onClick={() => setActiveTab('explore')}
                className="px-6 py-2.5 bg-[#D4AF37] text-black rounded-full text-xs font-bold uppercase cursor-pointer"
              >
                Browse Outfits
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {wishlistedProducts.map((prod) => (
                <ProductCard key={prod.id} product={prod} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 6: Saved Searches */}
      {activeProfileTab === 'searches' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-serif font-light text-white">Saved Searches & Couture Alerts</h3>
              <p className="text-xs text-white/50">Receive instant WhatsApp alerts when matching outfits are listed.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {savedSearches.map((s) => (
              <div key={s.id} className="p-5 rounded-3xl bg-[#111] border border-white/5 hover:border-[#D4AF37]/40 transition-colors flex flex-col justify-between gap-4">
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#D4AF37]/10 text-[#D4AF37] text-[10px] font-bold uppercase tracking-wider border border-[#D4AF37]/20">
                      {s.category}
                    </span>
                    <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                      <Bell className="w-3 h-3" />
                      Alerts Active
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white mt-2">{s.title}</h4>
                  <p className="text-xs text-white/50 mt-1">Keyword: "{s.query}" • {s.city ? `City: ${s.city}` : 'All Cities'}</p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-white/5">
                  <button
                    onClick={() => {
                      updateFilter({
                        searchQuery: s.query,
                        category: s.category as any,
                        city: s.city || 'All Cities'
                      });
                      setActiveTab('explore');
                    }}
                    className="px-4 py-1.5 rounded-full bg-[#D4AF37] text-black text-xs font-bold uppercase cursor-pointer hover:brightness-110 flex items-center gap-1"
                  >
                    <span>Run Search</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => showToast(`Search alert removed: "${s.title}"`, 'info')}
                    className="text-xs text-white/40 hover:text-red-400 transition-colors cursor-pointer"
                  >
                    Remove Alert
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 7: Settings & Security */}
      {activeProfileTab === 'settings' && (
        <div className="space-y-6 max-w-3xl">
          <div className="p-6 rounded-3xl bg-[#111] border border-white/5 space-y-5">
            <h3 className="text-base font-serif font-light text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
              <span>Account Security & Verified Marketplace</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/5">
                <div>
                  <h5 className="font-bold text-white">Direct Marketplace Verification</h5>
                  <p className="text-white/50 text-[11px] mt-0.5">Connect with verified boutique owners and authentic brides across India with zero platform commission.</p>
                </div>
                <span className="text-emerald-400 font-bold text-xs">ACTIVE</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/5">
                <div>
                  <h5 className="font-bold text-white">Phone & WhatsApp Verification</h5>
                  <p className="text-white/50 text-[11px] mt-0.5">Mask your phone number from unauthenticated guest visitors.</p>
                </div>
                <span className="text-emerald-400 font-bold text-xs">PROTECTED</span>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-[#111] border border-white/5 space-y-5">
            <h3 className="text-base font-serif font-light text-white flex items-center gap-2">
              <Bell className="w-4 h-4 text-[#D4AF37]" />
              <span>Notification Preferences</span>
            </h3>

            <div className="space-y-3 text-xs">
              <label className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/5 cursor-pointer">
                <span className="text-white">Instant WhatsApp notifications for new booking requests</span>
                <input type="checkbox" defaultChecked className="accent-[#D4AF37] w-4 h-4 cursor-pointer" />
              </label>

              <label className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/5 cursor-pointer">
                <span className="text-white">Price drop & rental discount alerts for wishlisted outfits</span>
                <input type="checkbox" defaultChecked className="accent-[#D4AF37] w-4 h-4 cursor-pointer" />
              </label>

              <label className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/5 cursor-pointer">
                <span className="text-white">Return window reminders (24h before rental period ends)</span>
                <input type="checkbox" defaultChecked className="accent-[#D4AF37] w-4 h-4 cursor-pointer" />
              </label>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-[#111] border border-white/5 space-y-4">
            <h3 className="text-base font-serif font-light text-white">Account Session</h3>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <p className="text-xs text-white/70 font-semibold">Signed in as {user.name} ({user.phone})</p>
                <p className="text-[11px] text-white/40">You can sign out to switch accounts or browse as a guest.</p>
              </div>

              <button
                onClick={handleLogout}
                className="px-6 py-2.5 rounded-full bg-red-600/10 hover:bg-red-600/20 text-red-400 border border-red-500/30 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
