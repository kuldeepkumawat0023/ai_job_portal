import ReactivateAccountForm from "@/components/auth/ReactivateAccountForm";
import { Suspense } from "react";

export default function ReactivateAccountPage() {
  return (
    <main className="w-full min-h-screen bg-surface">
      <Suspense fallback={<div className="min-h-screen w-full flex items-center justify-center bg-zinc-950 text-white">Loading...</div>}>
        <ReactivateAccountForm />
      </Suspense>
    </main>
  );
}
