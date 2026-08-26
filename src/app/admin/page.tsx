"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signOut, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import {
  getEquipmentItems,
  updateEquipmentPrice,
  updateEquipmentAvailability,
  saveEquipmentItem,
  deleteEquipmentItem,
  seedEquipmentDatabase,
  formatFirestoreError,
} from "@/lib/equipmentService";
import {
  getGalleryItems,
  saveGalleryItem,
  deleteGalleryItem,
  seedInitialGallery,
} from "@/lib/galleryService";
import { EquipmentItem, CategoryType, GalleryItem } from "@/types";
import {
  LogOut,
  Plus,
  Save,
  Trash2,
  Database,
  CheckCircle,
  AlertCircle,
  Search,
  Check,
  X,
  Package,
  Edit3,
  Upload,
  ImageIcon,
  Link2,
  Camera,
  Lock,
  Mail,
  ShieldAlert,
  ArrowRight,
  Eye,
  EyeOff,
} from "lucide-react";
import Image from "next/image";

const CATEGORIES: CategoryType[] = ["All", "Chairs", "Tables", "Tents", "Tablecloths", "Extras"];
const GALLERY_CATEGORIES = ["Weddings", "Birthdays", "Church Events", "Delivery", "Setups"] as const;

/**
 * Helper to compress and convert an uploaded image file into a compact Base64 Data URL.
 */
function processUploadedImageFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 800;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height = Math.round((height * MAX_WIDTH) / width);
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width = Math.round((width * MAX_HEIGHT) / height);
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, width, height);

        // Compress to JPEG at 80% quality
        const dataUrl = canvas.toDataURL("image/jpeg", 0.8);
        resolve(dataUrl);
      };
      img.onerror = () => reject(new Error("Failed to load image file."));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error("Failed to read image file."));
    reader.readAsDataURL(file);
  });
}

