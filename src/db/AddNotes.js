// Add a new note to the NotesDB database
import { openDB } from "./openDB";

export async function addNote(noteText) {
  // Reject empty notes
  if (!noteText || !noteText.trim()) {
    throw new Error("Note cannot be empty");
  }

  const db = await openDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction("notes", "readwrite");
    const store = transaction.objectStore("notes");

    const request = store.add({
      text: noteText.trim(),
      createdAt: new Date().toISOString(),
    });

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(request.error);
    };

    transaction.oncomplete = () => {
      db.close();
    };

    transaction.onerror = () => {
      db.close();
      reject(transaction.error);
    };
  });
}