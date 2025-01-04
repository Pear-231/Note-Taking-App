import React from 'react';
import './NotesList.css';

function NotesList({ notes, selectedNote, onNoteClick }) {
  return (
    <div className="notes-list">
      {notes.map(note => (
        <div
          key={note.id}
          className={`note-item ${selectedNote?.id === note.id ? 'active' : ''}`}
          onClick={() => onNoteClick(note)}
        >
          <h3>{note.title}</h3>
          <p className="note-preview">
            {new Date(note.createdAt).toLocaleDateString()} – {note.content}
          </p>
        </div>
      ))}
    </div>
  );
}

export default NotesList;
