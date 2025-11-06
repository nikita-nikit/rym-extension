// ========================================
// Utility Functions
// ========================================

// Helper function to format text from URL slugs
function formatText(text) {
  return text
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// Add a function to load the CSS file
function loadStylesheet(url) {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.type = 'text/css';
  link.href = chrome.runtime.getURL(url);
  (document.head || document.documentElement).appendChild(link);
  console.log(`Stylesheet loaded: ${url}`);
}

// Manual function to add class to currently selected element (for console use)
function addCompactClassToSelectedElement() {
  const selection = window.getSelection();
  let element = selection.anchorNode;
  
  // Traverse up to find the bubble_content element
  while (element && !element.classList?.contains('bubble_content')) {
    element = element.parentElement;
  }
  
  if (element && element.classList.contains('bubble_content')) {
    element.classList.add('bubble-content-compact');
    console.log('✅ Added bubble-content-compact class to selected element:', element);
    return element;
  } else {
    console.error('❌ No bubble_content element found in selection');
    return null;
  }
}

