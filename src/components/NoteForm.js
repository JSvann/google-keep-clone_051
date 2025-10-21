import React, { useState, useEffect, useRef } from 'react';
import './NoteForm.css';

function NoteForm({ addNote }) {
  // --- STATE ---
  const [isExpanded, setIsExpanded] = useState(false);
  // 1. Dirapikan: Menggabungkan title dan content ke satu state object
  const [note, setNote] = useState({
    title: '',
    content: '',
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
  const tryCloseForm = () => {
    // Hanya tutup jika form kosong
    if (!note.title.trim() && !note.content.trim()) {
      setIsExpanded(false);
    }
    // Jika ada isinya, jangan ditutup (ini perilaku yang benar)
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (note.title.trim() || note.content.trim()) {
      addNote(note);
      // Reset form
      setNote({ title: '', content: '' });
      setIsExpanded(false);
    }
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
      document.addEventListener('mousedown', handleClickOutside);
    }

    // Fungsi cleanup: Hapus listener saat komponen di-unmount atau isExpanded=false
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isExpanded, note]); // <-- Dependensi: jalankan ulang jika isExpanded atau note berubah

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
            <button type="submit" className="note-form-button">
              Add Note
            </button>
            <button
              type="button"
              onClick={tryCloseForm} // <-- Pakai handler baru
              className="note-form-button note-form-button-secondary"
            >
              Close
            </button>
          </div>
        )}
      </form>
    </div>
  );
}

export default NoteForm;