// ========================================
// RYM Extension - Main Entry Point
// ========================================

// EXTENSION LOAD MARKER - This should appear immediately
console.log("🚀 RYM Extension content script starting to load...");
console.log("Current URL:", window.location.href);
console.log("Document ready state:", document.readyState);
console.log("User agent:", navigator.userAgent);
console.log("Extension context:", typeof chrome !== 'undefined' ? 'Chrome extension' : 'Unknown context');

// Add to window for debugging
window.RYM_EXTENSION_LOADED = true;
window.RYM_EXTENSION_VERSION = "1.0-debug";

// NOTE: All functions are loaded from separate script files in the manifest.json
// They are available in the global scope without needing imports

// Enhanced initialization with comprehensive debugging
function initializeRYMExtension() {
  console.log('=== RYM EXTENSION INITIALIZATION START ===');
  
  // Debug current state
  const debugInfo = debugGlobeInitialization();
  
  // Core UI improvements
  try {
    console.log('Applying header redesign...');
    rearrangeHeader();
    
    console.log('Loading stylesheets...');
    loadStylesheet('styles/listening.css');
    loadStylesheet('styles/profile.css');
    loadStylesheet('styles/musicmap.css');
    
    console.log('Redesigning components...');
    redesignListeningComponent();
    setupListeningObserver();
    repositionPlatformLogos();
    addUniqueProfileIdentifiers();
    restyleProfilePicture();
    injectMusicTitleClass();
    addCustomBubbleHeaderClass();
    addCustomFilmBubbleHeaderClass();
    addBubbleContentCompactClass();
    addActionButtonsBubbleContentClass();
    addRecommendationsSectionClass();
    setupBubbleContentObserver();
    
    // Release page improvements
    moveTracklistTotalToHeader();
    setupReleasePageObserver();
    
    // Remove empty spacer rows detected on profile pages
    removeEmptySpacerRows();
    setupSpacerRowObserver();
    
    // Add unique class to usermap element for Three.js targeting
    setTimeout(() => addUsermapUniqueClass(), 500);
    
    // Initialize theme controller
    initializeThemeController();
    
    // Initialize cursor shimmer effect for toolbar
    initializeCursorShimmer();
    
    console.log('Core UI improvements completed successfully');
  } catch (error) {
    console.error('Error during core UI initialization:', error);
  }
  
  // Initialize custom Three.js element
  try {
    console.log('Initializing custom Three.js element...');
    initCustomThreeElement();
  } catch (error) {
    console.error('Error during custom Three.js initialization:', error);
  }
  
  // Enhanced globe initialization with proper page detection
  try {
    console.log('Starting globe initialization...');
    
    // Single initialization path - avoid duplicates
    if (!window.RYM_GLOBE_INIT_STARTED) {
      window.RYM_GLOBE_INIT_STARTED = true;
      
      // Use the smart initialization for musicmap pages
      if (window.location.pathname.includes('/musicmap/')) {
        console.log('🎯 Detected musicmap page, using smart initialization');
        setTimeout(() => {
          if (typeof window.initMusicmapGlobeWithData === 'function') {
            window.initMusicmapGlobeWithData();
          } else {
            console.log('⚠️ Smart init not available, falling back to standard');
            handleMusicmapPage();
          }
        }, 1000);
      } else {
        handleMusicmapPage();
      }
    } else {
      console.log('Globe initialization already started, skipping duplicate');
    }
    
    console.log('Globe initialization sequence started');
  } catch (error) {
    console.error('Error during globe initialization:', error);
  }
  
  // Export debug functions for console use
  setupDebugFunctions();
  
  console.log('=== RYM EXTENSION INITIALIZATION COMPLETE ===');
}

