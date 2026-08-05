import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Calendar, 
  Clock, 
  ShieldCheck, 
  Truck, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  ChevronRight, 
  MessageSquare, 
  Phone, 
  Receipt, 
  Sparkles, 
  MapPin, 
  ExternalLink,
  Package,
  Star,
  RefreshCw
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { RentalBooking, PurchaseOrder } from '../types';

export const OrdersView: React.FC = () => {
  const { 
    user, 
    rentalBookings, 
    purchaseOrders, 
    sellerRentalBookings, 
    sellerPurchaseOrders, 
    updateRentalStatus, 
    updatePurchaseStatus, 
    openChatWithSeller, 
    openCall, 
    products, 
    setSelectedProduct, 
    setActiveModal, 
    setActiveTab,
    showToast
  } = useApp();

  const [activeTabMode, setActiveTabMode] = useState<'buyer_rentals' | 'buyer_purchases' | 'seller_rentals' | 'seller_purchases'>('buyer_rentals');
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<RentalBooking | PurchaseOrder | null>(null);
  const [trackingInput, setTrackingInput] = useState('');
  const [editingOrderId, setEditingOrderId] = useState<string | null>(null);

  const isSellerMode = user.role === 'seller' || user.role === 'admin';

  // Helper to open chat for an order
  const handleChatForOrder = (item: RentalBooking | PurchaseOrder) => {
    const prod = products.find((p) => p.id === item.productId);
    const sellerStub = prod?.seller || {
      id: 'sellerId' in item ? (item as any).sellerId || 'seller-1' : 'seller-1',
      name: item.sellerName,
      phone: item.sellerPhone,
      whatsapp: item.sellerPhone,
      city: 'Mumbai',
      isVerified: true,
      rating: 4.9,
      reviewCount: 24,
      joinedYear: '2023',
      responseRate: '98%',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      totalListings: 12
    };

    openChatWithSeller(sellerStub, prod);
  };

  const handleUpdateTracking = async (orderId: string, isRental: boolean) => {
    if (!trackingInput.trim()) {
      showToast('Please enter a handover note or reference code', 'error');
      return;
    }

    if (isRental) {
      await updateRentalStatus(orderId, 'Dispatched', undefined, trackingInput.trim());
    } else {
      await updatePurchaseStatus(orderId, 'Shipped', trackingInput.trim());
    }
    setEditingOrderId(null);
    setTrackingInput('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6 pb-24 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-widest text-[#D4AF37] font-semibold">Direct Marketplace</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-0.5">
            Wedding Couture Bookings & Coordination
          </h1>
          <p className="text-xs text-white/50 mt-1">
            Direct buyer-to-seller coordination for fittings, pickup/handover, security deposits, and in-app chat.
          </p>
        </div>

        {/* Quick Role Switcher Pill */}
        <div className="flex items-center gap-2 bg-[#111] p-1 rounded-full border border-white/10 self-start">
          <button
            onClick={() => setActiveTabMode('buyer_rentals')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
              activeTabMode.startsWith('buyer') 
                ? 'bg-[#D4AF37] text-black shadow-md' 
                : 'text-white/60 hover:text-white'
            }`}
          >
            My Orders (Buyer)
          </button>
          <button
            onClick={() => setActiveTabMode('seller_rentals')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
              activeTabMode.startsWith('seller') 
                ? 'bg-[#D4AF37] text-black shadow-md' 
                : 'text-white/60 hover:text-white'
            }`}
          >
            Studio Orders (Seller)
          </button>
        </div>
      </div>

      {/* Sub tabs */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-3">
        {activeTabMode.startsWith('buyer') ? (
          <>
            <button
              onClick={() => setActiveTabMode('buyer_rentals')}
              className={`px-4 py-2 rounded-2xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all ${
                activeTabMode === 'buyer_rentals'
                  ? 'bg-white/10 text-[#D4AF37] border border-[#D4AF37]/40'
                  : 'text-white/40 hover:text-white'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Rental Bookings ({rentalBookings.length})</span>
            </button>

            <button
              onClick={() => setActiveTabMode('buyer_purchases')}
              className={`px-4 py-2 rounded-2xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all ${
                activeTabMode === 'buyer_purchases'
                  ? 'bg-white/10 text-[#D4AF37] border border-[#D4AF37]/40'
                  : 'text-white/40 hover:text-white'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Outright Purchases ({purchaseOrders.length})</span>
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => setActiveTabMode('seller_rentals')}
              className={`px-4 py-2 rounded-2xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all ${
                activeTabMode === 'seller_rentals'
                  ? 'bg-white/10 text-[#D4AF37] border border-[#D4AF37]/40'
                  : 'text-white/40 hover:text-white'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Incoming Rentals ({sellerRentalBookings.length})</span>
            </button>

            <button
              onClick={() => setActiveTabMode('seller_purchases')}
              className={`px-4 py-2 rounded-2xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all ${
                activeTabMode === 'seller_purchases'
                  ? 'bg-white/10 text-[#D4AF37] border border-[#D4AF37]/40'
                  : 'text-white/40 hover:text-white'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Incoming Purchases ({sellerPurchaseOrders.length})</span>
            </button>
          </>
        )}
      </div>

      {/* Marketplace Banner */}
      <div className="p-4 rounded-3xl bg-gradient-to-r from-[#D4AF37]/15 via-black to-[#D4AF37]/10 border border-[#D4AF37]/30 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] flex-shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-serif font-bold text-white">BGK Wear Direct Marketplace Coordination</h4>
            <p className="text-xs text-white/60">
              Direct connection with verified curators across India. Agree on handover and return details directly with the owner.
            </p>
          </div>
        </div>
      </div>

      {/* LIST OF ORDERS / BOOKINGS */}
      {activeTabMode === 'buyer_rentals' && (
        <div className="space-y-4">
          {rentalBookings.length === 0 ? (
            <div className="p-12 text-center bg-[#0a0a0a] border border-white/10 rounded-3xl space-y-3">
              <Calendar className="w-12 h-12 mx-auto text-[#D4AF37]/30" />
              <h3 className="text-lg font-serif font-bold text-white">No Rental Bookings Yet</h3>
              <p className="text-xs text-white/40 max-w-sm mx-auto">
                Explore designer lehengas, sherwanis, and sarees for 3 to 14 days with direct seller coordination.
              </p>
              <button
                onClick={() => setActiveTab('explore')}
                className="px-6 py-2.5 rounded-full bg-[#D4AF37] text-black text-xs font-bold uppercase tracking-wider hover:brightness-110"
              >
                Browse Outfits to Rent
              </button>
            </div>
          ) : (
            rentalBookings.map((booking) => (
              <div 
                key={booking.id}
                className="p-5 sm:p-6 rounded-3xl bg-[#0e0e0e] border border-white/10 hover:border-[#D4AF37]/40 transition-all shadow-xl space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-white/40">ID: #{booking.id}</span>
                    <span className="text-white/20">•</span>
                    <span className="text-xs text-white/50">Booked on {booking.bookingDate}</span>
                  </div>

                  {/* Status badge */}
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider self-start sm:self-auto ${
                    booking.status === 'Confirmed' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                    booking.status === 'In Use' ? 'bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/30 animate-pulse' :
                    booking.status === 'Dispatched' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                    booking.status === 'Returned' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' :
                    booking.status === 'Completed' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                    'bg-white/10 text-white/70'
                  }`}>
                    {booking.status === 'Dispatched' ? 'Handover Initiated' : booking.status}
                  </span>
                </div>

                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  {/* Product image & details */}
                  <div className="flex items-center gap-4">
                    <img
                      src={booking.productImage}
                      alt={booking.productTitle}
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border border-[#D4AF37]/30"
                    />
                    <div className="space-y-1">
                      <span className="text-[10px] uppercase font-bold text-[#D4AF37] tracking-wider">
                        {booking.category}
                      </span>
                      <h3 className="text-sm sm:text-base font-serif font-bold text-white line-clamp-1">
                        {booking.productTitle}
                      </h3>
                      <p className="text-xs text-white/60">
                        Curator: <strong className="text-white">{booking.sellerName}</strong>
                      </p>
                      <div className="flex items-center gap-3 text-xs text-white/50 pt-1">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" />
                          {booking.startDate} to {booking.endDate} ({booking.totalDays} Days)
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Financial Breakdown */}
                  <div className="bg-[#141414] p-4 rounded-2xl border border-white/5 space-y-1.5 text-xs w-full md:w-64">
                    <div className="flex justify-between text-white/60">
                      <span>Rental Fee:</span>
                      <span>₹{booking.rentAmount.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between text-emerald-400 font-semibold">
                      <span>Security Deposit:</span>
                      <span>₹{booking.securityDeposit.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between border-t border-white/10 pt-1.5 font-bold text-white text-sm">
                      <span>Total Paid:</span>
                      <span className="text-[#D4AF37]">₹{booking.totalPaid.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="text-[10px] text-white/40 pt-0.5 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-[#D4AF37]" />
                      <span>Deposit Status: {booking.depositRefundStatus || 'Refundable on Return'}</span>
                    </div>
                  </div>
                </div>

                {/* Handover & Coordination Note */}
                {booking.trackingNumber && (
                  <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4 text-[#D4AF37]" />
                      <span>Handover / Coordination: <strong className="text-[#D4AF37] font-mono">{booking.trackingNumber}</strong></span>
                    </div>
                    <span className="text-[11px] text-white/40">Direct Handover</span>
                  </div>
                )}

                {/* Action Buttons for Buyer */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-white/5">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleChatForOrder(booking)}
                      className="px-4 py-2 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#D4AF37] text-xs font-bold hover:bg-[#D4AF37] hover:text-black transition-all flex items-center gap-1.5"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Chat with Curator</span>
                    </button>
                    <button
                      onClick={() => openCall(booking.sellerPhone)}
                      className="p-2 rounded-full bg-white/5 border border-white/10 text-white/70 hover:text-white"
                      title="Call Curator"
                    >
                      <Phone className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    {booking.status === 'Dispatched' && (
                      <button
                        onClick={() => updateRentalStatus(booking.id, 'In Use')}
                        className="px-4 py-2 rounded-full bg-emerald-500 hover:bg-emerald-600 text-black text-xs font-bold uppercase tracking-wider transition-colors shadow-lg"
                      >
                        Confirm Received & In Use
                      </button>
                    )}

                    {booking.status === 'In Use' && (
                      <button
                        onClick={() => updateRentalStatus(booking.id, 'Returned', 'Refund Processing')}
                        className="px-4 py-2 rounded-full bg-purple-500 hover:bg-purple-600 text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-lg"
                      >
                        Initiate Return Handover to Seller
                      </button>
                    )}

                    {booking.status === 'Completed' && (
                      <button
                        onClick={() => {
                          const prod = products.find((p) => p.id === booking.productId);
                          if (prod) {
                            setSelectedProduct(prod);
                            setActiveModal('productDetail');
                          }
                        }}
                        className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1"
                      >
                        <Star className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span>Rate & Review Outfit</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* BUYER PURCHASES TAB */}
      {activeTabMode === 'buyer_purchases' && (
        <div className="space-y-4">
          {purchaseOrders.length === 0 ? (
            <div className="p-12 text-center bg-[#0a0a0a] border border-white/10 rounded-3xl space-y-3">
              <ShoppingBag className="w-12 h-12 mx-auto text-[#D4AF37]/30" />
              <h3 className="text-lg font-serif font-bold text-white">No Purchase Orders Yet</h3>
              <p className="text-xs text-white/40 max-w-sm mx-auto">
                Buy pre-loved and sample bridal wear permanently with verified designer certificates.
              </p>
              <button
                onClick={() => setActiveTab('explore')}
                className="px-6 py-2.5 rounded-full bg-[#D4AF37] text-black text-xs font-bold uppercase tracking-wider hover:brightness-110"
              >
                Explore Outfits for Sale
              </button>
            </div>
          ) : (
            purchaseOrders.map((order) => (
              <div 
                key={order.id}
                className="p-5 sm:p-6 rounded-3xl bg-[#0e0e0e] border border-white/10 hover:border-[#D4AF37]/40 transition-all shadow-xl space-y-4"
              >
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-white/40">Order #{order.id}</span>
                    <span className="text-white/20">•</span>
                    <span className="text-xs text-white/50">{order.orderDate}</span>
                  </div>

                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                    order.status === 'Processing' ? 'bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/30' :
                    order.status === 'Shipped' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                    order.status === 'Delivered' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                    'bg-white/10 text-white/70'
                  }`}>
                    {order.status === 'Shipped' ? 'Handover Initiated' : order.status === 'Delivered' ? 'Received & Completed' : order.status}
                  </span>
                </div>

                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={order.productImage}
                      alt={order.productTitle}
                      className="w-20 h-20 rounded-2xl object-cover border border-[#D4AF37]/30"
                    />
                    <div className="space-y-1">
                      <h3 className="text-sm sm:text-base font-serif font-bold text-white line-clamp-1">{order.productTitle}</h3>
                      <p className="text-xs text-white/60">Seller: <strong className="text-white">{order.sellerName}</strong></p>
                      <p className="text-sm font-serif font-bold text-[#D4AF37]">Total: ₹{order.totalPaid.toLocaleString('en-IN')}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleChatForOrder(order)}
                      className="px-4 py-2 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#D4AF37] text-xs font-bold hover:bg-[#D4AF37] hover:text-black transition-all flex items-center gap-1.5"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Chat with Seller</span>
                    </button>
                    {order.status === 'Shipped' && (
                      <button
                        onClick={() => updatePurchaseStatus(order.id, 'Delivered')}
                        className="px-4 py-2 rounded-full bg-emerald-500 hover:bg-emerald-600 text-black text-xs font-bold uppercase tracking-wider transition-colors"
                      >
                        Confirm Receipt
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* SELLER RENTALS TAB */}
      {activeTabMode === 'seller_rentals' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-[#141414] border border-white/10 text-xs text-white/70">
            👑 As a Seller/Curator, review rental requests, chat with renters to coordinate fitting/handover, and release security deposits upon return inspection.
          </div>

          {sellerRentalBookings.length === 0 ? (
            <div className="p-12 text-center bg-[#0a0a0a] border border-white/10 rounded-3xl space-y-3">
              <Calendar className="w-12 h-12 mx-auto text-[#D4AF37]/30" />
              <h3 className="text-lg font-serif font-bold text-white">No Incoming Rental Requests</h3>
              <p className="text-xs text-white/40 max-w-sm mx-auto">
                Once brides or grooms request your listed outfits, their requests and contact coordination details will appear here.
              </p>
            </div>
          ) : (
            sellerRentalBookings.map((booking) => (
              <div 
                key={booking.id}
                className="p-5 sm:p-6 rounded-3xl bg-[#0e0e0e] border border-white/10 hover:border-[#D4AF37]/40 transition-all shadow-xl space-y-4"
              >
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-white/40">Request #{booking.id}</span>
                    <span className="text-white/20">•</span>
                    <span className="text-xs text-white/50">{booking.bookingDate}</span>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#D4AF37]/20 text-[#D4AF37]">
                    {booking.status === 'Dispatched' ? 'Handover Initiated' : booking.status}
                  </span>
                </div>

                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={booking.productImage}
                      alt={booking.productTitle}
                      className="w-16 h-16 rounded-2xl object-cover border border-[#D4AF37]/30"
                    />
                    <div>
                      <h4 className="text-sm font-bold text-white">{booking.productTitle}</h4>
                      <p className="text-xs text-white/60">Renter: <strong className="text-white">{booking.deliveryAddress.fullName}</strong> ({booking.deliveryAddress.city})</p>
                      <p className="text-xs text-[#D4AF37]">Dates: {booking.startDate} to {booking.endDate}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs text-white/50 block">Payout Earnings</span>
                    <span className="text-lg font-serif font-bold text-emerald-400">
                      ₹{booking.rentAmount.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* Seller Actions */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/5">
                  <button
                    onClick={() => handleChatForOrder(booking)}
                    className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs text-white/80 hover:text-[#D4AF37] flex items-center gap-1.5"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>Message Renter</span>
                  </button>

                  <div className="flex items-center gap-2">
                    {booking.status === 'Confirmed' && (
                      editingOrderId === booking.id ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            placeholder="Handover Note / Details"
                            value={trackingInput}
                            onChange={(e) => setTrackingInput(e.target.value)}
                            className="bg-[#181818] border border-[#D4AF37]/40 rounded-full px-3 py-1.5 text-xs text-white"
                          />
                          <button
                            onClick={() => handleUpdateTracking(booking.id, true)}
                            className="px-3 py-1.5 rounded-full bg-[#D4AF37] text-black text-xs font-bold"
                          >
                            Save Handover
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setEditingOrderId(booking.id)}
                          className="px-4 py-2 rounded-full bg-[#D4AF37] text-black text-xs font-bold uppercase tracking-wider hover:brightness-110"
                        >
                          Mark Ready / Handed Over
                        </button>
                      )
                    )}

                    {booking.status === 'Returned' && (
                      <button
                        onClick={() => updateRentalStatus(booking.id, 'Completed', 'Refunded to Renter')}
                        className="px-4 py-2 rounded-full bg-emerald-500 hover:bg-emerald-600 text-black text-xs font-bold uppercase tracking-wider"
                      >
                        Inspect & Settle Security Deposit
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* SELLER PURCHASES TAB */}
      {activeTabMode === 'seller_purchases' && (
        <div className="space-y-4">
          {sellerPurchaseOrders.length === 0 ? (
            <div className="p-12 text-center bg-[#0a0a0a] border border-white/10 rounded-3xl space-y-3">
              <ShoppingBag className="w-12 h-12 mx-auto text-[#D4AF37]/30" />
              <h3 className="text-lg font-serif font-bold text-white">No Outright Sales Yet</h3>
              <p className="text-xs text-white/40 max-w-sm mx-auto">
                Orders for garments listed for sale will appear here.
              </p>
            </div>
          ) : (
            sellerPurchaseOrders.map((order) => (
              <div 
                key={order.id}
                className="p-5 sm:p-6 rounded-3xl bg-[#0e0e0e] border border-white/10 hover:border-[#D4AF37]/40 transition-all shadow-xl space-y-4"
              >
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <span className="text-xs font-mono text-white/40">Order #{order.id}</span>
                  <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-400">
                    {order.status}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={order.productImage}
                      alt={order.productTitle}
                      className="w-14 h-14 rounded-2xl object-cover border border-[#D4AF37]/30"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-white">{order.productTitle}</h4>
                      <p className="text-xs text-white/60">Buyer: {order.buyerName}</p>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-[#D4AF37]">₹{order.salePrice.toLocaleString('en-IN')}</span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

    </div>
  );
};
