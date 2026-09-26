import type { Metadata, Viewport } from 'next';
import './globals.css';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import Reveal from '@/components/Reveal';
import { site } from '@/content/site';

export const metadata: Metadata = {
  metadataBase: new URL(site.siteUrl),
  title: {
    default: `${site.name} — ${site.title}`,
    template: `%s • ${site.name}`,
  },
  description:
    'Cybersecurity engineering portfolio focused on network defense, SOC operations, Linux security, Python automation, secure infrastructure, and security monitoring.',
  keywords: [
    'cybersecurity',
    'network security',
    'SOC',
    'SIEM',
    'Wazuh',
    'Linux security',
    'security engineering',
    'detection engineering',
    'Omondi Raphael Owino',
  ],
  authors: [{ name: site.name }],
  creator: site.name,
  robots: { index: true, follow: true },
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    siteName: site.name,
    title: `${site.name} — ${site.title}`,
    description:
      'Building secure systems through real infrastructure, network security, monitoring, automation, and defensive experimentation.',
    url: site.siteUrl,
    images: [{ url: '/og-image.svg', width: 1200, height: 630, alt: `${site.name} — ${site.title}` }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${site.name} — ${site.title}`,
    description:
      'Building secure systems through real infrastructure, network security, monitoring, automation, and defensive experimentation.',
    images: ['/og-image.svg'],
  },
  icons: {
    icon: '/favicon.svg',
    apple: '/favicon.svg',
  },
  manifest: '/manifest.webmanifest',
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#05080d' },
    { media: '(prefers-color-scheme: light)', color: '#f4f6fa' },
  ],
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="dark">
      <head>
        {/*
          Fonts: loaded as stylesheets (allowed by CSP style-src).
          No inline scripts anywhere — strict script-src 'self' is preserved.
          Theme applies from localStorage via ThemeToggle on mount (dark default,
          the primary experience). See README "CSP & theme" note.
        */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&family=JetBrains+Mono:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
        <Reveal />
      </body>
    </html>
  );
}
