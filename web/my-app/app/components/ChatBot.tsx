"use client";

import { useEffect, useState } from "react";

type Msg = {
  from: "user" | "bot";
  message: string;
};

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [typing, setTyping] = useState(false);

  /* ================= GREETING ================= */

  useEffect(() => {
    if (open && msgs.length === 0) {
      setTimeout(() => {
        setMsgs([
          {
            from: "bot",
            message:
              "👋 Hello! Welcome to SentinelX.\nI'm here to assist you with safety, emergencies, or SOS support.\n\nHow can I help you today?",
          },
        ]);
      }, 600);
    }
  }, [open]);

  /* ================= SMART INTENT DETECTION ================= */

  function detectIntent(text: string) {
    const t = text.toLowerCase();

    const emergencyWords = [
      "unsafe",
      "danger",
      "hurt",
      "attack",
      "fire",
      "accident",
      "help me",
      "i am scared",
      "emergency",
    ];

    const sosWords = ["sos", "alert", "send help", "panic"];

    const infoWords = ["what", "how", "where", "guide", "do i"];

    if (emergencyWords.some((w) => t.includes(w))) {
      return "emergency";
    }

    if (sosWords.some((w) => t.includes(w))) {
      return "sos";
    }

    if (infoWords.some((w) => t.includes(w))) {
      return "info";
    }

    return "general";
  }

  function generateReply(intent: string) {
    switch (intent) {
      case "emergency":
        return "🚨 It sounds like you're in danger.\nPlease press the SOS button immediately.\n\nStay calm and move to a safe location if possible.";
      case "sos":
        return "🆘 The SOS feature sends your location and contact details to emergency responders.\nUse it if you feel unsafe.";
      case "info":
        return "📘 I can guide you through safety steps. Tell me what situation you're facing.";
      default:
        return "🤖 I'm here to help with safety guidance or emergency support.\nYou can describe what's happening.";
    }
  }

  /* ================= SEND MESSAGE ================= */

  const send = async () => {
    if (!input.trim()) return;

    const userMsg: Msg = { from: "user", message: input };
    setMsgs((m) => [...m, userMsg]);
    setInput("");

    const intent = detectIntent(input);

    setTyping(true);

    setTimeout(() => {
      const botMsg: Msg = {
        from: "bot",
        message: generateReply(intent),
      };

      setMsgs((m) => [...m, botMsg]);
      setTyping(false);
    }, 1200); // delay for realism
  };

  /* ================= UI ================= */

  return (
    <>
      {open && (
        <div className="fixed bottom-20 right-6 z-50 w-80 rounded-2xl bg-black border border-red-500 shadow-xl flex flex-col">

          {/* Header */}
          <div className="px-4 py-3 border-b border-red-500 text-red-400 font-semibold">
            SentinelX Assistant
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 space-y-3 overflow-y-auto text-sm">
            {msgs.map((m, i) => (
              <div
                key={i}
                className={`max-w-[75%] whitespace-pre-line px-3 py-2 rounded-2xl ${
                  m.from === "user"
                    ? "bg-red-500 text-black ml-auto"
                    : "bg-gray-800 text-gray-200"
                }`}
              >
                {m.message}
              </div>
            ))}

            {typing && (
              <div className="bg-gray-800 text-gray-300 px-3 py-2 rounded-2xl w-fit">
                Typing...
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-3 border-t border-gray-800 flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Describe your situation..."
              className="flex-1 rounded-full bg-gray-900 px-4 py-2 text-sm text-white outline-none"
            />
            <button
              onClick={send}
              className="rounded-full bg-red-500 px-4 py-2 text-black text-sm"
            >
              Send
            </button>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 rounded-full bg-red-500 p-4 text-black shadow-lg"
      >
        💬
      </button>
    </>
  );
}
