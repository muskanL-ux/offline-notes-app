// Open or create the NotesDB database
export function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("NotesDB", 1);

    // Create the notes object store when the database is first created
    request.onupgradeneeded = (event) => {
      const db = event.target.result;

      if (!db.objectStoreNames.contains("notes")) {
        db.createObjectStore("notes", {
          keyPath: "id",
          autoIncrement: true,
        });
      }
    };

    // Return the database connection
    request.onsuccess = () => {
      resolve(request.result);
    };

    // Handle database errors
    request.onerror = () => {
      reject(request.error);
    };
  });
}