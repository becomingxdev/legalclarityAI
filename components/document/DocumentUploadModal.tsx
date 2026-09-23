"use client";

import React, { useState, useRef } from "react";
import { UploadCloud, FileText, X, AlertCircle, Loader2, Sparkles } from "lucide-react";
import { LegalDocument } from "@/types/legal";
import { chunkLegalDocument } from "@/lib/pdf/chunker";
import { generateHeuristicAnalysis } from "@/lib/ai/heuristics";
import { saveDocument } from "@/lib/storage/documentStore";

interface DocumentUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDocumentAdded: (doc: LegalDocument) => void;
}

export const DocumentUploadModal: React.FC<DocumentUploadModalProps> = ({
  isOpen,
  onClose,
  onDocumentAdded,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [textInput, setTextInput] = useState("");
  const [title, setTitle] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      setFile(droppedFile);
      if (!title) setTitle(droppedFile.name.replace(/\.[^/.]+$/, ""));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      setFile(selected);
      if (!title) setTitle(selected.name.replace(/\.[^/.]+$/, ""));
    }
  };

  const handleProcess = async () => {
    if (!file && !textInput.trim()) {
      setError("Please select a file or paste document text");
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      let rawText = textInput;
      let fileSize = textInput.length;
      let fileName = `${(title || "Document").replace(/\s+/g, "_")}.txt`;

      if (file) {
        fileName = file.name;
        fileSize = file.size;

        // Try server upload route first
        const formData = new FormData();
        formData.append("file", file);
        formData.append("title", title || file.name);

        try {
          const res = await fetch("/api/documents/upload", {
            method: "POST",
            body: formData,
          });

          if (res.ok) {
            const data = await res.json();
            rawText = data.rawText;
          } else {
            // Read client side if server route had parse issue
            rawText = await file.text();
          }
        } catch {
          rawText = await file.text();
        }
      }

      if (!rawText.trim()) {
        throw new Error("Unable to extract text from the document. Please paste the text directly.");
      }

      const docTitle = title.trim() || (file ? file.name : "Legal Document");
      const docId = "doc-" + Date.now();
      const chunks = chunkLegalDocument(rawText, docId);

      // Perform legal analysis
      let analysis = generateHeuristicAnalysis(docTitle, rawText);

      // Attempt AI enhancement if online
      try {
        const analyzeRes = await fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title: docTitle, rawText, chunks }),
        });
        if (analyzeRes.ok) {
          const resJson = await analyzeRes.json();
          if (resJson.analysis) {
            analysis = resJson.analysis;
          }
        }
      } catch (aiErr) {
        console.warn("AI analysis fallback:", aiErr);
      }

      const newDoc: LegalDocument = {
        id: docId,
        userId: "usr-demo-12345",
        title: docTitle,
        fileName,
        fileSize,
        uploadDate: new Date().toISOString(),
        pageCount: Math.max(1, chunks[chunks.length - 1]?.pageNumber || 1),
        rawText,
        chunks,
        analysis,
        status: "ready",
        chatHistory: [
          {
            id: "msg-init",
            sender: "ai",
            text: `Analysis complete for **${docTitle}**. You can explore the 8 tabs above or ask any grounded question below.`,
            timestamp: new Date().toISOString(),
            suggestedFollowUps: [
              "What are my main obligations?",
              "What are the termination terms?",
              "Are there any financial penalties?",
            ],
          },
        ],
      };

      saveDocument(newDoc);
      onDocumentAdded(newDoc);
      onClose();
    } catch (err: unknown) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Failed to process document");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900 sm:p-8">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
            <UploadCloud className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Upload Legal Document
            </h3>
            <p className="text-xs text-slate-500">
              Upload PDF, contract text, or agreement to generate instant plain-English analysis
            </p>
          </div>
        </div>

        {error && (
          <div className="mt-4 flex items-center gap-2 rounded-xl bg-rose-50 p-3 text-xs text-rose-700 dark:bg-rose-950/40 dark:text-rose-300">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="mt-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Document Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Master Services Agreement 2025"
              className="mt-1.5 w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>

          {/* Drag & Drop File Zone */}
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`cursor-pointer rounded-2xl border-2 border-dashed p-6 text-center transition ${
              dragActive
                ? "border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/20"
                : "border-slate-300 hover:border-indigo-400 dark:border-slate-700 dark:hover:border-slate-600"
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.txt,.md,.doc,.docx"
              onChange={handleFileChange}
              className="hidden"
            />
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 dark:bg-slate-800 dark:text-indigo-400">
              <UploadCloud className="h-6 w-6" />
            </div>
            {file ? (
              <div className="mt-3">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  <FileText className="h-3.5 w-3.5" />
                  {file.name} ({(file.size / 1024).toFixed(1)} KB)
                </span>
                <p className="mt-1 text-[11px] text-slate-500">Click to choose another file</p>
              </div>
            ) : (
              <div className="mt-3">
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Drag and drop your PDF or document here, or <span className="text-indigo-600 font-semibold underline">browse</span>
                </p>
                <p className="mt-1 text-xs text-slate-400">Supports PDF, Markdown, and TXT files</p>
              </div>
            )}
          </div>

          {/* Alternative: Paste Direct Text */}
          <div>
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Or Paste Agreement Text
              </label>
              <span className="text-[11px] text-slate-400">Optional text fallback</span>
            </div>
            <textarea
              rows={4}
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="Paste contract provisions, clauses, or agreement text here..."
              className="mt-1.5 w-full rounded-xl border border-slate-300 p-3 text-xs focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3 border-t border-slate-100 pt-4 dark:border-slate-800">
          <button
            onClick={onClose}
            disabled={isUploading}
            className="rounded-xl border border-slate-300 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300"
          >
            Cancel
          </button>
          <button
            onClick={handleProcess}
            disabled={isUploading || (!file && !textInput.trim())}
            className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-semibold text-white shadow-md hover:bg-indigo-500 disabled:opacity-50"
          >
            {isUploading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Analyzing Document...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Analyze Document
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
