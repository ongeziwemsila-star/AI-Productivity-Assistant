import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/AppShell";
import { ToolWorkspace } from "@/components/ToolWorkspace";

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator — WorkFlow AI" },
      {
        name: "description",
        content:
          "Generate clear, professional workplace emails from a few structured details, then edit the draft before sending.",
      },
      { property: "og:title", content: "Smart Email Generator — WorkFlow AI" },
      {
        property: "og:description",
        content: "Turn a purpose and a few bullet points into a polished, editable email draft.",
      },
    ],
  }),
  component: EmailPage,
});

function EmailPage() {
  return (
    <AppShell>
      <PageHeader
        title="Smart Email Generator"
        description="Describe who you're writing to and what you need — get a subject line and a ready-to-edit draft."
      />
      <ToolWorkspace
        tool="email"
        submitLabel="Generate email"
        emptyState="Fill in the recipient and purpose, then generate your draft."
        fields={[
          {
            name: "recipient",
            label: "Recipient / audience",
            placeholder: "e.g. Head of Operations, external client",
            required: true,
          },
          {
            name: "purpose",
            label: "Purpose of the email",
            placeholder: "e.g. request a deadline extension for the Q3 rollout",
            type: "textarea",
            rows: 3,
            required: true,
          },
          {
            name: "points",
            label: "Key points to include",
            placeholder: "One point per line",
            type: "textarea",
            rows: 5,
          },
          {
            name: "tone",
            label: "Tone",
            type: "select",
            options: ["Professional", "Friendly", "Direct", "Formal", "Apologetic", "Persuasive"],
          },
          {
            name: "length",
            label: "Length",
            type: "select",
            options: ["Short", "Medium", "Detailed"],
          },
        ]}
      />
    </AppShell>
  );
}
