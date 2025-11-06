// ========================================
// Three.js Globe Initialization
// ========================================

// Enhanced globe initialization function with musicmap support
let lastGlobeInit = 0;
const GLOBE_INIT_THROTTLE = 2000; // 2 seconds

function initMusicGlobe(force = false) {
  const now = Date.now();
  
  // Throttle initialization unless forced
  if (!force && (now - lastGlobeInit) < GLOBE_INIT_THROTTLE) {
    console.log('Globe initialization throttled, skipping...');
    return;
  }
  
  // Check for enhanced globe initialization function
  if (typeof window.initEnhancedRYMGlobe === 'function') {
    console.log('Initializing enhanced music globe with musicmap support...', force ? '(forced)' : '');
    window.initEnhancedRYMGlobe();
    lastGlobeInit = now;
  } else if (typeof window.initRYMMusicGlobes === 'function') {
    console.log('Falling back to standard music globes...', force ? '(forced)' : '');
    window.initRYMMusicGlobes(force);
    lastGlobeInit = now;
  } else {
    console.warn('No globe initialization function found. Make sure enhanced-globe.js or globe.js is loaded.');
  }
}

// Function to add unique class to usermap element for Three.js component
function addUsermapUniqueClass() {
  console.log('Adding unique class to usermap element...');
  
  const usermapElement = document.querySelector('#usermap');
  
  if (usermapElement) {
    // Add unique class for our Three.js component identification
    usermapElement.classList.add('rym-ext-usermap-container');
    usermapElement.classList.add('rym-ext-threejs-target');
    
    // Add data attribute for additional identification
    usermapElement.setAttribute('data-rym-component', 'usermap-threejs');
    usermapElement.setAttribute('data-rym-enhanced', 'true');
    
    console.log('✅ Added unique classes to usermap element:', {
      id: usermapElement.id,
      classes: Array.from(usermapElement.classList),
      dataAttributes: {
        component: usermapElement.getAttribute('data-rym-component'),
        enhanced: usermapElement.getAttribute('data-rym-enhanced')
      }
    });
    
    return usermapElement;
  } else {
    console.log('❌ Usermap element (#usermap) not found');
    return null;
  }
}

// Enhanced musicmap page detection and initialization
function detectMusicmapPage() {
  const url = window.location.href.toLowerCase();
  const pathname = window.location.pathname.toLowerCase();
  
  // Multiple detection methods with correct URL pattern
  const isMusicmapURL = pathname.includes('/musicmap/') || 
                       pathname.startsWith('/musicmap') ||
                       url.includes('musicmap') ||
                       (pathname.includes('/~') && url.includes('musicmap'));
  
  // Check for actual musicmap container and other indicators
  const hasMusicmapElements = document.querySelector('#usermap') !== null ||
                             document.querySelector('[id*="musicmap"], [class*="musicmap"]') !== null;
  const hasLeafletMap = document.querySelector('.leaflet-container') !== null;
  const hasSVGWithCircles = Array.from(document.querySelectorAll('svg')).some(svg => 
    svg.querySelectorAll('circle').length >= 2
  );
  const isMusicmapTitle = document.title.toLowerCase().includes('music map');
  
  // Additional checks for common musicmap page elements
  const hasMapRelatedElements = document.querySelector('.leaflet-map-pane, .leaflet-overlay-pane, .leaflet-marker-pane') !== null;
  const hasMapScript = Array.from(document.querySelectorAll('script')).some(script => 
    script.textContent && (script.textContent.includes('mapLocations') || script.textContent.includes('L.map'))
  );
  
  const isMusicmapPage = isMusicmapURL || hasMusicmapElements || hasLeafletMap || hasSVGWithCircles || isMusicmapTitle || hasMapRelatedElements || hasMapScript;
  
  // Add unique class to usermap if we detect it's a musicmap page
  if (isMusicmapPage) {
    setTimeout(() => addUsermapUniqueClass(), 100);
  }
  
  console.log('Musicmap page detection:', {
    url: isMusicmapURL,
    elements: hasMusicmapElements,
    leaflet: hasLeafletMap,
    svgCircles: hasSVGWithCircles,
    title: isMusicmapTitle,
    mapElements: hasMapRelatedElements,
    mapScript: hasMapScript,
    usermapExists: !!document.querySelector('#usermap'),
    final: isMusicmapPage
  });
  
  return isMusicmapPage;
}

