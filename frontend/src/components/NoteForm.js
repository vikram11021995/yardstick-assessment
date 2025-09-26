import { useState } from "react";
import API from "../api";

export default function NoteForm({ onSuccess, setError }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/notes", { title, content });
      setTitle("");
      setContent("");
      setError("");
      onSuccess();
    } catch (e) {
      setError(e.response?.data?.error || "Error");
    }
  };

  return (
    <form onSubmit={submit}>
      <input
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        placeholder="Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <button type="submit">Add Note</button>
    </form>
  );
}
