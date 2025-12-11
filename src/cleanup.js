// ========================================
// DOM Cleanup Functions
// ========================================

// Remove empty spacer rows built as a full-width TD (any colspan), e.g. <td style="width:100%" colspan="2|5"></td>
function removeEmptySpacerRows() {
  try {
    // DEBUG: Check if profile_image exists before cleanup
    const profileImageBefore = document.getElementById('profile_image');
    if (profileImageBefore) {
      console.log('✅ Profile image exists at start of cleanup');
    } else {
      console.log('⚠️ No profile image found at start of cleanup');
    }
    
    let removedCount = 0;

    // Strategy 1: Directly target empty full-width TDs with any colspan
    const emptyFullWidthCells = document.querySelectorAll('td[colspan][style*="width:100%"]');
    emptyFullWidthCells.forEach(td => {
      // Skip TDs with IDs (like profile_image)
      if (td.id) return;
      // Skip TDs with background images
      const styleAttr = (td.getAttribute('style') || '').toLowerCase();
      if (styleAttr.includes('background-image')) return;
      
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
        // Skip TDs with IDs (like profile_image)
        if (td.id) return;
        const styleAttr = (td.getAttribute('style') || '').toLowerCase();
        // Skip TDs with background images
        if (styleAttr.includes('background-image')) return;
        const hasFullWidth = styleAttr.includes('width:100%');
        const isEmpty = td.textContent.trim() === '' && td.children.length === 0;
        if (hasFullWidth && isEmpty) {
          tr.remove();
          removedCount += 1;
        }
      } else if (cells.length > 0) {
        // Skip rows containing TDs with IDs or background images
        const hasProtectedCells = Array.from(cells).some(cell => {
          if (cell.id) return true;
          const cellStyle = (cell.getAttribute('style') || '').toLowerCase();
          return cellStyle.includes('background-image');
        });
        if (hasProtectedCells) return;
        
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
      // Skip TDs with IDs (like profile_image) - CRITICAL FIX
      if (td.id) return;
      // Skip TDs with background images - CRITICAL FIX
      const styleAttr = (td.getAttribute('style') || '').toLowerCase();
      if (styleAttr.includes('background-image')) return;
      // Skip TDs with significant width or height (profile images are ~260px × 300px)
      const width = td.offsetWidth;
      const height = td.offsetHeight;
      if (width > 15 || height > 15) return;
      
      const isEmpty = td.textContent.trim() === '' && td.children.length === 0 && !td.className;
      if (isEmpty && width <= 15) {
        td.remove();
        removedCount += 1;
      }
    });

    if (removedCount > 0) {
      console.log(`Removed ${removedCount} empty spacer row(s).`);
    }
    
    // DEBUG: Check if profile_image still exists after cleanup
    const profileImageAfter = document.getElementById('profile_image');
    if (profileImageAfter) {
      console.log('✅ Profile image still exists after cleanup');
    } else if (profileImageBefore) {
      console.error('❌ Profile image WAS REMOVED during cleanup!');
    }
  } catch (e) {
    console.error('Error removing empty spacer rows:', e);
  }
}

// Add unique class to "more..." link cells (td colspan="5" with more link)
function classifyMoreLinkCells() {
  try {
    const moreCells = document.querySelectorAll('td[colspan="5"]');
    moreCells.forEach(td => {
      const moreLink = td.querySelector('a[href*="/collection/"][href*="/recent/"]');
      if (moreLink && moreLink.textContent.trim() === 'more...') {
        td.classList.add('rym-ext-more-cell');
      }
    });
  } catch (e) {
    console.error('Error classifying more link cells:', e);
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
        classifyMoreLinkCells();
        relocateTracklistTotalsToHeaders();
        scheduled = false;
      }, 50);
    });
    observer.observe(targetNode, { childList: true, subtree: true });
    console.log('Spacer row observer set up');
    
    // Also classify more link cells on DOM changes
    classifyMoreLinkCells();
  } catch (e) {
    console.error('Error setting spacer row observer:', e);
  }
}

// Run classifyMoreLinkCells on initial load
classifyMoreLinkCells();

// Ensure tracklist totals are surfaced next to the header metadata
function relocateTracklistTotalsToHeaders() {
  try {
    const tracklistSections = document.querySelectorAll('.section_tracklisting');
    if (!tracklistSections.length) {
      return;
    }

    tracklistSections.forEach(section => {
      const releaseHeader = section.querySelector('.release_page_header');
      const tracklistTotal = section.querySelector('.tracklist_total');
      const originalTrackRow = tracklistTotal?.closest('li.track, tr.track, .track_total_row');

      if (!releaseHeader || !tracklistTotal) {
        return;
      }

      if (!releaseHeader.contains(tracklistTotal)) {
        releaseHeader.appendChild(tracklistTotal);
        console.log('✅ RYM Extension moved tracklist total into release_page_header');
      }

      ensureTracklistTotalCentered(releaseHeader, tracklistTotal);
      tracklistTotal.dataset.rymExtTracklistRelocated = 'true';
      tracklistTotal.classList.add('rym-ext-tracklist-total-moved');
      cleanupEmptyTracklistRow(originalTrackRow);
    });
  } catch (e) {
    console.error('Error relocating tracklist totals to header:', e);
  }
}

function ensureTracklistTotalCentered(releaseHeader, tracklistTotal) {
  const titleSelector = '.release_header_title, .release-page-header-title, .release_page_title, h2, h3';
  const toggleSelector = '#track_credit_show_link_tracks, .track_credit_show_link';
  const headerTitle = releaseHeader.querySelector(titleSelector);
  const toggleLink = releaseHeader.querySelector(toggleSelector);

  if (headerTitle) {
    if (releaseHeader.firstElementChild !== headerTitle) {
      releaseHeader.insertBefore(headerTitle, releaseHeader.firstElementChild);
    }

    if (headerTitle.nextElementSibling !== tracklistTotal) {
      headerTitle.insertAdjacentElement('afterend', tracklistTotal);
    }
  } else if (releaseHeader.firstElementChild !== tracklistTotal) {
    releaseHeader.insertBefore(tracklistTotal, releaseHeader.firstElementChild);
  }

  if (toggleLink && tracklistTotal.nextElementSibling !== toggleLink) {
    tracklistTotal.insertAdjacentElement('afterend', toggleLink);
  } else if (!toggleLink && headerTitle && headerTitle.nextElementSibling !== tracklistTotal) {
    headerTitle.insertAdjacentElement('afterend', tracklistTotal);
  }
}

function cleanupEmptyTracklistRow(row) {
  if (!row) return;
  const hasContent = row.children.length > 0 || row.textContent.trim().length > 0;
  if (!hasContent) {
    row.remove();
    console.log('🧹 Removed empty tracklist row left behind by tracklist_total');
  }
}

// Make the relocation helper available to other scripts (release.js, main.js)
window.relocateTracklistTotalsToHeaders = relocateTracklistTotalsToHeaders;

// Run immediately so release pages update on first paint
relocateTracklistTotalsToHeaders();

