import { streamText } from "ai";
import { createLovableAiGatewayProvider } from "./ai-gateway.server";

const MODEL = "google/gemini-3.6-flash";

type ToolKey = "email" | "notes" | "planner" | "research";

const SYSTEM_BASE =
  "You are a workplace productivity assistant for busy professionals. " +
  "Write clearly, concisely and professionally in Markdown. " +
  "Never invent facts, names, figures or citations — if information is missing, mark it as [confirm]. " +
  "Do not include private or sensitive data in outputs.";

function buildPrompt(tool: ToolKey, f: Record<string, string>): string {
  switch (tool) {
    case "email":
      return [
        "Task: Draft a professional workplace email.",
        `Recipient / audience: ${f.recipient || "[confirm]"}`,
        `Purpose: ${f.purpose || "[confirm]"}`,
        `Key points to cover: ${f.points || "[confirm]"}`,
        `Tone: ${f.tone || "professional"}`,
        `Desired length: ${f.length || "short"}`,
        "",
        "Return: a subject line on the first line as **Subject:** ..., then the email body with a greeting, structured paragraphs and a sign-off.",
      ].join("\n");
    case "notes":
      return [
        "Task: Summarize the meeting notes / transcript below.",
        `Meeting context: ${f.context || "not provided"}`,
        "",
        "Return these Markdown sections:",
        "## Summary (3-5 bullets)",
        "## Key Decisions",
        "## Action Items (table: Owner | Action | Due date)",
        "## Open Questions / Risks",
        "",
        "Notes:",
        f.notes || "",
      ].join("\n");
    case "planner":
      return [
        "Task: Build an actionable task plan.",
        `Goal / project: ${f.goal || "[confirm]"}`,
        `Deadline: ${f.deadline || "not specified"}`,
        `Time available: ${f.capacity || "not specified"}`,
        `Constraints or context: ${f.constraints || "none"}`,
        "",
        "Return: ## Plan Overview, then a Markdown table of tasks (Task | Priority | Estimate | Suggested day), then ## Sequencing Advice and ## Risks to Watch.",
      ].join("\n");
    case "research":
      return [
        "Task: Produce a structured research briefing from your general knowledge.",
        `Topic / question: ${f.topic || "[confirm]"}`,
        `Audience: ${f.audience || "internal team"}`,
        `Depth: ${f.depth || "overview"}`,
        "",
        "Return: ## Executive Summary, ## Key Findings (bullets), ## Considerations & Trade-offs, ## Suggested Next Steps, ## Verify Before Using (what a human must fact-check).",
        "Do not fabricate statistics, sources or links.",
      ].join("\n");
  }
}

function gateway() {
  const key = process.env["LOVABLE_API_KEY"];
  if (!key) throw new Error("AI is not configured (missing API key).");
  return createLovableAiGatewayProvider(key);
}

export async function runAssistant(tool: ToolKey, fields: Record<string, string>) {
  const result = streamText({
    model: gateway()(MODEL),
    system: SYSTEM_BASE,
    prompt: buildPrompt(tool, fields),
  });
  return { text: await result.text };
}

export async function runChat(messages: Array<{ role: "user" | "assistant"; content: string }>) {
  const result = streamText({
    model: gateway()(MODEL),
    system:
      SYSTEM_BASE +
      " You are in an ongoing chat. Ask a clarifying question when the request is ambiguous.",
    messages,
  });
  return { text: await result.text };
}
