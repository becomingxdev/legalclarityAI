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
          const pdfjsLib = require("pdfjs-dist/legacy/build/pdf.js");
          const uint8Array = new Uint8Array(buffer);
          
          const loadingTask = pdfjsLib.getDocument({
            data: uint8Array,
            disableFontFace: true,
            standardFontDataUrl: "node_modules/pdfjs-dist/standard_fonts/",
          });
          
          const pdfDocument = await loadingTask.promise;
          const numPages = pdfDocument.numPages;
          let extractedText = "";

          for (let i = 1; i <= numPages; i++) {
            const page = await pdfDocument.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items.map((item: any) => item.str).join(" ");
            extractedText += pageText + "\n\n";
          }
          
          rawText = extractedText;
        } catch (pdfErr) {
          console.warn("pdfjs-dist failed, fallback to raw text:", pdfErr);
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
