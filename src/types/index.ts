export type CategoryType = 'All' | 'Chairs' | 'Tables' | 'Tents' | 'Tablecloths' | 'Extras';

export interface EquipmentItem {
  id: string;
  name: string;
  category: CategoryType;
  description: string;
  image: string;
  price?: number;
  priceUnit?: string;
  isAvailable?: boolean;
  specifications?: string[];
  popular?: boolean;
  minQuantity?: number;
  updatedAt?: string;
}

export interface QuoteFormData {
  fullName: string;
  phoneNumber: string;
  eventDate: string;
  eventLocation: string;
  numberOfGuests: string;
  itemsNeeded: string[];
  additionalNotes: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'Weddings' | 'Birthdays' | 'Church Events' | 'Delivery' | 'Setups';
  image: string;
  description: string;
}
