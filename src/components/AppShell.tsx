import { Link } from "@tanstack/react-router";
import {
  Bot,
  CalendarCheck,
  LayoutDashboard,
  Mail,
  Menu,
  NotebookPen,
  Search,
  Sparkles,
  X,
} from "lucide-react";
import { useState, type ReactNode } from "react";

export const NAV_ITEMS = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, desc: "Overview of your AI workspace" },
  { to: "/email", label: "Email Generator", icon: Mail, desc: "Draft professional emails fast" },
  {
    to: "/notes",
    label: "Meeting Summarizer",
    icon: NotebookPen,
    desc: "Turn raw notes into decisions and actions",
  },
  {
    to: "/planner",
    label: "Task Planner",
    icon: CalendarCheck,
    desc: "Break goals into a prioritised plan",
  },
  {
    to: "/research",
    label: "Research Assistant",
    icon: Search,
    desc: "Structured briefings on any topic",
  },
  { to: "/chat", label: "Assistant Chat", icon: Bot, desc: "Ask anything, keep the context" },
] as const;

function NavList({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav className="flex flex-col gap-1">
      {NAV_ITEMS.map((item) => (
        <Link
          key={item.to}
          to={item.to}
          onClick={onNavigate}
          activeOptions={{ exact: item.to === "/" }}
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground/75 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          activeProps={{
            className: "bg-sidebar-accent text-sidebar-accent-foreground",
          }}
        >
          <item.icon className="size-4 shrink-0" />
          {item.label}
        </Link>
      ))}
    </nav>
  );
}

function SidebarInner({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div className="flex h-full flex-col bg-sidebar p-4">
      <Link to="/" onClick={onNavigate} className="mb-8 flex items-center gap-2.5 px-1 py-1">
        <span className="grid size-9 place-items-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
          <Sparkles className="size-4.5" />
        </span>
        <span className="leading-tight">
          <span className="block font-display text-sm font-bold text-sidebar-foreground">
            WorkFlow AI
          </span>
          <span className="block text-[11px] text-sidebar-foreground/55">
            Productivity Assistant
          </span>
        </span>
      </Link>
      <NavList onNavigate={onNavigate} />
      <div className="mt-auto rounded-lg border border-sidebar-border/70 p-3 text-[11px] leading-relaxed text-sidebar-foreground/60">
        AI outputs are drafts. Review facts, figures and tone before sending or sharing.
      </div>
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[16rem_1fr]">
      <aside className="hidden lg:sticky lg:top-0 lg:block lg:h-screen">
        <SidebarInner />
      </aside>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            aria-label="Close navigation"
            className="absolute inset-0 bg-foreground/40"
            onClick={() => setOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-64">
            <SidebarInner onNavigate={() => setOpen(false)} />
          </div>
        </div>
      )}

      <div className="flex min-h-screen flex-col">
        <header className="sticky top-0 z-40 flex items-center gap-3 border-b border-border bg-background/85 px-4 py-3 backdrop-blur lg:hidden">
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle navigation"
            className="grid size-9 place-items-center rounded-lg border border-border bg-card"
          >
            {open ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
          <span className="font-display text-sm font-bold">WorkFlow AI</span>
        </header>
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-10 lg:py-10">{children}</main>
      </div>
    </div>
  );
}

export function PageHeader({ title, description }: { title: string; description: string }) {
  return (
    <div className="mb-6 max-w-2xl">
      <h1 className="text-2xl font-bold sm:text-3xl">{title}</h1>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

export function AiDisclaimer() {
  return (
    <p className="mt-4 rounded-lg border border-border bg-surface px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
      <strong className="font-semibold text-foreground">Responsible AI:</strong> outputs are
      AI-generated drafts and may be incomplete or inaccurate. Verify facts, figures and names, keep
      confidential data out of prompts, and take final responsibility for anything you send.
    </p>
  );
}
