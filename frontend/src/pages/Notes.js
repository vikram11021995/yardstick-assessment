import { useEffect, useState } from "react";
import NoteForm from "../components/NoteForm";
import API from "../api";

export default function Notes() {
  const [notes, setNotes] = useState([]);
  const [error, setError] = useState("");
  const [editingNote, setEditingNote] = useState(null);
  const [user, setUser] = useState(null);
  const [tenant, setTenant] = useState(null);

  const token = localStorage.getItem("token");

  // Fetch notes + user info
  const fetchData = async () => {
    try {
      // Fetch notes
      const resNotes = await fetch("http://localhost:4000/notes", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const notesData = await resNotes.json();
      setNotes(notesData);

      // Fetch user & tenant info
      const resUser = await fetch("http://localhost:4000/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const dataUser = await resUser.json();
      setUser(dataUser.user);
      setTenant(dataUser.tenant);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Add note
  const handleAddNote = async (title, content) => {
    setError("");
    try {
      const res = await fetch("http://localhost:4000/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, content }),
      });
      const data = await res.json();
      if (res.ok) {
        setNotes([...notes, data]);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError("Failed to add note");
    }
  };

  // Delete note
  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:4000/notes/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotes(notes.filter((n) => n._id !== id));
    } catch (err) {
      setError("Delete failed");
    }
  };

  // Edit note
  const handleEdit = (note) => {
    setEditingNote(note);
    setError("");
  };

  // Update note
  const handleUpdate = async (id, title, content) => {
    try {
      const res = await fetch(`http://localhost:4000/notes/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, content }),
      });
      const data = await res.json();
      if (res.ok) {
        setNotes(notes.map((n) => (n._id === id ? data : n)));
        setEditingNote(null);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError("Update failed");
    }
  };


  const handleUpgrade = async () => {
    try {
      const res = await fetch(
        `http://localhost:4000/tenants/${tenant.slug}/upgrade`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      if (res.ok) {
        setTenant({ ...tenant, plan: "pro" });
        setError("");
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError("Upgrade failed");
    }
  };


  const showUpgrade =
    user?.role === "admin" && tenant?.plan === "free" && notes.length >= 3;

  return (
    <div style={{ padding: 20 }}>
      <h2>Your Notes</h2>


      {showUpgrade && tenant?.slug && (
        <div style={{ marginBottom: 10 }}>
          <button onClick={handleUpgrade}>Upgrade to Pro</button>
        </div>
      )}

      {/* Add Note Form */}
      {!editingNote && (
        <NoteForm onSuccess={fetchData} setError={setError} />
      )}

      {/* Edit Note Form */}
      {editingNote && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleUpdate(
              editingNote._id,
              editingNote.title,
              editingNote.content
            );
          }}
        >
          <input
            value={editingNote.title}
            onChange={(e) =>
              setEditingNote({ ...editingNote, title: e.target.value })
            }
          />
          <input
            value={editingNote.content}
            onChange={(e) =>
              setEditingNote({ ...editingNote, content: e.target.value })
            }
          />
          <button type="submit">Update Note</button>
          <button
            type="button"
            onClick={() => setEditingNote(null)}
            style={{ marginLeft: 10 }}
          >
            Cancel
          </button>
        </form>
      )}

      {error && <p style={{ color: "red" }}>{error}</p>}

      <ul>
        {notes.length === 0 && <li>No notes found</li>}
        {notes.map((note) => (
          <li key={note._id}>
            <strong>{note.title}</strong>: {note.content}{" "}
            <button onClick={() => handleEdit(note)}>Edit</button>{" "}
            <button onClick={() => handleDelete(note._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}


