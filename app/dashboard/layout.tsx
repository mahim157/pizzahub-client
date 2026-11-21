"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import {
  Flame,
  LayoutDashboard,
  Pizza,
  PlusCircle,
  ShoppingBag, Heart,
  Users,
  CheckSquare,
  Crown,
  User,
  LogOut,
  Menu,
  X,
  Sun,
  Moon,
  Home,
  Loader2,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";

type NavItem = {
  href: string;
  label: string;
  icon: React.ElementType;
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();

  const { data: session, isPending } = authClient.useSession();
  const user = session?.user as
    | {
        id?: string;
        name?: string;
        email?: string;
        image?: string;
        role?: string;
        businessName?: string;
        isPremium?: boolean;
      }
    | undefined;

  const [mounted, setMounted] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isPending && !user) {
      router.replace("/login");
    }
  }, [isPending, user, router]);

  const inferRoleFromPath = () => {
    if (pathname?.startsWith("/dashboard/admin")) return "admin";
    if (pathname?.startsWith("/dashboard/vendor")) return "vendor";
    return "customer";
  };

  const role = user?.role || inferRoleFromPath();

  const roleMenus: Record<string, NavItem[]> = {
    customer: [
      {
        href: "/dashboard/customer",
        label: "Overview",
        icon: LayoutDashboard,
      },
      {
        href: "/dashboard/customer/my-orders",
        label: "My Orders",
        icon: ShoppingBag,
      },
      {
        href: "/dashboard/customer/profile",
        label: "Profile Settings",
        icon: User,
      },
    ],
    vendor: [
      {
        href: "/dashboard/vendor",
        label: "Overview",
        icon: LayoutDashboard,
      },
      {
        href: "/dashboard/vendor/my-menu",
        label: "My Menu Items",
        icon: Pizza,
      },
      {
        href: "/dashboard/vendor/add-item",
        label: "Add New Pizza",
        icon: PlusCircle,
      },
      {
        href: "/dashboard/vendor/orders",
        label: "Incoming Orders",
        icon: ShoppingBag,
      },
      {
        href: "/dashboard/vendor/subscription",
        label: "Premium Plan",
        icon: Crown,
      },
      {
        href: "/dashboard/vendor/profile",
        label: "Profile Settings",
        icon: User,
      },
    ],
    admin: [
      {
        href: "/dashboard/admin",
        label: "Overview",
        icon: LayoutDashboard,
      },
      {
        href: "/dashboard/admin/menu-approvals",
        label: "Menu Approvals",
        icon: CheckSquare,
      },
      {
        href: "/dashboard/admin/users",
        label: "Manage Users",
        icon: Users,
      },
      {
        href: "/dashboard/admin/profile",
        label: "Profile Settings",
        icon: User,
      },
    ],
  };

  const links = roleMenus[role] || roleMenus.customer;

  const handleLogout = async () => {
    await authClient.signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-transform duration-300 lg:static lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-20 items-center justify-between border-b border-sidebar-border px-6">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-sidebar-primary text-sidebar-primary-foreground">
              <Flame className="h-5 w-5" />
            </span>
            <span className="text-xl font-extrabold tracking-tight">
              Pizza<span className="text-sidebar-primary">Hub</span>
            </span>
          </Link>

          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="rounded-lg p-1.5 text-sidebar-foreground/70 hover:bg-sidebar-accent lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="border-b border-sidebar-border p-5">
          <div className="flex items-center gap-3 rounded-2xl bg-sidebar-accent p-3.5">
            {user?.image ? (
              <img
                src={user.image}
                alt={user.name || "User"}
                className="h-11 w-11 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-sidebar-primary text-sm font-extrabold text-sidebar-primary-foreground">
                {(user?.name || user?.email || "U").charAt(0).toUpperCase()}
              </div>
            )}
            <div className="min-w-0">
              <p className="truncate text-sm font-extrabold">
                {user?.businessName || user?.name || "PizzaHub User"}
              </p>
              <span className="mt-0.5 inline-block rounded-md bg-sidebar-primary/20 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-sidebar-primary">
                {role}
              </span>
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-1.5 overflow-y-auto p-4">
          <p className="px-3 pb-2 text-[11px] font-extrabold uppercase tracking-widest text-sidebar-foreground/50">
            Dashboard Menu
          </p>

          {links.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-bold transition ${
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-xs"
                    : "text-sidebar-foreground/75 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="space-y-2 border-t border-sidebar-border p-4">
          <Link
            href="/"
            className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-sidebar-foreground/75 transition hover:bg-sidebar-accent hover:text-sidebar-foreground"
          >
            <Home className="h-4 w-4" />
            Back to Website
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-bold text-red-400 transition hover:bg-red-500/10"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-border bg-background/90 px-5 backdrop-blur-md sm:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card lg:hidden"
              aria-label="Open sidebar"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div>
              <h2 className="text-base font-extrabold capitalize sm:text-lg">
                {role} Workspace
              </h2>
              <p className="hidden text-xs text-muted-foreground sm:block">
                Manage your PizzaHub activities in one place
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {mounted && (
              <button
                type="button"
                onClick={() =>
                  setTheme(resolvedTheme === "dark" ? "light" : "dark")
                }
                aria-label="Toggle color theme"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-foreground transition hover:border-primary hover:text-primary"
              >
                {resolvedTheme === "dark" ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </button>
            )}

            <Link
              href="/menu"
              className="rounded-full bg-primary px-4 py-2 text-xs font-extrabold text-primary-foreground transition hover:opacity-90"
            >
              Browse Menu
            </Link>
          </div>
        </header>

        <main className="relative flex-1 p-5 sm:p-8">
          {isPending && (
            <div className="mb-4 flex items-center gap-2 rounded-2xl border border-border bg-card px-4 py-2.5 text-xs font-semibold text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
              <span>Verifying session...</span>
            </div>
          )}
          {children}
        </main>
      </div>
    </div>
  );
}




