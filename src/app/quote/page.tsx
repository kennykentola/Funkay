import React from "react";
import type { Metadata } from "next";
import SectionHeading from "@/components/ui/SectionHeading";
import QuoteForm from "@/components/quote/QuoteForm";
import { Truck, Phone, MessageCircle, Clock, ShieldCheck } from "lucide-react";
import { DISPLAY_PHONE, ALT_PHONE_1, getGeneralWhatsAppUrl } from "@/lib/whatsapp";
import { getEquipmentItems } from "@/lib/equipmentService";

export const metadata: Metadata = {
  title: "Get an Instant Event Rental Quote | WhatsApp Quotation Ibadan",
  description:
    "Request a fast event equipment rental quotation from FUNKAY RENTAL SERVICES in Elebu Moniya, Ibadan. Select chairs, tables, tents, and receive an instant estimate on WhatsApp.",
};

// Revalidate quote page statically every 1 hour (ISR)
export const revalidate = 3600;

export default async function QuotePage() {
  const initialEquipment = await getEquipmentItems();

  return (
    <div className="py-12 sm:py-16 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          subtitle="Simple Quotation"
          title="Get a Custom Rental Quote"
          description="Select your required event items and event date. Our system will generate a complete WhatsApp message ready to send to FUNKAY RENTAL SERVICES."
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Main Form (8 Cols) */}
          <div className="lg:col-span-8">
            <QuoteForm initialEquipment={initialEquipment} />
          </div>

          {/* Sidebar Info (4 Cols) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Direct Contact Card */}
            <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 space-y-6 border border-slate-800 shadow-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-700 text-gold-400 flex items-center justify-center">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-white">Prefer a Phone Call?</h3>
                  <p className="text-xs text-slate-400">Speak directly with our event manager</p>
                </div>
              </div>

              <div className="space-y-3 border-t border-slate-800 pt-4">
                <div>
                  <p className="text-xs text-slate-400 font-semibold uppercase">Primary Phone</p>
                  <a
                    href={`tel:${DISPLAY_PHONE.replace(/\s+/g, '')}`}
                    className="text-lg font-bold text-gold-400 hover:underline"
                  >
                    {DISPLAY_PHONE}
                  </a>
                </div>

                <div>
                  <p className="text-xs text-slate-400 font-semibold uppercase">Alternative Contact</p>
                  <p className="text-sm font-semibold text-slate-300">{ALT_PHONE_1}</p>
                </div>
              </div>

              <a
                href={getGeneralWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-colors"
              >
                <MessageCircle className="w-4 h-4 fill-emerald-100" />
                <span>Open WhatsApp Direct Chat</span>
              </a>
            </div>

            {/* Delivery Guarantee Card */}
            <div className="bg-emerald-950 text-emerald-100 rounded-3xl p-6 border border-emerald-800/80 space-y-4">
              <div className="flex items-center gap-3 text-gold-400">
                <Truck className="w-6 h-6 shrink-0" />
                <h3 className="font-extrabold text-white text-base">Own Delivery Vehicle</h3>
              </div>
              <p className="text-xs text-emerald-200 leading-relaxed">
                We transport all rented equipment using our company vehicle. We deliver straight to your event venue in Elebu Moniya & Ibadan metro.
              </p>
              <div className="flex items-center gap-2 text-xs text-emerald-300 font-semibold pt-2 border-t border-emerald-900">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Sanitized & Inspection Checked</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
