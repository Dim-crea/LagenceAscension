"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import clsx from "clsx";

const TABS = [
  { href: "/admin/projects", label: "Portfolio" },
  { href: "/admin/services", label: "Prestations" },
  { href: "/admin/testimonials", label: "Avis clients" },
  { href: "/admin/faq", label: "FAQ" },
  { href: "/admin/settings", label: "Réglages" },
];

export default function AdminShell({ title, description, children }) {
  const pathname = usePathname();
  const router = useRouter();

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <div className="min-h-screen">
      <header className="border-b border-line px-5 py-4 sm:px-8">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-1">
            {TABS.map((t) => (
              <Link
                key={t.href}
                href={t.href}
                className={clsx(
                  "rounded-sm px-3.5 py-2 text-xs font-medium uppercase tracking-[0.08em] transition-colors",
                  pathname === t.href
                    ? "bg-kelp text-white"
                    : "text-silver hover:bg-kelp/50 hover:text-white"
                )}
              >
                {t.label}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <Link href="/" target="_blank" className="text-xs text-silver hover:text-white">
              Voir le site ↗
            </Link>
            <button
              onClick={logout}
              className="rounded-sm border border-line2 px-3.5 py-2 text-xs text-silver hover:border-white hover:text-white"
            >
              Déconnexion
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
        {(title || description) && (
          <div className="mb-8">
            {title && <h1 className="font-display text-2xl font-semibold text-white">{title}</h1>}
            {description && <p className="mt-1.5 text-sm text-silver">{description}</p>}
          </div>
        )}
        {children}
      </main>
    </div>
  );
}
