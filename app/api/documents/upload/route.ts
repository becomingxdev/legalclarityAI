import { NextRequest, NextResponse } from "next/server";
import { chunkLegalDocument } from "@/lib/pdf/chunker";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const directText = formData.get("text") as string | null;
    const title = (formData.get("title") as string) || (file ? file.name.replace(/\.[^/.]+$/, "") : "Untitled Legal Document");

    let rawText = "";

    if (file) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const isPdf = file.name.toLowerCase().endsWith(".pdf") || file.type.includes("pdf");

      if (isPdf) {
        try {
          // Dynamic require or import of pdf-parse
          const pdfParse = require("pdf-parse");
          const pdfData = await pdfParse(buffer);
          rawText = pdfData.text || "";
        } catch (pdfErr) {
          console.warn("pdf-parse failed, attempting fallback text extraction:", pdfErr);
          rawText = buffer.toString("utf-8").replace(/[^\x20-\x7E\n\r]/g, " ");
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
