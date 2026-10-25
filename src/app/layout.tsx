import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#7C3AED", 
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: "CV Akurat Sukses Sejati",
  description: "Sistem Informasi Persediaan Barang Otomotif",
  manifest: "/manifest.json",
  icons: {
    icon: "/logo-cv-akurat-sukses-sejati-bg-purple.png",
    apple: "/icon-512.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Akurat Suksestama",
  },
  formatDetection: {
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <Toaster 
          position="top-right" 
          containerStyle={{ zIndex: 99999 }}
          toastOptions={{
            duration: 3500,
            style: {
              borderRadius: '12px',
              background: '#0f172a',
              color: '#f8fafc',
              fontSize: '14px',
              fontWeight: 500,
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.2)',
            },
            success: {
              style: {
                background: '#064e3b',
                color: '#ecfdf5',
                border: '1px solid #059669',
              },
              iconTheme: {
                primary: '#10b981',
                secondary: '#fff',
              },
            },
            error: {
              style: {
                background: '#7f1d1d',
                color: '#fef2f2',
                border: '1px solid #dc2626',
              },
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </body>
    </html>
  );
}