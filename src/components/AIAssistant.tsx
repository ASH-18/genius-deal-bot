import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { AnimatePresence, motion } from "framer-motion";
import { Send, Sparkles, X, Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const SUGGESTIONS = [
  "I need shoes under ₹3000",
  "Recommend a laptop for programming",
  "Birthday gift for my sister under ₹4000",
  "Compare Vega Pro vs Nova Ultra",
  "Find eco-friendly home decor",
];

export function AIAssistant({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const { messages, sendMessage, status, error } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  });

  const isLoading = status === "submitted" || status === "streaming";

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 200);
  }, [open]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, status]);

  const send = (text: string) => {
    const t = text.trim();
    if (!t || isLoading) return;
    sendMessage({ text: t });
    setInput("");
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background/70 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.aside
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 260 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full sm:w-[440px] bg-card border-l border-border shadow-elegant flex flex-col"
          >
            <div className="flex items-center justify-between p-5 border-b border-border">
              <div className="flex items-center gap-3">
                <span className="h-9 w-9 rounded-full bg-gradient-warm grid place-items-center shadow-glow">
                  <Sparkles className="h-4 w-4 text-primary-foreground" />
                </span>
                <div>
                  <div className="font-display text-lg leading-tight">Lumen Concierge</div>
                  <div className="text-xs text-muted-foreground">AI shopping assistant</div>
                </div>
              </div>
              <button onClick={onClose} className="h-9 w-9 grid place-items-center rounded-full hover:bg-muted" aria-label="Close">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-6 space-y-5">
              {messages.length === 0 && (
                <div className="space-y-4">
                  <div className="rounded-2xl bg-muted/50 p-4 text-sm">
                    Hi — I'm Lumen. Tell me what you're shopping for, your budget, or who it's for, and I'll pick the best options from our boutique.
                  </div>
                  <div className="space-y-2">
                    <div className="text-[11px] uppercase tracking-widest text-muted-foreground">Try asking</div>
                    {SUGGESTIONS.map((s) => (
                      <button
                        key={s}
                        onClick={() => send(s)}
                        className="w-full text-left text-sm px-3 py-2.5 rounded-lg border border-border hover:border-primary/60 hover:bg-primary/5 transition"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((m: UIMessage) => (
                <Bubble key={m.id} role={m.role}>
                  {m.parts.map((p, i) => (p.type === "text" ? <span key={i}>{p.text}</span> : null))}
                </Bubble>
              ))}

              {isLoading && messages[messages.length - 1]?.role === "user" && (
                <Bubble role="assistant">
                  <span className="inline-flex items-center gap-2 text-muted-foreground">
                    <Loader2 className="h-3.5 w-3.5 animate-spin" /> Thinking…
                  </span>
                </Bubble>
              )}

              {error && (
                <div className="text-sm text-destructive bg-destructive/10 border border-destructive/30 rounded-lg p-3">
                  {error.message || "Something went wrong."}
                </div>
              )}
            </div>

            <form
              onSubmit={(e) => { e.preventDefault(); send(input); }}
              className="p-4 border-t border-border"
            >
              <div className="flex items-end gap-2 rounded-2xl border border-border bg-input/40 p-2 focus-within:ring-2 focus-within:ring-primary/60 focus-within:border-primary/60">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(input); }
                  }}
                  rows={1}
                  placeholder="Ask about products, gifts, budgets…"
                  className="flex-1 bg-transparent resize-none px-2 py-2 text-sm focus:outline-none max-h-32"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className={cn(
                    "h-9 w-9 grid place-items-center rounded-xl transition",
                    input.trim() && !isLoading
                      ? "bg-primary text-primary-foreground hover:brightness-110"
                      : "bg-muted text-muted-foreground cursor-not-allowed",
                  )}
                  aria-label="Send"
                >
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </button>
              </div>
              <p className="mt-2 text-[10px] text-muted-foreground text-center">
                Lumen can make mistakes. Verify prices at checkout.
              </p>
            </form>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

function Bubble({ role, children }: { role: string; children: React.ReactNode }) {
  const isUser = role === "user";
  return (
    <div className={cn("flex", isUser ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[85%] rounded-2xl px-4 py-2.5 text-sm whitespace-pre-wrap leading-relaxed",
          isUser
            ? "bg-primary text-primary-foreground rounded-br-sm"
            : "bg-muted/60 text-foreground rounded-bl-sm",
        )}
      >
        {children}
      </div>
    </div>
  );
}
