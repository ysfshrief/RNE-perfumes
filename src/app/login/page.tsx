"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useShop } from "@/context/ShopContext";
import { useAuth, AUTH_ERRORS } from "@/context/AuthContext";
import { useLang } from "@/context/LangContext";
import { useConfig } from "@/context/ConfigContext";
import { normalizeImageUrl } from "@/context/ProductContext";
import {
  GlassCard,
  GlassCardHeader,
  GlassCardTitle,
  GlassCardDescription,
  GlassCardAction,
  GlassCardContent,
  GlassCardFooter,
} from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const { dispatch } = useShop();
  const { signIn, signInWithGoogle } = useAuth();
  const { t, lang } = useLang();
  const { config } = useConfig();
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const set = (k: "email" | "password") => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const showError = (code?: string) => {
    const msg = code ? (AUTH_ERRORS as any)[code] : null;
    setError(
      msg ? msg[lang] || msg.en : lang === "ar" ? "حصل خطأ، حاول تاني" : "Something went wrong",
    );
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await signIn(form.email, form.password);
    setLoading(false);
    if (res.ok) {
      dispatch({ type: "LOGIN", payload: { name: form.email.split("@")[0], email: form.email } });
      router.push("/account");
    } else showError(res.code);
  };

  const googleSignIn = async () => {
    setError("");
    setLoading(true);
    const res = await signInWithGoogle();
    if (res.redirecting) return;
    setLoading(false);
    if (res.ok) router.push("/account");
    else showError(res.code);
  };

  // Dedicated, admin-configurable background (Drive links supported).
  const bg = config?.authBackground?.image
    ? normalizeImageUrl(config.authBackground.image)
    : "/products/hero.jpg";

  return (
    <div
      className="relative flex min-h-[calc(100vh-72px)] w-full items-center justify-center bg-cover bg-center px-4 py-16"
      style={{ backgroundImage: `url(${bg})` }}
    >
      {/* Local scrim: enough contrast for the glass panel, image still readable */}
      <div className="absolute inset-0 bg-black/60" aria-hidden="true" />

      <GlassCard className="relative w-full max-w-sm bg-black/55 border-white/20">
        <GlassCardHeader>
          <GlassCardTitle>{t("auth.signIn")}</GlassCardTitle>
          <GlassCardDescription>{t("auth.welcomeBack")}</GlassCardDescription>
          <GlassCardAction>
            <Button variant="link" asChild>
              <Link href="/register">{t("auth.createAccount")}</Link>
            </Button>
          </GlassCardAction>
        </GlassCardHeader>

        <GlassCardContent>
          <form onSubmit={submit} className="flex flex-col gap-5">
            <div className="grid gap-2">
              <Label htmlFor="email">{t("auth.email")}</Label>
              <Input
                id="email"
                type="email"
                dir="ltr"
                required
                value={form.email}
                onChange={set("email")}
                placeholder="m@example.com"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="password">{t("auth.password")}</Label>
              <Input id="password" type="password" dir="ltr" required value={form.password} onChange={set("password")} />
            </div>

            {error && (
              <p role="alert" className="rounded-md bg-red-500/25 px-3 py-2 text-sm text-white">
                {error}
              </p>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "…" : t("auth.signIn")}
            </Button>
          </form>
        </GlassCardContent>

        <GlassCardFooter className="flex-col gap-2">
          <Button variant="ghost" className="w-full gap-2" onClick={googleSignIn} disabled={loading}>
            <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.15-4.53H2.18v2.84A11 11 0 0 0 12 23z" />
              <path fill="#FBBC05" d="M5.85 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.67-2.84z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.67 2.84C6.71 7.31 9.14 5.38 12 5.38z" />
            </svg>
            {t("auth.google")}
          </Button>
        </GlassCardFooter>
      </GlassCard>
    </div>
  );
}
