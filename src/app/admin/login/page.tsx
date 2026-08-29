import type { Metadata } from "next";
import Image from "next/image";
import { Suspense } from "react";

import { LoginForm } from "@/components/admin/login-form";

export const metadata: Metadata = {
  title: "Admin sign in",
  robots: { index: false, follow: false },
};

/**
 * Sits outside the (protected) group, so it does not inherit the admin
 * shell or the auth gate. Middleware bounces an already-signed-in admin
 * straight to the dashboard.
 */
export default function LoginPage() {
  return (
    <main className="grid min-h-dvh place-items-center bg-navy-900 px-5 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <Image
            src="/crest.png"
            alt="Precision FC"
            width={72}
            height={76}
            priority
            className="mx-auto mb-4"
          />
          <h1 className="text-2xl font-black uppercase tracking-[-0.02em] text-white">
            Admin sign in
          </h1>
          <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.16em] text-teal">
            Precision FC CMS
          </p>
        </div>

        <div className="rounded-lg bg-card p-6 shadow-xl">
          <Suspense fallback={<div className="h-64" />}>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
