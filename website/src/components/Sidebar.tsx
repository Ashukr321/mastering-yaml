"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronRight, X } from "lucide-react";
import { SITE_NAME } from "@/lib/site";
import type { NavCategory } from "./DocsShell";
import Logo from "./Logo";

type Props = {
  nav: NavCategory[];
  pathname: string;
  desktopOpen: boolean;
  drawerOpen: boolean;
  onClose: () => void;
};

export default function Sidebar({ nav, pathname, desktopOpen, drawerOpen, onClose }: Props) {
  const [toggled, setToggled] = useState<Record<string, boolean>>({});

  return (
    <aside
      aria-label="Topics"
      className={[
        "fixed inset-y-0 left-0 z-50 w-72 border-r border-line bg-panel transition-[translate,width,visibility] duration-300 ease-out",
        "lg:sticky lg:top-0 lg:z-auto lg:h-screen lg:translate-x-0 lg:overflow-hidden",
        drawerOpen ? "translate-x-0" : "-translate-x-full max-lg:invisible",
        desktopOpen ? "lg:visible lg:w-64" : "lg:invisible lg:w-0 lg:border-r-0",
      ].join(" ")}
    >
      {/* fixed-width inner wrapper so links don't reflow while the width animates */}
      <div className="flex h-full w-72 flex-col lg:w-64">
        <div className="flex h-14 shrink-0 items-center justify-between border-b border-line px-4">
          <Link href="/" onClick={onClose} className="flex items-center gap-2 font-semibold">
            <Logo className="size-6" />
            {SITE_NAME}
          </Link>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close sidebar"
            className="rounded-md p-1.5 text-muted hover:bg-foreground/5 hover:text-foreground lg:hidden"
          >
            <X className="size-4" />
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto py-2">
          {nav.map((cat) => {
            const isActive = cat.docs.some((d) => pathname === `/${d.slug}`);
            const open = toggled[cat.slug] ?? isActive;
            return (
              <div key={cat.slug} className="border-b border-line/70">
                <button
                  type="button"
                  aria-expanded={open}
                  onClick={() => setToggled((t) => ({ ...t, [cat.slug]: !open }))}
                  className="flex w-full items-center justify-between px-4 py-2.5 text-left text-sm font-semibold hover:bg-foreground/5"
                >
                  {cat.title}
                  <ChevronRight className={`size-4 text-muted transition-transform duration-300 ${open ? "rotate-90" : ""}`} />
                </button>
                <div
                  className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
                >
                  <ul className="overflow-hidden" inert={!open}>
                    {cat.docs.map((d, i) => {
                      const heading = d.group && d.group !== cat.docs[i - 1]?.group ? d.group : undefined;
                      const active = pathname === `/${d.slug}`;
                      return (
                        <li key={d.slug}>
                          {heading && (
                            <p className="px-4 pt-3 pb-1 text-xs font-semibold tracking-wide text-muted [font-variant-caps:all-small-caps]">
                              {heading}
                            </p>
                          )}
                          <Link
                            href={`/${d.slug}`}
                            onClick={onClose}
                            aria-current={active ? "page" : undefined}
                            className={`mx-2 mb-0.5 block rounded-md px-3 py-1.5 text-sm ${active ? "bg-accent/15 font-medium text-accent" : "text-muted hover:bg-foreground/5 hover:text-foreground"}`}
                          >
                            {d.title}
                          </Link>
                        </li>
                      );
                    })}
                    <li className="h-2" aria-hidden />
                  </ul>
                </div>
              </div>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
