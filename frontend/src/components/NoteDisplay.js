import React, { useEffect, useRef } from 'react';
import './NoteDisplay.css';
import Toolbar from './Toolbar';
import { applyBlockType } from '../utils/blockUtils';

function NoteDisplay({ note }) {
  const contentRef = useRef(null);

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.innerHTML = note?.content || '';
    }
  }, [note]);

  return (
    <div className="note-display">
      {note ? (
        <div>
          <Toolbar onApplyBlockType={(tag) => applyBlockType(tag, contentRef)} />
          <h3 contentEditable className="editable-title">{note.title}</h3>
          <div
            ref={contentRef}
            contentEditable
            suppressContentEditableWarning
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
