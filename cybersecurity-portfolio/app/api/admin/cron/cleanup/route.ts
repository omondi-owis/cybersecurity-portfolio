import { NextRequest,NextResponse } from 'next/server';
import { cleanup,cleanupAuth,equal,featureReady } from '@/lib/enquiries';
import { noStore } from '@/lib/admin-auth';
export const dynamic='force-dynamic';
/** Protected scheduler-only endpoint. Authorization value is compared in constant time. */
export async function POST(req:NextRequest){
  const supplied=req.headers.get('authorization'); const secret=process.env.CRON_SECRET?.trim();
  if(!featureReady()||!secret||!supplied||!equal(supplied,`Bearer ${secret}`)) return NextResponse.json({ok:false},{status:404,headers:noStore()});
  try { await cleanup(); await cleanupAuth(); return NextResponse.json({ok:true},{headers:noStore()}); }
  catch { return NextResponse.json({ok:false},{status:503,headers:noStore()}); }
}
