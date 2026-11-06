import i32 from '@/lib/brand-icon/32';
import i180 from '@/lib/brand-icon/180';
import i192 from '@/lib/brand-icon/192';
import i512 from '@/lib/brand-icon/512';
export const runtime = 'nodejs';
const icons: Record<string, string> = { '32': i32, '180': i180, '192': i192, '512': i512 };
export async function GET(_req: Request, { params }: { params: Promise<{ size: string }> }) {
 const { size } = await params;
 if (!icons[size]) return new Response('Not found', { status: 404 });
 return new Response(new Uint8Array(Buffer.from(icons[size], 'base64')), { headers: { 'Content-Type': 'image/png', 'Cache-Control': 'public, max-age=86400' } });
}
