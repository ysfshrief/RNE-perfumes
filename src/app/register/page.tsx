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
import { Select } from "@/components/ui/select";

const GOV_KEYS = [
  "Cairo", "Giza", "Alexandria", "Beheira", "Dakahlia", "Sharqia",
  "Qalyubia", "Gharbia", "Monufia", "Aswan", "Luxor", "Other",
] as const;

const GOV_AR: Record<string, string> = {
  Cairo: "القاهرة", Giza: "الجيزة", Alexandria: "الإسكندرية", Beheira: "البحيرة",
  Dakahlia: "الدقهلية", Sharqia: "الشرقية", Qalyubia: "القليوبية", Gharbia: "الغربية",
  Monufia: "المنوفية", Aswan: "أسوان", Luxor: "الأقصر", Other: "أخرى",
};

type Form = {
  name: string; phone: string; governorate: string; city: string;
  address: string; email: string; password: string;
};

export default function RegisterPage() {
  const { dispatch } = useShop();
  const { register } = useAuth();
  const { t, lang } = useLang();
  const { config } = useConfig();
  const router = useRouter();
  const [form, setForm] = useState<Form>({
    name: "", phone: "", governorate: "", city: "", address: "", email: "", password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const set =
    (k: keyof Form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await register(form.email, form.password, form.name);
    setLoading(false);
    if (res.ok) {
      dispatch({ type: "LOGIN", payload: { name: form.name, email: form.email, ...form } });
      router.push("/account");
    } else {
      const msg = res.code ? (AUTH_ERRORS as any)[res.code] : null;
      setError(msg ? msg[lang] || msg.en : t("auth.registerFailed"));
    }
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
      <div className="absolute inset-0 bg-black/60" aria-hidden="true" />

      <GlassCard className="relative w-full max-w-md bg-black/55 border-white/20">
        <GlassCardHeader>
          <GlassCardTitle>{t("auth.createAccount")}</GlassCardTitle>
          <GlassCardDescription>{t("auth.registerLead")}</GlassCardDescription>
          <GlassCardAction>
            <Button variant="link" asChild>
              <Link href="/login">{t("auth.signIn")}</Link>
            </Button>
          </GlassCardAction>
        </GlassCardHeader>

        <GlassCardContent>
          <form onSubmit={submit} className="flex flex-col gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">{t("auth.fullName")}</Label>
              <Input id="name" required value={form.name} onChange={set("name")} />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="phone">{t("auth.phone")}</Label>
                <Input id="phone" type="tel" dir="ltr" required value={form.phone} onChange={set("phone")} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="governorate">{t("auth.governorate")}</Label>
                <Select id="governorate" required value={form.governorate} onChange={set("governorate")}>
                  <option value="">{t("checkout.select")}</option>
                  {GOV_KEYS.map((g) => (
                    <option key={g} value={g}>{lang === "ar" ? GOV_AR[g] : g}</option>
                  ))}
                </Select>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="city">{t("auth.city")}</Label>
                <Input id="city" required value={form.city} onChange={set("city")} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="address">{t("auth.address")}</Label>
                <Input id="address" required value={form.address} onChange={set("address")} />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email">{t("auth.email")}</Label>
              <Input id="email" type="email" dir="ltr" required value={form.email} onChange={set("email")} placeholder="m@example.com" />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="password">{t("auth.password")}</Label>
              <Input id="password" type="password" dir="ltr" required minLength={6} value={form.password} onChange={set("password")} />
            </div>

            {error && (
              <p role="alert" className="rounded-md bg-red-500/25 px-3 py-2 text-sm text-white">
                {error}
              </p>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "…" : t("auth.createAccount")}
            </Button>
          </form>
        </GlassCardContent>

        <GlassCardFooter>
          <p className="w-full text-center text-sm text-white/80">
            {t("auth.haveAccount")}{" "}
            <Link href="/login" className="underline underline-offset-4">{t("auth.signIn")}</Link>
          </p>
        </GlassCardFooter>
      </GlassCard>
    </div>
  );
}
