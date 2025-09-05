/**
 * Enhanced RYM Music Globe Implementation
 * Circle-based data visualization
 */

console.log("🌍 Circle-based Globe script loading...");
console.log("THREE.js available:", typeof THREE !== 'undefined');

class EnhancedRYMGlobe {
  constructor(container) {
    this.container = container;
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.globe = null;
    this.animationId = null;
    this.locationMarkers = [];
    this.isDestroyed = false;
    
    // Simplified mouse controls
    this.mouse = new THREE.Vector2();
    this.isDragging = false;
    this.previousMouse = { x: 0, y: 0 };
    
    this.init();
  }
  
  init() {
    try {
      console.log('Initializing Circle-based RYM Globe...');
      this.createScene();
      this.createGlobe();
      this.createLighting();
      this.addLocationMarkers();
      this.setupControls();
      this.animate();
      console.log('Circle-based globe initialized successfully');
    } catch (error) {
      console.error('Failed to initialize globe:', error);
      this.createFallback();
    }
  }
  
  createScene() {
    const width = this.container.offsetWidth || 800;
    const height = this.container.offsetHeight || 400;
    
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x000511);
    
    this.camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    this.camera.position.set(0, 0, 3);
    
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    this.container.appendChild(this.renderer.domElement);
    
    // Add starfield
    this.addStarfield();
  }
  
  addStarfield() {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(1000 * 3);
    
    for (let i = 0; i < 1000 * 3; i += 3) {
      const radius = 50;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      
      positions[i] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i + 2] = radius * Math.cos(phi);
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    
    const material = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.5,
      transparent: true,
      opacity: 0.8
    });
    
    const stars = new THREE.Points(geometry, material);
    this.scene.add(stars);
  }
  
  createGlobe() {
    const geometry = new THREE.SphereGeometry(1, 64, 32);
    const material = new THREE.MeshPhongMaterial({
      color: 0x2e5984,
      shininess: 30,
      transparent: false
    });
    
    this.globe = new THREE.Mesh(geometry, material);
    this.scene.add(this.globe);
    
    // Simple atmosphere
    const atmosphereGeometry = new THREE.SphereGeometry(1.05, 32, 16);
    const atmosphereMaterial = new THREE.MeshBasicMaterial({
      color: 0x87ceeb,
      transparent: true,
      opacity: 0.15,
      side: THREE.BackSide
    });
    
    const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
    this.scene.add(atmosphere);
  }
  
  createLighting() {
    const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
    this.scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
    directionalLight.position.set(5, 3, 5);
    this.scene.add(directionalLight);
  }
  
  // Circle-based data extraction
  extractRYMLocationData() {
    console.log('🔍 === CIRCLE DATA EXTRACTION ===');
    
    let locations = this.extractCircleData();
    
    // Final fallback to demo data
    if (locations.length === 0) {
      console.log('🎭 No location data found, using fallback locations');
      locations = this.getFallbackLocations();
    }
    
    console.log(`📊 Final location count: ${locations.length}`);
    if (locations.length > 0) {
      console.log('📍 Locations found:', locations);
    }
    return locations;
  }
  

  // Circle data extraction
  extractCircleData() {
    console.log('Extracting circle data...');
    const locations = [];
    
    const mapElement = this.findBestMapSource();
    if (!mapElement) {
      return locations;
    }
    
    const circles = mapElement.querySelectorAll('circle');
    console.log(`Found ${circles.length} circle elements`);
    
    circles.forEach((circle, index) => {
      const location = this.parseCircleSimple(circle, index);
      if (location) {
        locations.push(location);
      }
    });
    
    return locations;
  }
  
  findBestMapSource() {
    const selectors = [
      '#music_map',
      '.leaflet-container',
      'svg:has(circle)',
      'svg'
    ];
    
    for (const selector of selectors) {
      try {
        const elements = document.querySelectorAll(selector);
        for (const element of elements) {
          const circles = element.querySelectorAll('circle');
          if (circles.length >= 2) {
            return element;
          }
        }
      } catch (e) {
        console.warn(`Selector "${selector}" failed:`, e);
      }
    }
    
    return null;
  }
  
  parseCircleSimple(circle, index) {
    const cx = parseFloat(circle.getAttribute('cx'));
    const cy = parseFloat(circle.getAttribute('cy'));
    const radius = parseFloat(circle.getAttribute('r')) || 3;
    
    if (isNaN(cx) || isNaN(cy)) {
      return null;
    }
    
    // Simple coordinate mapping
    const mapBounds = { minX: -400, maxX: 400, minY: -200, maxY: 200 };
    const normalizedX = (cx - mapBounds.minX) / (mapBounds.maxX - mapBounds.minX);
    const normalizedY = (cy - mapBounds.minY) / (mapBounds.maxY - mapBounds.minY);
    
    const lng = (normalizedX * 360) - 180;
    const lat = 85 - (normalizedY * 170);
    
    if (lng < -180 || lng > 180 || lat < -85 || lat > 85) {
      return null;
    }
    
    return {
      name: this.getLocationName(circle, cx, cy),
      lat: lat,
      lng: lng,
      artists: Math.max(1, Math.round(radius * radius * 2)),
      source: 'svg-circle',
      svgCoords: { x: cx, y: cy, r: radius }
    };
  }
  

  
  getLocationName(circle, cx, cy) {
    const name = circle.getAttribute('data-name') || 
                 circle.getAttribute('title') ||
                 circle.getAttribute('data-location');
    
    if (name && name.trim()) {
      return name.trim();
    }
    
    return `Location ${Math.round(cx)},${Math.round(cy)}`;
  }
  
  getFallbackLocations() {
    return [
      { name: 'New York', lat: 40.7128, lng: -74.0060, artists: 125, source: 'fallback' },
      { name: 'London', lat: 51.5074, lng: -0.1278, artists: 98, source: 'fallback' },
      { name: 'Tokyo', lat: 35.6762, lng: 139.6503, artists: 87, source: 'fallback' },
      { name: 'Los Angeles', lat: 34.0522, lng: -118.2437, artists: 76, source: 'fallback' },
      { name: 'Berlin', lat: 52.5200, lng: 13.4050, artists: 65, source: 'fallback' },
      { name: 'Toronto', lat: 43.6532, lng: -79.3832, artists: 54, source: 'fallback' },
      { name: 'Sydney', lat: -33.8688, lng: 151.2093, artists: 43, source: 'fallback' },
      { name: 'Stockholm', lat: 59.3293, lng: 18.0686, artists: 32, source: 'fallback' }
    ];
  }
  
  addLocationMarkers() {
    console.log('🌍 Starting addLocationMarkers with circle data...');
    const locations = this.extractRYMLocationData();
    
    if (locations.length === 0) {
      console.warn('❌ No location data found for markers');
      console.log('🔍 Debug info:', {
        mapLocationsExists: !!window.mapLocations,
        mapLocationsData: window.mapLocations,
        currentURL: window.location.href
      });
      return;
    }
    
    console.log(`✅ Creating markers for ${locations.length} locations:`, locations);
    this.createMarkersFromData(locations);
  }
  
  createMarkersFromData(locations) {
    this.locationMarkers = [];
    
    locations.forEach(location => {
      const coords = this.latLngToVector3(location.lat, location.lng, 1.02);
      const size = Math.max(0.01, Math.min(0.03, location.artists / 2000));
      
      // Create marker with color based on data source
      const color = this.getMarkerColor(location.source);
      
      const markerGeometry = new THREE.SphereGeometry(size, 16, 16);
      const markerMaterial = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.9
      });
      
      const marker = new THREE.Mesh(markerGeometry, markerMaterial);
      marker.position.copy(coords);
      marker.userData = location;
      
      this.globe.add(marker);
      this.locationMarkers.push(marker);
      
      // Debug log
      console.log(`Marker: ${location.name} | Source: ${location.source} | Lat: ${location.lat.toFixed(2)} | Lng: ${location.lng.toFixed(2)} | Artists: ${location.artists}`);
    });
  }
  
  getMarkerColor(source) {
    // Different colors for different data sources for debugging
    switch (source) {
      case 'svg-circle': return 0xff4444; // Red for SVG circles
      case 'fallback': return 0x888888; // Gray for demo data
      default: return 0x00ff88; // Default bright green
    }
  }
  
  latLngToVector3(lat, lng, radius = 1) {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lng + 180) * (Math.PI / 180);
    
    return new THREE.Vector3(
      -radius * Math.sin(phi) * Math.cos(theta),
      radius * Math.cos(phi),
      radius * Math.sin(phi) * Math.sin(theta)
    );
  }
  
  setupControls() {
    // Raycaster for click detection
    this.raycaster = new THREE.Raycaster();
    this.clickDetectionEnabled = true;
    let clickStartTime = 0;
    
    // Simplified mouse controls
    this.container.addEventListener('mousedown', (e) => {
      this.isDragging = true;
      this.clickDetectionEnabled = true;
      clickStartTime = Date.now();
      this.previousMouse = { x: e.clientX, y: e.clientY };
    });
    
    this.container.addEventListener('mousemove', (e) => {
      if (this.isDragging && this.globe) {
        const deltaX = e.clientX - this.previousMouse.x;
        const deltaY = e.clientY - this.previousMouse.y;
        
        // If mouse moved significantly, disable click detection
        if (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5) {
          this.clickDetectionEnabled = false;
        }
        
        this.globe.rotation.y += deltaX * 0.005;
        this.globe.rotation.x += deltaY * 0.005;
        
        this.previousMouse = { x: e.clientX, y: e.clientY };
      }
    });
    
    this.container.addEventListener('mouseup', (e) => {
      const clickDuration = Date.now() - clickStartTime;
      
      // Only process click if it was a short click and mouse didn't move much
      if (this.clickDetectionEnabled && clickDuration < 200) {
        this.handleClick(e);
      }
      
      this.isDragging = false;
      this.clickDetectionEnabled = true;
    });
    
    this.container.addEventListener('mouseleave', () => {
      this.isDragging = false;
    });
    
    // Zoom with mouse wheel
    this.container.addEventListener('wheel', (e) => {
      e.preventDefault();
      if (this.camera) {
        this.camera.position.z += e.deltaY * 0.001;
        this.camera.position.z = Math.max(1.5, Math.min(5, this.camera.position.z));
      }
    });
  }
  
  handleClick(event) {
    if (!this.camera || !this.locationMarkers.length) return;
    
    const rect = this.container.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    
    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.locationMarkers);
    
    if (intersects.length > 0) {
      const marker = intersects[0].object;
      this.onMarkerClick(marker);
    } else {
      // Click on globe itself - navigate to current user's musicmap
      this.onGlobeClick();
    }
  }
  
  

  
  onGlobeClick() {
    console.log('Globe clicked - navigating to user music map');
    
    // Try to get username from multiple sources
    let username = this.getCurrentUsername();
    
    if (username) {
      console.log(`Navigating to musicmap for user: ${username}`);
      window.location.href = `https://rateyourmusic.com/musicmap/${username}`;
    }
  }

  getCurrentUsername() {
    // Method 1: Try to get username from profile name element
    const profileNameElement = document.querySelector('#profilename');
    if (profileNameElement && profileNameElement.textContent.trim()) {
      return profileNameElement.textContent.trim();
    }
    
    // Method 2: Try to extract from URL (profile pages typically have /~username format)
    const urlMatch = window.location.pathname.match(/\/~([^\/]+)/);
    if (urlMatch && urlMatch[1]) {
      return urlMatch[1];
    }
    
    // Method 3: Try to get from header profile username
    const headerUsername = document.querySelector('#header_profile_username');
    if (headerUsername && headerUsername.textContent.trim()) {
      return headerUsername.textContent.trim();
    }
    
    // Method 4: Try to extract from any profile-related links
    const profileLink = document.querySelector('a[href*="/~"]');
    if (profileLink) {
      const linkMatch = profileLink.href.match(/\/~([^\/]+)/);
      if (linkMatch && linkMatch[1]) {
        return linkMatch[1];
      }
    }
    
    console.warn('Could not determine username from any source');
    return null;
  }
  

  
  createClickFeedback(marker) {
    // Create a temporary ring effect around clicked marker
    const ringGeometry = new THREE.RingGeometry(0.02, 0.04, 16);
    const ringMaterial = new THREE.MeshBasicMaterial({ 
      color: 0xffffff, 
      transparent: true, 
      opacity: 0.8,
      side: THREE.DoubleSide
    });
    
    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.position.copy(marker.position);
    ring.lookAt(this.camera.position);
    
    this.scene.add(ring);
    
    // Animate and remove the ring
    let scale = 1;
    let opacity = 0.8;
    
    const animateRing = () => {
      scale += 0.1;
      opacity -= 0.05;
      
      ring.scale.set(scale, scale, scale);
      ring.material.opacity = opacity;
      
      if (opacity > 0) {
        requestAnimationFrame(animateRing);
      } else {
        this.scene.remove(ring);
        ring.geometry.dispose();
        ring.material.dispose();
      }
    };
    
    animateRing();
  }
  
  animate() {
    if (this.isDestroyed) return;
    
    this.animationId = requestAnimationFrame(() => this.animate());
    
    // Auto-rotate
    if (this.globe) {
      this.globe.rotation.y += 0.002;
    }
    
    if (this.renderer && this.scene && this.camera) {
      this.renderer.render(this.scene, this.camera);
    }
  }
}

