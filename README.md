# FUNKAY RENTAL SERVICES WEBSITE

A modern, mobile-first, high-converting web application for **FUNKAY RENTAL SERVICES**, a premier local event equipment rental business based in **Elebu Moniya, Ibadan, Oyo State, Nigeria**.

---

## 🚀 Business Overview

- **Business Name:** FUNKAY RENTAL SERVICES
- **Exact Address:** Unit 1, House 25, Shop Merin Elebu, Moniya Rd, Moniya, Ibadan, Oyo State, Nigeria
- **Primary WhatsApp & Call Line:** +234 803 337 7252
- **Additional Phone Lines:** +234 816 357 1677 | +234 803 343 6897
- **Services:** Chairs, Tables, Tents/Canopies, Tablecloths, Event Accessories & Delivery Transport.
- **Delivery Advantage:** FUNKAY RENTAL SERVICES owns its own dedicated transport vehicle for delivering rental equipment directly to customer venues in Elebu Moniya & Ibadan metro.

---

## 🛠️ Technology Stack

- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS (Deep Emerald Green & Warm Gold palette)
- **Icons:** `lucide-react`
- **SEO & Structured Data:** JSON-LD Schema markup for Local Business, Open Graph metadata, semantic HTML5.

---

## 📁 Key Web Pages

1. **Home (`/`)**: High-impact hero section, popular category links, delivery vehicle storytelling, featured inventory cards, 5-step process visual, and WhatsApp CTAs.
2. **Equipment Catalogue (`/equipment`)**: Filterable inventory (All, Chairs, Tables, Tents, Tablecloths, Extras), instant search bar, detailed product specs, and single-item WhatsApp inquiry buttons.
3. **Get a Quote (`/quote`)**: Interactive quote request form validating full name, phone number, event date, location in Ibadan, number of guests, and required items with automated WhatsApp message generation.
4. **How It Works (`/how-it-works`)**: Visual step-by-step breakdown from item selection to doorstep vehicle delivery.
5. **Gallery (`/gallery`)**: Photo gallery showcasing Nigerian wedding setups, church events, birthday parties, and delivery operations with lightbox modal preview.
6. **About Us (`/about`)**: Company background emphasizing community trust, sanitized equipment, and dedicated vehicle logistics.
7. **Contact (`/contact`)**: Direct click-to-call buttons for all phone numbers, primary WhatsApp link, exact address details, and Google Maps location integration.

---

## 📲 WhatsApp Quote Logic & Security

When a customer submits a quote form or item inquiry:
- All required fields are validated on the client.
- The message payload is constructed safely using `encodeURIComponent()` to avoid HTML/URL injection issues.
- The user is redirected to WhatsApp via:
  `https://wa.me/2348033377252?text=ENCODED_MESSAGE`
- A floating WhatsApp button is anchored on the bottom-right of every page.

---

## 🖼️ How to Replace Sample Images with Real Photos

All image assets are stored in the `/public/images/` directory:
- `hero-event-setup.jpg` (Hero background & marquee setup)
- `chairs-rental.jpg` (Banquet & Chiavari chairs photo)
- `tables-rental.jpg` (Round banquet tables photo)
- `tents-canopies.jpg` (Outdoor white canopy tent photo)
- `tablecloths.jpg` (Emerald green & gold linens photo)
- `delivery-vehicle.jpg` (Company delivery transport vehicle photo)
- `vehicle-loading.jpg` (Crew loading rental equipment photo)
- `wedding-setup.jpg` (Wedding reception venue photo)
- `birthday-setup.jpg` (Outdoor birthday party setup photo)
- `church-event.jpg` (Community auditorium seating photo)
- `about-us.jpg` (Team portrait with delivery vehicle)

To update the photos, simply drop real JPEG/PNG photographs into `/public/images/` with the exact filenames listed above.

---

## 💻 Commands to Run the Project

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Local Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to view the site.

### 3. Build for Production
```bash
npm run build
```

### 4. Start Production Server
```bash
npm start
```
