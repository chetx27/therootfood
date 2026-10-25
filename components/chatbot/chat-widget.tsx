"use client";

import { WhatsAppLogo } from "@/components/ui/whatsapp-logo";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Bot, Send, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { getBotReply, quickReplies, welcomeReply, type BotAction, type BotContext } from "@/lib/chatbot-knowledge";
import { buildWhatsAppLink, defaultEnquiryMessage } from "@/lib/whatsapp";
import { useAnalytics } from "@/lib/analytics";
import { cn } from "@/lib/utils";

interface ChatMessage {
  role: "user" | "bot";
  text: string;
  action?: BotAction;
}

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [hintDismissed, setHintDismissed] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>(quickReplies);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const contextRef = useRef<BotContext>({});
  const scrollRef = useRef<HTMLDivElement>(null);
  const track = useAnalytics();

  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (!hintDismissed && !isOpen) setShowHint(true);
    }, 1800);
    return () => window.clearTimeout(timer);
  }, [hintDismissed, isOpen]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isTyping]);

  function respond(question: string) {
    setMessages((prev) => [...prev, { role: "user", text: question }]);
    setIsTyping(true);
    const reply = getBotReply(question, contextRef.current);
    contextRef.current = { lastIntent: reply.intent, lastProductId: reply.productId ?? contextRef.current.lastProductId };
    track("chatbot_message", { intent: reply.intent });

    const delay = Math.min(1400, 450 + reply.text.length * 4);
    setTimeout(() => {
      setMessages((prev) => [...prev, { role: "bot", text: reply.text, action: reply.action }]);
      setSuggestions(reply.suggestions.length ? reply.suggestions : quickReplies);
      setIsTyping(false);
    }, delay);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isTyping) return;
    setInput("");
    respond(trimmed);
  }

  function handleOpen() {
    if (messages.length === 0) setMessages([{ role: "bot", text: welcomeReply().text }]);
    setIsOpen(true);
    setShowHint(false);
    setHintDismissed(true);
    track("chatbot_opened");
  }

  return (
    <>
      {/* Right-side dock: WhatsApp ABOVE, AI chat BELOW — hide while panel is open so they don't collide */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-3 md:bottom-8 md:right-8"
          >
            {/* Contact support — opens WhatsApp */}
            <a
              href={buildWhatsAppLink(defaultEnquiryMessage())}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Contact support on WhatsApp"
              className="flex h-14 w-14 items-center justify-center rounded-full bg-forest text-white shadow-lg ring-1 ring-white/30 transition-transform hover:scale-105 hover:bg-forest-deep hover:shadow-xl"
            >
              <WhatsAppLogo className="h-6 w-6" />
            </a>

            <div className="relative flex items-center justify-end">
              <AnimatePresence>
                {showHint && (
                  <motion.button
                    type="button"
                    initial={{ opacity: 0, x: 12, scale: 0.96 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: 8, scale: 0.96 }}
                    onClick={handleOpen}
                    className="absolute right-[4.25rem] mr-1 hidden max-w-[min(220px,calc(100vw-7rem))] whitespace-nowrap xl:block rounded-2xl rounded-br-sm bg-white px-3.5 py-2.5 text-left text-sm font-medium text-forest shadow-[0_12px_40px_-16px_rgba(0,0,0,0.35)] ring-1 ring-black/5"
                  >
                    Hi! Ask me for help
                    <span
                      aria-hidden="true"
                      className="absolute -right-1.5 bottom-2 h-3 w-3 rotate-45 bg-white ring-1 ring-black/5"
                    />
                  </motion.button>
                )}
              </AnimatePresence>

              <button
                type="button"
                onClick={handleOpen}
                aria-label="Open chat bot"
                className="relative flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-all hover:scale-105 hover:shadow-xl"
              >
                <Bot className="h-6 w-6" />
                <span className="absolute -top-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-forest-deep ring-2 ring-white" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.97 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            role="dialog"
            aria-label="Chat assistant"
            className="surface-scope fixed z-50 bottom-0 right-0 left-0 sm:left-auto sm:bottom-6 sm:right-6 w-full sm:w-[380px] sm:max-h-[600px] h-[85dvh] sm:h-[600px] bg-surface text-surface-foreground border border-border sm:rounded-3xl rounded-t-3xl shadow-2xl flex flex-col overflow-hidden"
          >
            <div className="bg-forest-deep text-white px-5 py-4 flex items-center justify-between shrink-0">
              <div>
                <p className="font-heading font-semibold tracking-tight text-lg leading-tight">Ask TheRootFood</p>
                <p className="flex items-center gap-1.5 text-white/70 text-xs"><span className="h-2 w-2 rounded-full bg-[#25D366]" />Online · replies instantly</p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                aria-label="Close chat"
                className="h-9 w-9 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
              {messages.map((msg, i) => (
                <div key={i} className={cn("flex items-end gap-2", msg.role === "user" ? "justify-end" : "justify-start")}>
                  {msg.role === "bot" && (
                    <span className="mb-0.5 flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white ring-1 ring-border">
                      <Image src="/rootfood-mark.webp" alt="" width={24} height={24} />
                    </span>
                  )}
                  <div className={cn("flex max-w-[82%] flex-col gap-2", msg.role === "user" ? "items-end" : "items-start")}>
                    <div
                      className={cn(
                        "rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-line",
                        msg.role === "user"
                          ? "bg-forest text-white rounded-br-md"
                          : "bg-muted text-foreground rounded-bl-md"
                      )}
                    >
                      {msg.text}
                    </div>
                    {msg.action &&
                      (msg.action.external ? (
                        <a
                          href={msg.action.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => track("chatbot_whatsapp_handoff")}
                          className="inline-flex items-center gap-1.5 rounded-full bg-[#25D366] px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-[#1ebe5b]"
                        >
                          <WhatsAppLogo className="h-3.5 w-3.5" />
                          {msg.action.label}
                        </a>
                      ) : (
                        <Link
                          href={msg.action.href}
                          onClick={() => setIsOpen(false)}
                          className="inline-flex items-center gap-1.5 rounded-full border border-forest/30 px-3.5 py-1.5 text-xs font-semibold text-forest hover:bg-forest hover:text-white"
                        >
                          {msg.action.label}
                          <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                      ))}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-3 flex gap-1.5">
                    {[0, 1, 2].map((d) => (
                      <span
                        key={d}
                        className="h-1.5 w-1.5 rounded-full bg-muted-foreground/50 animate-bounce"
                        style={{ animationDelay: `${d * 120}ms` }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="px-4 pb-2 flex gap-2 overflow-x-auto shrink-0 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {suggestions.map((qr) => (
                <button
                  key={qr}
                  disabled={isTyping}
                  onClick={() => respond(qr)}
                  className="shrink-0 text-xs font-medium border border-border rounded-full px-3 py-1.5 text-muted-foreground hover:border-primary-dark hover:text-surface-foreground transition-colors"
                >
                  {qr}
                </button>
              ))}
            </div>

            <div className="px-4 pb-2 shrink-0">
              <a
                href={buildWhatsAppLink(defaultEnquiryMessage())}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => track("chatbot_whatsapp_handoff")}
                className="block text-center text-xs font-medium text-surface-foreground/70 hover:underline py-1"
              >
                Prefer a human? Continue on WhatsApp
              </a>
            </div>

            <form onSubmit={handleSubmit} className="border-t border-border p-3 flex gap-2 shrink-0 bg-surface">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Say hi, or ask about eggs, cakes, delivery…"
                aria-label="Type your question"
                className="flex-1 h-11 rounded-full border border-border bg-background px-4 text-base sm:text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              />
              <button
                type="submit"
                aria-label="Send message"
                disabled={!input.trim() || isTyping}
                className="h-11 w-11 rounded-full bg-primary text-primary-foreground flex items-center justify-center disabled:opacity-40 transition-opacity shrink-0"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
