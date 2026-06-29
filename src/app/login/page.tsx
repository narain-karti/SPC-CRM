"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { Sparkles, Mail, Lock, Eye, EyeOff, ArrowRight, Chrome } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  async function handleEmailLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      window.location.href = "/";
    } catch (err: any) {
      console.error("Auth error:", err);
      let errMsg = err.message || "An error occurred";
      if (errMsg === "{}" || errMsg === "[object Object]") {
        errMsg = JSON.stringify(err);
      }
      setError(errMsg);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen bg-[#0F1117]">
      {/* Left — Branding panel */}
      <div className="hidden lg:flex lg:w-[45%] relative flex-col justify-between p-12 overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-[0.03]" />
        <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-[#D6F04C]/15 blur-[120px]" />
        <div className="absolute -left-24 -bottom-24 h-96 w-96 rounded-full bg-[#B79AFB]/15 blur-[120px]" />

        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 mb-16"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#D6F04C] to-[#A3C128] shadow-[0_8px_32px_-6px_rgba(214,240,76,0.5)]">
              <Sparkles className="h-6 w-6 text-[#0F1117]" strokeWidth={2.5} />
            </div>
            <div>
              <div className="text-lg font-semibold text-white tracking-tight">Stability</div>
              <div className="text-[10px] uppercase tracking-[0.15em] text-white/40 font-medium">Physio Care CRM</div>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl font-semibold text-white tracking-tight leading-tight"
          >
            Manage your clinic,<br />
            <span className="text-[#D6F04C]">effortlessly.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-sm text-white/50 max-w-md leading-relaxed"
          >
            Multi-branch physiotherapy management with patient tracking, appointment scheduling, billing, lead pipeline, and real-time analytics — all in one place.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="relative z-10 grid grid-cols-3 gap-4"
        >
          {[
            { label: "Branches", value: "5", color: "#D6F04C" },
            { label: "Patients", value: "1,224", color: "#B79AFB" },
            { label: "Monthly Revenue", value: "₹12.4L", color: "#5EEAD4" },
          ].map((stat, i) => (
            <div
              key={stat.label}
              className="rounded-2xl bg-white/[0.04] p-4 ring-1 ring-white/10 backdrop-blur-sm"
            >
              <div className="text-[10px] uppercase tracking-wider text-white/40 font-semibold">{stat.label}</div>
              <div className="mt-1 text-xl font-semibold" style={{ color: stat.color }}>{stat.value}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Right — Login form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-background">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-[#D6F04C] to-[#A3C128]">
              <Sparkles className="h-5 w-5 text-[#0F1117]" strokeWidth={2.5} />
            </div>
            <div>
              <div className="text-base font-semibold tracking-tight">Stability Physio Care</div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Clinic CRM</div>
            </div>
          </div>

          <h2 className="text-2xl font-semibold tracking-tight">
            Welcome back
          </h2>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Sign in to access your clinic dashboard
          </p>



          {/* Email form */}
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div>
              <label className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">
                Email Address
              </label>
              <div className="relative mt-1.5">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@stabilityphysio.com"
                  required
                  className="w-full rounded-xl bg-muted/40 pl-10 pr-4 py-2.5 text-sm outline-none ring-1 ring-border/60 focus:ring-foreground/20 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">
                Password
              </label>
              <div className="relative mt-1.5">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  className="w-full rounded-xl bg-muted/40 pl-10 pr-10 py-2.5 text-sm outline-none ring-1 ring-border/60 focus:ring-foreground/20 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className={`rounded-xl px-3 py-2 text-xs font-medium ${
                  error.includes("Check your email")
                    ? "bg-emerald-500/10 text-emerald-600 ring-1 ring-emerald-500/30"
                    : "bg-rose-500/10 text-rose-600 ring-1 ring-rose-500/30"
                }`}
              >
                {error}
              </motion.div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#D6F04C] to-[#A3C128] px-4 py-3 text-sm font-semibold text-[#0F1117] shadow-[0_8px_24px_-6px_rgba(214,240,76,0.4)] hover:shadow-[0_12px_32px_-6px_rgba(214,240,76,0.5)] transition-all disabled:opacity-60"
            >
              {isLoading ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#0F1117] border-t-transparent" />
              ) : (
                <>
                  Sign In
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
