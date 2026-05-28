import PaymentsView from "@/components/admin/payments/PaymentsView";
import SEO from "@/components/SEO";

export default function PaymentsPage() {
  return (
    <>
      <SEO
        props={{
          title: "Payment Logs | AIJobFit - Platform Super Admin Panel",
          description:
            "Audit stripe integration payment records, resolve billing failures, monitor payout metrics, and view transaction history logs.",
          keywords:
            "payment audits, billing logs, Stripe transactions, subscription payouts",
          url: "/payments",
          noIndex: true,
        }}
      />

      <main className="w-full min-h-screen bg-surface">
        <PaymentsView />
      </main>
    </>
  );
}
