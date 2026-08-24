import React from "react";
import Image from "next/image";
import Link from "next/link";
import SectionHeading from "@/components/ui/SectionHeading";
import { Phone, MessageCircle, MapPin, Truck, Clock, Calendar, ExternalLink } from "lucide-react";
import { DISPLAY_PHONE, ALT_PHONE_1, ALT_PHONE_2, BUSINESS_ADDRESS, getGeneralWhatsAppUrl } from "@/lib/whatsapp";

import LocationMap from "@/components/ui/LocationMap";

export default function ContactPage() {
  const mapSearchUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    BUSINESS_ADDRESS
  )}`;

  return (
    <div className="py-12 sm:py-16 space-y-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          subtitle="Get in Touch"
          title="Contact FUNKAY Rental Services"
          description="We are ready to assist you with event chairs, tables, tents, and delivery arrangements across Moniya, Elebu, and Ibadan."
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Large Actionable Contact Cards (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Primary WhatsApp Card */}
            <div className="bg-gradient-to-br from-emerald-800 to-brand-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden border border-emerald-700/50">
              <div className="space-y-4">
                <span className="text-xs uppercase font-extrabold tracking-widest text-gold-400 bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-700/60">
                  Fastest Response
                </span>
                <h3 className="text-2xl font-extrabold text-white">Chat With Us on WhatsApp</h3>
                <p className="text-emerald-100 text-sm leading-relaxed">
                  Send your event date, location, and item list directly to our team for quick availability and pricing response.
                </p>

                <div className="pt-2">
                  <a
                    href={getGeneralWhatsAppUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2.5 px-8 py-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-extrabold text-base shadow-lg transition-all"
                  >
                    <MessageCircle className="w-5 h-5 fill-white text-emerald-600" />
                    <span>Open WhatsApp Chat (+234 803 337 7252)</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Click to Call Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gold-100 text-gold-700 flex items-center justify-center shrink-0">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-xl">Direct Phone Numbers</h3>
                  <p className="text-xs text-slate-500">Tap any number below to call directly from your phone</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <a
                  href={`tel:${DISPLAY_PHONE.replace(/\s+/g, '')}`}
                  className="flex flex-col p-4 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-colors"
                >
                  <span className="text-[11px] font-extrabold text-slate-400 uppercase">Primary Call Line</span>
                  <span className="text-base font-extrabold text-brand-800 mt-1">{DISPLAY_PHONE}</span>
                </a>

                <a
                  href={`tel:${ALT_PHONE_1.replace(/\s+/g, '')}`}
                  className="flex flex-col p-4 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-colors"
                >
                  <span className="text-[11px] font-extrabold text-slate-400 uppercase">Alternative Line 1</span>
                  <span className="text-base font-extrabold text-slate-800 mt-1">{ALT_PHONE_1}</span>
                </a>

                <a
                  href={`tel:${ALT_PHONE_2.replace(/\s+/g, '')}`}
                  className="flex flex-col p-4 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-colors sm:col-span-2"
                >
                  <span className="text-[11px] font-extrabold text-slate-400 uppercase">Alternative Line 2</span>
                  <span className="text-base font-extrabold text-slate-800 mt-1">{ALT_PHONE_2}</span>
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Address & Map (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Address Card */}
            <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-lg space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-brand-700 text-gold-400 flex items-center justify-center shrink-0">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-extrabold text-white text-xl">Business Address</h3>
                  <p className="text-xs text-slate-400">Hub & Office Location</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 text-slate-200 text-sm font-semibold leading-relaxed">
                {BUSINESS_ADDRESS}
              </div>

              <a
                href={mapSearchUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition-colors"
              >
                <ExternalLink className="w-4 h-4 text-emerald-400" />
                <span>Open Location in Google Maps</span>
              </a>
            </div>

            {/* Embedded Google Map Component */}
            <LocationMap />

            {/* Delivery Vehicle Feature */}
            <div className="bg-emerald-950 text-emerald-100 rounded-3xl p-6 border border-emerald-800 space-y-3">
              <div className="flex items-center gap-3 text-gold-400">
                <Truck className="w-6 h-6" />
                <h4 className="font-extrabold text-white text-base">Direct Equipment Delivery</h4>
              </div>
              <p className="text-xs text-emerald-200 leading-relaxed">
                We bring your rented chairs, tables, and canopies straight to your venue using our company truck.
              </p>
              <div className="pt-2">
                <Link
                  href="/quote"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-gold-300 hover:underline"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Request a Delivery Quote</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
