import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FloatingWhatsAppButton from "@/components/ui/FloatingWhatsAppButton";
import PWAInstallPrompt from "@/components/ui/PWAInstallPrompt";
import { BUSINESS_ADDRESS, DISPLAY_PHONE } from "@/lib/whatsapp";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  fallback: ["system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.URL || "https://funkay.vercel.app"),
  title: "FUNKAY Rental Services | Event Equipment Rental in Ibadan",
  description:
    "Rent chairs, tables, tents, canopies and event equipment from FUNKAY Rental Services in Moniya, Ibadan. Request a quote and arrange delivery through WhatsApp.",
  keywords: [
    "Event rental Ibadan",
    "Chair rental Moniya",
    "Table rental Elebu Moniya",
    "Canopy rental Ibadan",
    "FUNKAY Rental Services",
    "Wedding equipment Ibadan",
    "Event setup Ibadan Oyo State",
  ],
  authors: [{ name: "FUNKAY Rental Services" }],
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "FUNKAY",
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
    title: "FUNKAY Rental Services | Quality Event Rentals & Reliable Delivery",
    description:
      "Chairs, tables, tents/canopies, tablecloths, and event accessories in Elebu Moniya, Ibadan. Direct delivery with our own vehicle.",
    url: "https://funkay.vercel.app",
    siteName: "FUNKAY Rental Services",
    images: [
      {
        url: "/images/hero-event-setup.jpg",
        width: 1200,
        height: 630,
        alt: "FUNKAY Rental Services Event Setup in Ibadan",
      },
    ],
    locale: "en_NG",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Local Business Structured Data for SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "FUNKAY RENTAL SERVICES",
    "image": "https://funkay.vercel.app/images/hero-event-setup.jpg",
    "url": "https://funkay.vercel.app",
    "telephone": DISPLAY_PHONE,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": BUSINESS_ADDRESS,
      "addressLocality": "Ibadan",
      "addressRegion": "Oyo State",
      "addressCountry": "NG"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 7.5147,
      "longitude": 3.9161
    },
    "description": "Local event equipment rental business in Moniya, Ibadan supplying chairs, tables, canopies, and tablecloths with dedicated delivery vehicle transport.",
    "priceRange": "₦₦"
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
