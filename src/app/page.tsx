"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { MessageCircle, ArrowRight, Truck, CheckCircle2, ShieldCheck, Clock, Award, Calendar, Sparkles } from "lucide-react";
import { getGeneralWhatsAppUrl } from "@/lib/whatsapp";
import { SAMPLE_EQUIPMENT } from "@/data/equipmentData";
import { getEquipmentItems } from "@/lib/equipmentService";
import { EquipmentItem } from "@/types";
import EquipmentCard from "@/components/ui/EquipmentCard";
import SectionHeading from "@/components/ui/SectionHeading";

export default function HomePage() {
  const [equipment, setEquipment] = useState<EquipmentItem[]>(SAMPLE_EQUIPMENT);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        const data = await getEquipmentItems();
        if (isMounted) setEquipment(data);
      } catch (err) {
        console.error("Error loading homepage equipment:", err);
      }
    }
    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  const popularItems = equipment.filter((item) => item.popular && item.isAvailable !== false).slice(0, 8);

  const categories = [
    { title: "Chairs", count: "Banquet, Plastic", image: "/images/chairs-rental.jpg", href: "/equipment?category=Chairs" },
    { title: "Tables", count: "Round & Rectangular", image: "/images/tables-rental.jpg", href: "/equipment?category=Tables" },
    { title: "Tents & Canopies", count: "Weatherproof Canopies", image: "/images/tents-canopies.jpg", href: "/equipment?category=Tents" },
    { title: "Tablecloths", count: "Green, Gold & White Linens", image: "/images/tablecloths.jpg", href: "/equipment?category=Tablecloths" },
    { title: "Event Extras", count: "Cooling Fans & Accessories", image: "/images/birthday-setup.jpg", href: "/equipment?category=Extras" },
  ];

  const steps = [
    { num: "01", title: "Choose Your Items", text: "Browse our catalogue of clean chairs, tables, tents, and linens." },
    { num: "02", title: "Request a Quote", text: "Send your event details and item list directly to us via WhatsApp." },
    { num: "03", title: "Confirm Your Rental", text: "Discuss event schedule, quantity, location, and total pricing with our team." },
    { num: "04", title: "We Deliver", text: "FUNKAY RENTAL SERVICES transports equipment straight to your venue in our vehicle." },
    { num: "05", title: "Enjoy Your Event", text: "Relax and host your guests while our equipment makes your venue look spectacular." },
  ];

  return (
    <div className="space-y-16 md:space-y-24 pb-16">
      {/* 1. HERO SECTION */}
      <section className="relative bg-slate-900 text-white overflow-hidden py-16 lg:py-24">
        {/* Background Image Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/hero-event-setup.jpg"
            alt="FUNKAY Rental Services Event Setup"
            fill
            priority
            className="object-cover object-center opacity-30 scale-105 transform transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-slate-900/60" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-emerald-950/80 border border-emerald-600/50 text-emerald-300 text-xs sm:text-sm font-bold px-3.5 py-1.5 rounded-full shadow-inner">
                <Truck className="w-4 h-4 text-gold-400" />
                <span>Elebu Moniya & Ibadan Event Equipment Rentals</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] text-white">
                Quality Event Rentals. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-gold-400">
                  Reliable Delivery.
                </span>
              </h1>

              <p className="text-lg sm:text-xl text-slate-300 max-w-2xl font-normal leading-relaxed mx-auto lg:mx-0">
                Chairs, tables, tents, canopies, tablecloths, and reception accessories delivered directly to your venue in Ibadan using our own dedicated vehicle.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <a
                  href={getGeneralWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2.5 w-full sm:w-auto px-8 py-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-base shadow-xl shadow-emerald-900/50 hover:shadow-2xl transition-all hover:-translate-y-0.5"
                >
                  <MessageCircle className="w-5 h-5 fill-white text-emerald-600" />
                  <span>Get Quote on WhatsApp</span>
                </a>

                <Link
                  href="/equipment"
                  className="flex items-center justify-center gap-2 w-full sm:w-auto px-7 py-4 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-800 text-slate-200 font-bold text-base transition-all hover:border-slate-500"
                >
                  <span>View Equipment</span>
                  <ArrowRight className="w-4 h-4 text-gold-400" />
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="pt-6 border-t border-slate-800/80 grid grid-cols-3 gap-4 text-center lg:text-left">
                <div>
                  <p className="text-xl sm:text-2xl font-extrabold text-white">Own Fleet</p>
                  <p className="text-xs text-slate-400 font-medium">Safe Doorstep Delivery</p>
                </div>
                <div>
                  <p className="text-xl sm:text-2xl font-extrabold text-gold-400"> Clean</p>
                  <p className="text-xs text-slate-400 font-medium">Sanitized Equipment</p>
                </div>
                <div>
                  <p className="text-xl sm:text-2xl font-extrabold text-emerald-400">Instant</p>
                  <p className="text-xs text-slate-400 font-medium">WhatsApp Quotation</p>
                </div>
              </div>
            </div>

            {/* Right Card / Visual Showcase */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-700/60 group">
                <Image
                  src="/images/wedding-setup.jpg"
                  alt="Beautiful Event Setup in Ibadan"
                  width={600}
                  height={450}
                  loading="lazy"
                  className="object-cover w-full h-[380px] sm:h-[450px] group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-90" />

                <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-slate-900/90 backdrop-blur-md border border-slate-700/80 text-white space-y-2">
                  <div className="flex items-center gap-2 text-gold-400 text-xs font-bold uppercase tracking-wider">
                    <Sparkles className="w-4 h-4" /> Ready for your big day
                  </div>
                  <h3 className="font-extrabold text-lg">Weddings • Birthdays • Receptions</h3>
                  <p className="text-xs text-slate-300">
                    High-quality canopy tents, chiavari chairs, and dressed tables arranged for Ibadan celebrations.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. POPULAR CATEGORIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          subtitle="Explore Equipment"
          title="Popular Rental Categories"
          description="Everything you need for your upcoming wedding, party, church function or reception in Ibadan."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat, idx) => (
            <Link
              key={idx}
              href={cat.href}
              className="group relative rounded-2xl overflow-hidden h-64 border border-slate-200 shadow-md hover:shadow-xl transition-all duration-300"
            >
              <Image
                src={cat.image}
                alt={cat.title}
                fill
                loading="lazy"
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 text-white flex justify-between items-end">
                <div>
                  <span className="text-xs font-bold text-emerald-400 block mb-1">{cat.count}</span>
                  <h3 className="text-2xl font-bold tracking-tight text-white group-hover:text-gold-300 transition-colors">
                    {cat.title}
                  </h3>
                </div>
                <div className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center group-hover:bg-brand-700 group-hover:text-white transition-all">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. DELIVERY ADVANTAGE SECTION */}
      <section className="bg-slate-900 text-white py-16 sm:py-20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Image */}
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-800">
              <Image
                src="/images/delivery-vehicle.jpg"
                alt="FUNKAY Rental Services Delivery Vehicle"
                width={700}
                height={460}
                loading="lazy"
                className="object-cover w-full h-[360px] sm:h-[440px]"
              />
              <div className="absolute bottom-4 left-4 right-4 bg-emerald-950/90 backdrop-blur-md p-4 rounded-xl border border-emerald-700/50 flex items-center gap-3">
                <Truck className="w-8 h-8 text-gold-400 shrink-0" />
                <div>
                  <p className="font-extrabold text-sm text-white">Own Company Delivery Vehicle</p>
                  <p className="text-xs text-emerald-300">Transporting gear across Elebu Moniya & Ibadan metro</p>
                </div>
              </div>
            </div>

            {/* Copy */}
            <div className="space-y-6">
              <span className="text-xs font-extrabold uppercase tracking-widest text-gold-400 bg-gold-400/10 px-3 py-1 rounded-full border border-gold-400/20">
                Delivery Advantage
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
                &ldquo;We Don&apos;t Just Rent — We Deliver.&rdquo;
              </h2>
              <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
                At FUNKAY RENTAL SERVICES, we maintain our own dedicated transport vehicle. You don&apos;t need to worry about organizing external drivers or risky transport. We pack, load, and deliver your chairs, tables, and tents directly to your venue location in Moniya, Ibadan, and surrounding areas.
              </p>

              <div className="space-y-3 pt-2">
                {[
                  "Safe equipment transport using our own vehicle",
                  "Dedicated Vehicle Delivery & Pickup: Safe transport scheduled around your setup time (Transport fee is separate & calculated based on venue location)",
                  "Careful loading & unloading by trained handlers",
                  "Full coverage across Moniya, Elebu, and greater Ibadan",
                ].map((feat, i) => (
                  <div key={i} className="flex items-start gap-3 text-sm text-slate-200 font-semibold">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>

              <div className="p-3.5 rounded-xl bg-slate-800/90 border border-slate-700 text-xs text-slate-300 flex items-start gap-2.5">
                <Truck className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-white">Note on Transport Fees:</strong> Equipment rental rates do not include logistics. Dedicated vehicle delivery and pickup fees are calculated based on your event venue location within Ibadan.
                </span>
              </div>

              <div className="pt-4">
                <Link
                  href="/quote"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-gold-500 hover:bg-gold-400 text-slate-950 font-extrabold text-sm shadow-lg transition-all"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Request Rental & Delivery Quote</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FEATURED CATALOGUE HIGHLIGHTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs uppercase font-extrabold tracking-widest text-brand-700 bg-brand-50 px-3 py-1 rounded-full border border-brand-200">
              Quality Inventory
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 mt-2">
              Featured Event Equipment
            </h2>
          </div>
          <Link
            href="/equipment"
            className="flex items-center gap-1.5 text-sm font-extrabold text-brand-700 hover:text-brand-800"
          >
            <span>Browse Full Catalogue ({equipment.length} Items)</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {popularItems.map((item) => (
            <EquipmentCard key={item.id} item={item} />
          ))}
        </div>
      </section>

      {/* 5. HOW IT WORKS SECTION */}
      <section className="bg-slate-100 py-16 sm:py-20 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            subtitle="Simple Process"
            title="How It Works"
            description="5 simple steps from selecting your equipment to having everything delivered at your venue."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {steps.map((s, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm relative flex flex-col justify-between"
              >
                <div>
                  <span className="text-3xl font-extrabold text-brand-700 block mb-3">{s.num}</span>
                  <h3 className="font-bold text-slate-900 text-lg mb-2">{s.title}</h3>
                  <p className="text-slate-600 text-xs leading-relaxed">{s.text}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/how-it-works"
              className="inline-flex items-center gap-2 text-sm font-bold text-brand-800 hover:text-brand-900"
            >
              <span>Learn more about our delivery process</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 6. CALL TO ACTION BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-brand-900 via-brand-800 to-emerald-900 rounded-3xl p-8 sm:p-12 text-white shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 text-center md:text-left max-w-xl">
            <span className="text-xs font-extrabold uppercase tracking-widest text-gold-400">
              Need Equipment for an Upcoming Event?
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Get an Instant Quote on WhatsApp
            </h2>
            <p className="text-emerald-100 text-sm leading-relaxed">
              Tell us your event date, venue location in Ibadan, and required chairs or tents. We will reply promptly with availability and affordable pricing.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0">
            <a
              href={getGeneralWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-extrabold text-base shadow-xl transition-all"
            >
              <MessageCircle className="w-5 h-5 fill-white text-emerald-600" />
              <span>Chat on WhatsApp</span>
            </a>

            <Link
              href="/quote"
              className="flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-white text-slate-900 hover:bg-slate-100 font-bold text-base transition-all"
            >
              <span>Fill Quote Form</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
