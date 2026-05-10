import { Link, useLocation } from "wouter";
import { LayoutDashboard, Plane, PlusCircle, Globe, User, LogOut, Compass, Menu, X, Users } from "lucide-react";
import { useAuth } from "@workspace/replit-auth-web";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const nav = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/trips", label: "My Trips", icon: Plane },
  { href: "/trips/new", label: "Plan New Trip", icon: PlusCircle },
  { href: "/cities", label: "City Explorer", icon: Globe },
  { href: "/community", label: "Community", icon: Users },
  { href: "/profile", label: "Profile", icon: User },
];

function NavLink({ href, label, Icon, current }: { href: string; label: string; Icon: React.ElementType; current: boolean }) {
  return (
    <Link href={href} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${current ? "bg-orange-500 text-white shadow-sm shadow-orange-500/30" : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground"}`}>
      <Icon className="w-4.5 h-4.5 shrink-0" />
      {label}
    </Link>
  );
}

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  function isCurrent(href: string) {
    if (href === "/") return location === "/";
    if (href === "/trips") return location === "/trips";
    return location.startsWith(href);
  }

  const avatar = user?.profileImageUrl
    ? <img src={user.profileImageUrl} alt="" className="w-8 h-8 rounded-full object-cover" />
    : <div className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center text-primary text-sm font-bold">{(user?.firstName?.[0] || "U").toUpperCase()}</div>;

  const sidebar = (
    <div className="flex flex-col h-full">
      <div className="px-5 py-5">
        <Link href="/" className="flex items-center gap-2.5 text-orange-500" onClick={() => setMobileOpen(false)}>
          <div className="w-8 h-8 rounded-xl bg-orange-500 flex items-center justify-center">
            <Compass className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight">Traveloop</span>
          <span className="text-xs bg-orange-100 text-orange-600 px-1.5 py-0.5 rounded-full font-semibold">India</span>
        </Link>
      </div>

      <nav className="flex-1 px-3 space-y-0.5">
        {nav.map(({ href, label, icon: Icon }) => (
          <div key={href} onClick={() => setMobileOpen(false)}>
            <NavLink href={href} label={label} Icon={Icon} current={isCurrent(href)} />
          </div>
        ))}
      </nav>

      <div className="p-3 border-t border-sidebar-border mt-2">
        <div className="flex items-center gap-3 px-2 py-2 mb-1">
          {avatar}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-sidebar-foreground truncate">{user?.firstName} {user?.lastName}</p>
            <p className="text-xs text-sidebar-foreground/60 truncate">{user?.email}</p>
          </div>
        </div>
        <button onClick={logout} className="flex items-center gap-2.5 w-full px-3 py-2 rounded-xl text-sm text-destructive hover:bg-destructive/10 transition-colors">
          <LogOut className="w-4 h-4" /> Log out
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-60 shrink-0 flex-col bg-sidebar border-r border-sidebar-border sticky top-0 h-screen">
        {sidebar}
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-64 bg-sidebar border-r border-sidebar-border z-50">
            {sidebar}
          </aside>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile topbar */}
        <header className="md:hidden flex items-center justify-between px-4 py-3 bg-sidebar border-b border-sidebar-border sticky top-0 z-30">
          <button onClick={() => setMobileOpen(true)} className="p-1.5 rounded-lg hover:bg-sidebar-accent">
            <Menu className="w-5 h-5" />
          </button>
          <Link href="/" className="flex items-center gap-2 text-primary">
            <Compass className="w-6 h-6" />
            <span className="text-lg font-bold">Traveloop</span>
          </Link>
          {avatar}
        </header>

        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
