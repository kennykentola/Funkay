import { db } from "./firebase";
import {
  collection,
  getDocs,
  doc,
  setDoc,
  deleteDoc,
} from "firebase/firestore";
import { GalleryItem } from "@/types";
import { GALLERY_ITEMS } from "@/data/equipmentData";

const COLLECTION_NAME = "gallery";

// Helper with 10s timeout
async function withTimeout<T>(promise: Promise<T>, timeoutMs = 10000): Promise<T> {
  let timeoutId: NodeJS.Timeout;
  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(new Error(`Firestore operation timed out after ${timeoutMs / 1000}s.`));
    }, timeoutMs);
  });

  return Promise.race([promise, timeoutPromise]).finally(() => {
    clearTimeout(timeoutId);
  });
}

/**
 * Fetch all gallery items from Firestore.
 * Falls back to default GALLERY_ITEMS if collection is empty.
 */
export async function getGalleryItems(): Promise<GalleryItem[]> {
  try {
    const querySnapshot: any = await withTimeout(
      getDocs(collection(db, COLLECTION_NAME))
    );
    
    if (!querySnapshot || querySnapshot.empty) {
      console.log("No gallery documents found in Firestore. Returning initial gallery data.");
      return GALLERY_ITEMS;
    }

    const items: GalleryItem[] = [];
    querySnapshot.forEach((docSnap: any) => {
      items.push({
        id: docSnap.id,
        ...docSnap.data(),
      } as GalleryItem);
    });

    return items;
  } catch (error) {
    console.warn("Could not fetch gallery items from Firestore, using fallback defaults:", error);
    return GALLERY_ITEMS;
  }
}

/**
 * Save or update a single gallery item in Firestore.
 */
export async function saveGalleryItem(item: GalleryItem): Promise<boolean> {
  try {
    const itemId = item.id || `gal-${Date.now()}`;
    const docRef = doc(db, COLLECTION_NAME, itemId);
    
    const payload: GalleryItem = {
      ...item,
      id: itemId,
    };

    await withTimeout(setDoc(docRef, payload, { merge: true }));
    return true;
  } catch (error: any) {
    console.error("Error saving gallery item:", error);
    throw error;
  }
}

/**
 * Delete a gallery item from Firestore.
 */
export async function deleteGalleryItem(itemId: string): Promise<boolean> {
  try {
    const docRef = doc(db, COLLECTION_NAME, itemId);
    await withTimeout(deleteDoc(docRef));
    return true;
  } catch (error: any) {
    console.error("Error deleting gallery item:", error);
    throw error;
  }
}

/**
 * Seed initial gallery items into Firestore.
 */
export async function seedInitialGallery(): Promise<boolean> {
  try {
    for (const item of GALLERY_ITEMS) {
      const docRef = doc(db, COLLECTION_NAME, item.id);
      await withTimeout(setDoc(docRef, item, { merge: true }));
    }
    return true;
  } catch (error: any) {
    console.error("Error seeding initial gallery:", error);
    throw error;
  }
}
