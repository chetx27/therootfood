import { describe, it, expect } from "vitest";
import { getBotReply } from "@/lib/chatbot-knowledge";

const opts = { pick: <T,>(o: T[]) => o[0], hour: 10 };
const ask = (msg: string, ctx = {}) => getBotReply(msg, ctx, opts);

describe("chatbot", () => {
  it.each(["hello", "Hi!", "hey there", "namaste", "good evening", "helo"])("greets back for %s", (msg) => {
    const r = ask(msg);
    expect(r.intent).toBe("greeting");
    expect(r.text).toContain("Good morning");
  });

  it("does not treat 'shipping' as a greeting", () => {
    expect(ask("do you do shipping").intent).toBe("delivery");
  });

  it("answers a greeting plus a question", () => {
    const r = ask("hi, do you deliver to Chennai?");
    expect(r.intent).toBe("delivery");
    expect(r.text.startsWith("Good morning!")).toBe(true);
  });

  it.each([
    ["thank you so much", "thanks"],
    ["how are you", "how-are-you"],
    ["are you a bot", "who-are-you"],
    ["bye", "bye"],
    ["how do I pay, gpay ok?", "payment"],
    ["I want a birthday cake", "cakes"],
    ["we run a restaurant and need wholesale", "bulk"],
    ["how do i order", "how-to-order"],
    ["my order hasn't arrived, where is my order", "order-status"],
    ["is it organic? any chemicals", "fresh"],
  ])("%s → %s", (msg, intent) => {
    expect(ask(msg).intent).toBe(intent);
  });

  it("recognises products, including typos", () => {
    expect(ask("tell me about your eggs").productId).toBe("country-eggs");
    expect(ask("do you have mutton").productId).toBe("goat-meat");
    expect(ask("vetivar roots").productId).toBe("vetiver-roots");
  });

  it("answers product price directly", () => {
    expect(ask("how much is ragi flour").text).toContain("₹249");
  });

  it("handles follow-up price questions using context", () => {
    const first = ask("tell me about the eggs");
    const r = ask("how much is it?", { lastProductId: first.productId });
    expect(r.text).toContain("₹309");
  });

  it("falls back gracefully with a WhatsApp handoff", () => {
    const r = ask("qwerty zxcv");
    expect(r.intent).toBe("fallback");
    expect(r.action?.external).toBe(true);
  });
});
