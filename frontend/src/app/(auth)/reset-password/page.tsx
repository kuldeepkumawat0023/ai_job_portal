import ResetPasswordForm from "@/components/auth/ResetPasswordForm";
import { Suspense } from "react";

export default function ResetPasswordPage() {
  return (
    <main className="w-full min-h-screen bg-surface">
      <Suspense fallback={<div className="min-h-screen w-full flex items-center justify-center bg-zinc-950 text-white">Loading...</div>}>
        <ResetPasswordForm />
      </Suspense>
    </main>
  );
}
