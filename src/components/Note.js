import React, { useState, useEffect } from "react";
import "./Note.css";

function Note({ note, updateNote, deleteNote }) {
  // --- STATE ---
  const [isEditing, setIsEditing] = useState(false);
  // 1. Dirapikan: Menggabungkan state title dan content
  const [editedNote, setEditedNote] = useState({
    title: note.title,
    content: note.content,
  });

  // 2. Diperbaiki: Sinkronkan state editan jika note prop berubah
  //    Ini mencegah "stale state" jika data note di-update dari parent
  //    selagi user tidak sedang dalam mode edit.
  useEffect(() => {
    if (!isEditing) {
      setEditedNote({
        title: note.title,
        content: note.content,
      });
    }
  }, [note, isEditing]); // <-- Jalankan efek ini jika note atau isEditing berubah

  // --- HANDLERS ---

  // 3. Dirapikan: Satu handler untuk semua input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedNote((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    updateNote(note.id, {
      ...note,
      title: editedNote.title,
      content: editedNote.content,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    // Reset state dari props 'note' yang terbaru
    setEditedNote({
      title: note.title,
      content: note.content,
    });
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this note?")) {
      deleteNote(note.id);
    }
    // isEditing tidak perlu diubah, delete bisa terjadi di view/edit mode
  };

  // --- RENDER ---
  return (
    <div className="note">
      {isEditing ? (
        // --- Edit Mode ---
        <div className="note-edit">
          <input
            type="text"
            name="title" // <-- Tambahkan 'name'
            value={editedNote.title}
            onChange={handleChange} // <-- Pakai handler baru
            placeholder="Title"
            className="note-edit-input"
            autoFocus
          />
          <textarea
            name="content" // <-- Tambahkan 'name'
            value={editedNote.content}
            onChange={handleChange} // <-- Pakai handler baru
            placeholder="Take a note..."
            className="note-edit-textarea"
            rows={4}
          />
          <div className="note-edit-actions">
            <button
              onClick={handleSave}
              className="note-button note-button-save"
            >
              Save
            </button>
            <button
              onClick={handleCancel}
              className="note-button note-button-cancel"
            >
              Cancel
            </button>
            {/* 4. Dirapikan: Tombol delete juga ada di mode edit */}
            <button
              onClick={handleDelete}
              className="note-delete note-delete-edit" // <-- Beri class beda jika perlu
              title="Delete note"
            >
              <svg width="24" height="24" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"
                />
              </svg>
            </button>
          </div>
        </div>
      ) : (
        // --- View Mode ---
        <div className="note-view" onClick={() => setIsEditing(true)}>
          {note.title && <h3 className="note-title">{note.title}</h3>}
          {/* 5. Dirapikan: Tampilkan placeholder jika konten kosong */}
          <p className="note-content">
            {note.content || (
              <span className="note-placeholder">Empty note...</span>
            )}
          </p>
          <div className="note-actions">
            <button
              onClick={(e) => {
                // <-- 6. Diperbaiki: Typo 'buttononClick'
                e.stopPropagation(); // Mencegah triggering edit mode
                handleDelete();
              }}
              className="note-delete"
              title="Delete note"
            >
              <svg width="24" height="24" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Note;
