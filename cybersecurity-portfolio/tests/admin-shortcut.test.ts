import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { metadata } from '../app/admin/metadata';

const load = (file: string) => JSON.parse(readFileSync(new URL(file, import.meta.url), 'utf8'));

describe('dashboard-only Android installation', () => {
  const admin = load('../public/admin/manifest.webmanifest');
  const publicApp = load('../public/manifest.webmanifest');

  it('overrides the inherited public manifest only in admin pages', () => {
    expect(metadata.manifest).toBe('/admin/manifest.webmanifest');
    expect(metadata.title).toEqual({ absolute: 'VYRA Dashboard' });
    expect(metadata.robots).toMatchObject({ index: false, follow: false });
  });
  it('uses a separate identity and launches the authenticated admin entry point', () => {
    expect(admin.id).toBe('/admin');
    expect(admin.start_url).toBe('/admin');
    expect(admin.scope).toBe('/admin');
    expect(admin.name).toBe('VYRA Dashboard');
    expect(admin.display).toBe('standalone');
    expect(admin.id).not.toBe(publicApp.id ?? publicApp.start_url);
  });
  it('preserves the existing public app and valid Android icon sizes', () => {
    expect(publicApp.start_url).toBe('/');
    expect(admin.icons.map((icon: { sizes: string }) => icon.sizes)).toEqual(['192x192', '512x512']);
  });
  it('does not bypass or change the protected launch route', () => {
    const page = readFileSync(new URL('../app/admin/page.tsx', import.meta.url), 'utf8');
    expect(page).toContain('validSession');
    expect(page).toContain("redirect('/admin/login')");
  });
});
