'use client';

import React, { useState } from 'react';
import AdminSidebar from '@/components/admin/layout/AdminSidebar';
import AdminNavbar from '@/components/admin/layout/AdminNavbar';
import AdminAuthGuard from '@/components/auth/AdminAuthGuard';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <AdminAuthGuard>
      <div className="flex h-screen overflow-hidden bg-background">
        <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <AdminNavbar onMenuClick={() => setSidebarOpen(true)} />
          <main className="flex-1 overflow-y-auto p-6">
            {children}
          </main>
        </div>
      </div>
    </AdminAuthGuard>
  );
}
