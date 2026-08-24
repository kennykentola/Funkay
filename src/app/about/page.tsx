import React from "react";
import Image from "next/image";
import Link from "next/link";
import SectionHeading from "@/components/ui/SectionHeading";
import { Truck, CheckCircle2, Phone, MessageCircle, MapPin, ShieldCheck, HeartHandshake } from "lucide-react";
import { getGeneralWhatsAppUrl, BUSINESS_ADDRESS, DISPLAY_PHONE, ALT_PHONE_1 } from "@/lib/whatsapp";

export default function AboutPage() {
  return (
    <div className="py-12 sm:py-16 space-y-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          subtitle="Local & Trusted"
          title="About FUNKAY Rental Services"
          description="Your dedicated local partner for quality event equipment, reliable transport delivery, and customer convenience in Elebu Moniya, Ibadan."
        />

        {/* Story Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200">
              <Image
                src="/images/about-us.jpg"
                alt="FUNKAY Rental Services Team"
                width={650}
                height={480}
                loading="lazy"
                className="object-cover w-full h-[400px] sm:h-[480px]"
              />
              <div className="absolute bottom-4 left-4 right-4 bg-slate-900/90 backdrop-blur-md p-4 rounded-2xl border border-slate-800 text-white flex items-center gap-3">
                <Truck className="w-8 h-8 text-gold-400 shrink-0" />
                <div>
                  <p className="font-extrabold text-sm text-white">Direct Doorstep Delivery</p>
                  <p className="text-xs text-slate-300">Serving Moniya, Elebu, and Ibadan events</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs uppercase font-extrabold tracking-widest text-brand-700 bg-brand-50 px-3 py-1 rounded-full border border-brand-200">
              Our Mission
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Providing Clean Event Rentals with Stress-Free Delivery
            </h2>

            <p className="text-slate-600 text-base leading-relaxed">
              <strong>FUNKAY RENTAL SERVICES</strong> operates from Elebu Moniya, Ibadan. We understand that hosting an event — whether a wedding reception, birthday party, naming ceremony, church event, or corporate gathering — requires reliable, high-quality equipment that arrives on time.
            </p>

            <p className="text-slate-600 text-base leading-relaxed">
              We take pride in keeping our inventory of chairs, tables, tents, and tablecloths pristine, sanitized, and structurally sound. Furthermore, by maintaining our own company transport vehicle, we provide seamless delivery and pickup straight to your event venue.
            </p>

            <div className="space-y-3 pt-2">
              {[
                "Clean, sanitized, and sturdy event equipment",
                "Dedicated delivery using our company vehicle",
                "Personalized, attentive customer service on WhatsApp & phone",
                "Serving Elebu Moniya, Ibadan, and surrounding communities",
              ].map((point, i) => (
                <div key={i} className="flex items-center gap-3 text-sm text-slate-800 font-bold">
                  <CheckCircle2 className="w-5 h-5 text-brand-700 shrink-0" />
                  <span>{point}</span>
                </div>
              ))}
            </div>

            <div className="pt-4 flex flex-col sm:flex-row gap-4">
              <a
                href={getGeneralWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm shadow-md transition-colors"
              >
                <MessageCircle className="w-4 h-4 fill-emerald-100" />
                <span>Contact Us on WhatsApp</span>
              </a>

              <Link
                href="/quote"
                className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm transition-colors"
              >
                <span>Request a Quote</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Address Card */}
        <div className="mt-16 bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-700 flex items-center justify-center shrink-0">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base mb-1">Our Location</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{BUSINESS_ADDRESS}</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gold-50 text-gold-700 flex items-center justify-center shrink-0">
              <Phone className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base mb-1">Call Lines</h3>
              <p className="text-xs text-slate-600 font-bold">{DISPLAY_PHONE}</p>
              <p className="text-xs text-slate-500">{ALT_PHONE_1}</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base mb-1">Own Logistics</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Dedicated company vehicle for venue drop-off and pickup across Ibadan.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