// ENHANCED GLOBE MANAGER
class EnhancedGlobeManager {
  constructor() {
    this.currentGlobe = null;
    this.isInitializing = false;
    this.lastError = null;
    this.initAttempts = 0;
    this.maxAttempts = 3;
  }
  
  createGlobe(container) {
    if (this.isInitializing) {
      console.log('Enhanced globe initialization already in progress');
      return null;
    }
    
    // Check for existing enhanced globe canvas elements to prevent duplicates
    const existingCanvases = document.querySelectorAll('canvas');
    const enhancedGlobeCanvases = Array.from(existingCanvases).filter(canvas => 
      canvas.parentElement?.className?.includes('rym-music-globe-container') &&
      !canvas.parentElement?.className?.includes('rym-custom-three-container')
    );
    
    if (enhancedGlobeCanvases.length > 0) {
      console.log('Found existing enhanced globe canvas, preventing duplicate creation');
      return null;
    }
    
    if (this.currentGlobe) {
      console.log('Destroying existing enhanced globe before creating new one');
      this.destroyGlobe();
    }
    
    this.isInitializing = true;
    this.initAttempts++;
    
    try {
      console.log(`Creating enhanced globe... (attempt ${this.initAttempts}/${this.maxAttempts})`);
      
      // Validate container
      if (!container || !container.offsetWidth || !container.offsetHeight) {
        throw new Error('Invalid container provided - no dimensions');
      }
      
      // Check WebGL support
      if (!this.checkWebGLSupport()) {
        throw new Error('WebGL not supported');
      }
      
      // Check THREE.js
      if (typeof THREE === 'undefined') {
        throw new Error('THREE.js not loaded');
      }
      
      this.currentGlobe = new EnhancedRYMGlobe(container);
      this.lastError = null;
      this.initAttempts = 0; // Reset on success
      
      console.log('Enhanced globe created successfully');
      return this.currentGlobe;
      
    } catch (error) {
      console.error(`Failed to create enhanced globe (attempt ${this.initAttempts}):`, error);
      this.lastError = error;
      
      // Try fallback or retry
      if (this.initAttempts < this.maxAttempts) {
        console.log('Will retry globe creation...');
        setTimeout(() => {
          this.isInitializing = false;
          this.createGlobe(container);
        }, 1000 * this.initAttempts); // Increasing delay
      } else {
        console.log('Max attempts reached, creating fallback...');
        this.createFallbackGlobe(container);
      }
      
      return null;
    } finally {
      if (this.initAttempts >= this.maxAttempts || this.currentGlobe) {
        this.isInitializing = false;
      }
    }
  }
  
