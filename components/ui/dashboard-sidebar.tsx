"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Package, ShoppingBag, Users, Star, Percent,
  FileText, Settings, LogOut, Store, ChevronRight,
} from "lucide-react";
import { useLang } from "@/context/LangContext";
import { useAuth } from "@/context/AuthContext";

type NavItemData = {
  href: string;
  title: string;
  icon: React.ElementType;
  badge?: number | string;
};

type NavGroupData = {
  heading?: string;
  items: NavItemData[];
};

function NavItem({ item, active, onNavigate }: { item: NavItemData; active: boolean; onNavigate?: () => void }) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      className={`group flex items-center justify-between rounded-[6px] px-2.5 py-[7px] transition-all duration-200 ${
        active
          ? "bg-white/10 font-medium text-white"
          : "text-white/60 hover:bg-white/5 hover:text-white/90"
      }`}
    >
      <span className="flex items-center gap-2.5">
        <Icon
          className={`h-4 w-4 transition-colors ${active ? "text-white" : "text-white/50 group-hover:text-white/80"}`}
          strokeWidth={1.5}
        />
        <span className="truncate text-[13px] tracking-wide">{item.title}</span>
      </span>

      {item.badge ? (
        <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-white/15 px-1.5 text-[10px] font-medium text-white">
          {item.badge}
        </span>
      ) : (
        <ChevronRight
          className="h-3.5 w-3.5 shrink-0 text-white/0 transition-colors group-hover:text-white/35 rtl:rotate-180"
          strokeWidth={2}
        />
      )}
    </Link>
  );
}

/**
 * Admin sidebar. Every entry is a real admin route; the active state is derived
 * from the current pathname so it stays correct on refresh and deep links.
 */
export function DashboardSidebar({
  className = "",
  onNavigate,
  counts = {},
}: {
  className?: string;
  onNavigate?: () => void;
  counts?: Record<string, number>;
}) {
  const { t } = useLang();
  const { user } = useAuth();
  const pathname = usePathname();

  const groups: NavGroupData[] = [
    {
      items: [{ href: "/admin", title: t("admin.overview"), icon: LayoutDashboard }],
    },
    {
      heading: t("admin.storeGroup"),
      items: [
        { href: "/admin/products", title: t("admin.products"), icon: Package },
        { href: "/admin/orders", title: t("admin.orders"), icon: ShoppingBag, badge: counts.orders || undefined },
        { href: "/admin/customers", title: t("admin.customers"), icon: Users },
        { href: "/admin/reviews", title: t("admin.reviews"), icon: Star },
      ],
    },
    {
      heading: t("admin.marketingGroup"),
      items: [
        { href: "/admin/discounts", title: t("admin.discounts"), icon: Percent },
        { href: "/admin/content", title: t("admin.content"), icon: FileText },
      ],
    },
  ];

  const bottom: NavItemData[] = [
    { href: "/admin/settings", title: t("admin.settings"), icon: Settings },
    { href: "/", title: t("admin.backToSite"), icon: Store },
  ];

  // `/admin` must match exactly, otherwise every child route would light it up.
  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  return (
    <div className={`flex h-full w-[260px] flex-col bg-[#16130F] p-3 text-white ${className}`}>
      {/* Brand */}
      <div className="mb-4 flex items-center gap-3 px-2 py-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-[6px] bg-white text-[13px] font-semibold text-[#16130F]">
          R
        </div>
        <div className="flex min-w-0 flex-col">
          <span className="truncate text-[13px] font-medium leading-none">RNE Perfumes</span>
          <span className="mt-1 text-[11px] leading-none text-white/45">{t("admin.brand")}</span>
        </div>
      </div>

      <nav className="mt-2 flex flex-1 flex-col gap-4 overflow-y-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {groups.map((group, i) => (
          <div key={group.heading ?? i} className="flex flex-col gap-0.5">
            {group.heading && (
              <span className="mb-1 px-2.5 text-[11px] font-semibold uppercase tracking-wider text-white/35">
                {group.heading}
              </span>
            )}
            {group.items.map((item) => (
              <NavItem key={item.href} item={item} active={isActive(item.href)} onNavigate={onNavigate} />
            ))}
          </div>
        ))}
      </nav>

      <div className="mt-auto flex flex-col gap-0.5 border-t border-white/10 pt-4">
        {bottom.map((item) => (
          <NavItem key={item.href} item={item} active={isActive(item.href) && item.href !== "/"} onNavigate={onNavigate} />
        ))}

        {/* Signed-in admin */}
        <div className="mt-3 flex items-center gap-3 rounded-lg px-2 py-2">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 text-[12px] font-semibold uppercase">
            {(user?.name || user?.email || "A").charAt(0)}
          </div>
          <div className="flex min-w-0 flex-col">
            <span className="truncate text-[12px] font-medium leading-none">
              {user?.name || t("admin.brand")}
            </span>
            <span className="mt-1 truncate text-[11px] leading-none text-white/45">
              {user?.email || ""}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
