// ========================================
// RYM Theme Controller System
// ========================================

// Theme controller for managing RYM extension themes
class RYMThemeController {
  constructor() {
    this.availableThemes = {
      'auto': 'Auto',
      'light': 'OK Computer',
      'night': 'Night', 
      'loveless': 'Loveless',
      'stereolab': 'Stereolab',
      'lasvegas': 'Las Vegas'
    };
    
    // RYM's original theme cycling order (without our custom themes)
    this.originalThemes = ['light', 'loveless', 'night'];
    
    // Extended theme cycling order (includes our custom themes)
    this.extendedThemes = ['auto', 'light', 'loveless', 'night', 'stereolab', 'lasvegas'];
    
    this.currentTheme = this.getCurrentTheme();
    this.init();
  }
  
  init() {
    console.log('🎨 RYM Theme Controller initialized');
    
    // Apply saved theme on load
    this.applyTheme(this.currentTheme);
    
    // Override RYM's original theme cycling if it exists
    this.overrideOriginalThemeCycling();
    
    // Set up theme button if it exists
    this.setupThemeButton();
    
    // Export global functions for console access
    this.exportGlobalFunctions();
  }
  
  getCurrentTheme() {
    // Check localStorage first (our extension's preference)
    let theme = localStorage.getItem('rym_extension_theme');
    
    // If no extension theme, check RYM's original theme
    if (!theme) {
      theme = localStorage.getItem('theme') || 'auto';
    }
    
    // Validate theme exists in our available themes
    if (!this.availableThemes[theme]) {
      theme = 'auto';
    }
    
    return theme;
  }
  
  applyTheme(themeName) {
    const body = document.body || document.querySelector('#page_body');
    if (!body) return;
    
    // Handle auto theme (cycles through original RYM themes based on time or preference)
    if (themeName === 'auto') {
      themeName = this.getAutoTheme();
    }
    
    // Remove all existing theme classes
    Object.keys(this.availableThemes).forEach(theme => {
      if (theme !== 'auto') {
        body.classList.remove(`theme_${theme}`);
      }
    });
    
    // Apply new theme class
    body.classList.add(`theme_${themeName}`);
    
    // Store in both our extension storage and RYM's original storage
    localStorage.setItem('rym_extension_theme', this.currentTheme);
    localStorage.setItem('theme', themeName === 'auto' ? this.getAutoTheme() : themeName);
    
    console.log(`🎨 Applied theme: ${themeName} (original: ${this.currentTheme})`);
    
    // Update theme button display if it exists
    this.updateThemeButtonDisplay();
    
    // Dispatch custom event for other parts of the extension
    window.dispatchEvent(new CustomEvent('rymThemeChanged', { 
      detail: { theme: themeName, originalTheme: this.currentTheme }
    }));
  }
  
  getAutoTheme() {
    // Check if user prefers dark mode
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'night';
    }
    
