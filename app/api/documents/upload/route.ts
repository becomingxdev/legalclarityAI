import { NextRequest, NextResponse } from "next/server";
import { chunkLegalDocument } from "@/lib/pdf/chunker";

/** Maximum permitted upload file size: 10MB (DoS defense) */
const MAX_FILE_BYTES = 10 * 1024 * 1024;
/** Maximum permitted text characters: 500,000 (prevents memory & token exhaustion) */
const MAX_TEXT_CHARS = 500_000;
/** Maximum title length */
const MAX_TITLE_CHARS = 200;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const directText = formData.get("text") as string | null;
    const rawTitle = (formData.get("title") as string) || (file ? file.name.replace(/\.[^/.]+$/, "") : "Untitled Legal Document");
    const title = rawTitle.slice(0, MAX_TITLE_CHARS).trim() || "Untitled Legal Document";

    // ── Hard Bounds / DoS Defense ─────────────────────────────────────────────
    if (file && file.size > MAX_FILE_BYTES) {
      return NextResponse.json(
        { error: "File exceeds maximum permitted upload limit of 10MB" },
        { status: 413 }
      );
    }

    if (directText && directText.length > MAX_TEXT_CHARS) {
      return NextResponse.json(
        { error: `Document text exceeds maximum permitted limit of ${MAX_TEXT_CHARS.toLocaleString()} characters` },
        { status: 413 }
      );
    }
    // ─────────────────────────────────────────────────────────────────────────

    let rawText = "";

    if (file) {
      const buffer = Buffer.from(await file.arrayBuffer());
      if (buffer.byteLength > MAX_FILE_BYTES) {
        return NextResponse.json(
          { error: "File buffer exceeds maximum permitted upload limit of 10MB" },
          { status: 413 }
        );
      }

      const isPdf = file.name.toLowerCase().endsWith(".pdf") || file.type.includes("pdf");

      if (isPdf) {
        try {
          // Use standard (non-legacy) build — text extraction does NOT need canvas
          const pdfjsLib = await import("pdfjs-dist/build/pdf.js");
          const uint8Array = new Uint8Array(buffer);
          const loadingTask = pdfjsLib.getDocument({
            data: uint8Array,
            disableFontFace: true,
            verbosity: 0,
          });
          const pdfDocument = await loadingTask.promise;
          const numPages = pdfDocument.numPages;
          const pageTexts: string[] = [];
          for (let i = 1; i <= numPages; i++) {
            const page = await pdfDocument.getPage(i);
            const textContent = await page.getTextContent();
            const pageStr = textContent.items
              .map((item: { str: string }) => item.str)
              .join(" ");
            pageTexts.push(`--- Page ${i} ---\n${pageStr}`);
          }
          rawText = pageTexts.join("\n\n");
        } catch (pdfErr) {
          console.warn("pdfjs-dist failed, using ASCII fallback:", pdfErr);
          rawText = buffer.toString("latin1").replace(/[^\x20-\x7E\n\r\t]/g, " ").replace(/ {3,}/g, "  ");
        }
      } else {
        // Plain text / Markdown
        rawText = buffer.toString("utf-8");
      }
    } else if (directText) {
      rawText = directText;
    } else {
      return NextResponse.json({ error: "No file or text content provided" }, { status: 400 });
    }

    if (!rawText.trim()) {
      return NextResponse.json({ error: "Extracted document text was empty" }, { status: 400 });
    }

    if (rawText.length > MAX_TEXT_CHARS) {
      return NextResponse.json(
        { error: `Extracted text (${rawText.length.toLocaleString()} chars) exceeds maximum permitted limit of ${MAX_TEXT_CHARS.toLocaleString()} characters` },
        { status: 413 }
      );
    }

    const documentId = "doc-" + Date.now();
    const chunks = chunkLegalDocument(rawText, documentId);

    return NextResponse.json({
      success: true,
      documentId,
      title,
      fileName: file ? file.name : `${title.replace(/\s+/g, "_")}.txt`,
      fileSize: file ? file.size : Buffer.byteLength(rawText),
      rawText,
      chunks,
      pageCount: Math.max(1, chunks[chunks.length - 1]?.pageNumber || 1),
    });
  } catch (error: unknown) {
    console.error("API /api/documents/upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload and parse document", details: String(error) },
      { status: 500 }
    );
  }
}
