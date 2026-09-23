import { LegalDocument } from "@/types/legal";

const DB_NAME = "LegalClarityDB";
const STORE_NAME = "documents";
const DB_VERSION = 1;

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
      const db = (e.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    };
  });
}

export async function loadUserDocuments(): Promise<LegalDocument[]> {
  if (typeof window === "undefined") return [];
  try {
    const db = await getDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readonly");
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
    console.error("IDB load error", e);
    return [];
  }
}

export async function getDocumentById(id: string): Promise<LegalDocument | undefined> {
  if (typeof window === "undefined") return undefined;
  try {
    const db = await getDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readonly");
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(id);
      req.onsuccess = () => resolve(req.result as LegalDocument | undefined);
      req.onerror = () => reject(req.error);
    });
  } catch (e) {
    console.error("IDB get error", e);
    return undefined;
  }
}

export async function saveDocument(doc: LegalDocument): Promise<void> {
  if (typeof window === "undefined") return;
  try {
    const db = await getDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);
      const req = store.put(doc);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (e) {
    console.error("IDB save error", e);
  }
}

export async function deleteDocumentById(id: string): Promise<void> {
  if (typeof window === "undefined") return;
  try {
    const db = await getDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);
      const req = store.delete(id);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (e) {
    console.error("IDB delete error", e);
  }
}
