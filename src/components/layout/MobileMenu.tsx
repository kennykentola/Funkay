"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Phone, MessageCircle, Calendar } from "lucide-react";
import { DISPLAY_PHONE, ALT_PHONE_1, getGeneralWhatsAppUrl } from "@/lib/whatsapp";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  navLinks: { name: string; href: string }[];
  currentPath: string;
}

export default function MobileMenu({ isOpen, onClose, navLinks, currentPath }: MobileMenuProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden flex flex-col bg-white">
      {/* Drawer Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50">
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-white border border-slate-200">
            <Image
              src="/images/logo.png"
              alt="FUNKAY Rental Services Logo"
              fill
              className="object-contain p-0.5"
            />
          </div>
          <div>
            <h2 className="font-extrabold text-slate-900 text-base leading-none">FUNKAY</h2>
            <p className="text-[10px] font-bold text-brand-700 uppercase tracking-wider">Rental Services</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-200/60 transition-colors"
          aria-label="Close menu"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto p-4 space-y-1">
        {navLinks.map((link) => {
          const isActive = currentPath === link.href;
          return (
            <Link
              key={link.name}
              href={link.href}
              onClick={onClose}
              className={`flex items-center justify-between p-3.5 rounded-xl font-bold text-base transition-colors ${
                isActive
                  ? "bg-brand-700 text-white shadow-md shadow-brand-700/20"
                  : "text-slate-700 hover:bg-slate-100"
              }`}
            >
              <span>{link.name}</span>
              {isActive && <span className="w-2 h-2 rounded-full bg-gold-400"></span>}
            </Link>
          );
        })}
      </div>

      {/* Mobile CTA Footer */}
      <div className="p-4 bg-slate-50 border-t border-slate-200/80 space-y-3">
        <Link
          href="/quote"
          onClick={onClose}
          className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-brand-700 text-white font-bold text-base shadow-md shadow-brand-700/20"
        >
          <Calendar className="w-5 h-5 text-gold-400" />
          <span>Request Quote on WhatsApp</span>
        </Link>

        <a
          href={getGeneralWhatsAppUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-emerald-600 text-white font-bold text-sm shadow-sm"
        >
          <MessageCircle className="w-4 h-4 fill-emerald-100" />
          <span>Direct WhatsApp Chat</span>
        </a>

        <div className="pt-2 text-center text-xs text-slate-500 space-y-1">
          <p className="font-semibold text-slate-700 flex items-center justify-center gap-1">
            <Phone className="w-3.5 h-3.5 text-brand-700" /> Call Us: {DISPLAY_PHONE}
          </p>
          <p className="text-[11px]">Alt: {ALT_PHONE_1}</p>
        </div>
      </div>
    </div>
  );
}
