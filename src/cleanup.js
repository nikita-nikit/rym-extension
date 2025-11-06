// ========================================
// DOM Cleanup Functions
// ========================================

// Remove empty spacer rows built as a full-width TD (any colspan), e.g. <td style="width:100%" colspan="2|5"></td>
function removeEmptySpacerRows() {
  try {
    let removedCount = 0;

    // Strategy 1: Directly target empty full-width TDs with any colspan
    const emptyFullWidthCells = document.querySelectorAll('td[colspan][style*="width:100%"]');
    emptyFullWidthCells.forEach(td => {
      const isEmpty = td.textContent.trim() === '' && td.children.length === 0;
      if (!isEmpty) return;
      const parentRow = td.closest('tr');
      if (parentRow) {
        parentRow.remove();
        removedCount += 1;
      } else {
        td.remove();
        removedCount += 1;
      }
    });

    // Strategy 2: Fallback for rows that are a single empty TD (any colspan)
    const candidateRows = document.querySelectorAll('tr');
    candidateRows.forEach(tr => {
      const cells = tr.querySelectorAll('td');
      if (cells.length === 1) {
        const td = cells[0];
        const styleAttr = (td.getAttribute('style') || '').toLowerCase();
        const hasFullWidth = styleAttr.includes('width:100%');
        const isEmpty = td.textContent.trim() === '' && td.children.length === 0;
        if (hasFullWidth && isEmpty) {
          tr.remove();
          removedCount += 1;
        }
      } else if (cells.length > 0) {
        // If row has multiple cells but all are empty, remove the row
        const allEmpty = Array.from(cells).every(cell => cell.textContent.trim() === '' && cell.children.length === 0);
        if (allEmpty) {
          tr.remove();
          removedCount += 1;
        }
      }
    });

    // Strategy 3: Remove narrow empty spacer cells (10px wide, vertical-align:top)
    const emptySpacerCells = document.querySelectorAll('td[style*="vertical-align:top"]');
    emptySpacerCells.forEach(td => {
      const isEmpty = td.textContent.trim() === '' && td.children.length === 0 && !td.className;
      const width = td.offsetWidth;
      if (isEmpty && width <= 15) {
        td.remove();
        removedCount += 1;
      }
    });

    if (removedCount > 0) {
      console.log(`Removed ${removedCount} empty spacer row(s).`);
    }
  } catch (e) {
    console.error('Error removing empty spacer rows:', e);
  }
}

// Observe DOM changes and keep removing spacer rows proactively
function setupSpacerRowObserver() {
  try {
    const targetNode = document.body || document.documentElement;
    if (!targetNode) {
      console.error('Spacer row observer: no target node');
      return;
    }
    let scheduled = false;
    const observer = new MutationObserver(() => {
      if (scheduled) return;
      scheduled = true;
      setTimeout(() => {
        removeEmptySpacerRows();
        scheduled = false;
      }, 50);
    });
    observer.observe(targetNode, { childList: true, subtree: true });
    console.log('Spacer row observer set up');
  } catch (e) {
    console.error('Error setting spacer row observer:', e);
  }
}

