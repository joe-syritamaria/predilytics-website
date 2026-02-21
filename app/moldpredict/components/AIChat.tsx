"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Role = "user" | "assistant" | "typing";

interface Message {
  role: Role;
  content: string;
  showFeedback?: boolean;
}

interface AIChatProps {
  triggerOpen?: boolean; // open automatically when true
}

export default function AIChat({ triggerOpen }: AIChatProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const messagesRef = useRef<HTMLDivElement>(null);

  // Open chat and add greeting when triggerOpen is true
  useEffect(() => {
    if (triggerOpen && messages.length === 0) {
      setTimeout(() => {
        setIsOpen(true);
        setMessages([
          {
            role: "assistant",
            content:
              "Hi 👋 I’m <strong>Moth AI</strong>, here to assist you with MoldPredict. Ask me anything!",
            showFeedback: false,
          },
        ]);
      }, 400); // delay slightly after intro
    }
  }, [triggerOpen, messages.length]);

  // Auto-scroll
  useEffect(() => {
    messagesRef.current?.scrollTo({
      top: messagesRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");

    const typingMessage: Message = { role: "typing", content: "" };
    setMessages(prev => [...prev, typingMessage]);

    const res = await fetch("/api/ai-chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: input }),
    });
    const data = await res.json();

    setTimeout(() => {
      const assistantMessage: Message = {
        role: "assistant",
        content: data.reply,
        showFeedback: true,
      };
      setMessages(prev =>
        prev.filter(m => m.role !== "typing").concat(assistantMessage)
      );
    }, 1200);
  };

  const handleFeedback = (helpful: boolean) => {
    console.log("Moth AI feedback:", helpful ? "Helpful" : "Not helpful");
  };

  return (
    <AnimatePresence>
      {!isOpen && (
        <motion.button
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 bg-blue-600 text-white rounded-full p-4 shadow-lg hover:bg-blue-700 transition"
        >
          💬
        </motion.button>
      )}

      {isOpen && (
        <motion.div
          initial={{ y: 120, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 120, opacity: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="fixed bottom-6 right-6 w-80 bg-[rgb(var(--card))] border rounded-xl shadow-lg flex flex-col z-50"
        >
          {/* Header */}
          <div className="p-3 border-b font-semibold flex justify-between">
            Moth AI
            <button onClick={() => setIsOpen(false)}>✕</button>
          </div>

          {/* Messages */}
          <div
            ref={messagesRef}
            className="flex-1 p-3 space-y-3 overflow-y-auto max-h-80"
          >
            {messages.map((m, i) => {
              if (m.role === "typing") return <TypingBubble key={i} />;

              return (
                <div key={i}>
                  {m.role === "assistant" ? (
                    <div
                      className="p-2 rounded-lg text-sm bg-[rgb(var(--input))] text-[rgb(var(--foreground))]"
                      dangerouslySetInnerHTML={{ __html: m.content }}
                    />
                  ) : (
                    <div className="p-2 rounded-lg text-sm bg-blue-100 text-blue-900 text-right">
                      {m.content}
                    </div>
                  )}

                  {m.showFeedback && (
                    <div className="mt-1 text-xs text-gray-500">
                      Was this helpful?
                      <button
                        onClick={() => handleFeedback(true)}
                        className="ml-2 text-blue-600"
                      >
                        👍 Yes
                      </button>
                      <button
                        onClick={() => handleFeedback(false)}
                        className="ml-2 text-gray-400"
                      >
                        👎 No
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
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
  );
}

/* 🔵 Three-dot typing animation */
function TypingBubble() {
  return (
    <div className="bg-[rgb(var(--input))] px-3 py-2 rounded-lg w-fit">
      <div className="flex gap-1">
        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0ms]" />
        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:150ms]" />
        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:300ms]" />
      </div>
    </div>
  );
}

