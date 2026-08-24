"use client";

import React, { useEffect, useState } from "react";
import { Download, X, Smartphone } from "lucide-react";

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setShowPrompt(false);
    }
    setDeferredPrompt(null);
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-sm z-40 bg-slate-900 text-white p-4 rounded-2xl border border-slate-800 shadow-2xl animate-fadeIn space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-700 text-gold-400 flex items-center justify-center shrink-0">
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-extrabold text-sm text-white leading-tight">Install FUNKAY App</h4>
            <p className="text-[11px] text-slate-300 mt-0.5">Quick access for event bookings on your home screen</p>
          </div>
        </div>

        <button
          onClick={() => setShowPrompt(false)}
          className="text-slate-400 hover:text-white p-1"
          aria-label="Dismiss app install prompt"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <button
        onClick={handleInstallClick}
        className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-md transition-all"
      >
        <Download className="w-4 h-4" />
        <span>Add to Home Screen</span>
      </button>
    </div>
  );
}
