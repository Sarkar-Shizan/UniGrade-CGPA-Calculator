import type { Metadata } from "next";
import Link from "next/link";
import { AppLayout } from "@/components/AppLayout";

export const metadata: Metadata = {
  title: "Login",
  description: "Login route placeholder for the Next.js App Router structure.",
};

export default function LoginPage() {
  return (
    <AppLayout>
      <div className="mx-auto max-w-md glass rounded-3xl p-6">
        <h1 className="text-2xl font-bold">
          <span className="gradient-text">Login</span>
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          This project stores GPA data locally. Add your auth provider here when needed.
        </p>
        <form className="mt-5 space-y-3">
          <input
            type="email"
            placeholder="Email"
            className="w-full rounded-xl border border-border bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full rounded-xl border border-border bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
          <button type="button" className="w-full rounded-xl gradient-brand px-4 py-2 text-sm font-semibold">
            Login
          </button>
        </form>
        <p className="mt-4 text-sm text-muted-foreground">
          No account? <Link href="/register" className="text-primary underline-offset-4 hover:underline">Register</Link>
        </p>
      </div>
    </AppLayout>
  );
}
