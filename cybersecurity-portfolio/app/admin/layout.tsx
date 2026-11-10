import AdminShell from './admin-shell';
import './admin.css';

export { metadata } from './metadata';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}
