import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Container, Reveal, BrandMark } from "@damc/ui";
import { getMemberSession } from "@/lib/member-session";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Members' Area Login",
  description: "Sign in with your DAMC articulate number and password to access the members' area and business directory.",
};

export default async function MemberLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const session = await getMemberSession();
  const { callbackUrl } = await searchParams;

  if (session) {
    redirect(callbackUrl?.startsWith("/") ? callbackUrl : "/directory");
  }

  return (
    <div className="flex min-h-[calc(100vh-14rem)] items-center justify-center py-16 sm:py-24">
      <Container className="max-w-md">
        <Reveal>
          <div className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center">
              <BrandMark size={56} />
            </div>
            <span className="mt-4 block text-xs font-bold uppercase tracking-[0.14em] text-gold-deep dark:text-gold-bright">
              Private Brotherhood
            </span>
            <h1 className="mt-2 font-display text-3xl font-semibold text-ink dark:text-parchment">
              Members&rsquo; Area
            </h1>
            <p className="mt-2 text-sm text-bronze dark:text-parchment/70">
              Sign in with your articulate number to access the business directory and private club records.
            </p>
          </div>

          <div className="mt-8 rounded-2xl border border-ink/8 bg-white p-7 shadow-card dark:border-parchment/10 dark:bg-ink-soft/40">
            <LoginForm callbackUrl={callbackUrl} />
          </div>

          <div className="mt-6 text-center text-xs text-bronze dark:text-parchment/60">
            <p>
              Forgot your password or joining for the first time?
            </p>
            <p className="mt-1">
              Contact the Club Secretariat or an Executive to request an initial or reset password.
            </p>
            <div className="mt-4">
              <Link
                href="/contact"
                className="font-semibold text-gold-deep hover:underline dark:text-gold-bright"
              >
                Contact Administration &rarr;
              </Link>
            </div>
          </div>
        </Reveal>
      </Container>
    </div>
  );
}
