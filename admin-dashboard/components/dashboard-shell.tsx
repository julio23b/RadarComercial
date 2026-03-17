"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase";

const links = [
  { href: "/comercios", label: "Comercios" },
  { href: "/importacion", label: "Importación CSV" },
  { href: "/analiticas", label: "Analíticas" },
];

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const onSignOut = async () => {
    await createClient().auth.signOut();
    router.push("/login");
  };

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl gap-4 p-6">
      <aside className="w-60 rounded-lg border bg-white p-4">
        <h1 className="mb-4 text-lg font-semibold">Admin Dashboard</h1>
        <nav className="space-y-2">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`block rounded-md px-3 py-2 text-sm ${
                pathname === link.href ? "bg-slate-900 text-white" : "hover:bg-slate-100"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <Button variant="outline" className="mt-6 w-full" onClick={onSignOut}>
          Cerrar sesión
        </Button>
      </aside>
      <section className="flex-1">{children}</section>
    </main>
  );
}
