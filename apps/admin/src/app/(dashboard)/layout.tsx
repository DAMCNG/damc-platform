import { Suspense } from "react";
import { redirect } from "next/navigation";
import { Toaster } from "sonner";
import { auth } from "@/lib/auth";
import { DashboardShell } from "@/components/dashboard-shell";
import { ToastListener } from "@/components/toast-listener";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return (
    <DashboardShell user={session.user}>
      <Suspense fallback={null}>
        <ToastListener />
      </Suspense>
      <Toaster position="top-right" richColors closeButton />
      {children}
    </DashboardShell>
  );
}
