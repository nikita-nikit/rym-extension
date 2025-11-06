// ========================================
// Bubble Content Modifications
// ========================================

// Function to inject music-title class to bubble_header elements
function injectMusicTitleClass() {
  console.log("Injecting music-title class to bubble_header elements...");
  
  const bubbleHeaders = document.querySelectorAll('.bubble_header');
  
  bubbleHeaders.forEach((element, index) => {
    if (!element.classList.contains('music-title')) {
      element.classList.add('music-title');
      console.log(`Added music-title class to bubble_header ${index + 1}:`, element);
    }
  });
  
  console.log(`Processed ${bubbleHeaders.length} bubble_header elements`);
}

// Function to add custom class to specific bubble_header element
function addCustomBubbleHeaderClass() {
  console.log("Adding custom class to specific bubble_header element...");
  
  // Find the specific bubble_header element that contains "music" text
  const bubbleHeaders = document.querySelectorAll('.bubble_header');
  
  bubbleHeaders.forEach((element, index) => {
    if (element.textContent.trim() === 'music') {
      element.classList.add('bubble_header_music-title-name');
      console.log(`Added bubble_header_music-title-name class to element:`, element);
    }
  });
}

// Function to add custom class to film bubble_header element
function addCustomFilmBubbleHeaderClass() {
  console.log("Adding custom class to film bubble_header element...");
  
  // Find the specific bubble_header element that contains "film" text
  const bubbleHeaders = document.querySelectorAll('.bubble_header');
  
  bubbleHeaders.forEach((element, index) => {
    if (element.textContent.trim() === 'film') {
      element.classList.add('bubble_header_film-title-name');
      console.log(`Added bubble_header_film-title-name class to element:`, element);
    }
  });
}

// Function to add compact class to a SPECIFIC bubble_content element
// This targets ONLY the user bio bubble_content on profile pages
function addBubbleContentCompactClass() {
  console.log("Adding bubble-content-compact class to specific bubble_content element...");
  
  // Very specific selector for user bio section on profile pages
  // Look for bubble_content that:
  // 1. Contains rendered_text with user bio
  // 2. Has a div with padding:14px (specific to bio sections)
  // 3. Is within the profile area (profilehii or near profile elements)
  
  const bubbleContentElements = document.querySelectorAll('.bubble_content');
  
  bubbleContentElements.forEach((element) => {
    // Check for the specific structure that indicates user bio
    const hasPaddingDiv = element.querySelector('div[style*="padding:14px"]');
    const hasRenderedText = element.querySelector('.rendered_text');
    
    // Check if it's in a profile context (has profilehii ancestor or is near profile elements)
    const isInProfile = element.closest('.profilehii') || 
                       element.closest('#content')?.querySelector('.profilehii') ||
                       element.closest('table.mbgen');
    
    // Only apply to THIS specific type of bubble_content
    if (hasPaddingDiv && hasRenderedText && isInProfile && !element.classList.contains('bubble-content-compact')) {
      element.classList.add('bubble-content-compact');
      console.log(`✅ Added bubble-content-compact class to user bio bubble_content:`, element);
    }
  });
}

// Function to add unique class to bubble_content that contains action buttons
// This targets ONLY the specific bubble_content with platform profile links (RYM/Glitchwave)
function addActionButtonsBubbleContentClass() {
  console.log("Adding unique class to action buttons bubble_content...");
  
  const bubbleContentElements = document.querySelectorAll('.bubble_content');
  
  bubbleContentElements.forEach((element) => {
    // Check for the specific structure:
    // 1. Has a div with text-align:right and padding styles
    // 2. Contains action button links to Sonemic/Glitchwave
    const hasRightAlignedDiv = element.querySelector('div[style*="text-align:right"]');
    const hasSonemicLink = element.querySelector('a[href*="rateyourmusic.com/~"], a[href*="sonemic.com/~"]');
    const hasGlitchwaveLink = element.querySelector('a[href*="glitchwave.com/user/"]');
    
    // Only apply to the specific bubble_content with platform profile links
    if (hasRightAlignedDiv && (hasSonemicLink || hasGlitchwaveLink) && !element.classList.contains('rym-ext-bubble-content-actions')) {
      element.classList.add('rym-ext-bubble-content-actions');
      console.log(`✅ Added rym-ext-bubble-content-actions class to platform links bubble_content:`, element);
    }
  });
}

// Function to add unique class to recommendations section
function addRecommendationsSectionClass() {
  console.log("Adding rym-recommendations-section class to recommendations div...");
  
  // Find divs with text-align:center that contain "Recommendations:" text
  const centerDivs = document.querySelectorAll('div[style*="text-align:center"]');
  
  centerDivs.forEach((element) => {
    // Check if this div contains the recommendations links
    const hasRecommendationsText = element.textContent && element.textContent.includes('Recommendations:');
    const hasRecommendationsLink = element.querySelector('a[href*="/recommendations/"]');
    
    // Only apply to the recommendations section
    if (hasRecommendationsText && hasRecommendationsLink && !element.classList.contains('rym-recommendations-section')) {
      element.classList.add('rym-recommendations-section');
      console.log(`✅ Added rym-recommendations-section class to recommendations div:`, element);
    }
  });
}

// Observer to handle dynamically added bubble_content and recommendations elements
function setupBubbleContentObserver() {
  try {
    const targetNode = document.body || document.documentElement;
    if (!targetNode) {
      console.error('Bubble content observer: no target node');
      return;
    }
    
    let scheduled = false;
    const observer = new MutationObserver(() => {
      if (scheduled) return;
      scheduled = true;
      setTimeout(() => {
        addBubbleContentCompactClass();
        addActionButtonsBubbleContentClass();
        addRecommendationsSectionClass();
        scheduled = false;
      }, 50);
    });
    
    observer.observe(targetNode, { childList: true, subtree: true });
    console.log('Bubble content and recommendations observer set up');
  } catch (e) {
    console.error('Error setting bubble content observer:', e);
  }
}

