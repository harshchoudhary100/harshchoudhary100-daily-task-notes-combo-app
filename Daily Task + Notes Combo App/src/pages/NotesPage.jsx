import { useEffect, useState } from "react";
import { NoteAPI } from "../services/api";
import NoteForm from "../components/NoteForm";
import NoteList from "../components/NoteList";

export default function NotesPage() {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const n = await NoteAPI.list();
        setNotes(n);
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  return (
    <div className="container">
      <h2 style={{ margin: "10px 0" }}>📝 My Notes</h2>
      <NoteForm onCreated={(n) => setNotes((p) => [n, ...p])} />
      <NoteList notes={notes} setNotes={setNotes} />
    </div>
  );
}
