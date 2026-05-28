import RecruiterSettingsView from "@/components/recruiter/settings/RecruiterSettingsView";
import SEO from "@/components/SEO";

export default function BillingSettingsPage() {
  return (
    <>
      <SEO
        props={{
          title: "Billing Settings | AIJobFit Recruiter",
          description: "Manage subscription plans, billing details, payment history, and invoices for your company account.",
          url: "/recruiter/settings/billing",
          noIndex: true,
        }}
      />
      <RecruiterSettingsView initialTab="billing" />
    </>
  );
}
