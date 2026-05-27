import SEO from "@/components/SEO";
import LoginForm from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <>
      <SEO
        props={{
          title: "Login - AIJobFit Admin | Super Admin Panel Access",
          description:
            "Securely sign in to the AI JobFit Super Admin Panel. Manage users, recruiters, job postings, and monitor platform metrics with full administrative control.",
          keywords:
            "AIJobFit admin login, super admin sign in, admin panel access, AI job portal admin, admin dashboard login",
          url: "/login",
        }}
      />

      <main className="w-full min-h-screen bg-surface">
        <LoginForm />
      </main>
    </>
  );
}
