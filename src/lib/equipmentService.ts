import {
  collection,
  getDocs,
  doc,
  setDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "./firebase";
import { EquipmentItem } from "@/types";
import { SAMPLE_EQUIPMENT } from "@/data/equipmentData";

const COLLECTION_NAME = "equipment";

/**
 * Timeout wrapper to prevent Firestore promises from hanging indefinitely.
 */
function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number = 10000,
  operationName: string = "Firestore operation"
): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(
        new Error(
          `${operationName} timed out after ${timeoutMs / 1000}s. Check network connection or Firebase Firestore Security Rules.`
        )
      );
    }, timeoutMs);

    promise
      .then((res) => {
        clearTimeout(timer);
        resolve(res);
      })
      .catch((err) => {
        clearTimeout(timer);
        reject(err);
      });
  });
}

/**
 * Helper to turn Firestore error codes into human-readable messages.
 */
export function formatFirestoreError(err: any): string {
  if (!err) return "An unknown error occurred while contacting the database.";
  
  const code = err.code || "";
  const msg = err.message || String(err);

  if (msg.includes("timed out")) {
    return "Database Request Timed Out: Please check your internet connection or verify Firestore Security Rules in Firebase Console.";
  }

  switch (code) {
    case "permission-denied":
      return "Permission Denied: Firebase Security Rules are blocking write access. In Firebase Console > Firestore Database > Rules tab, set: 'allow read, write: if request.auth != null;' or 'allow read, write: if true;'";
    case "unavailable":
      return "Network Error: Could not connect to Firestore servers. Please check your internet connection.";
    case "unauthenticated":
      return "Unauthenticated: You must be logged in as an Admin to perform this action.";
    case "not-found":
      return "Database collection or document not found in Firestore.";
    default:
      return `Database Error (${code || "FAILED"}): ${msg}`;
  }
}

/**
 * Fetch all equipment items from Firestore with fallback to static sample data.
 */
export async function getEquipmentItems(): Promise<EquipmentItem[]> {
  try {
    const querySnapshot: any = await withTimeout<any>(
      getDocs(collection(db, COLLECTION_NAME)),
      8000,
      "Fetching equipment items"
    );
    if (querySnapshot.empty) {
      console.log("Firestore collection empty, returning static sample data.");
      return SAMPLE_EQUIPMENT;
    }
    const items: EquipmentItem[] = [];
    querySnapshot.forEach((docSnap: any) => {
      items.push({ id: docSnap.id, ...docSnap.data() } as EquipmentItem);
    });
    return items;
  } catch (error) {
    console.warn("Could not fetch from Firestore, using static fallback:", error);
    return SAMPLE_EQUIPMENT;
  }
}

/**
 * Update an item's price and price unit using setDoc with merge: true with 10s timeout wrapper.
 */
export async function updateEquipmentPrice(
  item: EquipmentItem,
  price: number,
  priceUnit: string = "per day"
): Promise<void> {
  const itemRef = doc(db, COLLECTION_NAME, item.id);
  await withTimeout(
    setDoc(
      itemRef,
      {
        ...item,
        price,
        priceUnit,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    ),
    10000,
    `Saving price for ${item.name}`
  );
}

/**
 * Toggle an item's availability (in stock / out of stock) safely.
 */
export async function updateEquipmentAvailability(
  item: EquipmentItem,
  isAvailable: boolean
): Promise<void> {
  const itemRef = doc(db, COLLECTION_NAME, item.id);
  await withTimeout(
    setDoc(
      itemRef,
      {
        ...item,
        isAvailable,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    ),
    10000,
    `Updating availability for ${item.name}`
  );
}

/**
 * Update complete equipment item fields.
 */
export async function saveEquipmentItem(item: EquipmentItem): Promise<void> {
  const itemRef = doc(db, COLLECTION_NAME, item.id);
  await withTimeout(
    setDoc(
      itemRef,
      {
        ...item,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    ),
    10000,
    `Saving equipment item ${item.name}`
  );
}

/**
 * Delete an equipment item from Firestore.
 */
export async function deleteEquipmentItem(id: string): Promise<void> {
  const itemRef = doc(db, COLLECTION_NAME, id);
  await withTimeout(deleteDoc(itemRef), 10000, `Deleting equipment item ${id}`);
}

/**
 * Seed Firestore with updated equipment items.
 */
export async function seedEquipmentDatabase(force: boolean = false): Promise<number> {
  const querySnapshot: any = await withTimeout<any>(
    getDocs(collection(db, COLLECTION_NAME)),
    10000,
    "Checking database before seed"
  );
  if (!querySnapshot.empty && !force) {
    console.log("Database already seeded with", querySnapshot.size, "items.");
    return querySnapshot.size;
  }

  let seededCount = 0;
  for (const item of SAMPLE_EQUIPMENT) {
    await withTimeout(
      setDoc(doc(db, COLLECTION_NAME, item.id), {
        ...item,
        price: item.price ?? 0,
        priceUnit: item.priceUnit ?? "per day",
        isAvailable: item.isAvailable ?? true,
        updatedAt: new Date().toISOString(),
      }),
      10000,
      `Seeding item ${item.name}`
    );
    seededCount++;
  }
  return seededCount;
}
