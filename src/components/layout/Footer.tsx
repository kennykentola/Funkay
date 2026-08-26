import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Phone, MessageCircle, MapPin, Truck, ChevronRight } from "lucide-react";
import { DISPLAY_PHONE, ALT_PHONE_1, ALT_PHONE_2, BUSINESS_ADDRESS, getGeneralWhatsAppUrl } from "@/lib/whatsapp";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          {/* Brand Info */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="relative w-11 h-11 rounded-xl overflow-hidden bg-slate-950 border border-slate-700">
                <Image
                  src="/images/logo.png"
                  alt="FUNKAY Rental Services Logo"
                  fill
                  className="object-contain p-0.5"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-xl tracking-tight text-white">FUNKAY</span>
                <span className="text-[10px] font-bold tracking-widest text-emerald-400 uppercase -mt-1">
                  Rental Services
                </span>
              </div>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed">
              Your premier local event equipment rental provider in Elebu Moniya & Ibadan, Oyo State. We supply top-quality chairs, tables, tents, and accessories with reliable doorstep delivery using our own vehicle.
            </p>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-3 py-2 rounded-lg">
              <Truck className="w-4 h-4 text-gold-400" />
              <span>We Don&apos;t Just Rent — We Deliver</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-white font-bold text-base tracking-wide border-b border-slate-800 pb-2">
              Quick Navigation
            </h3>
            <ul className="space-y-2 text-sm">
              {[
                { name: "Home", href: "/" },
                { name: "Equipment Catalogue", href: "/equipment" },
                { name: "Get a Quote", href: "/quote" },
                { name: "How It Works", href: "/how-it-works" },
                { name: "Event Gallery", href: "/gallery" },
                { name: "About Our Business", href: "/about" },
                { name: "Contact & Location", href: "/contact" },
              ].map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="hover:text-emerald-400 flex items-center gap-1.5 transition-colors text-slate-400"
                  >
                    <ChevronRight className="w-3.5 h-3.5 text-emerald-500" />
                    <span>{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Equipment Categories */}
          <div className="space-y-4">
            <h3 className="text-white font-bold text-base tracking-wide border-b border-slate-800 pb-2">
              Equipment Categories
            </h3>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link href="/equipment?category=Chairs" className="hover:text-emerald-400 transition-colors">
                  Banquet & Plastic Chairs
                </Link>
              </li>
              <li>
                <Link href="/equipment?category=Tables" className="hover:text-emerald-400 transition-colors">
                  Round & Trestle Tables
                </Link>
              </li>
              <li>
                <Link href="/equipment?category=Tents" className="hover:text-emerald-400 transition-colors">
                  Outdoor Party Tents & Canopies
                </Link>
              </li>
              <li>
                <Link href="/equipment?category=Tablecloths" className="hover:text-emerald-400 transition-colors">
                  Tablecloths & Linen Sets
                </Link>
              </li>
              <li>
                <Link href="/equipment?category=Extras" className="hover:text-emerald-400 transition-colors">
                  Cooling Fans & Accessories
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-4">
            <h3 className="text-white font-bold text-base tracking-wide border-b border-slate-800 pb-2">
              Contact Information
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2.5 text-slate-300">
                <MapPin className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <span className="text-xs leading-relaxed">{BUSINESS_ADDRESS}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-gold-400 shrink-0" />
                <div className="flex flex-col text-xs">
                  <a href={`tel:${DISPLAY_PHONE.replace(/\s+/g, '')}`} className="font-bold text-white hover:text-emerald-400 transition-colors">
                    {DISPLAY_PHONE} (Primary)
                  </a>
                  <span className="text-slate-400">{ALT_PHONE_1}</span>
                  <span className="text-slate-400">{ALT_PHONE_2}</span>
                </div>
              </li>
              <li className="pt-1">
                <a
                  href={getGeneralWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-colors"
                >
                  <MessageCircle className="w-4 h-4 fill-emerald-100" />
                  <span>WhatsApp Enquiries</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} FUNKAY RENTAL SERVICES. All rights reserved.</p>
          <p className="text-slate-500">Elebu Moniya, Ibadan, Oyo State, Nigeria</p>
        </div>
      </div>
    </footer>
  );
}
