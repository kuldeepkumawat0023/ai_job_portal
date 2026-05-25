import React from 'react';
import ProfileView from '@/components/candidate/settings/PortfolioView';
import SEO from "@/components/SEO";

export default function ProfilePage() {
  return (
    <>
      <SEO
        props={{
          title: "My Portfolio | AIJobFit",
          description: "Manage your professional portfolio and showcase your projects on AIJobFit.",
          keywords: "portfolio, candidate profile, AIJobFit projects",
          url: "/candidate/settings/profile",
          noIndex: true,
        }}
      />
      <main className="w-full min-h-screen bg-surface">
        <ProfileView />
      </main>
    </>
  );
}
