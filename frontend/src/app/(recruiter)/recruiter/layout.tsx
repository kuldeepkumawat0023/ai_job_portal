'use client';

import React, { useState } from 'react';
import Sidebar from "@/components/recruiter/layout/Sidebar";
import TopNavbar from "@/components/recruiter/layout/TopNavbar";
import AuthGuard from "@/components/auth/AuthGuard";
import RoleGuard from "@/components/auth/RoleGuard";
import { motion, AnimatePresence } from 'framer-motion';

import { ChatProvider } from "@/provider/ChatProvider";

export default function RecruiterRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    /* <AuthGuard>
      <RoleGuard allowedRoles={['recruiter', 'admin']}> */
        <ChatProvider>
          <div className="flex h-screen bg-background overflow-hidden font-sans">

            {/* Sidebar - Handles both desktop (static) and mobile (overlay) via props */}
            <Sidebar
              isOpen={isSidebarOpen}
              onClose={() => setIsSidebarOpen(false)}
            />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden lg:pl-72 transition-all duration-300">
              <TopNavbar onMenuClick={() => setIsSidebarOpen(true)} />

              <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-10 custom-scrollbar">
                <div className="max-w-7xl mx-auto">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key="recruiter-content"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                    >
                      {children}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </main>
            </div>
          </div>
        </ChatProvider>
      /* </RoleGuard>
    </AuthGuard> */
  );
}
