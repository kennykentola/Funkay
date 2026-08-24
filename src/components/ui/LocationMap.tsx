"use client";

import React from "react";
import { BUSINESS_ADDRESS } from "@/lib/whatsapp";

export default function LocationMap() {
  return (
    <div className="w-full h-80 rounded-2xl overflow-hidden shadow-lg border border-slate-200 bg-slate-100">
      <iframe
        title="FUNKAY Rental Services Location Map"
        width="100%"
        height="100%"
        style={{ border: 0 }}
        loading="lazy"
        allowFullScreen
        src={`https://maps.google.com/maps?q=${encodeURIComponent(BUSINESS_ADDRESS)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
      />
    </div>
  );
}
