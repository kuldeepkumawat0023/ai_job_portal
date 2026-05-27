import type { Metadata } from "next";
import { Manrope, Inter } from "next/font/google";
import "./globals.css";
import StoreProvider from "@/provider/StoreProvider";
import HydrationGuard from "@/provider/HydrationGuard";
import GoogleAuthProvider from "@/provider/GoogleAuthProvider";
import { ThemeProvider } from "@/provider/ThemeProvider";
import { Toaster } from 'react-hot-toast';

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "AIJobFit Admin — Super Admin Panel",
  description: "AI JobFit Super Admin Panel — Manage users, recruiters, job listings, and analyze platform metrics with AI-powered insights.",
  keywords: "AI JobFit admin, super admin panel, admin dashboard, job portal management, recruiter management, user management",
  authors: [{ name: "AI JobFit" }],
  creator: "AI JobFit",
  publisher: "AI JobFit",
  manifest: "/manifest.json",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#4648d4" },
    { media: "(prefers-color-scheme: dark)", color: "#0B0F19" },
  ],
  icons: {
    icon: [
      { url: "/logo.png", type: "image/png", sizes: "32x32" },
      { url: "/icons/icon-192.png", type: "image/png", sizes: "192x192" },
      { url: "/icons/icon-512.png", type: "image/png", sizes: "512x512" },
    ],
    apple: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    shortcut: [{ url: "/logo.png" }],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "AIJobFit Admin",
  },
  openGraph: {
    title: "AIJobFit Admin — Super Admin Panel",
    description: "Manage users, recruiters, job listings, and analyze platform metrics with AI-powered insights.",
    siteName: "AIJobFit Admin",
    locale: "en_IN",
    type: "website",
  },
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${manrope.variable} ${inter.variable}`} suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground font-sans antialiased flex flex-col" suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <StoreProvider>
            <HydrationGuard>
              <GoogleAuthProvider>
                <Toaster
                  position="top-right"
                  toastOptions={{
                    className: 'font-headline font-bold text-sm tracking-tight shadow-2xl rounded-2xl border border-white/10',
                    duration: 5000,
                    style: {
                      padding: '16px 24px',
                      color: '#fff',
                    },
                    success: {
                      style: {
                        background: '#059669',
                        boxShadow: '0 10px 15px -3px rgba(16, 185, 129, 0.4)',
                      },
                      iconTheme: {
                        primary: '#fff',
                        secondary: '#059669',
                      },
                    },
                    error: {
                      style: {
                        background: '#dc2626',
                        boxShadow: '0 10px 15px -3px rgba(239, 68, 68, 0.4)',
                      },
                      iconTheme: {
                        primary: '#fff',
                        secondary: '#dc2626',
                      },
                    },
                    loading: {
                      style: {
                        background: '#d97706',
                        boxShadow: '0 10px 15px -3px rgba(217, 119, 6, 0.4)',
                      },
                    },
                  }}
                />
                {children}
              </GoogleAuthProvider>
            </HydrationGuard>
          </StoreProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
