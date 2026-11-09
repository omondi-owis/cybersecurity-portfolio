import { NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { contactSchema, safeFieldErrors } from '@/lib/validation';
import { rateLimit } from '@/lib/rate-limit'; import { clientIp } from '@/lib/client-ip';
import { createEnquiry, featureReady, markDelivery, cleanup } from '@/lib/enquiries';
export const dynamic='force-dynamic';
const headers=(id:string)=>({'x-request-id':id,'Cache-Control':'no-store'});
const uuidV4=/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
/** Never reflect an attacker-controlled request id; UUIDs double as retry/idempotency keys. */
function requestId(h: Headers) {
  const candidate = h.get('x-request-id') ?? '';
  return /^[A-Za-z0-9_-]{1,64}$/.test(candidate) ? candidate : randomUUID();
}
function idempotencyKey(headers: Headers) {
  const candidate = headers.get('idempotency-key') ?? '';
  return uuidV4.test(candidate) ? candidate : randomUUID();
}
async function send(input:{name:string;email:string;subject:string;message:string}, id:string): Promise<boolean|null> {
 const key=process.env.RESEND_API_KEY?.trim(), to=process.env.CONTACT_TO_EMAIL?.trim(); if(!key||!to) return null;
 try { const c=new AbortController(),t=setTimeout(()=>c.abort(),8000); const r=await fetch('https://api.resend.com/emails',{method:'POST',headers:{Authorization:`Bearer ${key}`,'Content-Type':'application/json','Idempotency-Key':`vyra-contact-${id}`},body:JSON.stringify({from:'Portfolio contact <onboarding@resend.dev>',to:[to],reply_to:input.email,subject:`[Portfolio] ${input.subject}`.slice(0,140),text:`From: ${input.name} <${input.email}>\nRequest: ${id}\n\n${input.message}`.slice(0,5000)}),signal:c.signal,cache:'no-store'});clearTimeout(t);return r.ok; } catch { return false; }
}
export async function POST(req:Request){const id=requestId(req.headers), retryKey=idempotencyKey(req.headers), ip=clientIp(req.headers);
 if(!(req.headers.get('content-type')??'').includes('application/json')) return NextResponse.json({ok:false,error:'Content-Type must be application/json.'},{status:415,headers:headers(id)});
 let raw:unknown; try {const text=await req.text();if(text.length>10240)return NextResponse.json({ok:false,error:'Payload too large. Maximum 10 KB.'},{status:413,headers:headers(id)});raw=text?JSON.parse(text):{};}catch{return NextResponse.json({ok:false,error:'Invalid JSON body.'},{status:400,headers:headers(id)});}
 const parsed=contactSchema.safeParse(raw);if(!parsed.success){if(parsed.error.issues.some(i=>String(i.path[0])==='website'))return NextResponse.json({ok:true},{headers:headers(id)});return NextResponse.json({ok:false,error:'Please fix the highlighted fields.',errors:safeFieldErrors(parsed.error)},{status:422,headers:headers(id)});}
 try {const r=await rateLimit(`contact:${ip}`,{limit:5,windowMs:3600000});if(!r.allowed)return NextResponse.json({ok:false,error:'Too many messages. Please wait and try again.',retryAfterSec:Math.ceil(r.resetAfterMs/1000)},{status:429,headers:{...headers(id),'Retry-After':String(Math.ceil(r.resetAfterMs/1000))}});}catch{return NextResponse.json({ok:false,error:'Messaging is temporarily unavailable. Please try again later.'},{status:503,headers:{...headers(id),'Retry-After':'60'}});}
 const input=parsed.data;
 if(process.env.ENQUIRY_DASHBOARD_ENABLED==='true'&&!featureReady())return NextResponse.json({ok:false,error:'Messaging is temporarily unavailable. Please use a listed contact channel.'},{status:503,headers:headers(id)});
 if(featureReady()) { try {const enquiry=await createEnquiry(input,retryKey); void cleanup().catch(()=>undefined); if(enquiry.inserted){const delivered=await send(input,retryKey); await markDelivery(enquiry.id,delivered?'sent':'failed');} return NextResponse.json({ok:true},{headers:headers(id)});}catch{return NextResponse.json({ok:false,error:'Messaging is temporarily unavailable. Please use a listed contact channel.'},{status:503,headers:headers(id)});} }
 const delivered=await send(input,id); if(delivered===null)return NextResponse.json({ok:false,error:'Messaging is temporarily unavailable. Please use a listed contact channel.'},{status:503,headers:headers(id)}); if(!delivered)return NextResponse.json({ok:false,error:'Delivery failed. Please try again later.'},{status:502,headers:headers(id)});return NextResponse.json({ok:true},{headers:headers(id)});
}
export async function GET(){return NextResponse.json({ok:false,error:'Method not allowed.'},{status:405,headers:{'Cache-Control':'no-store'}});}
