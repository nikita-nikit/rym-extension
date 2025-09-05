/**
 * Musicmap Page Analysis Script
 * Run these commands in the browser console on a musicmap page
 */

console.log("🔍 Musicmap Debug script loading...");

// Function to analyze musicmap page structure
function analyzeMusicmapPage() {
  console.log('=== MUSICMAP PAGE ANALYSIS ===');
  
  // 1. Check current page URL and type
  console.log('Current URL:', window.location.href);
  console.log('Is musicmap page:', window.location.pathname.includes('/musicmap/'));
  
  // 2. Look for different types of map containers
  const mapContainers = {
    'music_map': document.querySelector('#music_map'),
    'leaflet_container': document.querySelector('.leaflet-container'),
    'leaflet_map_pane': document.querySelector('.leaflet-map-pane'),
    'leaflet_overlay_pane': document.querySelector('.leaflet-overlay-pane'),
    'map_container': document.querySelector('.map-container'),
    'any_svg': document.querySelectorAll('svg'),
    'musicmap_elements': document.querySelectorAll('[id*="musicmap"], [class*="musicmap"]')
  };
  
  console.log('=== MAP CONTAINERS FOUND ===');
  Object.entries(mapContainers).forEach(([key, value]) => {
    if (value) {
      if (value.length !== undefined) {
        console.log(`${key}:`, value.length, 'elements found');
        if (value.length > 0) {
          console.log('  - First element:', value[0]);
        }
      } else {
        console.log(`${key}:`, value);
      }
    } else {
      console.log(`${key}: NOT FOUND`);
    }
  });
  
  // 3. Check for Leaflet map instances
  console.log('=== LEAFLET MAP INSTANCES ===');
  if (window.L && window.L.map) {
    console.log('Leaflet library loaded:', !!window.L);
  }
  
  // Look for map instances in window
  const leafletMaps = [];
  for (const key in window) {
    if (key.includes('map') || key.includes('Map')) {
      try {
        const obj = window[key];
        if (obj && obj._container) {
          console.log('Potential Leaflet map found:', key, obj);
          leafletMaps.push({name: key, map: obj});
        }
      } catch (e) {
        // Ignore access errors
      }
    }
  }
  
  // 4. Look for location data in different formats
  console.log('=== LOCATION DATA ANALYSIS ===');
  
  // Check for circle elements (SVG markers)
  const circles = document.querySelectorAll('circle');
  console.log('SVG circles found:', circles.length);
  if (circles.length > 0) {
    console.log('First 3 circles:', Array.from(circles).slice(0, 3).map(c => ({
      cx: c.getAttribute('cx'),
      cy: c.getAttribute('cy'),
      r: c.getAttribute('r'),
      style: c.getAttribute('style'),
      parent: c.parentElement.tagName
    })));
  }
  
  // Check for mapLocations data
  console.log('mapLocations data available:', !!window.mapLocations);
  if (window.mapLocations) {
    const meCount = window.mapLocations.me ? Object.keys(window.mapLocations.me).length : 0;
    const artistCount = window.mapLocations.artists ? Object.keys(window.mapLocations.artists).length : 0;
    console.log(`mapLocations contains: ${meCount} user locations, ${artistCount} artist locations`);
    
    if (meCount > 0) {
      console.log('Sample user location:', Object.entries(window.mapLocations.me)[0]);
    }
    if (artistCount > 0) {
      console.log('Sample artist location:', Object.entries(window.mapLocations.artists)[0]);
    }
  }
  
  // Check for data attributes that might contain coordinates
  const elementsWithData = document.querySelectorAll('[data-lat], [data-lng], [data-latitude], [data-longitude], [data-coords], [data-location]');
  console.log('Elements with coordinate data attributes:', elementsWithData.length);
  if (elementsWithData.length > 0) {
    console.log('Coordinate data elements:', Array.from(elementsWithData).slice(0, 5).map(el => ({
      tagName: el.tagName,
      id: el.id,
      className: el.className,
      dataAttrs: Object.keys(el.dataset).filter(key => 
        key.includes('lat') || key.includes('lng') || key.includes('coord') || key.includes('location')
      ),
      dataset: el.dataset
    })));
  }
  
  // 5. Check for JavaScript variables that might contain location data
  console.log('=== JAVASCRIPT VARIABLES ===');
  const potentialDataVars = ['markers', 'locations', 'coordinates', 'geoData', 'mapData', 'artistData'];
  potentialDataVars.forEach(varName => {
    if (window[varName]) {
      console.log(`window.${varName}:`, window[varName]);
    }
  });
  
  // 6. Check for embedded JSON data
  const scriptTags = document.querySelectorAll('script[type="application/json"], script:not([src])');
  console.log('=== EMBEDDED DATA ===');
  console.log('Script tags with potential data:', scriptTags.length);
  
  scriptTags.forEach((script, index) => {
    const content = script.textContent || script.innerText;
    if (content && (content.includes('lat') || content.includes('lng') || content.includes('coordinate') || content.includes('location'))) {
      console.log(`Script ${index} contains location data:`, content.substring(0, 200) + '...');
      try {
        const parsed = JSON.parse(content);
        console.log(`  - Parsed JSON:`, parsed);
      } catch (e) {
        console.log(`  - Not valid JSON, checking for coordinates in text`);
        const coordRegex = /-?\d+\.?\d*[,\s]+-?\d+\.?\d*/g;
        const coordinates = content.match(coordRegex);
        if (coordinates) {
          console.log(`  - Found coordinate patterns:`, coordinates.slice(0, 5));
        }
      }
    }
  });
  
  // 7. Check network requests for map data
  console.log('=== NETWORK ANALYSIS ===');
  console.log('Check Network tab for:');
  console.log('- XHR/Fetch requests to endpoints containing "map", "location", "coordinate", "marker"');
  console.log('- JSON responses with geographic data');
  console.log('- Tile requests (if using tile-based maps)');
  
  return {
    containers: mapContainers,
    leafletMaps: leafletMaps,
    circles: circles.length,
    leafletMarkers: leafletMarkers.length,
    dataElements: elementsWithData.length
  };
}

