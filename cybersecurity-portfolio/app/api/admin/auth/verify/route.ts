import { NextRequest,NextResponse } from 'next/server';
import { consumeChallenge,featureReady,randomToken,createSession } from '@/lib/enquiries';
import { ADMIN_COOKIE,CHALLENGE_COOKIE,noStore,sameOrigin } from '@/lib/admin-auth';
export const dynamic='force-dynamic';
const uuid=/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
export async function POST(req:NextRequest){
  if(!featureReady()||!sameOrigin(req))return NextResponse.json({ok:false,error:'Sign-in unavailable.'},{status:404,headers:noStore()});
  try{
    const body=await req.json();
    // Challenge identity is HttpOnly cookie-bound, never client-selected.
    const challenge=req.cookies.get(CHALLENGE_COOKIE)?.value;
    if(!challenge||!uuid.test(challenge)||typeof body?.code!=='string'||!/^\d{6}$/.test(body.code)||Object.keys(body).length!==1) throw new Error();
    if(!await consumeChallenge(challenge,body.code)) throw new Error();
    const token=randomToken();await createSession(token);
    const r=NextResponse.json({ok:true},{headers:noStore()});
    r.cookies.set(ADMIN_COOKIE,token,{httpOnly:true,secure:true,sameSite:'strict',path:'/',maxAge:8*60*60});
    r.cookies.set(CHALLENGE_COOKIE,'',{httpOnly:true,secure:true,sameSite:'strict',path:'/api/admin/auth',maxAge:0});
    return r;
  }catch{return NextResponse.json({ok:false,error:'Sign-in unavailable.'},{status:401,headers:noStore()});}
}
