import React from 'react';
import { X, Phone, ShieldCheck, Lock } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const CallSellerModal: React.FC = () => {
  const { activeModal, setActiveModal, targetSeller, openCall, user } = useApp();

  if (activeModal !== 'call_seller' || !targetSeller) return null;

  const isGuest = user.isGuest;

  const handleDial = () => {
    if (isGuest) {
      setActiveModal('auth');
      return;
    }
    openCall(targetSeller.phone);
  };

  const maskedPhone = targetSeller.phone.replace(/(\+\d{2}\s?\d{2})\d{3}(\d{2})\d{3}/, '$1*** **$2');

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-[#0a0a0a] border border-white/10 rounded-3xl p-6 sm:p-7 max-w-sm w-full space-y-5 shadow-2xl text-center relative">
        <button
          onClick={() => setActiveModal(null)}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/5 text-white/50 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="w-16 h-16 rounded-full border-2 border-[#D4AF37] p-0.5 mx-auto shadow-lg">
          <img
            src={targetSeller.avatar}
            alt={targetSeller.name}
            className="w-full h-full rounded-full object-cover"
          />
        </div>

        <div>
          <div className="flex items-center justify-center gap-1.5">
            <h3 className="text-base font-serif font-light text-white">{targetSeller.name}</h3>
            {targetSeller.isVerified && <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />}
          </div>
          <p className="text-xs text-white/50 mt-0.5">{targetSeller.city}, {targetSeller.state}</p>
        </div>

        <div className="p-4 rounded-2xl bg-[#111] border border-white/5 text-xs text-left space-y-2">
          <div className="flex justify-between items-center text-white/60">
            <span>Verified Phone:</span>
            {isGuest ? (
              <span className="font-mono text-white/70 tracking-wider flex items-center gap-1">
                <Lock className="w-3 h-3 text-[#D4AF37]" />
                {maskedPhone}
              </span>
            ) : (
              <span className="font-bold text-white">{targetSeller.phone}</span>
            )}
          </div>
          <div className="flex justify-between text-white/60">
            <span>Average Response:</span>
            <span className="text-[#D4AF37] font-semibold">{targetSeller.responseTime}</span>
          </div>
        </div>

        {isGuest ? (
          <button
            onClick={handleDial}
            className="w-full py-3.5 rounded-full bg-[#D4AF37] text-black font-bold uppercase tracking-wider text-xs hover:brightness-110 flex items-center justify-center gap-2 shadow-lg cursor-pointer"
            id="login-reveal-dial-btn"
          >
            <Lock className="w-4 h-4" />
            <span>Login to Reveal Number & Call</span>
          </button>
        ) : (
          <button
            onClick={handleDial}
            className="w-full py-3.5 rounded-full bg-[#D4AF37] text-black font-bold uppercase tracking-wider text-xs hover:brightness-110 flex items-center justify-center gap-2 shadow-lg cursor-pointer"
            id="direct-dial-btn"
          >
            <Phone className="w-4 h-4" />
            <span>Call Now ({targetSeller.phone})</span>
          </button>
        )}

        <p className="text-[10px] text-white/40">
          BGK WEAR connects buyers and sellers directly. Always inspect items in person during handover.
        </p>
      </div>
    </div>
  );
};
