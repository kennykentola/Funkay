"use client";

import React from "react";
import Link from "next/link";
import { CheckCircle2, Phone, MessageCircle, RefreshCw, ShoppingBag } from "lucide-react";
import { DISPLAY_PHONE, ALT_PHONE_1 } from "@/lib/whatsapp";

interface QuoteSuccessModalProps {
  isOpen: boolean;
  onReset: () => void;
  whatsappUrl: string;
}

export default function QuoteSuccessModal({
  isOpen,
  onReset,
  whatsappUrl,
}: QuoteSuccessModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 text-center space-y-6">
        {/* Success Icon */}
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
          <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
        </div>

        {/* Message */}
        <div className="space-y-2">
          <h3 className="text-2xl font-extrabold text-slate-900">
            Quote Request Ready!
          </h3>
          <p className="text-slate-600 text-sm leading-relaxed">
            Your quote details have been generated. Click below to launch WhatsApp and send your request directly to <strong className="text-brand-800">FUNKAY RENTAL SERVICES</strong>.
          </p>
        </div>

        {/* Main WhatsApp Send Action */}
        <div className="space-y-3">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-base shadow-xl shadow-emerald-700/30 transition-all hover:scale-[1.02]"
          >
            <MessageCircle className="w-5 h-5 fill-white text-emerald-600" />
            <span>Send Quote on WhatsApp Now</span>
          </a>
        </div>

        {/* Next Options */}
        <div className="pt-4 border-t border-slate-100 space-y-3">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Need alternative options?
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <a
              href={`tel:${DISPLAY_PHONE.replace(/\s+/g, '')}`}
              className="flex items-center justify-center gap-1.5 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 font-bold hover:bg-slate-100 transition-colors"
            >
              <Phone className="w-4 h-4 text-gold-600" />
              <span>Call Us Direct</span>
            </a>

            <Link
              href="/equipment"
              className="flex items-center justify-center gap-1.5 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 font-bold hover:bg-slate-100 transition-colors"
            >
              <ShoppingBag className="w-4 h-4 text-brand-700" />
              <span>Browse Equipment</span>
            </Link>
          </div>

          <button
            onClick={onReset}
            className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800 font-medium pt-2 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Make another enquiry</span>
          </button>
        </div>
      </div>
    </div>
  );
}
