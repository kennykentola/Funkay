"use client";

import React from "react";
import { MessageCircle } from "lucide-react";
import { getGeneralWhatsAppUrl } from "@/lib/whatsapp";

export default function FloatingWhatsAppButton() {
  return (
    <div className="fixed bottom-5 right-5 z-50 group">
      <a
        href={getGeneralWhatsAppUrl()}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with FUNKAY RENTAL SERVICES on WhatsApp"
        className="flex items-center gap-2.5 px-4 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full shadow-2xl shadow-emerald-900/50 hover:scale-105 active:scale-95 transition-all duration-300 border-2 border-emerald-400/40"
      >
        <div className="relative">
          <MessageCircle className="w-6 h-6 fill-white text-emerald-600 shrink-0" />
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-gold-500"></span>
          </span>
        </div>
        <span className="font-extrabold text-sm tracking-wide hidden sm:inline">
          Chat on WhatsApp
        </span>
      </a>
    </div>
  );
}
