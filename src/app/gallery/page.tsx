"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import SectionHeading from "@/components/ui/SectionHeading";
import { GALLERY_ITEMS } from "@/data/equipmentData";
import { getGalleryItems } from "@/lib/galleryService";
import { GalleryItem } from "@/types";
import { Maximize2, X, MessageCircle, Image as ImageIcon } from "lucide-react";
import { getGeneralWhatsAppUrl } from "@/lib/whatsapp";

const GALLERY_CATEGORIES = ["All", "Weddings", "Birthdays", "Church Events", "Delivery", "Setups"];

export default function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);
  const [galleryList, setGalleryList] = useState<GalleryItem[]>(GALLERY_ITEMS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadGallery() {
      try {
        const items = await getGalleryItems();
        if (isMounted) setGalleryList(items);
      } catch (err) {
        console.error("Failed to fetch gallery photos:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadGallery();
    return () => {
      isMounted = false;
    };
  }, []);

  const filteredGallery = galleryList.filter(
    (item) => activeCategory === "All" || item.category === activeCategory
  );

  return (
    <div className="py-12 sm:py-16 space-y-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          subtitle="Real Event Setups"
          title="Event Photo Gallery"
          description="Browse real event setups, wedding decorations, canopy tents, and equipment delivery operations from FUNKAY RENTAL SERVICES in Ibadan."
        />

        {/* Category Tabs */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-4 scrollbar-none">
          {GALLERY_CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                  isActive
                    ? "bg-brand-700 text-white shadow-md shadow-brand-700/20"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Gallery Grid */}
        {filteredGallery.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-6">
            {filteredGallery.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedImage(item)}
                className="group relative h-72 rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl cursor-pointer transition-all duration-300 bg-slate-100"
              >
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  loading="lazy"
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/20 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />

                <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-slate-900/70 backdrop-blur-md text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Maximize2 className="w-4 h-4" />
                </div>

                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-gold-400 bg-slate-900/80 px-2.5 py-0.5 rounded-md inline-block mb-1">
                    {item.category}
                  </span>
                  <h3 className="font-bold text-lg leading-snug text-white group-hover:text-gold-200 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-300 line-clamp-1 mt-0.5">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 space-y-3">
            <ImageIcon className="w-10 h-10 text-slate-400 mx-auto" />
            <p className="text-slate-600 font-medium text-sm">
              No photos found in category &quot;{activeCategory}&quot;.
            </p>
          </div>
        )}
      </div>

      {/* Image Modal Lightbox */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
          <div className="relative max-w-4xl w-full bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-800 space-y-4">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-slate-950/80 text-white flex items-center justify-center hover:bg-slate-800 transition-colors"
              aria-label="Close image modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="relative h-96 sm:h-[480px] w-full bg-slate-950">
              <Image
                src={selectedImage.image}
                alt={selectedImage.title}
                fill
                priority
                sizes="100vw"
                className="object-contain"
              />
            </div>

            <div className="p-6 bg-slate-900 border-t border-slate-800 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-gold-400 bg-brand-900/80 px-2.5 py-1 rounded-md inline-block mb-1">
                  {selectedImage.category}
                </span>
                <h3 className="text-xl font-bold text-white">{selectedImage.title}</h3>
                <p className="text-xs text-slate-300 mt-1">{selectedImage.description}</p>
              </div>

              <a
                href={getGeneralWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all shrink-0"
              >
                <MessageCircle className="w-4 h-4 fill-emerald-100" />
                <span>Inquire About Similar Setup</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
