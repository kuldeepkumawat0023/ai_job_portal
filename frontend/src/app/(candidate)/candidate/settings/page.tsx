import React from 'react';
import SettingsView from '@/components/candidate/settings/SettingsView';
import SEO from "@/components/SEO";

export default function SettingsPage() {
  return (
    <>
      <SEO
        props={{
          title: "Settings | AIJobFit",
          description: "Manage your AIJobFit account settings and preferences.",
          keywords: "account settings, preferences, AIJobFit",
          url: "/candidate/settings",
          noIndex: true,
        }}
      />
      <main className="w-full min-h-screen bg-surface">
        <SettingsView />
      </main>
    </>
  );
}
