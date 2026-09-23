"use client";

import React, { useState, useRef, useEffect } from "react";
import { LegalDocument, ChatMessage } from "@/types/legal";
import {
  Send,
  Sparkles,
  User,
  Bot,
  FileText,
  Loader2,
  ExternalLink,
  ChevronRight,
} from "lucide-react";
import { saveDocument } from "@/lib/storage/documentStore";

interface ChatTabProps {
  document: LegalDocument;
  onNavigateToChunk?: (page: number, section: string) => void;
}

export const ChatTab: React.FC<ChatTabProps> = ({ document, onNavigateToChunk }) => {
  const [messages, setMessages] = useState<ChatMessage[]>(document.chatHistory || []);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (questionText?: string) => {
    const q = (questionText || input).trim();
    if (!q || isLoading) return;

    const userMsg: ChatMessage = {
      id: "msg-" + Date.now(),
      sender: "user",
      text: q,
      timestamp: new Date().toISOString(),
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: q,
          chunks: document.chunks,
          previousMessages: newHistory.map((m) => ({
            role: m.sender === "user" ? "user" : "assistant",
            content: m.text,
          })),
        }),
      });

      if (!res.ok) {
        throw new Error("Chat response failed");
      }

      const data = await res.json();

      const aiMsg: ChatMessage = {
        id: "msg-" + (Date.now() + 1),
        sender: "ai",
        text: data.answer || "No response received.",
        timestamp: new Date().toISOString(),
        sources: data.sources || [],
        suggestedFollowUps: data.suggestedFollowUps || [],
      };

      const finalHistory = [...newHistory, aiMsg];
      setMessages(finalHistory);

      // Persist to document
      document.chatHistory = finalHistory;
      saveDocument(document);
    } catch (err) {
      console.error(err);
      const fallbackMsg: ChatMessage = {
        id: "msg-err-" + Date.now(),
        sender: "ai",
        text: "I experienced a connection issue while grounding your answer. Please review the cited provisions in the Sources tab.",
        timestamp: new Date().toISOString(),
      };
      setMessages([...newHistory, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const currentSuggested =
    messages[messages.length - 1]?.suggestedFollowUps || [
      "Can I terminate this agreement?",
      "What penalties exist?",
      "What are my obligations?",
      "Is there an auto-renewal clause?",
    ];

  return (
    <div className="flex flex-col h-[650px] rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/80 px-6 py-3.5 dark:border-slate-800 dark:bg-slate-800/50">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
            <Bot className="h-4 w-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">
              Document-Grounded Q&A (RAG)
            </h4>
            <p className="text-[10px] text-slate-500">
              Cites exact page, section, and clauses • Anti-hallucination enabled
            </p>
          </div>
        </div>

        <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
          Grounded in {document.chunks.length} Chunks
        </span>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-5">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 max-w-3xl ${
              msg.sender === "user" ? "ml-auto justify-end" : "justify-start"
            }`}
          >
            {msg.sender === "ai" && (
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-600 text-white">
                <Bot className="h-4 w-4" />
              </div>
            )}

            <div
              className={`rounded-2xl p-4 text-xs leading-relaxed ${
                msg.sender === "user"
                  ? "bg-indigo-600 text-white shadow-sm rounded-tr-none"
                  : "bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-100 border border-slate-200/60 dark:border-slate-700/60 rounded-tl-none"
              }`}
            >
              <div className="whitespace-pre-wrap font-sans">{msg.text}</div>

              {/* Source Citations */}
              {msg.sources && msg.sources.length > 0 && (
                <div className="mt-3.5 border-t border-slate-200/70 pt-3 dark:border-slate-700">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1.5">
                    Source Citations:
                  </span>
                  <div className="space-y-1.5">
                    {msg.sources.map((src, i) => (
                      <div
                        key={i}
                        className="rounded-lg bg-white/70 p-2 text-[11px] text-slate-700 dark:bg-slate-900/60 dark:text-slate-300 border border-slate-200/50 dark:border-slate-700"
                      >
                        <div className="flex items-center gap-1.5 font-semibold text-indigo-700 dark:text-indigo-400">
                          <FileText className="h-3 w-3" />
                          <span>Page {src.pageNumber}</span>
                          <span>•</span>
                          <span>{src.section}</span>
                          {src.clause && <span>• {src.clause}</span>}
                        </div>
                        <p className="mt-1 font-mono text-[10px] text-slate-500 italic">
                          "{src.quote}"
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {msg.sender === "user" && (
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                <User className="h-4 w-4" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
              <Bot className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-2 rounded-2xl bg-slate-100 p-4 text-xs text-slate-500 dark:bg-slate-800">
              <Loader2 className="h-4 w-4 animate-spin text-indigo-600" />
              <span>Retrieving relevant provisions and formulating answer...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Follow-Up Chips */}
      {currentSuggested.length > 0 && !isLoading && (
        <div className="border-t border-slate-100 bg-slate-50/50 px-6 py-2.5 dark:border-slate-800 dark:bg-slate-900/40">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            <span className="text-[10px] font-semibold text-slate-400 shrink-0">Suggestions:</span>
            {currentSuggested.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(q)}
                className="whitespace-nowrap rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[11px] text-slate-700 hover:border-indigo-400 hover:text-indigo-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:text-white"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="border-t border-slate-200 p-4 dark:border-slate-800 bg-white dark:bg-slate-900"
      >
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            placeholder="Ask anything about obligations, penalties, termination, or renewal..."
            className="flex-1 rounded-xl border border-slate-300 px-4 py-2.5 text-xs focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm hover:bg-indigo-500 disabled:opacity-50"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </form>
    </div>
  );
};
