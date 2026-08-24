import React from "react";
import Image from "next/image";
import Link from "next/link";
import SectionHeading from "@/components/ui/SectionHeading";
import { Truck, CheckCircle2, MessageCircle, Calendar, ShieldCheck, MapPin } from "lucide-react";
import { getGeneralWhatsAppUrl, BUSINESS_ADDRESS } from "@/lib/whatsapp";

export default function HowItWorksPage() {
  const steps = [
    {
      num: "01",
      title: "Choose Your Items",
      desc: "Browse our catalogue of high-quality event rentals including plastic chairs, round/rectangular tables, white canopy tents, and tablecloths.",
      image: "/images/chairs-rental.jpg",
    },
    {
      num: "02",
      title: "Request a Quote",
      desc: "Use our simple WhatsApp Quote form or click any item to send your required quantity, event date, and venue location directly to our team.",
      image: "/images/birthday-setup.jpg",
    },
    {
      num: "03",
      title: "Confirm Your Rental",
      desc: "Our team reviews item availability, verifies your venue location in Ibadan, confirms delivery logistics, and agrees on transparent pricing with you.",
      image: "/images/wedding-setup.jpg",
    },
    {
      num: "04",
      title: "We Deliver (Own Vehicle)",
      desc: "FUNKAY RENTAL SERVICES loads and transports your rental items using our own dedicated delivery vehicle directly to your venue address.",
      image: "/images/delivery-vehicle.jpg",
    },
    {
      num: "05",
      title: "Enjoy Your Event",
      desc: "Your equipment arrives clean, organized, and ready for your guests. After your event concludes, our crew returns to collect the items seamlessly.",
      image: "/images/hero-event-setup.jpg",
    },
  ];

  return (
    <div className="py-12 sm:py-16 space-y-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          subtitle="Rental Process"
          title="How FUNKAY Rental Services Works"
          description="We take the stress out of event planning. Follow our 5-step rental journey for reliable equipment delivery in Ibadan."
        />

        {/* Steps List */}
        <div className="space-y-12">
          {steps.map((step, idx) => {
            const isEven = idx % 2 === 1;
            return (
              <div
                key={idx}
                className={`bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-10 shadow-sm hover:shadow-md transition-all flex flex-col ${
                  isEven ? "lg:flex-row-reverse" : "lg:flex-row"
                } items-center gap-8 lg:gap-12`}
              >
                {/* Image */}
                <div className="w-full lg:w-1/2 relative h-64 sm:h-80 rounded-2xl overflow-hidden shadow-inner shrink-0">
                  <Image
                    src={step.image}
                    alt={step.title}
                    fill
                    loading="lazy"
                    className="object-cover"
                  />
                  <div className="absolute top-4 left-4 bg-brand-900 text-gold-400 font-extrabold text-lg w-12 h-12 rounded-xl flex items-center justify-center shadow-lg">
                    {step.num}
                  </div>
                </div>

                {/* Content */}
                <div className="w-full lg:w-1/2 space-y-4 text-center lg:text-left">
                  <span className="text-xs uppercase font-extrabold tracking-widest text-brand-700 bg-brand-50 px-3 py-1 rounded-full">
                    Step {step.num}
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                    {step.title}
                  </h3>
                  <p className="text-slate-600 text-base leading-relaxed">
                    {step.desc}
                  </p>

                  {idx === 3 && (
                    <div className="pt-2">
                      <div className="inline-flex items-center gap-2 bg-emerald-950 text-emerald-300 text-xs font-bold px-3.5 py-2 rounded-xl border border-emerald-800">
                        <Truck className="w-4 h-4 text-gold-400" />
                        <span>Dedicated Company Transport Vehicle</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Coverage Section */}
        <div className="mt-16 bg-slate-900 text-white rounded-3xl p-8 sm:p-12 border border-slate-800 text-center space-y-6">
          <div className="w-14 h-14 bg-brand-800 text-gold-400 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
            <MapPin className="w-7 h-7" />
          </div>
          <h2 className="text-3xl font-extrabold text-white">Delivery Coverage Areas</h2>
          <p className="text-slate-300 max-w-2xl mx-auto text-sm leading-relaxed">
            Our hub is based in <strong>Elebu Moniya, Ibadan, Oyo State</strong>. We regularly deliver event equipment to Moniya, Elebu, Bodija, UI, and surrounding locations in Ibadan.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/quote"
              className="flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-gold-500 hover:bg-gold-400 text-slate-950 font-extrabold text-sm shadow-md transition-colors"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Your Event Equipment</span>
            </Link>

            <a
              href={getGeneralWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border border-slate-700 bg-slate-800 text-slate-200 font-bold text-sm hover:bg-slate-700 transition-colors"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span>Ask a Delivery Question</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
