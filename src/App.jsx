import { useEffect, useState } from "react";
import { addNote } from "./db/AddNotes";
import { getAllNotes } from "./db/GetNotes";
import "./App.css";

function App() {
  const [noteText, setNoteText] = useState("");
  const [notes, setNotes] = useState([]);
  const [error, setError] = useState("");

  // Load saved notes when the application opens
  useEffect(() => {
    loadNotes();
  }, []);

  async function loadNotes() {
    try {
      const savedNotes = await getAllNotes();
      setNotes(savedNotes);
    } catch (err) {
      setError("Unable to load notes: " + err.message);
    }
  }

  // Save a new note
  async function handleAddNote(event) {
    event.preventDefault();
    setError("");

    try {
      await addNote(noteText);
      setNoteText("");
      await loadNotes();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <main className="notes-container">
      <h1>Offline Notes App</h1>
      <p>Save your notes and access them offline.</p>

      <form onSubmit={handleAddNote}>
        <input
          type="text"
          value={noteText}
          onChange={(event) => setNoteText(event.target.value)}
          placeholder="Enter a note..."
          aria-label="Enter a note"
        />

        <button type="submit">Add</button>
      </form>

      {error && <p className="error-message">{error}</p>}

      <h2>My Notes</h2>

      {notes.length === 0 ? (
        <p>No notes saved yet.</p>
      ) : (
        <ul>
          {notes.map((note) => (
            <li key={note.id}>{note.text}</li>
          ))}
        </ul>
      )}
    </main>
  );
}

export default App;