    // Time-based theme selection
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 18) {
      return 'light';  // Day: 6 AM - 6 PM
    } else if (hour >= 18 && hour < 22) {
      return 'loveless';    // Evening: 6 PM - 10 PM
    } else {
      return 'night';  // Night: 10 PM - 6 AM
    }
  }
  
  cycleTheme() {
    const currentIndex = this.extendedThemes.indexOf(this.currentTheme);
    const nextIndex = (currentIndex + 1) % this.extendedThemes.length;
    const nextTheme = this.extendedThemes[nextIndex];
    
    this.switchTheme(nextTheme);
    return nextTheme;
  }
  
  switchTheme(themeName) {
    if (!this.availableThemes[themeName]) {
      console.warn(`Theme "${themeName}" not found. Available themes:`, Object.keys(this.availableThemes));
      return;
    }
    
    this.currentTheme = themeName;
    this.applyTheme(themeName);
    
    console.log(`🎨 Switched to theme: ${themeName}`);
  }
  
  overrideOriginalThemeCycling() {
    // Aggressively override RYM's theme cycling function
    const self = this;
    
    // Define our override function
    const overrideThemeCycle = () => {
      Object.defineProperty(window, 'theme_cycle', {
        value: function() {
          console.log('🔄 Intercepted RYM theme cycle, using extended theme cycling');
          self.cycleTheme();
        },
        writable: true,
        configurable: true
      });
    };
    
    // Override immediately
    overrideThemeCycle();
    
    // Re-override periodically in case RYM redefines it
    setInterval(overrideThemeCycle, 500);
    
    console.log('🔗 Aggressively overrode RYM theme cycling');
    
    // Override theme-related click handlers
    this.setupThemeClickHandlers();
    
    // Setup MutationObserver to catch dynamically added theme buttons
    this.setupThemeButtonObserver();
  }
  
  setupThemeClickHandlers() {
    // Find and override theme buttons with multiple selectors
    const themeButtons = document.querySelectorAll('.header_theme_button, [onclick*="theme"], [onclick*="Theme"], .header_theme_buttons button');
    
    themeButtons.forEach(button => {
      // Mark as processed to avoid duplicate handlers
      if (button.dataset.rymExtensionProcessed) return;
      button.dataset.rymExtensionProcessed = 'true';
      
      // Remove original onclick handlers
      button.removeAttribute('onclick');
      
      // Add our custom handler with capture phase to intercept before RYM's handler
      button.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        this.cycleTheme();
      }, true); // Capture phase
      
      // Also add in bubble phase for redundancy
      button.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        this.cycleTheme();
      });
    });
    
    if (themeButtons.length > 0) {
      console.log(`🔗 Setup ${themeButtons.length} theme button handler(s)`);
    }
  }
  
  setupThemeButtonObserver() {
    // Watch for dynamically added theme buttons
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.addedNodes.length) {
          // Check if any added nodes are theme buttons or contain theme buttons
          mutation.addedNodes.forEach(node => {
            if (node.nodeType === 1) { // Element node
              if (node.matches && node.matches('.header_theme_button, [onclick*="theme"]')) {
                this.setupThemeClickHandlers();
              } else if (node.querySelector) {
                const buttons = node.querySelectorAll('.header_theme_button, [onclick*="theme"]');
                if (buttons.length > 0) {
                  this.setupThemeClickHandlers();
                }
              }
            }
          });
        }
      }
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
    
    console.log('🔍 Theme button observer activated');
  }
  
  setupThemeButton() {
    // Call multiple times to ensure we catch the theme button
    setTimeout(() => this.setupThemeClickHandlers(), 100);
    setTimeout(() => this.setupThemeClickHandlers(), 500);
    setTimeout(() => this.setupThemeClickHandlers(), 1000);
    setTimeout(() => this.setupThemeClickHandlers(), 2000);
  }
  
  updateThemeButtonDisplay() {
    // Update any theme button text to show current theme
    const themeButtons = document.querySelectorAll('.header_theme_button_mode');
    themeButtons.forEach(button => {
      const displayName = this.availableThemes[this.currentTheme] || this.currentTheme;
      button.textContent = displayName;
    });
  }
  
  // Quick switch methods for console use
  switchToAuto() { this.switchTheme('auto'); }
  switchToLight() { this.switchTheme('light'); }
  switchToNight() { this.switchTheme('night'); }
  switchToLoveless() { this.switchTheme('loveless'); }
  switchToStereolab() { this.switchTheme('stereolab'); }
  switchToLasVegas() { this.switchTheme('lasvegas'); }
  
  exportGlobalFunctions() {
    // Export functions for console access
    window.rymThemeController = this;
    
    window.listThemes = () => {
      console.log('🎨 Available themes:', this.availableThemes);
      return this.availableThemes;
    };
    
    window.switchTheme = (themeName) => {
      this.switchTheme(themeName);
    };
    
    window.getCurrentTheme = () => {
      console.log(`🎨 Current theme: ${this.currentTheme}`);
      return this.currentTheme;
    };
    
    window.cycleTheme = () => {
      return this.cycleTheme();
    };
    
    window.showThemeSelector = () => {
      this.showThemeSelector();
    };
    
    console.log('🌍 Theme controller functions exported to window object');
  }
  
  showThemeSelector() {
    // Create a simple theme selector UI
    const existingSelector = document.getElementById('rym-theme-selector');
    if (existingSelector) {
      existingSelector.remove();
    }
    
    const selector = document.createElement('div');
    selector.id = 'rym-theme-selector';
    selector.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: var(--rym-bg-modal, rgba(0,0,0,0.9));
      border: 1px solid var(--rym-border, rgba(255,255,255,0.1));
      border-radius: 8px;
      padding: 20px;
      z-index: 10000;
      box-shadow: var(--rym-shadow-strong, 0 8px 32px rgba(0,0,0,0.3));
      backdrop-filter: blur(10px);
      color: var(--rym-text-primary, #fff);
      font-family: Arial, sans-serif;
      min-width: 300px;
    `;
    
    const title = document.createElement('h3');
    title.textContent = 'Select Theme';
    title.style.cssText = `
      margin: 0 0 15px 0;
      color: var(--rym-primary, #42A5F5);
      text-align: center;
    `;
    selector.appendChild(title);
    
    // Create theme buttons
    Object.entries(this.availableThemes).forEach(([themeKey, themeName]) => {
      const button = document.createElement('button');
      button.textContent = themeName;
      button.style.cssText = `
        display: block;
        width: 100%;
        margin: 8px 0;
        padding: 12px;
        background: ${themeKey === this.currentTheme ? 'var(--rym-primary, #42A5F5)' : 'transparent'};
        color: var(--rym-text-primary, #fff);
        border: 1px solid var(--rym-border, rgba(255,255,255,0.1));
        border-radius: 6px;
        cursor: pointer;
        transition: all 0.2s ease;
      `;
      
      button.addEventListener('click', () => {
        this.switchTheme(themeKey);
        selector.remove();
      });
      
      button.addEventListener('mouseenter', () => {
        if (themeKey !== this.currentTheme) {
          button.style.background = 'var(--rym-hover-bg, rgba(255,255,255,0.05))';
        }
      });
      
      button.addEventListener('mouseleave', () => {
        if (themeKey !== this.currentTheme) {
          button.style.background = 'transparent';
        }
      });
      
      selector.appendChild(button);
    });
    
    // Close button
    const closeButton = document.createElement('button');
    closeButton.textContent = '✕';
    closeButton.style.cssText = `
      position: absolute;
      top: 10px;
      right: 15px;
      background: none;
      border: none;
      color: var(--rym-text-muted, rgba(255,255,255,0.6));
      font-size: 18px;
      cursor: pointer;
      padding: 0;
      width: 20px;
      height: 20px;
    `;
    closeButton.addEventListener('click', () => selector.remove());
    selector.appendChild(closeButton);
    
    // Close on outside click
    selector.addEventListener('click', (e) => {
      if (e.target === selector) {
        selector.remove();
      }
    });
    
    document.body.appendChild(selector);
  }
}

// Initialize theme controller when DOM is ready
let rymThemeController;

function initializeThemeController() {
  if (!rymThemeController) {
    rymThemeController = new RYMThemeController();
    console.log('🎨 RYM Theme Controller initialized successfully');
    
    // Verify all themes are properly registered
    console.log('📋 Available themes:', Object.keys(rymThemeController.availableThemes));
    console.log('🔄 Theme cycling order:', rymThemeController.extendedThemes);
    console.log('✨ Current theme:', rymThemeController.currentTheme);
    console.log('💡 Use window.showThemeSelector() to see all themes, or window.cycleTheme() to cycle through them');
  }
  
  return rymThemeController;
}

