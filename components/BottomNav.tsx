import React from 'react';
import { 
  Home, 
  Compass, 
  Plus, 
  Heart, 
  User,
  ShieldAlert
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const BottomNav: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    wishlist, 
    setActiveModal, 
    user 
  } = useApp();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 h-20 bg-[#0a0a0a] border-t border-white/10 flex items-center justify-around px-3 sm:px-12 shadow-2xl">
      <div className="flex items-center justify-around w-full max-w-lg mx-auto">
        
        {/* Home */}
        <button
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center justify-center gap-1 transition-all ${
            activeTab === 'home' 
              ? 'text-[#D4AF37]' 
              : 'text-white/40 hover:text-white/70'
          }`}
          id="bottom-nav-home"
        >
          <Home className={`w-5 h-5 ${activeTab === 'home' ? 'stroke-[2.5]' : 'stroke-2'}`} />
          <span className="text-[10px] font-bold uppercase tracking-tighter">
            Home
          </span>
        </button>

        {/* Explore / Categories */}
        <button
          onClick={() => setActiveTab('explore')}
          className={`flex flex-col items-center justify-center gap-1 transition-all ${
            activeTab === 'explore' 
              ? 'text-[#D4AF37]' 
              : 'text-white/40 hover:text-white/70'
          }`}
          id="bottom-nav-explore"
        >
          <Compass className={`w-5 h-5 ${activeTab === 'explore' ? 'stroke-[2.5]' : 'stroke-2'}`} />
          <span className="text-[10px] font-bold uppercase tracking-tighter">
            Explore
          </span>
        </button>

        {/* Center SELL (+) Button */}
        <button
          onClick={() => setActiveModal('upload')}
          className="flex flex-col items-center justify-center -mt-9 group cursor-pointer"
          id="bottom-nav-sell"
        >
          <div className="w-14 h-14 sm:w-16 sm:h-16 bg-[#D4AF37] rounded-full border-4 border-[#050505] flex items-center justify-center shadow-xl group-hover:scale-105 group-active:scale-95 transition-transform text-black">
            <Plus className="w-7 h-7 stroke-[3]" />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-tighter text-[#D4AF37] mt-1">
            Sell Outfit
          </span>
        </button>

        {/* Wishlist */}
        <button
          onClick={() => setActiveTab('wishlist')}
          className={`flex flex-col items-center justify-center gap-1 transition-all relative ${
            activeTab === 'wishlist' 
              ? 'text-[#D4AF37]' 
              : 'text-white/40 hover:text-white/70'
          }`}
          id="bottom-nav-wishlist"
        >
          <div className="relative">
            <Heart className={`w-5 h-5 ${activeTab === 'wishlist' ? 'stroke-[2.5] fill-[#D4AF37]' : 'stroke-2'}`} />
            {wishlist.length > 0 && (
              <span className="absolute -top-1 -right-2 w-3.5 h-3.5 bg-[#D4AF37] text-black text-[9px] font-black rounded-full flex items-center justify-center">
                {wishlist.length}
              </span>
            )}
          </div>
          <span className="text-[10px] font-bold uppercase tracking-tighter">
            Wishlist
          </span>
        </button>

        {/* Profile / Admin */}
        <button
          onClick={() => setActiveTab(user.role === 'admin' ? 'admin' : 'profile')}
          className={`flex flex-col items-center justify-center gap-1 transition-all ${
            activeTab === 'profile' || activeTab === 'admin'
              ? 'text-[#D4AF37]' 
              : 'text-white/40 hover:text-white/70'
          }`}
          id="bottom-nav-profile"
        >
          {user.role === 'admin' ? (
            <ShieldAlert className="w-5 h-5 text-[#D4AF37]" />
          ) : (
            <User className={`w-5 h-5 ${activeTab === 'profile' ? 'stroke-[2.5]' : 'stroke-2'}`} />
          )}
          <span className="text-[10px] font-bold uppercase tracking-tighter">
            {user.role === 'admin' ? 'Admin' : 'Profile'}
          </span>
        </button>

      </div>
    </nav>
  );
};
