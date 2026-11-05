'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/** Keep content visible by default; enhance new cards with the existing motion. */
export default function Reveal() {
  const pathname = usePathname();
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return;
    const prepared = new Set<Element>();
    const reveal = (el: Element) => {
      el.classList.add('visible');
      el.classList.remove('reveal-pending');
    };
    const io = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          reveal(entry.target);
          io.unobserve(entry.target);
        }
      }
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    const prepare = () => {
      document.querySelectorAll('.reveal:not(.visible)').forEach((el) => {
        if (prepared.has(el)) return;
        prepared.add(el);
        el.classList.add('reveal-pending');
        io.observe(el);
      });
    };
    prepare();
    // Filters and client-side navigation can insert cards after the initial effect.
    const mutations = new MutationObserver(prepare);
    mutations.observe(document.body, { childList: true, subtree: true });
    return () => {
      mutations.disconnect();
      io.disconnect();
      prepared.forEach(reveal);
    };
  }, [pathname]);
  return null;
}
