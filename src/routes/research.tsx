import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/AppShell";
import { ToolWorkspace } from "@/components/ToolWorkspace";

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [
      { title: "AI Research Assistant — WorkFlow AI" },
      {
        name: "description",
        content:
          "Get a structured briefing on any work topic: executive summary, key findings, trade-offs and what to fact-check.",
      },
      { property: "og:title", content: "AI Research Assistant — WorkFlow AI" },
      {
        property: "og:description",
        content: "Structured briefings with findings, trade-offs and a verification checklist.",
      },
    ],
  }),
  component: ResearchPage,
});

function ResearchPage() {
  return (
    <AppShell>
      <PageHeader
        title="AI Research Assistant"
        description="Ask a work question and get a structured briefing — including an explicit list of what a human should verify."
      />
      <ToolWorkspace
        tool="research"
        submitLabel="Run briefing"
        emptyState="Enter a topic or question to generate a research briefing."
        fields={[
          {
            name: "topic",
            label: "Topic or question",
            placeholder: "e.g. Pros and cons of a four-day work week for a 40-person agency",
            type: "textarea",
            rows: 3,
            required: true,
          },
          {
            name: "audience",
            label: "Audience",
            placeholder: "e.g. exec team, engineering leads, board",
          },
          {
            name: "depth",
            label: "Depth",
            type: "select",
            options: ["Quick overview", "Standard briefing", "Deep dive"],
          },
        ]}
      />
    </AppShell>
  );
}
