"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useSyncExternalStore } from "react";
import { PanelLeft, Search } from "lucide-react";
import { SITE_NAME } from "@/lib/site";
import Sidebar from "./Sidebar";
import SearchDialog from "./SearchDialog";
import ThemeToggle from "./ThemeToggle";
import Logo from "./Logo";

export type NavDoc = { slug: string; title: string; group?: string };
export type NavCategory = { slug: string; title: string; docs: NavDoc[] };

const noop = () => () => {};
const isDesktop = () => window.matchMedia("(min-width: 1024px)").matches;
const isTyping = (t: EventTarget | null) =>
  t instanceof HTMLElement && (t.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(t.tagName));

export default function DocsShell({ nav, children }: { nav: NavCategory[]; children: React.ReactNode }) {
  const pathname = usePathname();
  const [desktopOpen, setDesktopOpen] = useState(true);
  // the drawer belongs to the page it was opened on, so navigating closes it without an effect
  const [drawerPath, setDrawerPath] = useState<string | null>(null);
  const drawerOpen = drawerPath === pathname;
  const [searchOpen, setSearchOpen] = useState(false);
  const mod = useSyncExternalStore(
    noop,
    () => (/Mac|iPhone|iPad/.test(navigator.platform) ? "⌘" : "Ctrl"),
    () => "Ctrl",
  );

  useEffect(() => {
    const toggle = () => (isDesktop() ? setDesktopOpen((v) => !v) : setDrawerPath((p) => (p === pathname ? null : pathname)));
    const onKey = (e: KeyboardEvent) => {
      const cmd = e.ctrlKey || e.metaKey;
      if (cmd && !e.altKey && e.code === "KeyK") {
        e.preventDefault();
        setSearchOpen((v) => !v);
      } else if (cmd && !e.altKey && !e.shiftKey && e.code === "KeyB") {
        e.preventDefault();
        toggle();
      } else if (!cmd && !e.altKey && e.code === "Slash" && !isTyping(e.target)) {
        e.preventDefault();
        if (e.shiftKey) toggle();
        else setSearchOpen(true);
      } else if (e.key === "Escape") {
        setDrawerPath(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [pathname]);

  const toggleSidebar = () =>
    isDesktop() ? setDesktopOpen((v) => !v) : setDrawerPath(drawerOpen ? null : pathname);

  return (
    <div className="flex min-h-screen">
      <div
        aria-hidden
        onClick={() => setDrawerPath(null)}
        className={`fixed inset-0 z-40 bg-black/60 transition-opacity duration-300 lg:hidden ${drawerOpen ? "opacity-100" : "pointer-events-none opacity-0"}`}
      />
      <Sidebar
        nav={nav}
        pathname={pathname}
        desktopOpen={desktopOpen}
        drawerOpen={drawerOpen}
        onClose={() => setDrawerPath(null)}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-line bg-background/80 px-3 backdrop-blur sm:px-4">
          <button
            type="button"
            onClick={toggleSidebar}
            aria-label="Toggle sidebar"
            title={`Toggle sidebar (${mod}+B)`}
            className="rounded-md p-2 text-muted hover:bg-foreground/5 hover:text-foreground"
          >
            <PanelLeft className="size-4" />
          </button>
          <Link href="/" className="flex items-center gap-2 font-semibold lg:hidden">
            <Logo className="size-6" />
            <span className="hidden sm:inline">{SITE_NAME}</span>
          </Link>
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            className="flex min-w-0 flex-1 items-center gap-2 rounded-lg border border-line bg-card px-3 py-1.5 text-sm text-muted hover:text-foreground sm:max-w-64 sm:flex-none sm:w-64"
          >
            <Search className="size-4 shrink-0" />
            <span className="truncate">Search topics…</span>
            <kbd className="ml-auto hidden shrink-0 rounded border border-line px-1.5 font-mono text-[10px] sm:inline">
              {mod} K
            </kbd>
          </button>
          <div className="ml-auto">
            <ThemeToggle />
          </div>
        </header>
        <main className="flex-1">{children}</main>
      </div>
      <SearchDialog nav={nav} open={searchOpen} onOpenChange={setSearchOpen} />
    </div>
  );
}
