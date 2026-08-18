import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/AppShell";
import { ToolWorkspace } from "@/components/ToolWorkspace";

export const Route = createFileRoute("/planner")({
  head: () => ({
    meta: [
      { title: "AI Task Planner — WorkFlow AI" },
      {
        name: "description",
        content:
          "Break a goal into a prioritised, time-estimated task plan with sequencing advice and risks to watch.",
      },
      { property: "og:title", content: "AI Task Planner — WorkFlow AI" },
      {
        property: "og:description",
        content: "Turn a goal and deadline into a prioritised, editable task plan.",
      },
    ],
  }),
  component: PlannerPage,
});

function PlannerPage() {
  return (
    <AppShell>
      <PageHeader
        title="AI Task Planner"
        description="Give the assistant a goal and your constraints — get a prioritised task breakdown you can edit and reuse."
      />
      <ToolWorkspace
        tool="planner"
        submitLabel="Build plan"
        emptyState="Describe your goal and deadline to generate a task plan."
        fields={[
          {
            name: "goal",
            label: "Goal or project",
            placeholder: "e.g. Launch the internal onboarding portal",
            type: "textarea",
            rows: 3,
            required: true,
          },
          { name: "deadline", label: "Deadline", placeholder: "e.g. end of next month" },
          {
            name: "capacity",
            label: "Time available",
            placeholder: "e.g. 6 focused hours per week",
          },
          {
            name: "constraints",
            label: "Constraints & context",
            placeholder: "Dependencies, stakeholders, budget, blockers…",
            type: "textarea",
            rows: 4,
          },
        ]}
      />
    </AppShell>
  );
}
