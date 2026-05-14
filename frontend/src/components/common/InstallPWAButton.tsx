'use client';

import { useEffect, useState } from 'react';
import { Download } from 'lucide-react';

/**
 * 📲 Install PWA Button
 * Detects if the app can be installed as a PWA and shows a prompt.
 */
export default function InstallPWAButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('User accepted the PWA install prompt');
    }
    
    setDeferredPrompt(null);
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <button
      onClick={handleInstallClick}
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-orange-600 px-4 py-2 text-sm font-bold text-white shadow-2xl transition-all hover:bg-orange-700 active:scale-95 md:px-6 md:py-3 md:text-base"
    >
      <Download className="h-5 w-5" />
      <span>Install App</span>
    </button>
  );
}
