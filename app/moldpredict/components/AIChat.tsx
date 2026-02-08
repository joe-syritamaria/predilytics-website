"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Role = "user" | "assistant" | "typing";

interface Message {
  role: Role;
  content: string;
  showFeedback?: boolean;
}

export default function AIChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasAutoOpened, setHasAutoOpened] = useState(false);

  // Auto-slide in once after page load
  useEffect(() => {
    if (hasAutoOpened) return;

    const t = setTimeout(() => {
      setIsOpen(true);
      setHasAutoOpened(true);
    }, 2500);

    return () => clearTimeout(t);
  }, [hasAutoOpened]);

  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hi 👋 I’m <strong>Moth AI</strong>, here to help with MoldPredict and Predilytics. Ask me anything!",
    },
  ]);

  const [input, setInput] = useState("");
  const messagesRef = useRef<HTMLDivElement>(null);

  // Auto-scroll
  useEffect(() => {
    messagesRef.current?.scrollTo({
      top: messagesRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  async function sendMessage() {
    if (!input.trim()) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");

    setMessages(prev => [...prev, { role: "typing", content: "" }]);

    const res = await fetch("/api/ai-chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: input }),
    });

    const data = await res.json();

    setTimeout(() => {
      setMessages(prev =>
        prev.filter(m => m.role !== "typing").concat({
          role: "assistant",
          content: data.reply,
          showFeedback: true,
        })
      );
    }, 1200);
  }

  return (
    <>
      {/* Floating button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 bg-blue-600 text-white px-4 py-3 rounded-full shadow-lg hover:bg-blue-700 transition"
        >
          🤖 Chat
        </button>
      )}

      {/* Chat panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="fixed bottom-6 right-6 w-80 bg-white border rounded-xl shadow-lg flex flex-col z-50"
          >
            {/* Header */}
            <div className="p-3 border-b font-semibold text-blue-700 flex justify-between">
              Moth AI
              <button onClick={() => setIsOpen(false)}>✕</button>
            </div>

            {/* Messages */}
            <div
              ref={messagesRef}
              className="flex-1 p-3 space-y-3 overflow-y-auto max-h-80"
            >
              {messages.map((m, i) =>
                m.role === "typing" ? (
                  <TypingBubble key={i} />
                ) : (
                  <div key={i}>
                    {m.role === "assistant" ? (
                      <div
                        className="p-2 rounded-lg text-sm bg-gray-100"
                        dangerouslySetInnerHTML={{ __html: m.content }}
                      />
                    ) : (
                      <div className="p-2 rounded-lg text-sm bg-blue-100 text-right">
                        {m.content}
                      </div>
                    )}

                  </div>
                )
              )}
            </div>

            {/* Input */}
            <div className="p-2 border-t flex gap-2">
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && sendMessage()}
                className="flex-1 border rounded-lg px-3 py-2 text-sm"
                placeholder="Ask something…"
              />
              <button
                onClick={sendMessage}
                className="bg-blue-600 text-white px-3 rounded-lg"
              >
                Send
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function TypingBubble() {
  return (
    <div className="bg-gray-100 px-3 py-2 rounded-lg w-fit">
      <div className="flex gap-1">
        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:150ms]" />
        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:300ms]" />
      </div>
    </div>
  );
}
