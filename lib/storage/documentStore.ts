import { LegalDocument } from "@/types/legal";
import { db, auth } from "@/lib/firebase/config";
import {
  collection,
  doc as firestoreDoc,
  setDoc,
  getDoc,
  getDocs,
  deleteDoc,
} from "firebase/firestore";

const DB_NAME = "LegalClarityDB";
const STORE_NAME = "documents";
const DB_VERSION = 1;

// ─── IndexedDB Local Cache Layer ─────────────────────────────────────────────
function getDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") {
      reject(new Error("No window"));
      return;
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = (e) => {
      const idb = (e.target as IDBOpenDBRequest).result;
      if (!idb.objectStoreNames.contains(STORE_NAME)) {
        idb.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    };
  });
}

async function loadFromIDB(): Promise<LegalDocument[]> {
  try {
    const idb = await getDb();
    return new Promise((resolve, reject) => {
      const tx = idb.transaction(STORE_NAME, "readonly");
      const store = tx.objectStore(STORE_NAME);
      const req = store.getAll();
      req.onsuccess = () => {
        const docs = (req.result || []) as LegalDocument[];
        docs.sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime());
        resolve(docs);
      };
      req.onerror = () => reject(req.error);
    });
  } catch (e) {
    console.warn("IDB load error", e);
    return [];
  }
}

