import React from "react";
import type { Metadata } from "next";
import SectionHeading from "@/components/ui/SectionHeading";
import EquipmentFilterGrid from "@/components/equipment/EquipmentFilterGrid";
import { getEquipmentItems } from "@/lib/equipmentService";

export const metadata: Metadata = {
  title: "Event Equipment Rental Catalogue | Chairs, Tables & Tents in Ibadan",
  description:
    "Browse FUNKAY RENTAL SERVICES complete equipment inventory: plastic chairs, banquet tables, white canopy tents, tablecloths and event accessories in Moniya, Ibadan.",
  keywords: [
    "Funkay Equipment Catalogue",
    "Chair rental Moniya",
    "Canopy tent rental Ibadan",
    "Banquet table rental Elebu Moniya",
    "Funkay Rentals inventory",
  ],
};

// Revalidate equipment catalogue page statically every 1 hour (ISR)
export const revalidate = 3600;

export default async function EquipmentPage() {
  const initialItems = await getEquipmentItems();

  return (
    <div className="py-12 sm:py-16 space-y-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <SectionHeading
          subtitle="Inventory Catalogue"
          title="Event Equipment & Rentals"
          description="Select chairs, tables, tents, tablecloths, and accessories for your event in Ibadan. Click any item to request instant availability and pricing on WhatsApp."
        />

        {/* Interactive Equipment Catalogue Grid */}
        <EquipmentFilterGrid initialItems={initialItems} />
      </div>
    </div>
  );
}
