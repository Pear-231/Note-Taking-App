import React, { useState, useEffect, useRef } from 'react';
import './NoteDisplay.css';

function NoteDisplay({ note }) {
  const [isEditing, setIsEditing] = useState(false);
  const contentRef = useRef(null);
  const titleRef = useRef(null);

  // Sync note content and title with the DOM when note changes
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.innerText = note?.content || '';
    }
    if (titleRef.current) {
      titleRef.current.innerText = note?.title || 'Untitled Note';
    }
  }, [note]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
    console.log('Edited title:', titleRef.current.innerText);
    console.log('Edited content:', contentRef.current.innerText);
  };

  return (
    <div className="note-display">
      {note ? (
        <div>
          <div
            ref={titleRef}
            contentEditable={true}
            suppressContentEditableWarning={true}
            onBlur={handleBlur}
            className="editable-title"
          />
          <p style={{ fontSize: '0.9em', color: '#bbb' }}>
            {new Date(note.createdAt).toLocaleString()}
          </p>
          <div
            ref={contentRef}
            contentEditable={isEditing}
            suppressContentEditableWarning={true}
            onClick={handleEdit}
            onBlur={handleBlur}
            className="editable-content"
          />
        </div>
      ) : (
        <div>Select a note to view</div>
      )}
    </div>
  );
}

export default NoteDisplay;
