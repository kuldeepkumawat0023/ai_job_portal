'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * 🔝 Auto Scroll To Top
 * Ensures the user starts at the top of the page on every route change.
 */
export default function AutoScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