// Musicmap-specific initialization with enhanced detection
function initMusicmapGlobe() {
  console.log('Initializing musicmap-specific globe...');
  
  // Run musicmap analysis if available
  if (typeof window.analyzeMusicmapPage === 'function') {
    setTimeout(() => {
      console.log('Running musicmap page analysis...');
      window.analyzeMusicmapPage();
    }, 1000);
  }
  
  // Initialize enhanced globe with proper timing
  const initAttempt = (retry = 0) => {
    if (retry > 0) {
      console.log(`Musicmap globe init attempt ${retry + 1}`);
    }
    
    // Check if THREE.js is loaded
    if (typeof THREE === 'undefined') {
      if (retry < 5) {
        setTimeout(() => initAttempt(retry + 1), 500);
        return;
      } else {
        console.error('THREE.js not loaded after multiple attempts');
        return;
      }
    }
    
    // Check if enhanced globe function is available
    if (typeof window.initEnhancedRYMGlobe !== 'function') {
      if (retry < 5) {
        setTimeout(() => initAttempt(retry + 1), 500);
        return;
      } else {
        console.error('Enhanced globe function not available');
        return;
      }
    }
    
    // Initialize the enhanced globe
    try {
      window.initEnhancedRYMGlobe();
      console.log('Musicmap globe initialization completed successfully');
    } catch (error) {
      console.error('Error initializing musicmap globe:', error);
      
      // Fallback to standard globe if available
      if (typeof window.initRYMMusicGlobes === 'function') {
        console.log('Falling back to standard globe initialization');
        window.initRYMMusicGlobes(true);
      }
    }
  };
  
  // Start initialization with appropriate delay
  setTimeout(() => initAttempt(), 1000);
}

// Standard globe initialization for non-musicmap pages
function initStandardPageGlobe() {
  console.log('Initializing globe for standard page...');
  
  const initAttempt = (retry = 0) => {
    if (typeof THREE === 'undefined' || typeof window.initEnhancedRYMGlobe !== 'function') {
      if (retry < 3) {
        setTimeout(() => initAttempt(retry + 1), 500);
        return;
      } else {
        console.warn('Globe dependencies not loaded, skipping globe initialization');
        return;
      }
    }
    
    try {
      window.initEnhancedRYMGlobe();
      console.log('Standard page globe initialization completed');
    } catch (error) {
      console.error('Error initializing standard globe:', error);
    }
  };
  
  setTimeout(() => initAttempt(), 500);
}

// Custom Three.js element initialization function
function initCustomThreeElement() {
  console.log('Starting custom Three.js element initialization...');
  
  // Wait for dependencies
  const initAttempt = (retry = 0) => {
    if (typeof THREE === 'undefined' || typeof window.initRYMCustomThreeElement !== 'function') {
      if (retry < 5) {
        console.log(`Custom Three.js dependencies not ready, retrying... (${retry + 1}/5)`);
        setTimeout(() => initAttempt(retry + 1), 500);
        return;
      } else {
        console.warn('Custom Three.js dependencies not loaded after multiple attempts');
        return;
      }
    }
    
    // Check for conflicts with enhanced globe
    if (typeof window.checkForThreeJSConflicts === 'function') {
      const conflictCheck = window.checkForThreeJSConflicts();
      console.log('Conflict check before custom element init:', conflictCheck);
      
      if (conflictCheck.hasConflicts) {
        console.warn('Potential conflict detected, skipping custom Three.js element initialization:', conflictCheck.conflictType);
        return;
      }
    }
    
    try {
      // Initialize the custom Three.js element
      const customElement = window.initRYMCustomThreeElement('rym-custom-three-display');
      
      if (customElement) {
        console.log('Custom Three.js element initialized successfully');
        
        // Store reference globally for debugging
        window.rymCustomElement = customElement;
        
        // Add to debug functions
        window.destroyCustomElement = () => {
          if (window.rymCustomThreeManager) {
            window.rymCustomThreeManager.destroyAll();
            console.log('All custom Three.js elements destroyed');
          }
        };
        
        window.getCustomElementStatus = () => {
          return {
            managerExists: !!window.rymCustomThreeManager,
            instanceCount: window.rymCustomThreeManager ? window.rymCustomThreeManager.getInstanceCount() : 0,
            instances: window.rymCustomThreeManager ? window.rymCustomThreeManager.getAllInstances().map(i => i.uniqueId) : []
          };
        };
        
      } else {
        console.error('Failed to initialize custom Three.js element');
      }
      
    } catch (error) {
      console.error('Error during custom Three.js element initialization:', error);
    }
  };
  
  // Start initialization with delay to ensure DOM is ready
  setTimeout(() => initAttempt(), 1000);
}

