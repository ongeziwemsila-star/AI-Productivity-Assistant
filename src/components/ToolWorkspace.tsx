import { useServerFn } from "@tanstack/react-start";
import { Check, Copy, Loader2, Pencil, RotateCcw, Sparkles } from "lucide-react";
import { useState, type ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { toast } from "sonner";
import { AiDisclaimer } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { generateAssistantOutput } from "@/lib/ai.functions";

export type Field = {
  name: string;
  label: string;
  placeholder?: string;
  type?: "input" | "textarea" | "select";
  options?: string[];
  rows?: number;
  required?: boolean;
};

type Props = {
  tool: "email" | "notes" | "planner" | "research";
  fields: Field[];
  submitLabel: string;
  emptyState: ReactNode;
};

export function ToolWorkspace({ tool, fields, submitLabel, emptyState }: Props) {
  const run = useServerFn(generateAssistantOutput);
  const [values, setValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(fields.map((f) => [f.name, f.type === "select" ? (f.options?.[0] ?? "") : ""])),
  );
  const [output, setOutput] = useState("");
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const set = (name: string, value: string) => setValues((v) => ({ ...v, [name]: value }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const missing = fields.find((f) => f.required && !values[f.name]?.trim());
    if (missing) {
      toast.error(`${missing.label} is required`);
      return;
    }
    setLoading(true);
    try {
      const res = await run({ data: { tool, fields: values } });
      setOutput(res.text);
      setEditing(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Generation failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function copy() {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] xl:grid-cols-[minmax(0,26rem)_minmax(0,1fr)]">
      <form onSubmit={submit} className="panel h-fit p-5">
        <h2 className="mb-1 text-sm font-semibold">Prompt details</h2>
        <p className="mb-5 text-xs text-muted-foreground">
          Structured inputs give the assistant the context it needs.
        </p>
        <div className="space-y-4">
          {fields.map((f) => (
            <div key={f.name} className="space-y-1.5">
              <Label htmlFor={f.name} className="text-xs font-medium">
                {f.label}
                {f.required && <span className="text-destructive"> *</span>}
              </Label>
              {f.type === "textarea" ? (
                <Textarea
                  id={f.name}
                  rows={f.rows ?? 5}
                  placeholder={f.placeholder}
                  value={values[f.name] ?? ""}
                  onChange={(e) => set(f.name, e.target.value)}
                />
              ) : f.type === "select" ? (
                <select
                  id={f.name}
                  value={values[f.name] ?? ""}
                  onChange={(e) => set(f.name, e.target.value)}
                  className="h-9 w-full rounded-md border border-input bg-card px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
                >
                  {f.options?.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              ) : (
                <Input
                  id={f.name}
                  placeholder={f.placeholder}
                  value={values[f.name] ?? ""}
                  onChange={(e) => set(f.name, e.target.value)}
                />
              )}
            </div>
          ))}
        </div>
        <Button type="submit" disabled={loading} className="mt-5 w-full">
          {loading ? (
            <>
              <Loader2 className="size-4 animate-spin" /> Generating…
            </>
          ) : (
            <>
              <Sparkles className="size-4" /> {submitLabel}
            </>
          )}
        </Button>
      </form>

      <div className="panel flex min-h-[26rem] flex-col p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-sm font-semibold">AI output</h2>
          {output && (
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setEditing((v) => !v)}>
                <Pencil className="size-3.5" /> {editing ? "Preview" : "Edit"}
              </Button>
              <Button variant="outline" size="sm" onClick={copy}>
                {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />} Copy
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setOutput("")}>
                <RotateCcw className="size-3.5" /> Clear
              </Button>
            </div>
          )}
        </div>

        <div className="flex-1">
          {loading && !output ? (
            <div className="flex h-full min-h-64 flex-col items-center justify-center gap-3 text-sm text-muted-foreground">
              <Loader2 className="size-5 animate-spin" />
              Drafting your output…
            </div>
          ) : !output ? (
            <div className="flex h-full min-h-64 items-center justify-center rounded-lg border border-dashed border-border bg-surface/60 p-6 text-center text-sm text-muted-foreground">
              {emptyState}
            </div>
          ) : editing ? (
            <Textarea
              value={output}
              onChange={(e) => setOutput(e.target.value)}
              className="min-h-96 font-mono text-xs"
            />
          ) : (
            <div className="prose-output text-sm">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{output}</ReactMarkdown>
            </div>
          )}
        </div>

        <AiDisclaimer />
      </div>
    </div>
  );
}
