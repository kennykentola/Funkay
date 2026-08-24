import { QuoteFormData } from "@/types";

export const WHATSAPP_NUMBER = "2348033377252";
export const DISPLAY_PHONE = "+234 803 337 7252";
export const ALT_PHONE_1 = "+234 816 357 1677";
export const ALT_PHONE_2 = "+234 803 343 6897";
export const BUSINESS_ADDRESS = "Unit 1, House 25, Shop Merin Elebu, Moniya Rd, Moniya, Ibadan, Oyo State, Nigeria";

/**
 * Constructs a WhatsApp URL for general enquiries
 */
export function getGeneralWhatsAppUrl(): string {
  const message = "Hello FUNKAY RENTAL SERVICES, I would like to make an enquiry about your event rental services.";
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

/**
 * Constructs a WhatsApp URL for a specific equipment item enquiry
 */
export function getEquipmentInquiryUrl(productName: string): string {
  const message = `Hello FUNKAY RENTAL SERVICES, I would like to enquire about ${productName}. Please provide availability and pricing.`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

/**
 * Constructs a WhatsApp URL for a complete quote request from form data
 */
export function getQuoteWhatsAppUrl(data: QuoteFormData): string {
  const itemsText = data.itemsNeeded.length > 0 ? data.itemsNeeded.join(", ") : "Not specified";
  const notesText = data.additionalNotes.trim() ? data.additionalNotes.trim() : "None";

  const message = `Hello FUNKAY RENTAL SERVICES,

I would like to request a quote for an event.

*Name:* ${data.fullName}
*Phone:* ${data.phoneNumber}
*Event Date:* ${data.eventDate}
*Event Location:* ${data.eventLocation}
*Number of Guests:* ${data.numberOfGuests}
*Items Needed:* ${itemsText}
*Additional Notes:* ${notesText}

Please let me know the availability and quotation.

Thank you.`;

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
