import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/AppShell";
import { ToolWorkspace } from "@/components/ToolWorkspace";

export const Route = createFileRoute("/notes")({
  head: () => ({
    meta: [
      { title: "Meeting Notes Summarizer — WorkFlow AI" },
      {
        name: "description",
        content:
          "Paste raw meeting notes or a transcript and get a summary, decisions, owner-assigned action items and open questions.",
      },
      { property: "og:title", content: "Meeting Notes Summarizer — WorkFlow AI" },
      {
        property: "og:description",
        content: "Turn messy meeting notes into decisions, action items and open questions.",
      },
    ],
  }),
  component: NotesPage,
});

function NotesPage() {
  return (
    <AppShell>
      <PageHeader
        title="Meeting Notes Summarizer"
        description="Paste your raw notes or transcript. You'll get a summary, the decisions made, action items with owners, and anything still unresolved."
      />
      <ToolWorkspace
        tool="notes"
        submitLabel="Summarize meeting"
        emptyState="Paste your meeting notes to get a structured summary."
        fields={[
          {
            name: "context",
            label: "Meeting context",
            placeholder: "e.g. Weekly product sync, 6 attendees",
          },
          {
            name: "notes",
            label: "Raw notes or transcript",
            placeholder: "Paste everything here — bullet fragments are fine.",
            type: "textarea",
            rows: 14,
            required: true,
          },
        ]}
      />
    </AppShell>
  );
}
