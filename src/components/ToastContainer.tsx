import React from 'react';
import { Sparkles, CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto p-4 rounded-full bg-[#0a0a0a]/95 backdrop-blur-xl border border-white/10 shadow-2xl flex items-center justify-between gap-3 text-xs text-white animate-in slide-in-from-bottom-3 duration-200"
        >
          <div className="flex items-center gap-2.5 pl-1">
            {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />}
            {toast.type === 'error' && <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />}
            {toast.type === 'info' && <Sparkles className="w-4 h-4 text-[#D4AF37] flex-shrink-0" />}
            <span className="font-medium leading-relaxed">{toast.message}</span>
          </div>

          <button
            onClick={() => removeToast(toast.id)}
            className="p-1 text-white/40 hover:text-white flex-shrink-0 cursor-pointer pr-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};
