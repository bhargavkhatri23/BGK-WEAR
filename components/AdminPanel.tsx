import React, { useState } from 'react';
import { 
  ShieldAlert, 
  CheckCircle, 
  XCircle, 
  Trash2, 
  Star, 
  Users, 
  DollarSign, 
  Layers, 
  AlertTriangle, 
  TrendingUp, 
  Plus, 
  Eye,
  ShieldCheck,
  Crown
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Product } from '../types';
import { CATEGORIES_DATA } from '../data/mockData';

export const AdminPanel: React.FC = () => {
  const { 
    products, 
    updateProductStatus, 
    deleteProduct, 
    setSelectedProduct, 
    rentalBookings,
    showToast
  } = useApp();

  const [adminTab, setAdminTab] = useState<'listings' | 'approvals' | 'users' | 'deposits' | 'categories'>('approvals');
  const [categoriesList, setCategoriesList] = useState(CATEGORIES_DATA);
  const [newCatName, setNewCatName] = useState('');

  const pendingListings = products.filter((p) => p.status === 'pending_approval');
  const activeListings = products.filter((p) => p.status === 'active');

  // Metrics
  const totalGMV = products.reduce((sum, p) => sum + p.rentPricePerDay * 3, 0) + 125000;
  const platformEarnings = Math.round(totalGMV * 0.12); // 12% commission

  const handleApprove = (id: string) => {
    updateProductStatus(id, 'active');
    showToast('Listing approved and published to live marketplace! ✨', 'success');
  };

  const handleReject = (id: string) => {
    updateProductStatus(id, 'rejected');
    showToast('Listing rejected', 'info');
  };

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    setCategoriesList([
      ...categoriesList,
      {
        name: newCatName,
        count: 0,
        image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80',
        description: 'New Luxury Category'
      }
    ]);
    setNewCatName('');
    showToast('Category added to BGK WEAR', 'success');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Admin Banner */}
      <div className="p-8 rounded-3xl bg-[#0a0a0a] border border-white/10 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37]">
            <Crown className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-serif font-light text-white">
              BGK WEAR Admin Console
            </h1>
            <p className="text-xs text-white/50">
              Listing approvals, boutique verification & platform metrics
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-4 py-1.5 rounded-full bg-white/5 text-emerald-400 border border-emerald-500/30 text-xs font-semibold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Platform Engine Online
          </span>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-[#0a0a0a] border border-white/10">
          <span className="text-[11px] text-white/50 uppercase tracking-wider font-semibold">Total GMV Processed</span>
          <div className="text-xl sm:text-2xl font-serif font-bold text-white mt-1.5">
            ₹{totalGMV.toLocaleString('en-IN')}
          </div>
          <span className="text-[10px] text-emerald-400 mt-1 block">+18% this month</span>
        </div>

        <div className="p-5 rounded-3xl bg-[#0a0a0a] border border-white/10">
          <span className="text-[11px] text-white/50 uppercase tracking-wider font-semibold">Platform Commission (12%)</span>
          <div className="text-xl sm:text-2xl font-serif font-bold text-[#D4AF37] mt-1.5">
            ₹{platformEarnings.toLocaleString('en-IN')}
          </div>
          <span className="text-[10px] text-white/40 mt-1 block">Net Revenue</span>
        </div>

        <div className="p-5 rounded-3xl bg-[#0a0a0a] border border-white/10">
          <span className="text-[11px] text-white/50 uppercase tracking-wider font-semibold">Active Listings</span>
          <div className="text-xl sm:text-2xl font-serif font-bold text-white mt-1.5">
            {products.length} Outfits
          </div>
          <span className="text-[10px] text-[#D4AF37] mt-1 block">{pendingListings.length} Pending Approval</span>
        </div>

        <div className="p-5 rounded-3xl bg-[#0a0a0a] border border-white/10">
          <span className="text-[11px] text-white/50 uppercase tracking-wider font-semibold">Total Rentals & Orders</span>
          <div className="text-xl sm:text-2xl font-serif font-bold text-white mt-1.5">
            {rentalBookings.length + 8} Bookings
          </div>
          <span className="text-[10px] text-emerald-400 mt-1 block">100% On-time Returns</span>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="flex gap-2 border-b border-white/5 pb-4 overflow-x-auto no-scrollbar">
        {[
          { id: 'approvals', label: `Approve Listings (${pendingListings.length})` },
          { id: 'listings', label: `All Catalog Listings (${products.length})` },
          { id: 'deposits', label: `Rental Security Deposits (${rentalBookings.length})` },
          { id: 'categories', label: `Manage Categories (${categoriesList.length})` }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setAdminTab(tab.id as any)}
            className={`px-4 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-colors cursor-pointer ${
              adminTab === tab.id
                ? 'bg-[#D4AF37] text-black shadow-md'
                : 'bg-white/5 text-white/60 border border-white/10 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Approve Listings */}
      {adminTab === 'approvals' && (
        <div className="space-y-4">
          <h3 className="text-base font-serif font-semibold text-white">Pending Outfit Submissions</h3>

          {pendingListings.length === 0 ? (
            <div className="py-14 text-center rounded-3xl bg-[#0a0a0a] border border-white/10 p-6 space-y-2">
              <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto" />
              <p className="text-xs text-white/70 font-semibold">All seller listings are currently reviewed & approved!</p>
              <p className="text-[11px] text-white/40">New seller submissions will appear here for verification.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingListings.map((prod) => (
                <div key={prod.id} className="p-5 rounded-3xl bg-[#0a0a0a] border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <img src={prod.images[0]} alt={prod.title} className="w-16 h-20 rounded-2xl object-cover border border-white/10" />
                    <div>
                      <span className="text-[10px] text-[#D4AF37] font-bold uppercase">{prod.brand} • {prod.category}</span>
                      <h4 className="text-xs sm:text-sm font-semibold text-white">{prod.title}</h4>
                      <p className="text-xs text-white/60 mt-1">
                        Rent: ₹{prod.rentPricePerDay}/day • Deposit: ₹{prod.securityDeposit} • Seller: {prod.seller.name} ({prod.city})
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2 w-full sm:w-auto">
                    <button
                      onClick={() => handleApprove(prod.id)}
                      className="flex-1 sm:flex-initial px-4 py-2 rounded-full bg-[#D4AF37] hover:brightness-110 text-black text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>Approve</span>
                    </button>
                    <button
                      onClick={() => handleReject(prod.id)}
                      className="flex-1 sm:flex-initial px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 text-white/70 border border-white/10 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>Reject</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Manage All Listings */}
      {adminTab === 'listings' && (
        <div className="space-y-4">
          <div className="overflow-x-auto rounded-3xl border border-white/10">
            <table className="w-full text-left text-xs text-white/70 bg-[#0a0a0a] overflow-hidden">
              <thead className="bg-[#111] text-[11px] text-[#D4AF37] font-bold uppercase">
                <tr>
                  <th className="p-3.5">Outfit</th>
                  <th className="p-3.5">Category</th>
                  <th className="p-3.5">Rent / Day</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5">Seller</th>
                  <th className="p-3.5">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {products.map((prod) => (
                  <tr key={prod.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-3.5 flex items-center gap-3">
                      <img src={prod.images[0]} alt={prod.title} className="w-8 h-10 rounded-lg object-cover" />
                      <span className="font-medium text-white max-w-[180px] truncate">{prod.title}</span>
                    </td>
                    <td className="p-3.5">{prod.category}</td>
                    <td className="p-3.5 font-serif font-bold text-white">₹{prod.rentPricePerDay.toLocaleString('en-IN')}</td>
                    <td className="p-3.5">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                        prod.status === 'active' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                      }`}>
                        {prod.status}
                      </span>
                    </td>
                    <td className="p-3.5">{prod.seller.name}</td>
                    <td className="p-3.5">
                      <div className="flex gap-2">
                        <button
                          onClick={() => setSelectedProduct(prod)}
                          className="text-white/60 hover:text-white p-1 cursor-pointer"
                          title="View"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteProduct(prod.id)}
                          className="text-red-400 hover:text-red-300 p-1 cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Security Deposits */}
      {adminTab === 'deposits' && (
        <div className="space-y-4">
          <h3 className="text-base font-serif font-semibold text-white">Rental Security Deposit Tracker</h3>
          <div className="space-y-3">
            {rentalBookings.map((b) => (
              <div key={b.id} className="p-5 rounded-3xl bg-[#0a0a0a] border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                <div>
                  <h4 className="font-semibold text-white">{b.productTitle}</h4>
                  <p className="text-white/50 mt-0.5">Renter: {b.deliveryAddress.fullName} • Seller: {b.sellerName}</p>
                  <p className="text-emerald-400 font-semibold mt-1">Security Deposit: ₹{b.securityDeposit.toLocaleString('en-IN')} ({b.depositRefundStatus})</p>
                </div>
                <button
                  onClick={() => showToast('Security deposit status updated! 💸', 'success')}
                  className="px-4 py-2 rounded-full bg-[#D4AF37] hover:brightness-110 text-black text-xs font-bold uppercase tracking-wider cursor-pointer"
                >
                  Update Status
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Manage Categories */}
      {adminTab === 'categories' && (
        <div className="space-y-6">
          <form onSubmit={handleAddCategory} className="flex gap-2 max-w-md">
            <input
              type="text"
              placeholder="New Category Name (e.g. Cocktail Sherwanis)"
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
              className="flex-1 bg-[#111] border border-white/10 rounded-full px-4 py-2.5 text-xs text-white focus:border-[#D4AF37] focus:outline-none"
            />
            <button type="submit" className="px-5 py-2.5 rounded-full bg-[#D4AF37] hover:brightness-110 text-black text-xs font-bold uppercase tracking-wider cursor-pointer">
              + Add
            </button>
          </form>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {categoriesList.map((c) => (
              <div key={c.name} className="p-4 rounded-3xl bg-[#0a0a0a] border border-white/10 text-center">
                <img src={c.image} alt={c.name} className="w-full h-24 rounded-2xl object-cover mb-2.5" />
                <h5 className="text-xs font-semibold text-white">{c.name}</h5>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
