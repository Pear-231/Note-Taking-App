import React, { useEffect, useState } from 'react';
import { getNotes } from './services/api';
import Sidebar from './components/NotesList';
import NoteDisplay from './components/NoteDisplay';
import './App.css';

function App() {
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);

  useEffect(() => {
    getNotes().then(response => {
      setNotes(response.data);
      if (response.data.length > 0) {
        setSelectedNote(response.data[0]);
      }
    });
  }, []);

  const handleNoteClick = (note) => {
    setSelectedNote(note);
  };

  return (
    <div className="app-container">
      <Sidebar
        notes={notes}
        selectedNote={selectedNote}
        onNoteClick={handleNoteClick}
      />
      <NoteDisplay note={selectedNote} />
    </div>
  );
}

export default App;