// Setup all debug functions for console use
function setupDebugFunctions() {
  window.debugRYMGlobe = debugGlobeInitialization;
  
  // Export removal function for console use
  window.removeEmptySpacerRows = removeEmptySpacerRows;
  
  window.forceGlobeReinit = () => {
    if (window.enhancedGlobeManager) {
      const container = document.querySelector('.rym-music-globe-container');
      if (container) {
        return window.enhancedGlobeManager.forceReinitialize(container);
      } else {
        console.log('No globe container found, running full reinitialization...');
        return handleMusicmapPage();
      }
    } else {
      console.error('Globe manager not available');
    }
  };
  
  // Export usermap class functions for console use
  window.addUsermapClass = addUsermapUniqueClass;
  window.checkUsermapClass = () => {
    const usermap = document.querySelector('#usermap');
    if (usermap) {
      return {
        element: usermap,
        id: usermap.id,
        classes: Array.from(usermap.classList),
        hasRYMClasses: usermap.classList.contains('rym-ext-usermap-container'),
        dataAttributes: {
          component: usermap.getAttribute('data-rym-component'),
          enhanced: usermap.getAttribute('data-rym-enhanced')
        }
      };
    } else {
      return { error: 'Usermap element not found' };
    }
  };
  
  window.getGlobeStatus = () => {
    return window.enhancedGlobeManager?.getStatus() || { error: 'Globe manager not available' };
  };
  
  window.forceMusicmapGlobe = () => {
    console.log('🔄 MANUAL: Forcing musicmap globe creation...');
    return initMusicmapGlobe();
  };
  
  window.testGlobeDetection = () => {
    return {
      isMusicmapPage: detectMusicmapPage(),
      containers: {
        usermap: !!document.querySelector('#usermap'),
        leafletContainer: !!document.querySelector('.leaflet-container'),
        bubbleContent: !!document.querySelector('.bubble_content'),
        content: !!document.querySelector('#content'),
        existingGlobe: !!document.querySelector('.rym-music-globe-container')
      },
      mapLocationsData: !!window.mapLocations,
      threejsLoaded: typeof THREE !== 'undefined',
      enhancedGlobeLoaded: typeof window.initEnhancedRYMGlobe === 'function'
    };
  };
  
  // Quick fix function for users
  window.fixGlobeCoordinates = () => {
    console.log('🔧 Attempting to fix globe coordinates...');
    
    if (window.location.pathname.includes('/musicmap/')) {
      console.log('🎯 On musicmap page, checking data...');
      
      if (window.mapLocations) {
        console.log('✅ mapLocations found, forcing globe reload...');
        if (typeof window.forceReloadGlobe === 'function') {
          window.forceReloadGlobe();
        } else if (typeof window.initMusicmapGlobeWithData === 'function') {
          window.initMusicmapGlobeWithData();
        } else {
          console.log('⚠️ No reload functions available, trying manual reinit...');
          window.forceMusicmapGlobe();
        }
      } else {
        console.log('❌ No mapLocations data found yet. Try refreshing the page.');
      }
    } else {
      console.log('❌ Not on a musicmap page');
    }
  };
  
  // Three.js conflict management functions
  window.checkAllThreeJSConflicts = () => {
    console.log('🔍 === THREE.JS CONFLICT CHECK ===');
    if (typeof window.checkForThreeJSConflicts === 'function') {
      const conflicts = window.checkForThreeJSConflicts();
      console.log('Conflict status:', conflicts);
      return conflicts;
    } else {
      console.log('❌ Conflict check function not available');
      return { error: 'Function not loaded' };
    }
  };
  
  window.debugAllThreeJS = () => {
    console.log('🔍 === ALL THREE.JS DEBUG INFO ===');
    console.log('Enhanced Globe Status:', window.getGlobeStatus ? window.getGlobeStatus() : 'Not available');
    console.log('Custom Element Status:', window.getCustomElementStatus ? window.getCustomElementStatus() : 'Not available');
    if (typeof window.debugCustomThreeJS === 'function') {
      window.debugCustomThreeJS();
    }
    if (typeof window.checkAllThreeJSConflicts === 'function') {
      window.checkAllThreeJSConflicts();
    }
  };
  
  // Export utility for selecting bubble content
  window.addCompactToSelected = addCompactClassToSelectedElement;
}

// Initialize cursor shimmer effect for toolbar buttons
function initializeCursorShimmer() {
  // Function to add shimmer tracking to toolbar elements
  function addShimmerTracking() {
    const toolbarButtons = document.querySelectorAll('.musictoolbar a');
    
    toolbarButtons.forEach(button => {
      // Skip if already initialized
      if (button.hasAttribute('data-shimmer-initialized')) return;
      button.setAttribute('data-shimmer-initialized', 'true');
      
      button.addEventListener('mousemove', (e) => {
        const rect = button.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        
        button.style.setProperty('--mouse-x', `${x}%`);
        button.style.setProperty('--mouse-y', `${y}%`);
      });
      
      button.addEventListener('mouseleave', () => {
        button.style.setProperty('--mouse-x', '50%');
        button.style.setProperty('--mouse-y', '50%');
      });
    });
  }
  
  // Initial setup
  setTimeout(addShimmerTracking, 500);
  
  // Re-run when toolbar might be dynamically added/updated
  const observer = new MutationObserver(() => {
    addShimmerTracking();
  });
  
  // Observe the document for toolbar additions
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}

// Run when DOM is ready
if (document.readyState === 'complete' || document.readyState === 'interactive') {
  console.log("🔥 Running RYM Extension initialization immediately (DOM ready)");
  initializeRYMExtension();
} else {
  console.log("⏰ Waiting for DOMContentLoaded to run RYM Extension");
  document.addEventListener("DOMContentLoaded", initializeRYMExtension);
}

console.log("📜 RYM Extension content script fully loaded!");

