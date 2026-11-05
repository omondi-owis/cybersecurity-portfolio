import type { Metadata, Viewport } from 'next';
import './globals.css';
import './knowledge-fixes.css';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import Reveal from '@/components/Reveal';
import { site } from '@/content/site';

export const metadata: Metadata = {
  metadataBase: new URL(site.siteUrl),
  title: { default: `${site.name} — ${site.title}`, template: `%s • ${site.name}` },
  description: 'VYRA provides scoped, authorized cybersecurity services for SIEM and Wazuh, Linux security, network review, log automation and incident documentation.',
  keywords: ['cybersecurity services', 'SIEM', 'Wazuh', 'Linux security', 'network security review', 'Python log automation', 'incident triage documentation'],
  authors: [{ name: site.name }], creator: site.name,
  robots: { index: true, follow: true }, alternates: { canonical: '/' },
  openGraph: {
    type: 'website', siteName: site.name, title: `${site.name} — ${site.title}`,
    description: 'Practical, authorized cybersecurity support with clear scope and documentation.',
    url: site.siteUrl, images: [{ url: '/og-image.svg', width: 1200, height: 630, alt: `${site.name} — ${site.title}` }],
  },
  twitter: { card: 'summary_large_image', title: `${site.name} — ${site.title}`, description: 'Practical, authorized cybersecurity support with clear scope and documentation.', images: ['/og-image.svg'] },
  icons: { icon: '/favicon.svg', apple: '/favicon.svg' }, manifest: '/manifest.webmanifest',
};

export const viewport: Viewport = { themeColor: [{ media: '(prefers-color-scheme: dark)', color: '#05080d' }, { media: '(prefers-color-scheme: light)', color: '#f4f6fa' }], width: 'device-width', initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en" data-theme="dark"><head><link rel="preconnect" href="https://fonts.googleapis.com" /><link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" /><link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&family=JetBrains+Mono:wght@400;600;700&display=swap" rel="stylesheet" /></head><body><a className="skip-link" href="#main">Skip to content</a><SiteHeader /><main id="main">{children}</main><SiteFooter /><Reveal /></body></html>;
}
