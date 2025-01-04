const ensureBlockWrapper = (contentRef) => {
    if (!contentRef.current) return;

    const selection = window.getSelection();
    if (!selection.rangeCount) return;

    const range = selection.getRangeAt(0);
    let selectedNode = range.startContainer;

    // If the selected node is a text node, move up to the parent
    if (selectedNode.nodeType === 3) {
        selectedNode = selectedNode.parentNode;
    }

    // If the selected node is not inside a block, wrap it in a <p>
    if (!selectedNode.closest('h1, h2, h3, p')) {
        const block = document.createElement('p');
        block.appendChild(range.extractContents());
        range.insertNode(block);

        // Move selection inside the new block
        const newRange = document.createRange();
        newRange.selectNodeContents(block);
        selection.removeAllRanges();
        selection.addRange(newRange);
    }
};

export const applyBlockType = (tag, contentRef) => {
    // Ensure selection is wrapped in a block
    ensureBlockWrapper(contentRef);

    const selection = window.getSelection();
    if (!selection.rangeCount) return;

    const range = selection.getRangeAt(0);
    let selectedNode = range.startContainer;

    if (selectedNode.nodeType === 3) {
        selectedNode = selectedNode.parentNode;
    }

    const currentBlock = selectedNode.closest('h1, h2, h3, p');

    // Check if the block is already the desired type
    if (currentBlock && currentBlock.tagName.toLowerCase() === tag) {
        return; // Do nothing if it's already the right tag
    }

    // Replace the block if needed
    if (currentBlock) {
        const block = document.createElement(tag);
        block.innerHTML = currentBlock.innerHTML;
        currentBlock.replaceWith(block);

        // Maintain cursor position
        const newRange = document.createRange();
        newRange.selectNodeContents(block);
        selection.removeAllRanges();
        selection.addRange(newRange);
    }
};
