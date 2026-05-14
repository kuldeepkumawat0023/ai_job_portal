import ReactivateAccountForm from "@/components/auth/ReactivateAccountForm";
import Link from "next/link";
import { Suspense } from "react";

export default function ReactivateAccountPage() {
  return (
    <main className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden bg-gradient-to-br from-white via-zinc-50 to-zinc-100 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950">
      {/* Background Abstract Element */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] md:w-[800px] md:h-[800px] bg-gradient-to-tr from-primary/10 to-secondary/10 rounded-full blur-[60px] md:blur-[120px] -z-10 animate-pulse"></div>
      
      <Suspense fallback={<div className="text-white">Loading...</div>}>
        <ReactivateAccountForm />
      </Suspense>
    </main>
  );
}
