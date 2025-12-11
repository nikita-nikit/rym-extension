// ========================================
// Release Page DOM Manipulation Functions
// ========================================

// Move tracklist total duration to the release page header
function moveTracklistTotalToHeader() {
  try {
    if (typeof window.relocateTracklistTotalsToHeaders === 'function') {
      window.relocateTracklistTotalsToHeaders();
      return;
    }

    // Fallback logic in case the cleanup helper fails to load
    const tracklistTotal = document.querySelector('.tracklist_total');
    const releasePageHeader = document.querySelector('.section_tracklisting .release_page_header');

    if (tracklistTotal && releasePageHeader && !releasePageHeader.contains(tracklistTotal)) {
      releasePageHeader.appendChild(tracklistTotal);
      console.log('✅ Moved tracklist_total to release_page_header (fallback)');
    }
  } catch (error) {
    console.error('Error moving tracklist_total to header:', error);
  }
}

// Setup observer to handle dynamically loaded content
function setupReleasePageObserver() {
  try {
    const targetNode = document.body || document.documentElement;
    if (!targetNode) {
      console.error('Release page observer: no target node');
      return;
    }
    
    let scheduled = false;
    const observer = new MutationObserver(() => {
      if (scheduled) return;
      scheduled = true;
      setTimeout(() => {
        moveTracklistTotalToHeader();
        enhanceColorBarGlow();
        scheduled = false;
      }, 100);
    });
    
    observer.observe(targetNode, { childList: true, subtree: true });
    
    // Run once on setup in case the table is already present
    enhanceColorBarGlow();
    console.log('Release page observer set up');
  } catch (error) {
    console.error('Error setting up release page observer:', error);
  }
}

// Enhance the release color bar with per-swatch glow on hover
function enhanceColorBarGlow() {
  try {
    const cells = document.querySelectorAll('#column_container_right table.color_bar td');
    if (!cells.length) return;
    
    cells.forEach(cell => {
      if (cell.dataset.rymGlowAttached === '1') return;
      cell.dataset.rymGlowAttached = '1';
      
      const baseColor = getCellColor(cell);
      const glowSoft = toRgba(baseColor, 0.45);
      const glowStrong = toRgba(baseColor, 0.75);
      
      // Ensure hover visuals aren't clipped
      if (!cell.style.position) cell.style.position = 'relative';
      if (!cell.style.overflow) cell.style.overflow = 'visible';
      if (!cell.style.transition) cell.style.transition = 'box-shadow 260ms ease, filter 260ms ease';
      
      cell.addEventListener('mouseenter', () => {
        cell.style.boxShadow = `0 0 10px 4px ${glowSoft}, 0 0 14px 8px ${glowStrong}`;
        cell.style.filter = 'brightness(1.08) saturate(1.12)';
      });
      
      cell.addEventListener('mouseleave', () => {
        cell.style.boxShadow = 'none';
        cell.style.filter = '';
      });
    });
  } catch (error) {
    console.error('Error enhancing color bar glow:', error);
  }
}

function getCellColor(cell) {
  const inlineBg = cell.style.backgroundColor || cell.getAttribute('bgcolor');
  const computed = getComputedStyle(cell).backgroundColor;
  const inlineText = cell.style.color;
  const computedText = getComputedStyle(cell).color;
  return inlineBg || computed || inlineText || computedText || 'rgba(255,255,255,0.5)';
}

function toRgba(color, alpha = 0.6) {
  if (!color) return `rgba(255,255,255,${alpha})`;
  
  // rgb/rgba
  const rgbMatch = color.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i);
  if (rgbMatch) {
    const [r, g, b] = rgbMatch.slice(1, 4).map(Number);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
  
  // hex #rgb or #rrggbb
  const hexMatch = color.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
  if (hexMatch) {
    let hex = hexMatch[1];
    if (hex.length === 3) {
      hex = hex.split('').map(c => c + c).join('');
    }
    const intVal = parseInt(hex, 16);
    const r = (intVal >> 16) & 255;
    const g = (intVal >> 8) & 255;
    const b = intVal & 255;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
  
  // fallback: just attach alpha
  return color.replace(')', `, ${alpha})`).replace('rgb(', 'rgba(');
}