  checkWebGLSupport() {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      return !!gl;
    } catch (e) {
      return false;
    }
  }
  
  createFallbackGlobe(container) {
    console.log('Creating fallback globe display...');
    
    const fallback = document.createElement('div');
    fallback.className = 'rym-globe-manager-fallback';
    fallback.style.cssText = `
      width: 100%; height: 100%;
      background: linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 100%);
      border-radius: 12px;
      display: flex; align-items: center; justify-content: center;
      color: #ffffff; font-family: Arial, sans-serif; text-align: center;
      cursor: pointer;
      transition: all 0.3s ease;
      border: 2px solid rgba(255, 82, 82, 0.3);
    `;
    
    fallback.innerHTML = `
      <div>
        <div style="font-size: 18px; margin-bottom: 8px;">🌍 Music Globe</div>
        <div style="font-size: 14px; opacity: 0.7; margin-bottom: 8px;">Unable to initialize 3D view</div>
        <div style="font-size: 12px; opacity: 0.5;">Error: ${this.lastError?.message || 'Unknown error'}</div>
        <div style="font-size: 11px; opacity: 0.4; margin-top: 8px;">Click to navigate to musicmap</div>
      </div>
    `;
    
    // Add click handler
    fallback.addEventListener('click', () => {
      let username = this.getCurrentUsername();
      if (username) {
        window.location.href = `/musicmap/${username}`;
      } else {
        window.location.href = '/musicmap/';
      }
    });
    
    // Add hover effect
    fallback.addEventListener('mouseenter', () => {
      fallback.style.borderColor = 'rgba(255, 82, 82, 0.6)';
      fallback.style.transform = 'scale(1.02)';
    });
    
    fallback.addEventListener('mouseleave', () => {
      fallback.style.borderColor = 'rgba(255, 82, 82, 0.3)';
      fallback.style.transform = 'scale(1)';
    });
    
    container.appendChild(fallback);
  }
  
  destroyGlobe() {
    if (this.currentGlobe) {
      this.currentGlobe.destroy();
      this.currentGlobe = null;
    }
  }
  
  hasGlobe() {
    return this.currentGlobe !== null;
  }
  
  getStatus() {
    return {
      hasGlobe: this.hasGlobe(),
      isInitializing: this.isInitializing,
      attempts: this.initAttempts,
      lastError: this.lastError?.message
    };
  }
  
  forceReinitialize(container) {
    console.log('Forcing globe reinitialization...');
    this.initAttempts = 0;
    this.lastError = null;
    this.destroyGlobe();
    return this.createGlobe(container);
  }
}

