"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, LoaderCircle, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { useAdminAuth } from "@/context/AdminAuthContext";

export default function AdminLoginPage() {
  const router = useRouter();
  const { login, isLoading, isAuthenticated } = useAdminAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace("/admin/dashboard");
    }
  }, [isLoading, isAuthenticated, router]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSubmitting) return;

    if (!email.trim() || !password) {
      toast.error("Please enter your email and password.");
      return;
    }

    setIsSubmitting(true);

    try {
      await login({
        email: email.trim(),
        password,
      });

      toast.success("Welcome to Verigo Essential.");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to sign in. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading || isAuthenticated) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f7f5f0] px-5 text-[#171717]">
        <div className="text-center">
          <LoaderCircle size={22} className="mx-auto mb-4 animate-spin" />
          <p className="text-sm text-[#777168]">
            {isLoading
              ? "Checking administrator session..."
              : "Opening dashboard..."}
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f7f5f0] px-5 py-12 text-[#171717]">
      <div className="w-full max-w-md">
        <Link
          href="/"
          className="mb-12 block text-center text-xl font-semibold tracking-[0.18em]"
        >
          VERIGO <span className="font-light">ESSENTIAL</span>
        </Link>

        <section className="border border-[#ded9d0] bg-white p-7 sm:p-10">
          <div className="mb-8 flex h-12 w-12 items-center justify-center border border-[#ded9d0]">
            <ShieldCheck size={23} strokeWidth={1.5} />
          </div>

          <p className="mb-2 text-xs uppercase tracking-[0.2em] text-[#777168]">
            Administration
          </p>

          <h1 className="font-serif text-3xl">Welcome back</h1>

          <p className="mt-3 text-sm leading-6 text-[#777168]">
            Sign in to manage your catalog, website content, and wholesale
            inquiries.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-medium">
                Email address
              </label>

              <input
                id="email"
                type="email"
                autoComplete="username"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="admin@example.com"
                className="h-12 w-full border border-[#d9d4cb] bg-white px-4 text-sm outline-none transition focus:border-[#171717]"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium"
              >
                Password
              </label>

              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter your password"
                  className="h-12 w-full border border-[#d9d4cb] bg-white px-4 pr-12 text-sm outline-none transition focus:border-[#171717]"
                />

                <button
                  type="button"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowPassword((value) => !value)}
                  className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-[#777168] hover:text-black"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex h-12 w-full items-center justify-center gap-2 bg-[#171717] px-5 text-sm font-medium text-white transition hover:bg-[#353535] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting && (
                <LoaderCircle size={17} className="animate-spin" />
              )}
              {isSubmitting ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <p className="mt-7 border-t border-[#eeeae3] pt-5 text-center text-xs text-[#777168]">
            Authorized administrators only.
          </p>
        </section>

        <Link
          href="/"
          className="mt-7 block text-center text-sm text-[#777168] transition hover:text-black"
        >
          Return to website
        </Link>
      </div>
    </main>
  );
}
