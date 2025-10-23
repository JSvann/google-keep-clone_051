import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import NoteForm from "./components/NoteForm";
import NotesList from "./components/NotesList";
import "./App.css";

function App() {
  // State to store all notes
  const [notes, setNotes] = useState([]);
  // State for dark mode
  const [isDarkMode, setIsDarkMode] = useState(false);
  // Load notes and theme from localStorage when app starts
  useEffect(() => {
    const savedNotes = localStorage.getItem("keepNotes");
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes));
    }
    
    const savedTheme = localStorage.getItem("keepTheme");
    if (savedTheme) {
      setIsDarkMode(JSON.parse(savedTheme));
    }
  }, []); // Empty array means this runs once on mount
  // Save notes to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("keepNotes", JSON.stringify(notes));
  }, [notes]); // Runs whenever notes array changes

  // Save theme to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("keepTheme", JSON.stringify(isDarkMode));
  }, [isDarkMode]);
  // Function to add a new note
  const addNote = (noteData) => {
    const newNote = {
      id: Date.now(), // Simple unique ID using timestamp
      title: noteData.title,
      content: noteData.content,
      image: noteData.image || null,
      reminder: noteData.reminder || null,
      isPinned: noteData.isPinned || false,
      createdAt: new Date().toISOString(),
    };
    // Add new note to beginning of array
    setNotes([newNote, ...notes]);
  };
  // Function to update an existing note
  const updateNote = (id, updatedNote) => {
    setNotes(notes.map((note) => (note.id === id ? updatedNote : note)));
  };
  // Function to delete a note
  const deleteNote = (id) => {
    setNotes(notes.filter((note) => note.id !== id));
  };

  // Function to toggle pin status
  const togglePin = (id) => {
    setNotes(notes.map((note) => 
      note.id === id ? { ...note, isPinned: !note.isPinned } : note
    ));
  };

  // Function to toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };
  return (
    <div className={`app ${isDarkMode ? 'dark-mode' : ''}`}>
      <Header isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
      <main className="app-main">
        <NoteForm addNote={addNote} isDarkMode={isDarkMode} />
        <NotesList
          notes={notes}
          updateNote={updateNote}
          deleteNote={deleteNote}
          togglePin={togglePin}
          isDarkMode={isDarkMode}
        />
      </main>
    </div>
  );
}
export default App;