// Initialize globe manager
window.enhancedGlobeManager = window.enhancedGlobeManager || new EnhancedGlobeManager();

// Initialization function with global guard
function initEnhancedRYMGlobe() {
  // Check if we're specifically on a musicmap URL - be more precise
  const url = window.location.href.toLowerCase();
  const pathname = window.location.pathname.toLowerCase();
  
  // Only skip if we're specifically on a musicmap page (not just any profile page)
  const isMusicmapURL = pathname.includes('/musicmap/') || 
                       pathname.endsWith('/musicmap') ||
                       (pathname.includes('/~') && pathname.includes('musicmap')) ||
                       url.includes('rateyourmusic.com/musicmap');
  
  if (isMusicmapURL) {
    console.log('🚫 Enhanced globe initialization skipped - musicmap URL detected:', window.location.href);
    console.log('💡 Musicmap pages should use their own usermap element with unique classes');
    return;
  }
  
  // Prevent multiple initializations
  if (window.RYM_ENHANCED_GLOBE_INITIALIZING) {
    console.log('Enhanced globe initialization already in progress, skipping...');
    return;
  }
  
  if (window.enhancedGlobeManager?.hasGlobe()) {
    console.log('Enhanced globe already exists, skipping initialization...');
    return;
  }
  
  window.RYM_ENHANCED_GLOBE_INITIALIZING = true;
  
  try {
    console.log('Initializing Circle-based RYM Globe...');
    const result = initStandardGlobe();
    
    // Reset the flag after a delay to allow for retries if needed
    setTimeout(() => {
      window.RYM_ENHANCED_GLOBE_INITIALIZING = false;
    }, 5000);
    
    return result;
  } catch (error) {
    console.error('Error during enhanced globe initialization:', error);
    window.RYM_ENHANCED_GLOBE_INITIALIZING = false;
    throw error;
  }
}



