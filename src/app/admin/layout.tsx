import '../globals.css';
import Sidebar from '@/components/Sidebar';
import type { ReactNode } from 'react';

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 ml-64 p-6">{children}</main>
    </div>
  );
}

