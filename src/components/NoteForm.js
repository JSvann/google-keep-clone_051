import React, { useState, useEffect, useRef, useCallback } from "react";
import "./NoteForm.css";

function NoteForm({ addNote, isDarkMode }) {
  // --- STATE ---
  const [isExpanded, setIsExpanded] = useState(false);
  // 1. Dirapikan: Menggabungkan title dan content ke satu state object
  const [note, setNote] = useState({
    title: "",
    content: "",
    image: null,
    reminder: null,
    isPinned: false,
  });

  // 2. Diperbaiki: Menambahkan ref untuk mendeteksi klik di luar form
  const formRef = useRef(null);

  // --- HANDLERS ---

  // 3. Dirapikan: Satu handler untuk semua input (title & content)
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNote((prevNote) => ({
      ...prevNote,
      [name]: value,
    }));
  };

  const handleExpand = () => {
    setIsExpanded(true);
  };

  // 4. Dirapikan: Mengganti nama handleClose menjadi tryCloseForm
  //    Fungsi ini akan dipakai oleh tombol "Close" DAN klik di luar
  const tryCloseForm = useCallback(() => {
    // Hanya tutup jika form kosong
    if (!note.title.trim() && !note.content.trim()) {
      setIsExpanded(false);
    }
    // Jika ada isinya, jangan ditutup (ini perilaku yang benar)
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (note.title.trim() || note.content.trim()) {
      addNote(note);
      // Reset form
      setNote({
        title: "",
        content: "",
        image: null,
        reminder: null,
        isPinned: false,
      });
      setIsExpanded(false);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setNote((prev) => ({ ...prev, image: event.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleReminderChange = (e) => {
    setNote((prev) => ({ ...prev, reminder: e.target.value }));
  };

  const togglePin = () => {
    setNote((prev) => ({ ...prev, isPinned: !prev.isPinned }));
  };

  // --- EFEK (UNTUK LOGIKA "CLICK OUTSIDE") ---

  // 5. Diperbaiki: Menambahkan useEffect untuk menangani "click outside"
  useEffect(() => {
    // Fungsi yang akan dijalankan saat user mengklik
    const handleClickOutside = (event) => {
      // Cek apakah ref-nya ada DAN user mengklik di luar area formRef
      if (formRef.current && !formRef.current.contains(event.target)) {
        tryCloseForm(); // Coba tutup form
      }
    };

    // Hanya tambahkan listener jika form sedang terbuka (expanded)
    if (isExpanded) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    // Fungsi cleanup: Hapus listener saat komponen di-unmount atau isExpanded=false
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isExpanded, note, tryCloseForm, formRef]); // <-- Dependensi: jalankan ulang jika isExpanded atau note berubah

  // --- RENDER ---
  return (
    // 6. Diperbaiki: Menambahkan ref ke container utama
    <div className="note-form-container" ref={formRef}>
      <form className="note-form" onSubmit={handleSubmit}>
        {isExpanded && (
          <input
            type="text"
            name="title" // <-- Tambahkan 'name'
            placeholder="Title"
            value={note.title}
            onChange={handleChange} // <-- Pakai handler baru
            className="note-form-input"
            autoFocus
          />
        )}
        <textarea
          name="content" // <-- Tambahkan 'name'
          placeholder="Take a note..."
          value={note.content}
          onChange={handleChange} // <-- Pakai handler baru
          onClick={handleExpand}
          className="note-form-textarea"
          rows={isExpanded ? 3 : 1}
        />
        {isExpanded && (
          <div className="note-form-actions">
            <div className="note-form-options">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                id="image-upload"
                style={{ display: "none" }}
              />
              <label
                htmlFor="image-upload"
                className="note-form-option-button"
                title="Add image"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
                </svg>
              </label>
              <button
                type="button"
                onClick={togglePin}
                className={`note-form-option-button ${
                  note.isPinned ? "pinned" : ""
                }`}
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
              <input
                type="datetime-local"
                value={note.reminder || ""}
                onChange={handleReminderChange}
                className="note-form-reminder"
                title="Set reminder"
              />
            </div>
            <div className="note-form-buttons">
              <button type="submit" className="note-form-button">
                Add Note
              </button>
              <button
                type="button"
                onClick={tryCloseForm}
                className="note-form-button note-form-button-secondary"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}

export default NoteForm;
