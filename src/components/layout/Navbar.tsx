"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Phone, MessageCircle, Menu, X, Truck, Calendar, ShieldCheck } from "lucide-react";
import { DISPLAY_PHONE, getGeneralWhatsAppUrl } from "@/lib/whatsapp";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import MobileMenu from "./MobileMenu";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user: any) => {
      setIsAdmin(!!user);
    });
    return () => unsubscribe();
  }, []);

  const baseNavLinks = [
    { name: "Home", href: "/" },
    { name: "Equipment", href: "/equipment" },
    { name: "How It Works", href: "/how-it-works" },
    { name: "Gallery", href: "/gallery" },
    { name: "About Us", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  const navLinks = isAdmin
    ? [...baseNavLinks, { name: "Admin Portal", href: "/admin" }]
    : baseNavLinks;

  return (
    <>
      {/* Top Banner with Local Delivery Highlight & Contact Quick Links */}
      <div className="bg-brand-950 text-emerald-100 text-xs py-2 px-3 sm:px-4 border-b border-brand-900/60 overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 font-medium shrink-0">
            <span className="inline-flex items-center gap-1 bg-brand-800/80 text-emerald-300 text-[11px] sm:text-xs px-2 py-0.5 rounded-full font-semibold border border-brand-700/50">
              <Truck className="w-3 h-3 text-gold-400" /> Direct Delivery
            </span>
            <span className="text-[11px] sm:text-xs text-slate-300 hidden xs:inline">
              Ibadan & Moniya
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs font-semibold shrink-0">
            {isAdmin && (
              <span className="text-gold-400 font-extrabold text-[11px] flex items-center gap-1 bg-brand-900 px-2 py-0.5 rounded-md border border-gold-500/30">
                <ShieldCheck className="w-3.5 h-3.5 text-gold-400" /> Admin Mode Active
              </span>
            )}
            <a
              href={`tel:${DISPLAY_PHONE.replace(/\s+/g, '')}`}
              className="flex items-center gap-1 hover:text-white transition-colors"
            >
              <Phone className="w-3 h-3 text-gold-400" />
              <span className="text-[11px] sm:text-xs">Call</span>
            </a>
            <span className="text-brand-700">|</span>
            <a
              href={getGeneralWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-emerald-300 hover:text-white transition-colors"
            >
              <MessageCircle className="w-3 h-3 text-emerald-400 fill-emerald-950" />
              <span className="text-[11px] sm:text-xs font-bold">WhatsApp Us</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Brand Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative w-12 h-12 rounded-2xl overflow-hidden shadow-md shadow-brand-900/10 group-hover:scale-105 transition-transform border border-brand-100 bg-white">
                <Image
                  src="/images/logo.png"
                  alt="FUNKAY Rental Services Logo"
                  fill
                  priority
                  className="object-contain p-0.5"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-xl tracking-tight text-slate-900 group-hover:text-brand-800 transition-colors">
                  FUNKAY
                </span>
                <span className="text-[10px] font-bold tracking-widest text-brand-700 uppercase -mt-1">
                  Rental Services
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1 lg:gap-2">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all ${
                      isActive
                        ? "text-brand-800 bg-brand-50/80 font-bold shadow-sm"
                        : "text-slate-700 hover:text-brand-800 hover:bg-slate-50"
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </nav>

            {/* Desktop Action CTAs */}
            <div className="hidden md:flex items-center gap-3">
              <a
                href={getGeneralWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-xs shadow-md shadow-emerald-700/20 transition-all hover:scale-[1.02]"
              >
                <MessageCircle className="w-4 h-4 fill-emerald-100" />
                <span>WhatsApp Us</span>
              </a>

              <Link
                href="/quote"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-700 hover:bg-brand-600 active:bg-brand-800 text-white font-extrabold text-xs shadow-md shadow-brand-900/20 transition-all hover:scale-[1.02]"
              >
                <Calendar className="w-4 h-4 text-gold-400" />
                <span>Get Instant Quote</span>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex md:hidden items-center gap-2">
              <Link
                href="/quote"
                className="px-3.5 py-2 rounded-xl bg-brand-700 text-white font-bold text-xs shadow-sm"
              >
                Get Quote
              </Link>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2.5 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
                aria-label="Toggle Navigation Menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Navigation */}
      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        navLinks={navLinks}
        currentPath={pathname}
      />
    </>
  );
}
