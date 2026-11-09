import { redirect } from 'next/navigation'; import { cookies } from 'next/headers'; import { ADMIN_COOKIE } from '@/lib/admin-auth'; import { featureReady,validSession } from '@/lib/enquiries'; import AdminDashboard from './dashboard';
export const dynamic='force-dynamic'; export const revalidate=0; export const metadata={robots:{index:false,follow:false}};
export default async function AdminPage(){if(!featureReady()||!await validSession((await cookies()).get(ADMIN_COOKIE)?.value))redirect('/admin/login');return <AdminDashboard/>;}