export default function AdminDashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"inventory" | "gallery">("inventory");

  // Equipment states
  const [items, setItems] = useState<EquipmentItem[]>([]);
  const [loadingItems, setLoadingItems] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>("All");

  // Gallery states
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [loadingGallery, setLoadingGallery] = useState(true);
  const [gallerySearchQuery, setGallerySearchQuery] = useState("");

  // Notice state
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Edit price states: map item.id -> price value
  const [editingPrices, setEditingPrices] = useState<{ [id: string]: number }>({});
  const [editingUnits, setEditingUnits] = useState<{ [id: string]: string }>({});
  const [savingId, setSavingId] = useState<string | null>(null);
  const [savedId, setSavedId] = useState<string | null>(null);

  // Add Item Modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newItem, setNewItem] = useState<Partial<EquipmentItem>>({
    name: "",
    category: "Chairs",
    description: "",
    image: "/images/chairs-rental.jpg",
    price: 2500,
    priceUnit: "per dozen",
    isAvailable: true,
    specifications: [""],
  });

  // Edit Item Modal state
  const [editingItem, setEditingItem] = useState<EquipmentItem | null>(null);

  // Gallery Modal state
  const [showAddGalleryModal, setShowAddGalleryModal] = useState(false);
  const [editingGalleryItem, setEditingGalleryItem] = useState<GalleryItem | null>(null);
  const [newGalleryItem, setNewGalleryItem] = useState<Partial<GalleryItem>>({
    title: "",
    category: "Weddings",
    image: "/images/wedding-setup.jpg",
    description: "",
  });

  // Inline Login state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  const router = useRouter();

  // 1. Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser: any) => {
      setUser(currentUser);
      setAuthLoading(false);
      if (currentUser) {
        loadItemsData();
        loadGalleryData();
      }
    });

    return () => unsubscribe();
  }, []);

  const handleInlineLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setLoginLoading(true);

    try {
      await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
    } catch (err: any) {
      console.error("Auth error:", err);
      if (
        err.code === "auth/invalid-credential" ||
        err.code === "auth/user-not-found" ||
        err.code === "auth/wrong-password"
      ) {
        setLoginError("Access Denied: Only authorized business owners can access the Funkay Admin Portal.");
      } else {
        setLoginError(`Auth error: ${err.message || "Failed to authenticate."}`);
      }
    } finally {
      setLoginLoading(false);
    }
  };

  // Load Firestore items
  async function loadItemsData() {
    setLoadingItems(true);
    try {
      const data = await getEquipmentItems();
      setItems(data);
      const initialPrices: { [id: string]: number } = {};
      const initialUnits: { [id: string]: string } = {};
      data.forEach((i) => {
        initialPrices[i.id] = i.price || 0;
        initialUnits[i.id] = i.priceUnit || "per day";
      });
      setEditingPrices(initialPrices);
      setEditingUnits(initialUnits);
    } catch (err: any) {
      setStatusMessage({ type: "error", text: formatFirestoreError(err) });
    } finally {
      setLoadingItems(false);
    }
  }

  // Load Firestore gallery
  async function loadGalleryData() {
    setLoadingGallery(true);
    try {
      const data = await getGalleryItems();
      setGalleryItems(data);
    } catch (err: any) {
      setStatusMessage({ type: "error", text: formatFirestoreError(err) });
    } finally {
      setLoadingGallery(false);
    }
  }

  // Logout handler
  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setStatusMessage({ type: "success", text: "Signed out successfully." });
    } catch (err: any) {
      setStatusMessage({ type: "error", text: "Failed to sign out." });
    }
  };

  // Quick price save handler
  const handleSavePrice = async (item: EquipmentItem) => {
    const newPrice = editingPrices[item.id];
    const newUnit = editingUnits[item.id] || item.priceUnit || "per day";
    setSavingId(item.id);
    setStatusMessage(null);

    try {
      await updateEquipmentPrice(item, newPrice, newUnit);
      setSavedId(item.id);
      setStatusMessage({
        type: "success",
        text: `Updated price for "${item.name}" to ₦${newPrice.toLocaleString()} (${newUnit}).`,
      });
      setTimeout(() => setSavedId(null), 2500);
      await loadItemsData();
    } catch (err: any) {
      setStatusMessage({ type: "error", text: formatFirestoreError(err) });
    } finally {
      setSavingId(null);
    }
  };

  // Toggle availability handler
  const handleToggleAvailability = async (item: EquipmentItem) => {
    const updatedStatus = !item.isAvailable;
    try {
      await updateEquipmentAvailability(item, updatedStatus);
      setStatusMessage({
        type: "success",
        text: `Marked "${item.name}" as ${updatedStatus ? "In Stock" : "Out of Stock"}.`,
      });
      await loadItemsData();
    } catch (err: any) {
      setStatusMessage({ type: "error", text: formatFirestoreError(err) });
    }
  };

  // Delete equipment item
  const handleDeleteItem = async (item: EquipmentItem) => {
    if (!confirm(`Are you sure you want to delete "${item.name}" from inventory?`)) return;
    try {
      await deleteEquipmentItem(item.id);
      setStatusMessage({ type: "success", text: `Deleted "${item.name}".` });
      await loadItemsData();
    } catch (err: any) {
      setStatusMessage({ type: "error", text: formatFirestoreError(err) });
    }
  };

  // Seed inventory database
  const handleSeedDatabase = async () => {
    if (!confirm("This will upload or merge all default rental equipment into Firestore. Continue?")) return;
    try {
      await seedEquipmentDatabase();
      setStatusMessage({ type: "success", text: "Database seeded successfully!" });
      await loadItemsData();
    } catch (err: any) {
      setStatusMessage({ type: "error", text: formatFirestoreError(err) });
    }
  };

  // Save new equipment item
  const handleCreateNewItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.name || !newItem.description) {
      setStatusMessage({ type: "error", text: "Please enter a valid item name and description." });
      return;
    }
    try {
      const payload: EquipmentItem = {
        id: `item-${Date.now()}`,
        name: newItem.name,
        category: newItem.category as CategoryType,
        description: newItem.description,
        image: newItem.image || "/images/chairs-rental.jpg",
        price: Number(newItem.price) || 0,
        priceUnit: newItem.priceUnit || "per day",
        isAvailable: newItem.isAvailable !== false,
        specifications: newItem.specifications?.filter((s) => s.trim().length > 0) || [],
      };

      await saveEquipmentItem(payload);
      setStatusMessage({ type: "success", text: `Successfully added "${payload.name}"!` });
      setShowAddModal(false);
      setNewItem({
        name: "",
        category: "Chairs",
        description: "",
        image: "/images/chairs-rental.jpg",
        price: 2500,
        priceUnit: "per dozen",
        isAvailable: true,
        specifications: [""],
      });
      await loadItemsData();
    } catch (err: any) {
      setStatusMessage({ type: "error", text: formatFirestoreError(err) });
    }
  };

  // Save edited equipment item
  const handleSaveEditedItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    try {
      await saveEquipmentItem(editingItem);
      setStatusMessage({ type: "success", text: `Saved details for "${editingItem.name}"!` });
      setEditingItem(null);
      await loadItemsData();
    } catch (err: any) {
      setStatusMessage({ type: "error", text: formatFirestoreError(err) });
    }
  };

  // --- GALLERY HANDLERS ---
  const handleCreateGalleryItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGalleryItem.title || !newGalleryItem.description) {
      setStatusMessage({ type: "error", text: "Please enter a title and description for the gallery photo." });
      return;
    }
    try {
      const payload: GalleryItem = {
        id: `gal-${Date.now()}`,
        title: newGalleryItem.title,
        category: (newGalleryItem.category as any) || "Weddings",
        image: newGalleryItem.image || "/images/wedding-setup.jpg",
        description: newGalleryItem.description,
      };
      await saveGalleryItem(payload);
      setStatusMessage({ type: "success", text: `Added event photo "${payload.title}" to gallery!` });
      setShowAddGalleryModal(false);
      setNewGalleryItem({ title: "", category: "Weddings", image: "/images/wedding-setup.jpg", description: "" });
      await loadGalleryData();
    } catch (err: any) {
      setStatusMessage({ type: "error", text: formatFirestoreError(err) });
    }
  };

  const handleSaveEditedGalleryItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingGalleryItem) return;
    try {
      await saveGalleryItem(editingGalleryItem);
      setStatusMessage({ type: "success", text: `Updated event photo "${editingGalleryItem.title}"!` });
      setEditingGalleryItem(null);
      await loadGalleryData();
    } catch (err: any) {
      setStatusMessage({ type: "error", text: formatFirestoreError(err) });
    }
  };

  const handleDeleteGalleryItem = async (item: GalleryItem) => {
    if (!confirm(`Are you sure you want to delete photo "${item.title}" from the gallery?`)) return;
    try {
      await deleteGalleryItem(item.id);
      setStatusMessage({ type: "success", text: `Deleted photo "${item.title}".` });
      await loadGalleryData();
    } catch (err: any) {
      setStatusMessage({ type: "error", text: formatFirestoreError(err) });
    }
  };

  const handleSeedGallery = async () => {
    if (!confirm("This will upload all default event photo gallery items into Firestore. Continue?")) return;
    try {
      await seedInitialGallery();
      setStatusMessage({ type: "success", text: "Photo gallery seeded successfully!" });
      await loadGalleryData();
    } catch (err: any) {
      setStatusMessage({ type: "error", text: formatFirestoreError(err) });
    }
  };

  // Image Upload Handlers
  const handleImageFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, target: "new" | "edit" | "galNew" | "galEdit") => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await processUploadedImageFile(file);
      if (target === "new") setNewItem((prev) => ({ ...prev, image: dataUrl }));
      else if (target === "edit" && editingItem) setEditingItem((prev) => prev ? { ...prev, image: dataUrl } : null);
      else if (target === "galNew") setNewGalleryItem((prev) => ({ ...prev, image: dataUrl }));
      else if (target === "galEdit" && editingGalleryItem) setEditingGalleryItem((prev) => prev ? { ...prev, image: dataUrl } : null);
    } catch (err: any) {
      setStatusMessage({ type: "error", text: "Failed to process uploaded image file." });
    }
  };

  // Filter items
  const filteredItems = items.filter((item) => {
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const filteredGallery = galleryItems.filter((item) =>
    item.title.toLowerCase().includes(gallerySearchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(gallerySearchQuery.toLowerCase())
  );

  if (authLoading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-slate-900 text-white">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm font-semibold text-slate-300">Verifying Admin Access...</p>
        </div>
      </div>
    );
  }

  // If NOT logged in: render Admin Login Form directly on /admin!
  if (!user) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-900 text-white">
        <div className="max-w-md w-full space-y-8 bg-slate-950 p-8 sm:p-10 rounded-3xl border border-slate-800 shadow-2xl">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-brand-900 border border-brand-700 text-gold-400 flex items-center justify-center mx-auto shadow-lg">
              <Lock className="w-7 h-7" />
            </div>
            <h2 className="text-3xl font-extrabold text-white tracking-tight">Admin Portal Login</h2>
            <p className="text-xs text-slate-400">
              Log in to manage equipment prices, availability, and photo gallery for FUNKAY RENTAL SERVICES.
            </p>
          </div>

          {loginError && (
            <div className="p-4 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-300 text-xs flex items-center gap-3 animate-fadeIn">
              <ShieldAlert className="w-5 h-5 shrink-0 text-rose-400" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleInlineLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                Admin Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="admin@funkayrentals.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-11 py-3 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors p-1"
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-4.5 h-4.5 text-brand-400" />
                  ) : (
                    <Eye className="w-4.5 h-4.5 text-slate-400" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full py-3.5 rounded-xl bg-brand-700 hover:bg-brand-600 active:bg-brand-800 text-white font-extrabold text-sm shadow-lg shadow-brand-900/50 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {loginLoading ? (
                <span>Authenticating Owner...</span>
              ) : (
                <>
                  <span>Sign In to Admin Dashboard</span>
                  <ArrowRight className="w-4 h-4 text-gold-400" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <span className="text-xs uppercase font-extrabold tracking-widest text-gold-400 bg-brand-900/80 px-3 py-1 rounded-full border border-brand-700">
              Admin Portal
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-2">
              FUNKAY Control Dashboard
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Signed in as <strong className="text-slate-200">{user?.email}</strong>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {activeTab === "inventory" ? (
              <>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Equipment Item</span>
                </button>

                <button
                  onClick={handleSeedDatabase}
                  title="Upload default inventory items to Firestore if database is empty"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-800 hover:bg-brand-700 text-gold-300 font-bold text-xs border border-brand-700 transition-all"
                >
                  <Database className="w-4 h-4" />
                  <span>Seed Inventory</span>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setShowAddGalleryModal(true)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all"
                >
                  <Camera className="w-4 h-4" />
                  <span>Add Event Gallery Photo</span>
                </button>

                <button
                  onClick={handleSeedGallery}
                  title="Upload default gallery photos to Firestore"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-800 hover:bg-brand-700 text-gold-300 font-bold text-xs border border-brand-700 transition-all"
                >
                  <Database className="w-4 h-4" />
                  <span>Seed Gallery</span>
                </button>
              </>
            )}

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs border border-slate-700 transition-all"
            >
              <LogOut className="w-4 h-4 text-rose-400" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-3 border-b border-slate-800 pb-1">
          <button
            onClick={() => setActiveTab("inventory")}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-xs transition-all ${
              activeTab === "inventory"
                ? "bg-brand-700 text-white shadow-lg shadow-brand-900/40"
                : "bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Rental Inventory Manager</span>
          </button>

          <button
            onClick={() => setActiveTab("gallery")}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-xs transition-all ${
              activeTab === "gallery"
                ? "bg-brand-700 text-white shadow-lg shadow-brand-900/40"
                : "bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>Event Photo Gallery Manager</span>
          </button>
        </div>

        {/* Floating Notice Toast */}
        {statusMessage && (
          <div
            className={`fixed bottom-6 right-6 z-50 p-4 rounded-2xl border text-xs font-extrabold shadow-2xl flex items-center gap-3 transition-all animate-fadeIn ${
              statusMessage.type === "success"
                ? "bg-slate-900 text-emerald-400 border-emerald-600 shadow-emerald-950/60"
                : "bg-rose-950 text-rose-300 border-rose-800 shadow-rose-950/60"
            }`}
          >
            {statusMessage.type === "success" ? (
              <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
            )}
            <span>{statusMessage.text}</span>
            <button onClick={() => setStatusMessage(null)} className="ml-2 text-slate-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* ================= TAB 1: EQUIPMENT INVENTORY MANAGER ================= */}
        {activeTab === "inventory" && (
          <div className="space-y-6">
            {/* Controls Bar */}
            <div className="bg-slate-900 rounded-2xl border border-slate-800 p-4 sm:p-6 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="relative w-full sm:w-80">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Filter equipment by title..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-xs text-white focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-md transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add New Equipment Item</span>
                  </button>
                  <div className="text-xs text-slate-400 font-semibold hidden md:block">
                    <span className="text-white font-extrabold">{filteredItems.length}</span> of {items.length} items
                  </div>
                </div>
              </div>

              {/* Category Filter Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pt-2 pb-1 border-t border-slate-800/80 scrollbar-none">
                {CATEGORIES.map((cat) => {
                  const isActive = selectedCategory === cat;
                  return (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                        isActive
                          ? "bg-brand-700 text-white shadow-md shadow-brand-700/20"
                          : "bg-slate-950 text-slate-400 border border-slate-800 hover:text-white"
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Inventory Items Table */}
            {loadingItems ? (
              <div className="text-center py-16 bg-slate-900 rounded-3xl border border-slate-800 p-8 space-y-4">
                <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="text-slate-400 text-sm font-semibold">Loading inventory items from Firestore...</p>
              </div>
            ) : filteredItems.length > 0 ? (
              <div className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-950 text-slate-400 uppercase tracking-wider font-extrabold border-b border-slate-800">
                        <th className="py-4 px-6">Equipment Item</th>
                        <th className="py-4 px-4">Category</th>
                        <th className="py-4 px-4">Live Price (₦ Naira)</th>
                        <th className="py-4 px-4">Stock Status</th>
                        <th className="py-4 px-6 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/80">
                      {filteredItems.map((item) => {
                        const currentPrice = editingPrices[item.id] ?? (item.price || 0);
                        const currentUnit = editingUnits[item.id] ?? (item.priceUnit || "per day");
                        const isSaving = savingId === item.id;
                        const isJustSaved = savedId === item.id;

                        return (
                          <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                            {/* Item details */}
                            <td className="py-4 px-6">
                              <div className="flex items-center gap-4">
                                <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-slate-800 shrink-0 border border-slate-700">
                                  <Image src={item.image} alt={item.name} fill className="object-cover" />
                                </div>
                                <div>
                                  <h3 className="font-extrabold text-sm text-white">{item.name}</h3>
                                  <p className="text-[11px] text-slate-400 line-clamp-1 max-w-xs">{item.description}</p>
                                </div>
                              </div>
                            </td>

                            {/* Category */}
                            <td className="py-4 px-4">
                              <span className="px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 text-[11px] font-bold">
                                {item.category}
                              </span>
                            </td>

                            {/* Price modifier */}
                            <td className="py-4 px-4">
                              <div className="flex items-center gap-2">
                                <span className="text-slate-400 font-bold">₦</span>
                                <input
                                  type="number"
                                  value={currentPrice}
                                  onChange={(e) =>
                                    setEditingPrices({ ...editingPrices, [item.id]: Number(e.target.value) })
                                  }
                                  className="w-24 px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white font-extrabold text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                                />
                                <select
                                  value={currentUnit}
                                  onChange={(e) =>
                                    setEditingUnits({ ...editingUnits, [item.id]: e.target.value })
                                  }
                                  className="px-2 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-slate-300 text-[11px] font-semibold focus:outline-none"
                                >
                                  <option value="per dozen">/ per dozen</option>
                                  <option value="per day">/ per day</option>
                                  <option value="per item">/ per item</option>
                                  <option value="per event">/ per event</option>
                                  <option value="on inquiry">/ on inquiry</option>
                                </select>

                                <button
                                  onClick={() => handleSavePrice(item)}
                                  disabled={isSaving}
                                  className={`ml-1 px-3 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1 transition-all ${
                                    isJustSaved
                                      ? "bg-emerald-600 text-white"
                                      : "bg-brand-700 hover:bg-brand-600 text-white"
                                  } disabled:opacity-50`}
                                >
                                  {isSaving ? (
                                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                  ) : isJustSaved ? (
                                    <>
                                      <Check className="w-3.5 h-3.5" />
                                      <span>Saved!</span>
                                    </>
                                  ) : (
                                    <>
                                      <Save className="w-3.5 h-3.5" />
                                      <span>Save</span>
                                    </>
                                  )}
                                </button>
                              </div>
                            </td>

                            {/* Stock status */}
                            <td className="py-4 px-4">
                              <button
                                onClick={() => handleToggleAvailability(item)}
                                className={`px-3 py-1 rounded-full text-[11px] font-extrabold transition-all border ${
                                  item.isAvailable !== false
                                    ? "bg-emerald-950/80 text-emerald-300 border-emerald-800 hover:bg-emerald-900"
                                    : "bg-rose-950/80 text-rose-300 border-rose-800 hover:bg-rose-900"
                                }`}
                              >
                                {item.isAvailable !== false ? "In Stock" : "Out of Stock"}
                              </button>
                            </td>

                            {/* Actions */}
                            <td className="py-4 px-6 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => setEditingItem(item)}
                                  className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                                  title="Edit full item details"
                                >
                                  <Edit3 className="w-4 h-4" />
                                </button>

                                <button
                                  onClick={() => handleDeleteItem(item)}
                                  className="p-2 rounded-lg bg-slate-800 hover:bg-rose-900 text-slate-400 hover:text-rose-300 transition-colors"
                                  title="Delete item"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="text-center py-16 bg-slate-900 rounded-3xl border border-slate-800 p-8 space-y-4">
                <Package className="w-10 h-10 text-slate-500 mx-auto" />
                <p className="text-slate-400 text-sm font-semibold">No equipment items found.</p>
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 2: EVENT PHOTO GALLERY MANAGER ================= */}
        {activeTab === "gallery" && (
          <div className="space-y-6">
            {/* Controls Bar */}
            <div className="bg-slate-900 rounded-2xl border border-slate-800 p-4 sm:p-6 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="relative w-full sm:w-80">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search gallery photos..."
                    value={gallerySearchQuery}
                    onChange={(e) => setGallerySearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-xs text-white focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowAddGalleryModal(true)}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-md transition-all"
                  >
                    <Camera className="w-4 h-4" />
                    <span>Upload New Event Photo</span>
                  </button>
                  <div className="text-xs text-slate-400 font-semibold hidden md:block">
                    <span className="text-white font-extrabold">{filteredGallery.length}</span> photos
                  </div>
                </div>
              </div>
            </div>

            {/* Gallery Grid */}
            {loadingGallery ? (
              <div className="text-center py-16 bg-slate-900 rounded-3xl border border-slate-800 p-8 space-y-4">
                <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="text-slate-400 text-sm font-semibold">Loading photo gallery from Firestore...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Always-Visible Add Photo Card */}
                <div
                  onClick={() => setShowAddGalleryModal(true)}
                  className="bg-slate-900/60 border-2 border-dashed border-slate-700 hover:border-emerald-500 rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 min-h-[260px] group space-y-3"
                >
                  <div className="w-14 h-14 rounded-2xl bg-emerald-950 border border-emerald-800 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Camera className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base text-white group-hover:text-emerald-300 transition-colors">
                      + Add New Event Photo
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Upload past setup photos to show on website photo gallery
                    </p>
                  </div>
                  <span className="px-4 py-2 rounded-xl bg-emerald-600 group-hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-colors">
                    Upload Photo
                  </span>
                </div>

                {filteredGallery.map((item) => (
                  <div
                    key={item.id}
                    className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-lg flex flex-col justify-between"
                  >
                    <div className="relative h-52 w-full bg-slate-950 overflow-hidden">
                      <Image src={item.image} alt={item.title} fill className="object-cover" />
                      <div className="absolute top-3 left-3">
                        <span className="bg-slate-950/90 backdrop-blur-md text-gold-400 text-[10px] font-extrabold px-2.5 py-1 rounded-md uppercase tracking-wider">
                          {item.category}
                        </span>
                      </div>
                    </div>

                    <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="font-extrabold text-base text-white">{item.title}</h3>
                        <p className="text-xs text-slate-400 line-clamp-2 mt-1">{item.description}</p>
                      </div>

                      <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                        <button
                          onClick={() => setEditingGalleryItem(item)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => handleDeleteGalleryItem(item)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-950 hover:bg-rose-900 text-rose-300 text-xs font-bold transition-all border border-rose-800"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* --- ADD NEW EQUIPMENT MODAL --- */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white text-slate-900 rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl my-8">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <h2 className="text-xl font-extrabold text-slate-900">Add New Rental Equipment</h2>
                <button onClick={() => setShowAddModal(false)} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateNewItem} className="space-y-4 text-xs font-medium">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Equipment Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Armless Altak Plastic Chairs"
                    value={newItem.name}
                    onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-semibold focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Category *</label>
                    <select
                      value={newItem.category}
                      onChange={(e) => setNewItem({ ...newItem, category: e.target.value as CategoryType })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-semibold bg-white focus:outline-none"
                    >
                      <option value="Chairs">Chairs</option>
                      <option value="Tables">Tables</option>
                      <option value="Tents">Tents</option>
                      <option value="Tablecloths">Tablecloths</option>
                      <option value="Extras">Extras</option>
                    </select>
                  </div>

                  {/* Dual Image Input */}
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Equipment Image</label>
                    <div className="space-y-2">
                      <label className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-slate-100 border border-slate-300 text-slate-700 font-bold hover:bg-slate-200 cursor-pointer">
                        <Upload className="w-4 h-4 text-brand-600" />
                        <span>Choose File from Device...</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageFileUpload(e, "new")}
                          className="hidden"
                        />
                      </label>

                      <div className="relative">
                        <Link2 className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          placeholder="Or paste image Web URL..."
                          value={newItem.image}
                          onChange={(e) => setNewItem({ ...newItem, image: e.target.value })}
                          className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-slate-300 text-[11px] focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Price (₦ Naira) *</label>
                    <input
                      type="number"
                      required
                      placeholder="2500"
                      value={newItem.price}
                      onChange={(e) => setNewItem({ ...newItem, price: Number(e.target.value) })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-extrabold focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Price Unit</label>
                    <select
                      value={newItem.priceUnit}
                      onChange={(e) => setNewItem({ ...newItem, priceUnit: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-semibold bg-white focus:outline-none"
                    >
                      <option value="per dozen">per dozen</option>
                      <option value="per day">per day</option>
                      <option value="per item">per item</option>
                      <option value="per event">per event</option>
                      <option value="on inquiry">on inquiry</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Description</label>
                  <textarea
                    rows={3}
                    placeholder="Describe item specifications..."
                    value={newItem.description}
                    onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-medium focus:outline-none"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-brand-700 text-white font-bold hover:bg-brand-800 shadow-md"
                  >
                    Save Equipment
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* --- EDIT EQUIPMENT MODAL --- */}
        {editingItem && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white text-slate-900 rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl my-8">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <h2 className="text-xl font-extrabold text-slate-900">Edit Equipment Details</h2>
                <button onClick={() => setEditingItem(null)} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveEditedItem} className="space-y-4 text-xs font-medium">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Equipment Name *</label>
                  <input
                    type="text"
                    required
                    value={editingItem.name}
                    onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-semibold focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Category *</label>
                    <select
                      value={editingItem.category}
                      onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value as CategoryType })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-semibold bg-white focus:outline-none"
                    >
                      <option value="Chairs">Chairs</option>
                      <option value="Tables">Tables</option>
                      <option value="Tents">Tents</option>
                      <option value="Tablecloths">Tablecloths</option>
                      <option value="Extras">Extras</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Equipment Image</label>
                    <div className="space-y-2">
                      <label className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-slate-100 border border-slate-300 text-slate-700 font-bold hover:bg-slate-200 cursor-pointer">
                        <Upload className="w-4 h-4 text-brand-600" />
                        <span>Upload New File...</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageFileUpload(e, "edit")}
                          className="hidden"
                        />
                      </label>

                      <div className="relative">
                        <Link2 className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={editingItem.image}
                          onChange={(e) => setEditingItem({ ...editingItem, image: e.target.value })}
                          className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-slate-300 text-[11px] focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Price (₦ Naira) *</label>
                    <input
                      type="number"
                      required
                      value={editingItem.price || 0}
                      onChange={(e) => setEditingItem({ ...editingItem, price: Number(e.target.value) })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-extrabold focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Price Unit</label>
                    <select
                      value={editingItem.priceUnit || "per day"}
                      onChange={(e) => setEditingItem({ ...editingItem, priceUnit: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-semibold bg-white focus:outline-none"
                    >
                      <option value="per dozen">per dozen</option>
                      <option value="per day">per day</option>
                      <option value="per item">per item</option>
                      <option value="per event">per event</option>
                      <option value="on inquiry">on inquiry</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Description</label>
                  <textarea
                    rows={3}
                    value={editingItem.description}
                    onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-medium focus:outline-none"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setEditingItem(null)}
                    className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-brand-700 text-white font-bold hover:bg-brand-800 shadow-md"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* --- ADD NEW GALLERY PHOTO MODAL --- */}
        {showAddGalleryModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white text-slate-900 rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl my-8">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <h2 className="text-xl font-extrabold text-slate-900">Add Event Photo to Gallery</h2>
                <button onClick={() => setShowAddGalleryModal(false)} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateGalleryItem} className="space-y-4 text-xs font-medium">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Photo Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Grand Outdoor Wedding Setup in Moniya"
                    value={newGalleryItem.title}
                    onChange={(e) => setNewGalleryItem({ ...newGalleryItem, title: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-semibold focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Event Category *</label>
                    <select
                      value={newGalleryItem.category}
                      onChange={(e) => setNewGalleryItem({ ...newGalleryItem, category: e.target.value as any })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-semibold bg-white focus:outline-none"
                    >
                      {GALLERY_CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Dual Image Input */}
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Photo Image *</label>
                    <div className="space-y-2">
                      <label className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-slate-100 border border-slate-300 text-slate-700 font-bold hover:bg-slate-200 cursor-pointer">
                        <Upload className="w-4 h-4 text-brand-600" />
                        <span>Choose File from Device...</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageFileUpload(e, "galNew")}
                          className="hidden"
                        />
                      </label>

                      <div className="relative">
                        <Link2 className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          placeholder="Or paste image Web URL..."
                          value={newGalleryItem.image}
                          onChange={(e) => setNewGalleryItem({ ...newGalleryItem, image: e.target.value })}
                          className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-slate-300 text-[11px] focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Description *</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Describe the event setup, canopy tent, or chairs used..."
                    value={newGalleryItem.description}
                    onChange={(e) => setNewGalleryItem({ ...newGalleryItem, description: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-medium focus:outline-none"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowAddGalleryModal(false)}
                    className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-brand-700 text-white font-bold hover:bg-brand-800 shadow-md"
                  >
                    Add Gallery Photo
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* --- EDIT GALLERY PHOTO MODAL --- */}
        {editingGalleryItem && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white text-slate-900 rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl my-8">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <h2 className="text-xl font-extrabold text-slate-900">Edit Event Gallery Photo</h2>
                <button onClick={() => setEditingGalleryItem(null)} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveEditedGalleryItem} className="space-y-4 text-xs font-medium">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Photo Title *</label>
                  <input
                    type="text"
                    required
                    value={editingGalleryItem.title}
                    onChange={(e) => setEditingGalleryItem({ ...editingGalleryItem, title: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-semibold focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Event Category *</label>
                    <select
                      value={editingGalleryItem.category}
                      onChange={(e) => setEditingGalleryItem({ ...editingGalleryItem, category: e.target.value as any })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-semibold bg-white focus:outline-none"
                    >
                      {GALLERY_CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Photo Image *</label>
                    <div className="space-y-2">
                      <label className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-slate-100 border border-slate-300 text-slate-700 font-bold hover:bg-slate-200 cursor-pointer">
                        <Upload className="w-4 h-4 text-brand-600" />
                        <span>Upload New File...</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageFileUpload(e, "galEdit")}
                          className="hidden"
                        />
                      </label>

                      <div className="relative">
                        <Link2 className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={editingGalleryItem.image}
                          onChange={(e) => setEditingGalleryItem({ ...editingGalleryItem, image: e.target.value })}
                          className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-slate-300 text-[11px] focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Description *</label>
                  <textarea
                    rows={3}
                    required
                    value={editingGalleryItem.description}
                    onChange={(e) => setEditingGalleryItem({ ...editingGalleryItem, description: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-medium focus:outline-none"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setEditingGalleryItem(null)}
                    className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-brand-700 text-white font-bold hover:bg-brand-800 shadow-md"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
