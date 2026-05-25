'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * 🔝 Auto Scroll To Top
 * Ensures the user starts at the top of the page on every route change.
 * Also handles layouts with custom scrollable containers (e.g. <main>, .overflow-y-auto).
 */
export default function AutoScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    // 1. Scroll main window to top
    window.scrollTo(0, 0);

    // 2. Scroll custom scrollable containers (like main, or divs with overflow-y-auto) to top
    const scrollableContainers = document.querySelectorAll('main, .overflow-y-auto, [class*="overflow-y-auto"]');
    scrollableContainers.forEach((el) => {
      el.scrollTop = 0;
    });
  }, [pathname]);

  return null;
}