function initStandardGlobe() {
  console.log('Initializing globe for standard page...');
  
  // Find the best map container
  const mapSelectors = [
    '#music_map',         // Profile map container
    '.leaflet-container',
    '[id*="map"]',
    '[class*="leaflet"]'
  ];
  
  let mapElement = null;
  for (const selector of mapSelectors) {
    const elements = document.querySelectorAll(selector);
    if (elements.length > 0) {
      mapElement = elements[0];
      console.log(`Found map element with selector: ${selector}`);
      break;
    }
  }
  
  // Fallback search for any map-like elements
  if (!mapElement) {
    console.log('No direct map element found - searching for map-like elements');
    const svgs = document.querySelectorAll('svg');
    for (const svg of svgs) {
      if (svg.querySelectorAll('circle').length >= 2) {
        mapElement = svg;
        console.log('Found SVG with circles');
        break;
      }
    }
  }
  
  if (!mapElement) {
    console.warn('No suitable map element found for enhanced globe replacement');
    return;
  }
  
  return createGlobeForElement(mapElement);
}

function createGlobeForElement(mapElement) {
  // Check if this is a usermap element on a musicmap page - if so, skip globe creation
  const url = window.location.href.toLowerCase();
  const pathname = window.location.pathname.toLowerCase();
  const isMusicmapPage = pathname.includes('/musicmap/') || 
                        pathname.endsWith('/musicmap') ||
                        (pathname.includes('/~') && pathname.includes('musicmap')) ||
                        url.includes('rateyourmusic.com/musicmap');
  
  if (isMusicmapPage && (mapElement.id === 'usermap' || 
      mapElement.classList.contains('rym-ext-usermap-container') ||
      mapElement.getAttribute('data-rym-component') === 'usermap-threejs')) {
    console.log('🚫 Skipping globe creation for usermap element on musicmap page - reserved for separate Three.js component');
    mapElement.dataset.enhancedGlobeProcessed = 'true';
    return;
  }
  
  // Check if already processed
  if (mapElement.dataset.enhancedGlobeProcessed === 'true') {
    console.log('Map already processed with enhanced globe');
    return;
  }
  
  // Check if a globe container already exists on this page
  const existingGlobe = document.querySelector('.rym-music-globe-container');
  if (existingGlobe) {
    console.log('Globe container already exists on page, skipping duplicate creation');
    mapElement.dataset.enhancedGlobeProcessed = 'true';
    return;
  }
  
  // Check if globe manager already has an active globe
  if (window.enhancedGlobeManager?.hasGlobe()) {
    console.log('Globe manager already has active globe, skipping duplicate creation');
    mapElement.dataset.enhancedGlobeProcessed = 'true';
    return;
  }
  
  // Create globe container
  const rect = mapElement.getBoundingClientRect();
  const width = Math.max(rect.width || 800, 300);
  const height = Math.max(rect.height || 400, 200);
  
  const globeContainer = document.createElement('div');
  globeContainer.className = 'rym-music-globe-container enhanced';
  globeContainer.style.cssText = `
    width: ${width}px;
    height: ${height}px;
    position: relative;
    border-radius: 12px;
    overflow: hidden;
    background: linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 100%);
    margin: 12px auto;
    box-shadow: 0 8px 32px rgba(0,0,0,0.3);
    cursor: pointer;
  `;
  
  // Replace the map
  console.log('Replacing map with globe');
  mapElement.parentNode.insertBefore(globeContainer, mapElement);
  mapElement.style.display = 'none';
  
  mapElement.dataset.enhancedGlobeProcessed = 'true';
  
  // Create enhanced globe with retry logic
  const globe = window.enhancedGlobeManager.createGlobe(globeContainer);
  
  if (!globe) {
    console.error('Failed to create globe, removing container');
    globeContainer.remove();
  } else {
    console.log('Enhanced globe initialization complete');
  }
  
  return globe;
}


