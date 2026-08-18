import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ShieldCheck, Sparkles, Zap } from "lucide-react";
import { AiDisclaimer, AppShell, NAV_ITEMS, PageHeader } from "@/components/AppShell";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "WorkFlow AI — AI Workplace Productivity Assistant" },
      {
        name: "description",
        content:
          "Automate workplace tasks with AI: draft emails, summarize meetings, plan work, research topics and chat with an assistant.",
      },
      { property: "og:title", content: "WorkFlow AI — AI Workplace Productivity Assistant" },
      {
        property: "og:description",
        content:
          "One workspace for AI-drafted emails, meeting summaries, task plans and research briefings.",
      },
    ],
  }),
  component: Dashboard,
});

const STATS = [
  { label: "AI tools ready", value: "5", icon: Sparkles },
  { label: "Setup required", value: "None", icon: Zap },
  { label: "Human review", value: "Always", icon: ShieldCheck },
];

function Dashboard() {
  const tools = NAV_ITEMS.filter((i) => i.to !== "/");

  return (
    <AppShell>
      <PageHeader
        title="Your AI workspace"
        description="Five focused assistants for the work that eats your day — drafting, summarizing, planning, researching and thinking out loud."
      />

      <div className="grid gap-4 sm:grid-cols-3">
        {STATS.map((s) => (
          <div key={s.label} className="panel flex items-center gap-3 p-4">
            <span className="grid size-10 place-items-center rounded-lg bg-brand-soft text-primary">
              <s.icon className="size-4.5" />
            </span>
            <div>
              <p className="text-lg font-semibold leading-none">{s.value}</p>
              <p className="mt-1 text-xs text-muted-foreground">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      <h2 className="mb-3 mt-9 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        Assistants
      </h2>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {tools.map((t) => (
          <Link
            key={t.to}
            to={t.to}
            className="panel group flex flex-col p-5 transition-transform hover:-translate-y-0.5"
          >
            <span className="grid size-10 place-items-center rounded-lg bg-brand-soft text-primary">
              <t.icon className="size-5" />
            </span>
            <h3 className="mt-4 text-base font-semibold">{t.label}</h3>
            <p className="mt-1.5 flex-1 text-sm text-muted-foreground">{t.desc}</p>
            <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
              Open <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </span>
          </Link>
        ))}
      </div>

      <AiDisclaimer />
    </AppShell>
  );
}
