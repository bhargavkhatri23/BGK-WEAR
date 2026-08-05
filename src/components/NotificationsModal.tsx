import React, { useState } from 'react';
import { 
  X, 
  Bell, 
  Check, 
  XCircle, 
  Sparkles, 
  Clock, 
  MessageCircle, 
  Tag, 
  ShieldCheck, 
  CheckCheck 
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AppNotification } from '../types';

export const NotificationsModal: React.FC = () => {
  const { 
    activeModal, 
    setActiveModal, 
    notifications, 
    markNotificationRead, 
    handleNotificationAction,
    setSelectedProduct,
    products
  } = useApp();

  const [activeFilter, setActiveFilter] = useState<'all' | 'rental_request' | 'purchase_request' | 'offers' | 'messages'>('all');

  if (activeModal !== 'notifications') return null;

  const filteredNotifs = notifications.filter((n) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'rental_request') return n.type === 'rental_request';
    if (activeFilter === 'purchase_request') return n.type === 'purchase_request';
    if (activeFilter === 'offers') return n.type === 'offer';
    if (activeFilter === 'messages') return n.type === 'message';
    return true;
  });

  const handleOpenProduct = (prodId?: string) => {
    if (!prodId) return;
    const prod = products.find((p) => p.id === prodId);
    if (prod) {
      setSelectedProduct(prod);
      setActiveModal(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-xl flex justify-center p-2 sm:p-4 lg:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-[#0a0a0a] rounded-3xl border border-white/10 shadow-2xl overflow-hidden my-auto flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 bg-[#111] border-b border-white/5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37]">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-serif font-light text-white">Notifications & Requests</h3>
              <p className="text-[11px] text-white/50">Rental inquiries, bookings, approvals & messages</p>
            </div>
          </div>
          <button
            onClick={() => setActiveModal(null)}
            className="p-2 rounded-full bg-white/5 text-white/50 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Pills */}
        <div className="flex gap-2 px-6 py-3 border-b border-white/5 overflow-x-auto no-scrollbar bg-[#0a0a0a]">
          {[
            { id: 'all', label: 'All' },
            { id: 'rental_request', label: 'Rental Requests' },
            { id: 'purchase_request', label: 'Purchases' },
            { id: 'offers', label: 'Offers' },
            { id: 'messages', label: 'Messages' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id as any)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                activeFilter === tab.id
                  ? 'bg-[#D4AF37] text-black font-bold'
                  : 'bg-white/5 text-white/60 border border-white/10 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Notifications List */}
        <div className="overflow-y-auto p-4 sm:p-6 space-y-3 no-scrollbar">
          {filteredNotifs.length === 0 ? (
            <div className="py-12 text-center text-xs text-white/40">
              No notifications in this category.
            </div>
          ) : (
            filteredNotifs.map((n) => (
              <div
                key={n.id}
                onClick={() => {
                  markNotificationRead(n.id);
                  if (n.relatedProductId) handleOpenProduct(n.relatedProductId);
                }}
                className={`p-4 rounded-3xl border transition-all cursor-pointer ${
                  n.read
                    ? 'bg-[#111] border-white/5'
                    : 'bg-[#141414] border-[#D4AF37]/40 shadow-md'
                }`}
              >
                <div className="flex items-start gap-3">
                  {n.senderAvatar ? (
                    <img
                      src={n.senderAvatar}
                      alt="Sender"
                      className="w-10 h-10 rounded-full object-cover border border-[#D4AF37]"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-[#D4AF37] flex-shrink-0">
                      <Sparkles className="w-5 h-5" />
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <h4 className="text-xs sm:text-sm font-semibold text-white leading-tight">
                        {n.title}
                      </h4>
                      <span className="text-[10px] text-white/40 flex-shrink-0">{n.timestamp}</span>
                    </div>

                    <p className="text-xs text-white/60 mt-1 leading-relaxed">{n.description}</p>

                    {/* Action buttons for rental requests */}
                    {n.actionRequired && n.actionState === 'pending' && (
                      <div className="mt-3 flex gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleNotificationAction(n.id, 'accepted');
                          }}
                          className="px-3.5 py-1.5 rounded-full bg-[#D4AF37] hover:brightness-110 text-black text-xs font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Accept Request</span>
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleNotificationAction(n.id, 'declined');
                          }}
                          className="px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-white/10 text-white/70 border border-white/10 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Decline</span>
                        </button>
                      </div>
                    )}

                    {n.actionState === 'accepted' && (
                      <div className="mt-2 text-xs text-emerald-400 font-semibold flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" />
                        <span>Accepted • Outfit reserved for renter</span>
                      </div>
                    )}

                    {n.actionState === 'declined' && (
                      <div className="mt-2 text-xs text-red-400 font-semibold flex items-center gap-1">
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Declined</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};
