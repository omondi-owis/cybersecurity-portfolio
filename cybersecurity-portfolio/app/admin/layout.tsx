import type { Metadata } from 'next';

// A separate app identity keeps Android installs out of the public homepage.
// This is navigation only; all existing server-side authentication stays in place.
export const metadata: Metadata = {
  title: { absolute: 'VYRA Dashboard' },
  applicationName: 'VYRA Dashboard',
  manifest: '/admin/manifest.webmanifest',
  appleWebApp: { capable: true, title: 'VYRA Dashboard' },
  robots: { index: false, follow: false, noarchive: true, nosnippet: true },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return children;
}
