'use client';

import { useEffect, useState } from 'react';
import { Download, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { Button } from './Button';

/**
 * 📲 Install PWA Button / Modal
 * Detects if the app can be installed as a PWA and shows a prompt.
 */
export default function InstallPWAButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);
  const { user, isInitialized } = useAuth();

  useEffect(() => {
    // If initialized, not logged in, and not installed as app, auto-show popup after 3 seconds
    if (isInitialized && !user) {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (navigator as any).standalone;
      
      if (!isStandalone) {
        const timer = setTimeout(() => {
          setIsVisible(true);
        }, 3000);
        return () => clearTimeout(timer);
      }
    }
  }, [user, isInitialized]);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      (window as any).deferredPrompt = e;
      window.dispatchEvent(new Event('pwa-ready'));

      // Only show the global popup automatically if the user is not logged in
      if (!user) {
        setDeferredPrompt(e);
        setIsVisible(true);
      }
    };

    // Check if it was already fired
    if ((window as any).deferredPrompt) {
      if (!user) {
        setDeferredPrompt((window as any).deferredPrompt);
        setIsVisible(true);
      }
    } else {
      window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    }

    const handleShowModal = () => {
      // Always allow modal to open for manual fallback
      setIsVisible(true);
    };
    window.addEventListener('showInstallModal', handleShowModal);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('showInstallModal', handleShowModal);
    };
  }, [user]);

  const handleInstallClick = async () => {
    const promptEvent = deferredPrompt || (window as any).deferredPrompt;
    
    if (!promptEvent) {
      import('react-hot-toast').then(({ toast }) => {
        toast.success("To install: Open your browser menu (⋮) and tap 'Install App' or 'Add to Home Screen'");
      });
      setIsVisible(false);
      return;
    }

    try {
      // Close custom modal immediately before showing native prompt
      setIsVisible(false);
      
      await promptEvent.prompt();
      const { outcome } = await promptEvent.userChoice;
      if (outcome === 'accepted') {
        console.log('User accepted the PWA install prompt');
      }
      // Clear it so it cannot be reused
      setDeferredPrompt(null);
      (window as any).deferredPrompt = null;
    } catch (err) {
      console.error('Install prompt failed:', err);
      // Event was likely already consumed or blocked by Chrome
      import('react-hot-toast').then(({ toast }) => {
        toast.success("To install: Open your browser menu (⋮) and tap 'Install App' or 'Add to Home Screen'");
      });
      setDeferredPrompt(null);
      (window as any).deferredPrompt = null;
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          {/* Backdrop Blur Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsVisible(false)}
            className="absolute inset-0 bg-zinc-950/80 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="relative w-full max-w-lg bg-surface border border-outline-variant/30 rounded-[36px] shadow-2xl p-6 sm:p-10 text-center overflow-hidden z-10"
          >
            {/* Soft background glow */}
            <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.02] to-transparent pointer-events-none" />

            {/* Close Button */}
            <button
              onClick={() => setIsVisible(false)}
              className="absolute top-5 right-5 p-2 rounded-xl text-on-surface-variant/60 hover:text-on-surface hover:bg-surface-container-low transition-all"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Logo */}
            <div className="w-24 h-24 flex items-center justify-center rounded-xl mx-auto mb-6 overflow-hidden">
              <img src="/logo.png" alt="AI JobFit Logo" className="h-full w-full object-contain" />
            </div>

            <h3 className="text-2xl sm:text-3xl font-black text-on-surface mb-3 tracking-tight leading-tight">
              Install AI JobFit
            </h3>
            <p className="text-on-surface-variant font-medium text-sm sm:text-base leading-relaxed mb-8 px-2 sm:px-4">
              Experience the next generation of career advancement. Install AI JobFit for lightning-fast, native-like access to precision AI job matching, resume analysis, and smart hiring tools directly from your home screen.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
              <Button
                variant="outline"
                size="md"
                onClick={() => setIsVisible(false)}
                className="w-full sm:w-auto min-w-[120px] font-bold text-sm"
              >
                Maybe Later
              </Button>
              <Button
                variant="primary"
                size="md"
                onClick={handleInstallClick}
                className="w-full sm:w-auto min-w-[140px] font-black text-sm bg-primary hover:bg-primary/90 text-white border-none shadow-lg shadow-primary/20 hover:shadow-primary/30 flex items-center gap-2 justify-center"
              >
                <Download className="w-4 h-4" />
                Install Now
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
