/**
 * VinilArt Sport — IndexedDB Storage Helper
 *
 * Lightweight, zero-dependency browser IndexedDB storage.
 * Safely persists binary image blobs so uploaded images survive page refreshes.
 */

const DB_NAME = "vinilart_sport_storage";
const DB_VERSION = 1;
const STORE_IMAGES = "uploaded_images";

export interface StoredImageRecord {
  fileKey: string;
  blob: Blob;
  filename: string;
  mimeType: string;
  updatedAt: number;
}

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined" || !("indexedDB" in window)) {
      reject(new Error("IndexedDB is not supported in this environment"));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_IMAGES)) {
        db.createObjectStore(STORE_IMAGES, { keyPath: "fileKey" });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error || new Error("Failed to open IndexedDB"));
  });
}

/**
 * Saves a Blob in IndexedDB under a unique fileKey.
 */
export async function saveImageBlob(fileKey: string, blob: Blob, filename: string): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_IMAGES, "readwrite");
    const store = transaction.objectStore(STORE_IMAGES);
    const record: StoredImageRecord = {
      fileKey,
      blob,
      filename,
      mimeType: blob.type,
      updatedAt: Date.now(),
    };
    const request = store.put(record);

    transaction.oncomplete = () => {
      db.close();
      resolve();
    };
    transaction.onabort = () =>
      reject(transaction.error ?? new Error("Falha ao guardar ficheiro."));
    request.onerror = () => reject(request.error);
  });
}

/**
 * Retrieves a Blob from IndexedDB by fileKey.
 */
export async function getImageBlob(fileKey: string): Promise<StoredImageRecord | null> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_IMAGES, "readonly");
    const store = transaction.objectStore(STORE_IMAGES);
    const request = store.get(fileKey);

    request.onsuccess = () => {
      resolve((request.result as StoredImageRecord) || null);
    };
    request.onerror = () => reject(request.error);
  });
}

/**
 * Deletes an image record from IndexedDB.
 */
export async function deleteImageBlob(fileKey: string): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_IMAGES, "readwrite");
    const store = transaction.objectStore(STORE_IMAGES);
    const request = store.delete(fileKey);

    transaction.oncomplete = () => {
      db.close();
      resolve();
    };
    transaction.onabort = () =>
      reject(transaction.error ?? new Error("Falha ao guardar ficheiro."));
    request.onerror = () => reject(request.error);
  });
}

/**
 * Clears all stored images in IndexedDB.
 */
export async function clearAllImageBlobs(): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_IMAGES, "readwrite");
    const store = transaction.objectStore(STORE_IMAGES);
    const request = store.clear();

    transaction.oncomplete = () => {
      db.close();
      resolve();
    };
    transaction.onabort = () =>
      reject(transaction.error ?? new Error("Falha ao guardar ficheiro."));
    request.onerror = () => reject(request.error);
  });
}
