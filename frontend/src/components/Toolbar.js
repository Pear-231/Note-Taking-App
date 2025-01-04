import React from 'react';
import './Toolbar.css';

function Toolbar({ onApplyBlockType }) {
  return (
    <div className="toolbar">
      <button onClick={() => onApplyBlockType('p')}>Paragraph</button>
      <button onClick={() => onApplyBlockType('h1')}>Heading 1</button>
      <button onClick={() => onApplyBlockType('h2')}>Heading 2</button>
      <button onClick={() => onApplyBlockType('h3')}>Heading 3</button>
    </div>
  );
}

export default Toolbar;
