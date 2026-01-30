import { Geist, Geist_Mono, Raleway, Bebas_Neue } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/AuthContext";
import { Toaster } from "@/components/ui/sonner";
import { NextAuthProvider } from "@/lib/NextAuthProvider";
import { Analytics } from "@vercel/analytics/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const bebasNeue = Bebas_Neue({
  variable: "--font-bebas",
  subsets: ["latin"],
  weight: "400",
});

const raleway = Raleway({
  variable: "--font-raleway",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://lootmyvouchers.in';

export const metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'Loot My Vouchers - Claim Free Vouchers Daily',
    template: '%s | Loot My Vouchers',
  },
  description: 'Claim free vouchers daily from top brands and earn rewards. Discover exclusive deals, discount codes, and special offers on Loot My Vouchers.',
  keywords: [
    'free vouchers',
    'discount codes',
    'promo codes',
    'daily deals',
    'coupons',
    'savings',
    'online shopping deals',
    'brand vouchers',
    'exclusive offers',
    'cashback',
    'rewards',
    'loot my vouchers',
  ],
  authors: [{ name: 'Loot My Vouchers' }],
  creator: 'Loot My Vouchers',
  publisher: 'Loot My Vouchers',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: BASE_URL,
    siteName: 'Loot My Vouchers',
    title: 'Loot My Vouchers - Claim Free Vouchers Daily',
    description: 'Claim free vouchers daily from top brands and earn rewards. Discover exclusive deals, discount codes, and special offers.',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'Loot My Vouchers - Claim Free Vouchers Daily',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Loot My Vouchers - Claim Free Vouchers Daily',
    description: 'Claim free vouchers daily from top brands and earn rewards. Discover exclusive deals and special offers.',
    images: ['/twitter-image'],
    creator: '@lootmyvouchers',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code', // Replace with actual code from Google Search Console
    // yandex: 'your-yandex-verification-code',
    // bing: 'your-bing-verification-code',
  },
  alternates: {
    canonical: BASE_URL,
  },
  category: 'shopping',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/icons/icon-192x192.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="192x192" href="/icons/icon-192x192.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/icons/icon-512x512.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/icon-192x192.png" />
        <link rel="shortcut icon" href="/favicon.ico" />
      </head>
      <body
        className={`${geistSans.variable} bg-black scrollbar ${geistMono.variable} ${bebasNeue.variable} ${raleway.variable} antialiased`}
      >
        <NextAuthProvider>
          <AuthProvider>
            {children}
            <Toaster position="top-center" richColors />
          </AuthProvider>
        </NextAuthProvider>
        <Analytics />
      </body>
    </html>
  );
}
