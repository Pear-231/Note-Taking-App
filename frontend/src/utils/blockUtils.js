export const applyBlockType = (tag, contentRef) => {
    if (!contentRef.current) return;
  
    const selection = window.getSelection();
    if (!selection.rangeCount) return;
  
    const range = selection.getRangeAt(0);
    let selectedNode = range.startContainer.parentNode;
  
    // Ensure the selected text is within a block element
    if (!selectedNode.closest('h1, h2, h3, p')) {
      const block = document.createElement('p');
      block.appendChild(range.extractContents());
      range.insertNode(block);
      selectedNode = block;
    }
  
    const currentBlock = selectedNode.closest('h1, h2, h3, p');
  
    // Only apply if the current block is not the selected type
    if (currentBlock && currentBlock.tagName.toLowerCase() !== tag) {
      const block = document.createElement(tag);
      block.innerHTML = currentBlock.innerHTML;
      currentBlock.replaceWith(block);
    }
  };
  