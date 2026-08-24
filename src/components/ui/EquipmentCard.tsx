import React from "react";
import Image from "next/image";
import { MessageCircle, CheckCircle2, Star } from "lucide-react";
import { EquipmentItem } from "@/types";
import { getEquipmentInquiryUrl } from "@/lib/whatsapp";

interface EquipmentCardProps {
  item: EquipmentItem;
}

export default function EquipmentCard({ item }: EquipmentCardProps) {
  const inquiryUrl = getEquipmentInquiryUrl(item.name);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden group">
      {/* Image container */}
      <div className="relative h-56 w-full bg-slate-100 overflow-hidden">
        <Image
          src={item.image}
          alt={item.name}
          fill
          loading="lazy"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3 flex gap-2">
          <span className="bg-slate-900/85 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1 rounded-md tracking-wider uppercase">
            {item.category}
          </span>
          {item.popular && (
            <span className="bg-amber-500 text-slate-950 text-[11px] font-extrabold px-2.5 py-1 rounded-md flex items-center gap-1 shadow-sm">
              <Star className="w-3 h-3 fill-slate-950" /> Popular
            </span>
          )}
          {item.isAvailable === false && (
            <span className="bg-rose-600 text-white text-[11px] font-extrabold px-2.5 py-1 rounded-md shadow-sm">
              Out of Stock
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="text-xl font-bold text-slate-900 group-hover:text-brand-800 transition-colors">
              {item.name}
            </h3>

            {/* Price Badge */}
            <div className="text-right shrink-0">
              {item.price && item.price > 0 ? (
                <div>
                  <span className="text-lg font-extrabold text-emerald-700 block">
                    ₦{item.price.toLocaleString()}
                  </span>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    {item.priceUnit || "per day"}
                  </span>
                </div>
              ) : (
                <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                  Price on Request
                </span>
              )}
            </div>
          </div>

          <p className="text-slate-600 text-sm leading-relaxed mb-4">
            {item.description}
          </p>

          {item.specifications && item.specifications.length > 0 && (
            <ul className="space-y-1.5 border-t border-slate-100 pt-3">
              {item.specifications.map((spec, index) => (
                <li key={index} className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>{spec}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Inquire Button */}
        <div className="pt-2">
          <a
            href={inquiryUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-sm shadow-md shadow-emerald-700/20 hover:shadow-lg transition-all"
          >
            <MessageCircle className="w-4 h-4 fill-emerald-100" />
            <span>Inquire on WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  );
}