async function saveToIDB(document: LegalDocument): Promise<void> {
  try {
    const idb = await getDb();
    return new Promise((resolve, reject) => {
      const tx = idb.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);
      const req = store.put(document);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (e) {
    console.warn("IDB save error", e);
  }
}

async function deleteFromIDB(id: string): Promise<void> {
  try {
    const idb = await getDb();
    return new Promise((resolve, reject) => {
      const tx = idb.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);
      const req = store.delete(id);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (e) {
    console.warn("IDB delete error", e);
  }
}

// ─── Firestore Helpers ───────────────────────────────────────────────────────
// Firestore has a 1MB limit per document and disallows `undefined` values.
function sanitizeForFirestore(docData: LegalDocument) {
  const safeCopy = JSON.parse(JSON.stringify(docData));
  if (typeof safeCopy.rawText === "string" && safeCopy.rawText.length > 300000) {
    safeCopy.rawText = safeCopy.rawText.slice(0, 300000) + "\n...[truncated for cloud storage]";
  }
  return safeCopy;
}

function getActiveUserId(explicitUserId?: string): string | null {
  return explicitUserId || auth.currentUser?.uid || null;
}

// ─── Public Store API ────────────────────────────────────────────────────────

/**
 * Loads documents for the current user from Firebase Firestore (`users/{userId}/documents`).
 * Falls back seamlessly to IndexedDB if offline or unauthenticated.
 */
export async function loadUserDocuments(userId?: string): Promise<LegalDocument[]> {
  if (typeof window === "undefined") return [];

  const uid = getActiveUserId(userId);

  // If user is logged in, try loading from Firestore
  if (uid && db) {
    try {
      const colRef = collection(db, "users", uid, "documents");
      const snap = await getDocs(colRef);
      if (!snap.empty) {
        const firestoreDocs: LegalDocument[] = [];
        snap.forEach((d) => {
          firestoreDocs.push(d.data() as LegalDocument);
        });
        firestoreDocs.sort(
          (a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime()
        );

        // Update local IndexedDB cache in background
        for (const doc of firestoreDocs) {
          saveToIDB(doc).catch(() => {});
        }
        return firestoreDocs;
      }
    } catch (err) {
      console.warn("Firestore fetch error, falling back to local storage:", err);
    }
  }

  // Fallback to local IndexedDB
  return loadFromIDB();
}

/**
 * Retrieves a document by its ID from Firestore first, then IndexedDB.
 */
export async function getDocumentById(id: string, userId?: string): Promise<LegalDocument | undefined> {
  if (typeof window === "undefined") return undefined;

  const uid = getActiveUserId(userId);

  if (uid && db) {
    try {
      const docRef = firestoreDoc(db, "users", uid, "documents", id);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        const docData = snap.data() as LegalDocument;
        saveToIDB(docData).catch(() => {});
        return docData;
      }
    } catch (err) {
      console.warn("Firestore getDoc error, falling back to local:", err);
    }
  }

  // Fallback to local IndexedDB
  const idbDocs = await loadFromIDB();
  return idbDocs.find((d) => d.id === id);
}

/**
 * Saves a document both to the user's Firebase Firestore collection
 * (`users/{userId}/documents/{docId}`) and to IndexedDB for offline capability.
 */
export async function saveDocument(document: LegalDocument, userId?: string): Promise<void> {
  if (typeof window === "undefined") return;

  // 1. Always save to local IndexedDB immediately
  await saveToIDB(document);

  // 2. Persist to Firebase Firestore under the user's document collection
  const uid = getActiveUserId(userId || document.userId);
  if (uid && db) {
    try {
      const sanitized = sanitizeForFirestore({
        ...document,
        userId: uid,
      });
      const docRef = firestoreDoc(db, "users", uid, "documents", document.id);
      await setDoc(docRef, sanitized, { merge: true });
    } catch (err) {
      console.error("Failed to save document to Firebase Firestore:", err);
    }
  }
}

/**
 * Deletes a document from Firestore and IndexedDB.
 */
export async function deleteDocumentById(id: string, userId?: string): Promise<void> {
  if (typeof window === "undefined") return;

  // 1. Delete from local cache
  await deleteFromIDB(id);

  // 2. Delete from Firestore
  const uid = getActiveUserId(userId);
  if (uid && db) {
    try {
      const docRef = firestoreDoc(db, "users", uid, "documents", id);
      await deleteDoc(docRef);
    } catch (err) {
      console.error("Failed to delete document from Firebase Firestore:", err);
    }
  }
}

/**
 * Seeds high-quality demo contracts (Employment Agreement, SaaS v1, and SaaS v2 Redline)
 * so users and judges can test all 8 capabilities and contract comparison instantly.
 */
export async function seedSampleDocuments(userId?: string): Promise<LegalDocument[]> {
  const { chunkLegalDocument } = await import("@/lib/pdf/chunker");
  const { generateHeuristicAnalysis } = await import("@/lib/ai/heuristics");
  const {
    SAMPLE_EMPLOYMENT_AGREEMENT,
    SAMPLE_SAAS_CONTRACT,
    SAMPLE_REVISED_SAAS_CONTRACT,
  } = await import("@/lib/sample-data/sampleContracts");

  const samples = [
    SAMPLE_EMPLOYMENT_AGREEMENT,
    SAMPLE_SAAS_CONTRACT,
    SAMPLE_REVISED_SAAS_CONTRACT,
  ];

  const uid = getActiveUserId(userId) || "demo-user";
  const created: LegalDocument[] = [];

  for (const s of samples) {
    if (!s.rawText || !s.title || !s.id) continue;
    const chunks = chunkLegalDocument(s.rawText, s.id);
    const analysis = generateHeuristicAnalysis(s.title, s.rawText);

    const fullDoc: LegalDocument = {
      id: s.id,
      userId: uid,
      title: s.title,
      fileName: s.fileName || `${s.title}.pdf`,
      fileSize: s.fileSize || 500000,
      uploadDate: s.uploadDate || new Date().toISOString(),
      rawText: s.rawText,
      pageCount: s.pageCount || Math.max(1, chunks[chunks.length - 1]?.pageNumber || 1),
      chunks,
      analysis,
      status: "ready",
      chatHistory: [
        {
          id: `msg-${s.id}-init`,
          sender: "ai",
          text: `Analysis complete for **${s.title}**. You can explore the simplified breakdown, review flagged risks and checklist items, or ask questions grounded in this document's text.`,
          timestamp: new Date().toISOString(),
          suggestedFollowUps: [
            "Can I terminate this agreement early?",
            "What notice period is required?",
            "What are the payment penalties?",
            "What are my confidentiality obligations?",
          ],
        },
      ],
    };

    await saveDocument(fullDoc, uid);
    created.push(fullDoc);
  }

  return created;
}
