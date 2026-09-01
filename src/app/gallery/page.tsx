import React from "react";
import type { Metadata } from "next";
import SectionHeading from "@/components/ui/SectionHeading";
import GalleryFilterGrid from "@/components/gallery/GalleryFilterGrid";
import { getGalleryItems } from "@/lib/galleryService";

export const metadata: Metadata = {
  title: "Event Photo Gallery | Real Wedding & Canopy Setups in Ibadan",
  description:
    "Explore real event setups, wedding receptions, birthday parties, and delivery vehicle operations by FUNKAY RENTAL SERVICES in Moniya, Ibadan.",
};

// Revalidate gallery page statically every 1 hour (ISR)
export const revalidate = 3600;

export default async function GalleryPage() {
  const initialGallery = await getGalleryItems();

  return (
    <div className="py-12 sm:py-16 space-y-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          subtitle="Real Event Setups"
          title="Event Photo Gallery"
          description="Browse real event setups, wedding decorations, canopy tents, and equipment delivery operations from FUNKAY RENTAL SERVICES in Ibadan."
        />

        {/* Interactive Photo Gallery Grid */}
        <GalleryFilterGrid initialGallery={initialGallery} />
      </div>
    </div>
  );
}
