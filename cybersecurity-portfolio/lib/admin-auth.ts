import { NextRequest, NextResponse } from 'next/server';
import { featureReady, validSession } from './enquiries';
export const ADMIN_COOKIE='vyra_admin';
export const CHALLENGE_COOKIE='vyra_admin_challenge';
export function noStore(init:ResponseInit={}) { const h=new Headers(init.headers); h.set('Cache-Control','no-store, max-age=0'); return h; }

/** Require an explicit, parseable HTTPS Origin equal to the configured public origin.
 * Request Host is attacker-controlled and must never establish trust. */
export function sameOrigin(req:Request) {
  const configured=process.env.SITE_URL?.trim();
  const origin=req.headers.get('origin');
  if (!configured || !origin) return false;
  try {
    const expected=new URL(configured); const actual=new URL(origin);
    return expected.protocol==='https:' && actual.protocol==='https:' && actual.origin===expected.origin;
  } catch { return false; }
}
export async function admin(req:NextRequest) { if(!featureReady()) return false; try{return await validSession(req.cookies.get(ADMIN_COOKIE)?.value);}catch{return false;} }
export function denied() { return NextResponse.json({ok:false,error:'Not available.'},{status:404,headers:noStore()}); }
