"use client";

import React, { useState, useEffect } from "react";
import { User, Phone, Calendar, MapPin, Users, CheckSquare, MessageSquare, Send, AlertCircle, Calculator } from "lucide-react";
import { QuoteFormData, EquipmentItem } from "@/types";
import { getEquipmentItems } from "@/lib/equipmentService";
import { getQuoteWhatsAppUrl } from "@/lib/whatsapp";
import QuoteSuccessModal from "./QuoteSuccessModal";

export default function QuoteForm() {
  const [equipmentList, setEquipmentList] = useState<EquipmentItem[]>([]);
  const [quantities, setQuantities] = useState<{ [id: string]: number }>({});
  
  const [formData, setFormData] = useState<QuoteFormData>({
    fullName: "",
    phoneNumber: "",
    eventDate: "",
    eventLocation: "",
    numberOfGuests: "",
    itemsNeeded: [],
    additionalNotes: "",
  });

  const [customItemInput, setCustomItemInput] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [submittedUrl, setSubmittedUrl] = useState<string | null>(null);

  useEffect(() => {
    async function loadEquipment() {
      try {
        const items = await getEquipmentItems();
        setEquipmentList(items.filter((i) => i.isAvailable !== false));
      } catch (err) {
        console.error("Failed to load equipment list:", err);
      }
    }
    loadEquipment();
  }, []);

  const getItemFormattedText = (item: EquipmentItem, qty: number) => {
    const isChair = item.category === "Chairs" || (item.priceUnit && item.priceUnit.includes("dozen"));
    const unitLabel = item.priceUnit || (isChair ? "per dozen" : "per day");
    const priceText = item.price && item.price > 0 ? ` (₦${item.price.toLocaleString()} ${unitLabel})` : "";
    if (isChair) {
      const dozenLabel = qty === 1 ? "1 Dozen" : `${qty} Dozens`;
      return `${item.name}${priceText} x${dozenLabel} (${qty * 12} Chairs)`;
    }
    return `${item.name}${priceText} x${qty}`;
  };

  const handleToggleItem = (item: EquipmentItem) => {
    const exists = formData.itemsNeeded.some((i) => i.startsWith(item.name));

    if (exists) {
      setFormData((prev) => ({
        ...prev,
        itemsNeeded: prev.itemsNeeded.filter((i) => !i.startsWith(item.name)),
      }));
      setQuantities((prev) => {
        const copy = { ...prev };
        delete copy[item.id];
        return copy;
      });
    } else {
      const initialQty = 1;
      setQuantities((prev) => ({ ...prev, [item.id]: initialQty }));
      setFormData((prev) => ({
        ...prev,
        itemsNeeded: [...prev.itemsNeeded, getItemFormattedText(item, initialQty)],
      }));
    }
  };

  const handleQuantityChange = (item: EquipmentItem, qty: number) => {
    const validQty = Math.max(1, qty);
    setQuantities((prev) => ({ ...prev, [item.id]: validQty }));

    const formattedItem = getItemFormattedText(item, validQty);

    setFormData((prev) => ({
      ...prev,
      itemsNeeded: prev.itemsNeeded.map((i) => (i.startsWith(item.name) ? formattedItem : i)),
    }));
  };

  const handleAddCustomItem = () => {
    if (customItemInput.trim() && !formData.itemsNeeded.includes(customItemInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        itemsNeeded: [...prev.itemsNeeded, customItemInput.trim()],
      }));
      setCustomItemInput("");
    }
  };

  // Calculate estimated subtotal
  const estimatedSubtotal = Object.entries(quantities).reduce((acc, [id, qty]) => {
    const found = equipmentList.find((i) => i.id === id);
    if (found && found.price) {
      return acc + found.price * qty;
    }
    return acc;
  }, 0);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.fullName.trim()) newErrors.fullName = "Full Name is required";
    if (!formData.phoneNumber.trim()) newErrors.phoneNumber = "Phone Number is required";
    if (!formData.eventDate) newErrors.eventDate = "Event Date is required";
    if (!formData.eventLocation.trim()) newErrors.eventLocation = "Event Location is required";
    if (formData.itemsNeeded.length === 0) newErrors.itemsNeeded = "Please select at least one item needed";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    // Append subtotal note if > 0
    const finalData = { ...formData };
    if (estimatedSubtotal > 0) {
      finalData.additionalNotes = `${finalData.additionalNotes ? finalData.additionalNotes + '\n' : ''}[Estimated Subtotal: ₦${estimatedSubtotal.toLocaleString()}]`;
    }

    const targetUrl = getQuoteWhatsAppUrl(finalData);
    setSubmittedUrl(targetUrl);
    window.open(targetUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-10 shadow-xl relative overflow-hidden">
      <div className="mb-8 border-b border-slate-100 pb-6">
        <span className="text-xs uppercase font-extrabold tracking-widest text-brand-700 bg-brand-50 px-3 py-1 rounded-full">
          Instant WhatsApp Quotation
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
          Request Event Equipment Rental Quote
        </h2>
        <p className="text-slate-600 text-sm mt-1">
          Select equipment items, specify quantities, and get live quote estimates.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Full Name & Phone Number */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
              Full Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <User className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="e.g. Adebayo Ogunlesi"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className={`w-full pl-11 pr-4 py-3.5 rounded-xl border ${
                  errors.fullName ? "border-red-500 bg-red-50/30" : "border-slate-300 focus:border-brand-600"
                } text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-brand-600/20 font-medium transition-all`}
              />
            </div>
            {errors.fullName && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" />{errors.fullName}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Phone className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="tel"
                placeholder="e.g. 0803 123 4567"
                value={formData.phoneNumber}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                className={`w-full pl-11 pr-4 py-3.5 rounded-xl border ${
                  errors.phoneNumber ? "border-red-500 bg-red-50/30" : "border-slate-300 focus:border-brand-600"
                } text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-brand-600/20 font-medium transition-all`}
              />
            </div>
            {errors.phoneNumber && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" />{errors.phoneNumber}</p>}
          </div>
        </div>

        {/* Event Date & Location */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
              Event Date <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Calendar className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="date"
                value={formData.eventDate}
                onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                className={`w-full pl-11 pr-4 py-3.5 rounded-xl border ${
                  errors.eventDate ? "border-red-500 bg-red-50/30" : "border-slate-300 focus:border-brand-600"
                } text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-brand-600/20 font-medium transition-all`}
              />
            </div>
            {errors.eventDate && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" />{errors.eventDate}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
              Event Location (Ibadan / Moniya / Surrounding) <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <MapPin className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="e.g. Moniya Event Center, Ibadan"
                value={formData.eventLocation}
                onChange={(e) => setFormData({ ...formData, eventLocation: e.target.value })}
                className={`w-full pl-11 pr-4 py-3.5 rounded-xl border ${
                  errors.eventLocation ? "border-red-500 bg-red-50/30" : "border-slate-300 focus:border-brand-600"
                } text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-brand-600/20 font-medium transition-all`}
              />
            </div>
            {errors.eventLocation && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" />{errors.eventLocation}</p>}
          </div>
        </div>

        {/* Number of Guests */}
        <div>
          <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
            Number of Guests <span className="text-slate-400 font-normal lowercase">(optional)</span>
          </label>
          <div className="relative">
            <Users className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="e.g. 150 guests"
              value={formData.numberOfGuests}
              onChange={(e) => setFormData({ ...formData, numberOfGuests: e.target.value })}
              className={`w-full pl-11 pr-4 py-3.5 rounded-xl border ${
                errors.numberOfGuests ? "border-red-500 bg-red-50/30" : "border-slate-300 focus:border-brand-600"
              } text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-brand-600/20 font-medium transition-all`}
            />
          </div>
          {errors.numberOfGuests && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" />{errors.numberOfGuests}</p>}
        </div>

        {/* Dynamic Equipment Selection with Quantities */}
        <div>
          <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
            Select Equipment Needed & Quantities <span className="text-red-500">*</span>
          </label>

          <div className="space-y-3 p-4 bg-slate-50 border border-slate-200/80 rounded-2xl">
            {equipmentList.map((item) => {
              const isSelected = formData.itemsNeeded.some((i) => i.startsWith(item.name));
              const qty = quantities[item.id] || 1;
              const isChair = item.category === "Chairs" || (item.priceUnit && item.priceUnit.includes("dozen"));

              return (
                <div
                  key={item.id}
                  className={`flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl border transition-all gap-3 ${
                    isSelected
                      ? "bg-emerald-950 text-white border-emerald-800 shadow-sm"
                      : "bg-white text-slate-700 border-slate-200 hover:border-brand-300"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => handleToggleItem(item)}
                    className="flex items-center gap-3 text-left text-xs font-bold flex-1"
                  >
                    <div
                      className={`w-5 h-5 rounded flex items-center justify-center border shrink-0 ${
                        isSelected ? "bg-emerald-500 border-emerald-500 text-white" : "border-slate-300 bg-white"
                      }`}
                    >
                      {isSelected && <CheckSquare className="w-4 h-4 stroke-[3]" />}
                    </div>
                    <div>
                      <span className="font-extrabold text-sm block">{item.name}</span>
                      {item.price && item.price > 0 ? (
                        <span className={`text-[11px] ${isSelected ? "text-emerald-300" : "text-emerald-700 font-bold"}`}>
                          ₦{item.price.toLocaleString()} {item.priceUnit || (isChair ? "per dozen" : "per day")}
                        </span>
                      ) : (
                        <span className="text-[11px] text-slate-400">Price on inquiry</span>
                      )}
                    </div>
                  </button>

                  {/* Quantity Controller */}
                  {isSelected && (
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 shrink-0 bg-slate-900/90 p-2 rounded-xl border border-slate-700 text-white">
                      <div className="text-[11px] font-bold text-emerald-400 px-1">
                        {isChair ? (
                          <span>Qty: <strong>{qty} {qty === 1 ? "Dozen" : "Dozens"}</strong> ({qty * 12} Chairs)</span>
                        ) : (
                          <span className="uppercase text-[10px] text-slate-400">Qty:</span>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleQuantityChange(item, qty - 1)}
                          className="w-6 h-6 rounded-lg bg-slate-800 hover:bg-slate-700 font-bold flex items-center justify-center text-xs"
                        >
                          -
                        </button>
                        <input
                          type="number"
                          min={1}
                          value={qty}
                          onChange={(e) => handleQuantityChange(item, Number(e.target.value))}
                          className="w-12 text-center bg-slate-950 border border-slate-700 text-white text-xs font-extrabold rounded py-0.5"
                        />
                        <button
                          type="button"
                          onClick={() => handleQuantityChange(item, qty + 1)}
                          className="w-6 h-6 rounded-lg bg-slate-800 hover:bg-slate-700 font-bold flex items-center justify-center text-xs"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Add custom item input */}
          <div className="mt-3 flex gap-2">
            <input
              type="text"
              placeholder="Other equipment? (e.g. 5 Serving Trays)"
              value={customItemInput}
              onChange={(e) => setCustomItemInput(e.target.value)}
              className="flex-1 px-3.5 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-600/20"
            />
            <button
              type="button"
              onClick={handleAddCustomItem}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-bold text-xs transition-colors"
            >
              Add Item
            </button>
          </div>

          {errors.itemsNeeded && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" />{errors.itemsNeeded}</p>}
        </div>

        {/* Live Estimated Subtotal Box */}
        {estimatedSubtotal > 0 && (
          <div className="p-4 rounded-2xl bg-emerald-950 text-emerald-100 border border-emerald-800 flex items-center justify-between shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-900 text-gold-400 flex items-center justify-center border border-emerald-700">
                <Calculator className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs uppercase font-extrabold tracking-wider text-emerald-300">Estimated Rental Subtotal</p>
                <p className="text-xs text-emerald-200">Based on live pricing (excluding logistics)</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-2xl font-extrabold text-gold-400">₦{estimatedSubtotal.toLocaleString()}</span>
            </div>
          </div>
        )}

        {/* Additional Notes */}
        <div>
          <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
            Additional Notes / Setup Preferences <span className="text-slate-400 font-normal">(Optional)</span>
          </label>
          <div className="relative">
            <MessageSquare className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
            <textarea
              rows={3}
              placeholder="e.g. Setup required by 8:00 AM sharp on event morning..."
              value={formData.additionalNotes}
              onChange={(e) => setFormData({ ...formData, additionalNotes: e.target.value })}
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-300 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-brand-600/20 font-medium transition-all"
            />
          </div>
        </div>

        {/* Submit CTA */}
        <button
          type="submit"
          className="flex items-center justify-center gap-2 w-full py-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-extrabold text-base shadow-xl shadow-emerald-700/25 transition-all hover:scale-[1.01]"
        >
          <Send className="w-5 h-5 fill-white text-emerald-600" />
          <span>Generate & Send Quote on WhatsApp</span>
        </button>
      </form>

      {/* Success Modal */}
      <QuoteSuccessModal
        isOpen={!!submittedUrl}
        onReset={() => setSubmittedUrl(null)}
        whatsappUrl={submittedUrl || ""}
      />
    </div>
  );
}
