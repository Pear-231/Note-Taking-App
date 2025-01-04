import React, { useEffect, useRef } from 'react';
import './NoteDisplay.css';
import Toolbar from './Toolbar';
import { applyBlockType } from '../utils/blockUtils';

// Helper function to wrap plain text nodes in <p>
const preprocessContent = (container) => {
    if (!container) return;

    // Loop over all child nodes of the content area
    Array.from(container.childNodes).forEach((node) => {
        // If the node is a text node and has content, wrap it in <p>
        if (node.nodeType === 3 && node.textContent.trim().length > 0) {
            const p = document.createElement('p');
            p.textContent = node.textContent;
            node.replaceWith(p);
        }
    });
};

function NoteDisplay({ note }) {
    const contentRef = useRef(null);

    useEffect(() => {
        if (contentRef.current) {
            contentRef.current.innerHTML = note?.content || '';

            // Preprocess to ensure all text is wrapped in blocks
            preprocessContent(contentRef.current);
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