// Enhanced page handling with better detection
function handleMusicmapPage() {
  const isMusicmapPage = detectMusicmapPage();
  
  if (isMusicmapPage) {
    console.log('Detected musicmap page, using enhanced initialization');
    initMusicmapGlobe();
    
    // Set up observer for dynamic content loading on musicmap pages
    setupMusicmapObserver();
    return true;
  } else {
    console.log('Standard page detected, using standard globe initialization');
    initStandardPageGlobe();
    return false;
  }
}

// MutationObserver for musicmap pages to detect when map content loads
function setupMusicmapObserver() {
  console.log('Setting up musicmap content observer...');
  
  let hasTriggered = false;
  
  const observer = new MutationObserver((mutations) => {
    if (hasTriggered) return;
    
    let shouldReinitialize = false;
    
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
        // Check if new map-related elements were added
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === 1) { // Element node
            const hasMapElements = node.querySelectorAll ? 
              node.querySelectorAll('.leaflet-container, .leaflet-map-pane, svg, circle, [class*="marker"]').length > 0 : false;
            
            if (hasMapElements) {
              console.log('New map elements detected:', node);
              shouldReinitialize = true;
            }
          }
        });
      }
    });
    
    if (shouldReinitialize && !hasTriggered) {
      hasTriggered = true;
      console.log('Dynamic map content detected, reinitializing globe...');
      
      // Wait a bit for content to settle, then reinitialize
      setTimeout(() => {
        // Check if globe hasn't been created yet
        if (!window.enhancedGlobeManager?.hasGlobe()) {
          console.log('No globe found, attempting reinitialization...');
          try {
            window.initEnhancedRYMGlobe();
          } catch (error) {
            console.error('Error during globe reinitialization:', error);
          }
        } else {
          console.log('Globe already exists, skipping reinitialization');
        }
      }, 2000);
      
      // Stop observing after first trigger
      observer.disconnect();
    }
  });
  
  // Observe the whole document for changes
  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: false
  });
  
  // Stop observing after 15 seconds to prevent endless watching
  setTimeout(() => {
    observer.disconnect();
    console.log('Musicmap observer stopped after timeout');
  }, 15000);
}

// Debug function to analyze current page state
function debugGlobeInitialization() {
  console.log('=== GLOBE INITIALIZATION DEBUG ===');
  console.log('URL:', window.location.href);
  console.log('Pathname:', window.location.pathname);
  console.log('Document ready state:', document.readyState);
  
  // Check dependencies
  console.log('THREE.js loaded:', typeof THREE !== 'undefined');
  console.log('Enhanced globe function available:', typeof window.initEnhancedRYMGlobe === 'function');
  console.log('Musicmap analysis available:', typeof window.analyzeMusicmapPage === 'function');
  console.log('Globe manager available:', !!window.enhancedGlobeManager);
  
  // Check page elements
  const mapElements = {
    'usermap': document.querySelector('#usermap'),              // Primary musicmap container
    'music_map': document.querySelector('#music_map'),         // Secondary map container
    'leaflet_container': document.querySelector('.leaflet-container'),
    'leaflet_map_pane': document.querySelector('.leaflet-map-pane'),
    'leaflet_overlay_pane': document.querySelector('.leaflet-overlay-pane'),
    'svg_elements': document.querySelectorAll('svg'),
    'circles': document.querySelectorAll('circle'),
    'markers': document.querySelectorAll('.leaflet-marker-icon, [class*="marker"]'),
    'musicmap_elements': document.querySelectorAll('[id*="musicmap"], [class*="musicmap"]')
  };
  
  console.log('Page elements found:');
  Object.entries(mapElements).forEach(([key, value]) => {
    if (value && value.length !== undefined) {
      console.log(`  ${key}:`, value.length, 'elements');
    } else {
      console.log(`  ${key}:`, !!value);
    }
  });
  
  // Check if globe already exists
  if (window.enhancedGlobeManager) {
    console.log('Globe manager state:', {
      hasGlobe: window.enhancedGlobeManager.hasGlobe(),
      isInitializing: window.enhancedGlobeManager.isInitializing
    });
  }
  
  // Check for existing globe containers
  const existingGlobes = document.querySelectorAll('.rym-music-globe-container');
  console.log('Existing globe containers:', existingGlobes.length);
  
  console.log('=== END DEBUG ===');
  
  return {
    dependencies: {
      threejs: typeof THREE !== 'undefined',
      enhancedGlobe: typeof window.initEnhancedRYMGlobe === 'function',
      globeManager: !!window.enhancedGlobeManager
    },
    elements: mapElements,
    existingGlobes: existingGlobes.length
  };
}

