import { NextRequest,NextResponse } from 'next/server';
import { createChallenge, featureReady, otp } from '@/lib/enquiries';
import { CHALLENGE_COOKIE,noStore,sameOrigin } from '@/lib/admin-auth';
import { rateLimit } from '@/lib/rate-limit';
import { clientIp } from '@/lib/client-ip';
export const dynamic='force-dynamic';
const reply=()=>NextResponse.json({ok:true},{headers:noStore()});
export async function POST(req:NextRequest){
  // Validate origin before Redis/DB/email work; feature remains intentionally opaque.
  if(!featureReady()||!sameOrigin(req)) return reply();
  try {
    const ip=clientIp(req.headers);
    const [perIp,global]=await Promise.all([
      rateLimit(`admin-auth:ip:${ip}`,{limit:5,windowMs:60*60*1000}),
      rateLimit('admin-auth:global',{limit:50,windowMs:60*60*1000}),
    ]);
    if(!perIp.allowed||!global.allowed) return reply();
    // Parse a bounded JSON object; no destination can be supplied by a client.
    const body=await req.json().catch(()=>null);
    if(body!==null && (typeof body!=='object'||Array.isArray(body)||Object.keys(body as object).length>0)) return reply();
    const key=process.env.RESEND_API_KEY?.trim(),to=process.env.ADMIN_EMAIL?.trim();
    if(!key||!to) return reply();
    const code=otp(); const id=await createChallenge(code);
    const r=await fetch('https://api.resend.com/emails',{method:'POST',headers:{Authorization:`Bearer ${key}`,'Content-Type':'application/json'},body:JSON.stringify({from:'VYRA admin <onboarding@resend.dev>',to:[to],subject:'Your VYRA admin sign-in code',text:`Your one-time code is ${code}. It expires in 10 minutes.`}),cache:'no-store'});
    if(!r.ok) return reply();
    const response=NextResponse.json({ok:true},{headers:noStore()});
    response.cookies.set(CHALLENGE_COOKIE,id,{httpOnly:true,secure:true,sameSite:'strict',path:'/api/admin/auth',maxAge:10*60});
    return response;
  }catch{return reply();}
}
