import React, { useState, useEffect } from "react";
import "./Note.css";

function Note({ note, updateNote, deleteNote, togglePin, isDarkMode }) {
  // --- STATE ---
  const [isEditing, setIsEditing] = useState(false);
  // 1. Dirapikan: Menggabungkan state title dan content
  const [editedNote, setEditedNote] = useState({
    title: note.title,
    content: note.content,
    image: note.image,
    reminder: note.reminder,
    isPinned: note.isPinned,
  });

  // 2. Diperbaiki: Sinkronkan state editan jika note prop berubah
  //    Ini mencegah "stale state" jika data note di-update dari parent
  //    selagi user tidak sedang dalam mode edit.
  useEffect(() => {
    if (!isEditing) {
      setEditedNote({
        title: note.title,
        content: note.content,
        image: note.image,
        reminder: note.reminder,
        isPinned: note.isPinned,
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
      image: editedNote.image,
      reminder: editedNote.reminder,
      isPinned: editedNote.isPinned,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    // Reset state dari props 'note' yang terbaru
    setEditedNote({
      title: note.title,
      content: note.content,
      image: note.image,
      reminder: note.reminder,
      isPinned: note.isPinned,
    });
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this note?")) {
      deleteNote(note.id);
    }
    // isEditing tidak perlu diubah, delete bisa terjadi di view/edit mode
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setEditedNote((prev) => ({ ...prev, image: event.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleReminderChange = (e) => {
    setEditedNote((prev) => ({ ...prev, reminder: e.target.value }));
  };

  const handleTogglePin = (e) => {
    e.stopPropagation();
    togglePin(note.id);
  };

  // --- RENDER ---
  return (
    <div className={`note ${note.isPinned ? "pinned" : ""}`}>
      {isEditing ? (
        // --- Edit Mode ---
        <div className="note-edit">
          <input
            type="text"
            name="title"
            value={editedNote.title}
            onChange={handleChange}
            placeholder="Title"
            className="note-edit-input"
            autoFocus
          />
          <textarea
            name="content"
            value={editedNote.content}
            onChange={handleChange}
            placeholder="Take a note..."
            className="note-edit-textarea"
            rows={4}
          />
          {editedNote.image && (
            <div className="note-edit-image">
              <img src={editedNote.image} alt="Note attachment" />
              <button
                onClick={() =>
                  setEditedNote((prev) => ({ ...prev, image: null }))
                }
                className="remove-image-btn"
                title="Remove image"
              >
                ×
              </button>
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            id={`image-upload-${note.id}`}
            style={{ display: "none" }}
          />
          <label
            htmlFor={`image-upload-${note.id}`}
            className="note-edit-option"
          >
            📷 Add Image
          </label>
          <input
            type="datetime-local"
            value={editedNote.reminder || ""}
            onChange={handleReminderChange}
            className="note-edit-reminder"
            placeholder="Set reminder"
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
            <button
              onClick={handleDelete}
              className="note-delete note-delete-edit"
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
          {note.isPinned && <div className="note-pin-indicator">📌</div>}
          {note.title && <h3 className="note-title">{note.title}</h3>}
          {note.image && (
            <div className="note-image">
              <img src={note.image} alt="Note attachment" />
            </div>
          )}
          <p className="note-content">
            {note.content || (
              <span className="note-placeholder">Empty note...</span>
            )}
          </p>
          {note.reminder && (
            <div className="note-reminder">
              ⏰ {new Date(note.reminder).toLocaleString()}
            </div>
          )}
          <div className="note-actions">
            <button
              onClick={handleTogglePin}
              className={`note-pin ${note.isPinned ? "pinned" : ""}`}
              title={note.isPinned ? "Unpin note" : "Pin note"}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M16 4v12l-4-2-4 2V4c0-1.1.9-2 2-2h4c1.1 0 2 .9 2 2z" />
              </svg>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
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