// Function to extract all possible location data
function extractAllLocationData() {
  console.log('=== EXTRACTING ALL LOCATION DATA ===');
  
  const locationData = [];
  
  // Method 1: SVG Circles
  const circles = document.querySelectorAll('circle');
  circles.forEach((circle, index) => {
    const cx = parseFloat(circle.getAttribute('cx'));
    const cy = parseFloat(circle.getAttribute('cy'));
    const r = parseFloat(circle.getAttribute('r')) || 3;
    
    if (!isNaN(cx) && !isNaN(cy)) {
      locationData.push({
        method: 'svg-circle',
        index: index,
        cx: cx,
        cy: cy,
        radius: r,
        element: circle,
        parent: circle.parentElement.tagName
      });
    }
  });
  
  // Method 2: Check for JavaScript mapLocations data
  if (window.mapLocations) {
    console.log('Found mapLocations data:', window.mapLocations);
    
    if (window.mapLocations.me) {
      Object.entries(window.mapLocations.me).forEach(([locId, locData], index) => {
        if (locData.la && locData.lo) {
          locationData.push({
            method: 'maplocations-me',
            index: index,
            lat: locData.la,
            lng: locData.lo,
            count: locData.count,
            locId: locId,
            data: locData
          });
        }
      });
    }
    
    if (window.mapLocations.artists) {
      Object.entries(window.mapLocations.artists).forEach(([locId, locData], index) => {
        if (locData.la && locData.lo) {
          locationData.push({
            method: 'maplocations-artists',
            index: index,
            lat: locData.la,
            lng: locData.lo,
            count: locData.count,
            artists: locData.artists,
            locId: locId,
            data: locData
          });
        }
      });
    }
  }
  
  // Method 3: Data Attributes
  const dataElements = document.querySelectorAll('[data-lat], [data-lng], [data-latitude], [data-longitude]');
  dataElements.forEach((element, index) => {
    const lat = element.dataset.lat || element.dataset.latitude;
    const lng = element.dataset.lng || element.dataset.longitude;
    
    if (lat && lng) {
      locationData.push({
        method: 'data-attributes',
        index: index,
        lat: parseFloat(lat),
        lng: parseFloat(lng),
        element: element
      });
    }
  });
  
  console.log(`Found ${locationData.length} location data points:`, locationData);
  return locationData;
}

// Function to monitor for dynamic content loading
function monitorDynamicContent() {
  console.log('=== MONITORING DYNAMIC CONTENT ===');
  
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === 1) { // Element node
            // Check if new location elements were added
            const newLocationElements = node.querySelectorAll ? node.querySelectorAll('circle, [data-lat]') : [];
            if (newLocationElements.length > 0) {
              console.log('New location elements detected:', newLocationElements);
            }
            
            // Check if mapLocations data became available
            if (window.mapLocations && !window.mapLocationsDetected) {
              console.log('mapLocations data just became available!', window.mapLocations);
              window.mapLocationsDetected = true;
            }
          }
        });
      }
    });
  });
  
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
  
  console.log('Mutation observer started. New markers will be logged automatically.');
  
  // Stop monitoring after 30 seconds
  setTimeout(() => {
    observer.disconnect();
    console.log('Mutation observer stopped.');
  }, 30000);
}

// Export functions for console use
if (typeof window !== 'undefined') {
  window.analyzeMusicmapPage = analyzeMusicmapPage;
  window.extractAllLocationData = extractAllLocationData;
  window.monitorDynamicContent = monitorDynamicContent;
  
  // Auto-run analysis if this script is loaded
  if (document.readyState === 'complete') {
    console.log('Running automatic musicmap analysis...');
    analyzeMusicmapPage();
  } else {
    document.addEventListener('DOMContentLoaded', () => {
      console.log('Running automatic musicmap analysis...');
      analyzeMusicmapPage();
    });
  }
}
