import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Bot, Loader2, Send, Trash2, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { toast } from "sonner";
import { AiDisclaimer, AppShell, PageHeader } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { sendChatMessage } from "@/lib/ai.functions";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "AI Assistant Chat — WorkFlow AI" },
      {
        name: "description",
        content:
          "Chat with an AI workplace assistant that keeps context across the conversation and helps with everyday work tasks.",
      },
      { property: "og:title", content: "AI Assistant Chat — WorkFlow AI" },
      {
        property: "og:description",
        content: "A context-aware chat assistant for everyday workplace questions and drafting.",
      },
    ],
  }),
  component: ChatPage,
});

type Message = { role: "user" | "assistant"; content: string };

const SUGGESTIONS = [
  "Rewrite this update so it's clearer for execs",
  "Help me prepare for a difficult 1:1",
  "Give me an agenda for a 30-minute kickoff",
];

function ChatPage() {
  const send = useServerFn(sendChatMessage);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function submit(text: string) {
    const trimmed = text.trim();
    if (!trimmed || loading) return;
    const next: Message[] = [...messages, { role: "user", content: trimmed }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const res = await send({ data: { messages: next } });
      setMessages([...next, { role: "assistant", content: res.text }]);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "The assistant could not respond.");
      setMessages(next);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppShell>
      <PageHeader
        title="AI Assistant Chat"
        description="Think out loud, refine drafts, or ask for help with any workplace task. The assistant remembers this conversation."
      />

      <div className="panel flex h-[calc(100vh-15rem)] min-h-[30rem] flex-col">
        <div className="flex items-center justify-between border-b border-border px-5 py-3">
          <span className="text-sm font-semibold">Conversation</span>
          {messages.length > 0 && (
            <Button variant="ghost" size="sm" onClick={() => setMessages([])}>
              <Trash2 className="size-3.5" /> Clear
            </Button>
          )}
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto px-5 py-5">
          {messages.length === 0 && (
            <div className="mx-auto max-w-md py-10 text-center">
              <span className="mx-auto grid size-11 place-items-center rounded-xl bg-brand-soft text-primary">
                <Bot className="size-5" />
              </span>
              <p className="mt-4 text-sm text-muted-foreground">
                Start with one of these, or ask your own question.
              </p>
              <div className="mt-4 flex flex-col gap-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => submit(s)}
                    className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground transition-colors hover:bg-brand-soft"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse" : "flex-row"}`}
            >
              <span
                className={`mt-0.5 grid size-8 shrink-0 place-items-center rounded-lg ${
                  m.role === "user"
                    ? "bg-secondary text-secondary-foreground"
                    : "bg-brand-soft text-primary"
                }`}
              >
                {m.role === "user" ? <User className="size-4" /> : <Bot className="size-4" />}
              </span>
              <div
                className={`prose-output max-w-[85%] rounded-xl px-4 py-3 text-sm ${
                  m.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "border border-border bg-surface"
                }`}
              >
                {m.role === "user" ? (
                  <p className="whitespace-pre-wrap">{m.content}</p>
                ) : (
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{m.content}</ReactMarkdown>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" /> Thinking…
            </div>
          )}
          <div ref={endRef} />
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            void submit(input);
          }}
          className="flex items-end gap-2 border-t border-border p-4"
        >
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                void submit(input);
              }
            }}
            rows={2}
            placeholder="Ask the assistant… (Enter to send, Shift+Enter for a new line)"
            className="min-h-[2.75rem] resize-none"
          />
          <Button type="submit" disabled={loading || !input.trim()} className="h-11">
            <Send className="size-4" />
          </Button>
        </form>
      </div>

      <AiDisclaimer />
    </AppShell>
  );
}
