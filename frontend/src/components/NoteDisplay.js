import React from 'react';
import './NoteDisplay.css';

function NoteDisplay({ note }) {
  return (
    <div className="note-display">
      {note ? (
        <div>
          <h3>{note.title}</h3>
          <p style={{ fontSize: '0.9em', color: '#bbb' }}>
            {new Date(note.createdAt).toLocaleString()}
          </p>
          <p>{note.content}</p>
        </div>
      ) : (
        <div>Select a note to view</div>
      )}
    </div>
  );
}

export default NoteDisplay;
