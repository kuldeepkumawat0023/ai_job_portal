import type { Viewport } from "next";
import { Manrope, Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/provider/ThemeProvider";
import StoreProvider from "@/provider/StoreProvider";
import HydrationGuard from "@/provider/HydrationGuard";
import GoogleAuthProvider from "@/provider/GoogleAuthProvider";
import AutoScrollToTop from "@/components/common/AutoScrollToTop";
import InstallPWAButton from "@/components/common/InstallPWAButton";
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

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${manrope.variable} ${inter.variable}`}>
      <body className="min-h-screen bg-white dark:bg-zinc-950 font-sans antialiased flex flex-col" suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <StoreProvider>
            <GoogleAuthProvider>
              <AutoScrollToTop />
              <InstallPWAButton />
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
              <HydrationGuard>
                {children}
              </HydrationGuard>
            </GoogleAuthProvider>
          </StoreProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

