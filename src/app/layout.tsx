import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FloatingWhatsAppButton from "@/components/ui/FloatingWhatsAppButton";
import PWAInstallPrompt from "@/components/ui/PWAInstallPrompt";
import { BUSINESS_ADDRESS, DISPLAY_PHONE, ALT_PHONE_1, ALT_PHONE_2 } from "@/lib/whatsapp";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  fallback: ["system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.URL || "https://funkay.vercel.app"),
  title: {
    default: "FUNKAY RENTAL SERVICES — Event Equipment Rental in Moniya & Ibadan, Nigeria",
    template: "%s | FUNKAY RENTAL SERVICES Ibadan",
  },
  description:
    "FUNKAY RENTAL SERVICES is the premier local event equipment rental business in Elebu Moniya, Ibadan, Oyo State. Rent chairs, tables, tents/canopies, tablecloths & accessories with dedicated delivery transport.",
  keywords: [
    "Funkay",
    "FUNKAY",
    "Funkay Rental Services",
    "Funkay Rentals",
    "Funkay Rentals Ibadan",
    "Funkay Moniya",
    "Funkay Elebu",
    "Funkay Event Rentals",
    "Event equipment rental Ibadan",
    "Chair rental Moniya Ibadan",
    "Canopy tent rental Moniya Elebu",
    "Table rental Elebu Moniya",
    "Banquet chair rental Ibadan",
    "Chiavari chair rental Ibadan",
    "Tablecloth rental Ibadan Oyo State",
    "Wedding rentals Ibadan",
    "Party rental equipment Moniya",
  ],
  authors: [{ name: "FUNKAY RENTAL SERVICES", url: "https://funkay.vercel.app" }],
  publisher: "FUNKAY RENTAL SERVICES",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "FUNKAY RENTAL SERVICES",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/icon.jpg",
    apple: "/apple-icon.jpg",
  },
  verification: {
    google: "JQrZWT5k8RI6yHvZbLZE3frl6tdc719De-Q_4NHjpP4",
  },
  openGraph: {
    title: "FUNKAY RENTAL SERVICES — Premier Event Rentals in Moniya & Ibadan",
    description:
      "High quality chairs, tables, tents, canopies & tablecloths for weddings, birthdays, and church events in Ibadan. Dedicated delivery vehicle service.",
    url: "https://funkay.vercel.app",
    siteName: "FUNKAY RENTAL SERVICES",
    images: [
      {
        url: "/images/hero-event-setup.jpg",
        width: 1200,
        height: 630,
        alt: "FUNKAY RENTAL SERVICES Event Equipment Setup in Moniya Ibadan",
      },
    ],
    locale: "en_NG",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FUNKAY RENTAL SERVICES — Event Rentals in Ibadan",
    description: "Rent chairs, tables, canopies & tablecloths in Elebu Moniya, Ibadan with reliable doorstep delivery.",
    images: ["/images/hero-event-setup.jpg"],
  },
  alternates: {
    canonical: "https://funkay.vercel.app",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Comprehensive Schema.org JSON-LD Structured Data for Max Google Ranking
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "EquipmentRental"],
    "@id": "https://funkay.vercel.app/#organization",
    "name": "FUNKAY RENTAL SERVICES",
    "alternateName": [
      "Funkay Rentals",
      "Funkay Event Rentals",
      "Funkay Rentals Ibadan",
      "Funkay Moniya",
      "Funkay Rental Services Ibadan"
    ],
    "legalName": "FUNKAY RENTAL SERVICES",
    "image": [
      "https://funkay.vercel.app/images/hero-event-setup.jpg",
      "https://funkay.vercel.app/images/delivery-vehicle.jpg",
      "https://funkay.vercel.app/images/chairs-rental.jpg"
    ],
    "logo": "https://funkay.vercel.app/icon.jpg",
    "url": "https://funkay.vercel.app",
    "telephone": [DISPLAY_PHONE, ALT_PHONE_1, ALT_PHONE_2],
    "email": "info@funkayrentals.com",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": BUSINESS_ADDRESS,
      "addressLocality": "Moniya, Ibadan",
      "addressRegion": "Oyo State",
      "postalCode": "200213",
      "addressCountry": "NG"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 7.5255,
      "longitude": 3.9103
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        "opens": "07:00",
        "closes": "20:00"
      }
    ],
    "areaServed": [
      { "@type": "City", "name": "Ibadan" },
      { "@type": "AdministrativeArea", "name": "Moniya" },
      { "@type": "AdministrativeArea", "name": "Elebu" },
      { "@type": "AdministrativeArea", "name": "Bodija" },
      { "@type": "AdministrativeArea", "name": "Akobo" },
      { "@type": "AdministrativeArea", "name": "Ring Road" },
      { "@type": "AdministrativeArea", "name": "Challenge" },
      { "@type": "State", "name": "Oyo State" }
    ],
    "description": "FUNKAY RENTAL SERVICES is Ibadan's top event equipment rental business in Elebu Moniya supplying plastic chairs, banquet tables, canopy tents, tablecloths, and delivery vehicle transport.",
    "priceRange": "₦₦",
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Event Equipment Rental Catalog",
      "itemListElement": [
        {
          "@type": "OfferCatalog",
          "name": "Chairs & Seating",
          "description": "Altak plastic chairs, Chiavari chairs, banquet seating"
        },
        {
          "@type": "OfferCatalog",
          "name": "Tents & Canopies",
          "description": "High-peak white canopy tents, marquee event tents"
        },
        {
          "@type": "OfferCatalog",
          "name": "Banquet Tables & Linens",
          "description": "Round banquet tables, rectangular tables, premium tablecloths"
        }
      ]
    }
  };

  return (
    <html lang="en" className={`${inter.variable} scroll-smooth`}>
      <head>
        <meta name="theme-color" content="#047857" />
        <meta name="mobile-web-app-capable" content="yes" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-icon.jpg" />
        <meta name="google-site-verification" content="JQrZWT5k8RI6yHvZbLZE3frl6tdc719De-Q_4NHjpP4" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="flex flex-col min-h-screen bg-slate-50 text-slate-900 font-sans antialiased overflow-x-hidden w-full max-w-full">
        <Navbar />
        <main className="flex-1 overflow-x-hidden w-full max-w-full">{children}</main>
        <FloatingWhatsAppButton />
        <PWAInstallPrompt />
        <Footer />
      </body>
    </html>
  );
}
