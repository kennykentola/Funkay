"use client";

import React, { useState, useEffect, useMemo } from "react";
import SectionHeading from "@/components/ui/SectionHeading";
import EquipmentCard from "@/components/ui/EquipmentCard";
import { SAMPLE_EQUIPMENT } from "@/data/equipmentData";
import { getEquipmentItems } from "@/lib/equipmentService";
import { EquipmentItem, CategoryType } from "@/types";
import { Search, Filter, MessageCircle } from "lucide-react";
import { getGeneralWhatsAppUrl } from "@/lib/whatsapp";

const CATEGORIES: CategoryType[] = ["All", "Chairs", "Tables", "Tents", "Tablecloths", "Extras"];

export default function EquipmentPage() {
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [items, setItems] = useState<EquipmentItem[]>(SAMPLE_EQUIPMENT);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        const data = await getEquipmentItems();
        if (isMounted) setItems(data);
      } catch (err) {
        console.error("Failed to load equipment:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [items, selectedCategory, searchQuery]);

  return (
    <div className="py-12 sm:py-16 space-y-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <SectionHeading
          subtitle="Inventory Catalogue"
          title="Event Equipment & Rentals"
          description="Select chairs, tables, tents, tablecloths, and accessories for your event in Ibadan. Click any item to request instant availability and pricing on WhatsApp."
        />

        {/* Search & Category Filter Controls */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search equipment..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-600/20 font-medium"
              />
            </div>

            {/* Quick Bulk Inquiry CTA */}
            <a
              href={getGeneralWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-colors w-full sm:w-auto justify-center"
            >
              <MessageCircle className="w-4 h-4 fill-emerald-100" />
              <span>Need Custom Package? Chat Us</span>
            </a>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pt-2 pb-1 border-t border-slate-100 scrollbar-none">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 shrink-0 mr-2">
              <Filter className="w-3.5 h-3.5" /> Filter:
            </span>
            {CATEGORIES.map((category) => {
              const isActive = selectedCategory === category;
              return (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                    isActive
                      ? "bg-brand-700 text-white shadow-md shadow-brand-700/20"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </div>

        {/* Equipment Grid */}
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-6">
            {filteredItems.map((item) => (
              <EquipmentCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200/80 p-8 space-y-4">
            <p className="text-slate-500 font-medium text-base">
              No equipment found matching your current search or filter criteria.
            </p>
            <button
              onClick={() => {
                setSelectedCategory("All");
                setSearchQuery("");
              }}
              className="px-5 py-2.5 rounded-xl bg-brand-700 text-white font-bold text-xs hover:bg-brand-800 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
