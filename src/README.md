# RYM Extension - Modular Architecture

This directory contains the modularized source code for the RYM Extension. The original monolithic `content.js` file (1978 lines) has been split into logical, maintainable modules.

## File Structure

### Core Modules

1. **`utils.js`** (43 lines)
   - Helper functions used across the extension
   - `formatText()` - Text formatting utility
   - `loadStylesheet()` - Dynamic CSS loading
   - `addCompactClassToSelectedElement()` - Console utility for styling

2. **`header.js`** (195 lines)
   - Header rearrangement and styling
   - `rearrangeHeader()` - Reorganizes RYM header layout
   - Implements dynamic island for listening component
   - Profile picture integration in menu

3. **`listening.js`** (201 lines)
   - Listening component redesign
   - `redesignListeningComponent()` - Enhances play history display
   - `setupListeningObserver()` - Monitors DOM for listening component updates
   - Album cover integration

4. **`profile.js`** (295 lines)
   - Profile page enhancements
   - `repositionPlatformLogos()` - Moves platform logos to username
   - `addUniqueProfileIdentifiers()` - Adds CSS classes for styling
   - `restyleProfilePicture()` - Enhanced profile picture styling

5. **`bubble-content.js`** (152 lines)
   - Bubble content modifications
   - `injectMusicTitleClass()` - Adds classes to bubble headers
   - `addBubbleContentCompactClass()` - Compact styling for user bio
   - `setupBubbleContentObserver()` - Monitors bubble content changes

6. **`cleanup.js`** (91 lines)
   - DOM cleanup functions
   - `removeEmptySpacerRows()` - Removes empty table spacers
   - `setupSpacerRowObserver()` - Monitors and cleans spacers automatically

7. **`globe.js`** (405 lines)
   - Three.js globe initialization
   - `detectMusicmapPage()` - Detects musicmap pages
   - `initMusicmapGlobe()` - Initializes globe for musicmap pages
   - `initStandardPageGlobe()` - Standard page globe initialization
   - `handleMusicmapPage()` - Smart page-specific initialization
   - `debugGlobeInitialization()` - Debug utilities

8. **`theme-controller.js`** (399 lines)
   - Theme management system
   - `RYMThemeController` class - Main theme controller
   - Auto theme switching based on time/preference
   - Extended theme cycling (6 themes)
   - Theme selector UI

9. **`main.js`** (249 lines)
   - Main entry point and orchestration
   - `initializeRYMExtension()` - Coordinates all initialization
   - `setupDebugFunctions()` - Exports debug utilities to window
   - DOM ready state handling

## Total Line Count
- **Old structure**: 1 file, 1978 lines
- **New structure**: 9 files, ~2030 lines (with better organization and comments)

## Loading Order

The files are loaded in this order (defined in `manifest.json`):

1. `three.min.js` (external library)
2. `enhanced-globe.js` (external component)
3. `src/utils.js` (dependencies)
4. `src/header.js`
5. `src/listening.js`
6. `src/profile.js`
7. `src/bubble-content.js`
8. `src/cleanup.js`
9. `src/globe.js`
10. `src/theme-controller.js`
11. `src/main.js` (entry point)

## Key Features

### Separation of Concerns
- Each module has a single, well-defined responsibility
- Easy to locate and modify specific functionality
- Reduced cognitive load when debugging

### No Build Step Required
- Uses global scope instead of ES6 modules
- Works directly with Chrome's Manifest V3
- No webpack/rollup configuration needed

### Debug Functions
All debug functions are exported to `window` for console access:
- `window.debugRYMGlobe()`
- `window.forceGlobeReinit()`
- `window.testGlobeDetection()`
- `window.switchTheme(themeName)`
- `window.showThemeSelector()`
- And many more...

## Making Changes

### To modify header behavior:
Edit `src/header.js`

### To change theme functionality:
Edit `src/theme-controller.js`

### To update globe initialization:
Edit `src/globe.js`

### To add new functionality:
1. Create a new file in `src/` directory
2. Add functions (no need for export/import)
3. Update `manifest.json` to include the new file in the loading order
4. Call your functions from `src/main.js`

## Backup

The original monolithic file is preserved as `content.js.backup` for reference.

## Benefits of This Architecture

✅ **Better Maintainability** - Easy to find and fix issues
✅ **Clearer Dependencies** - Loading order is explicit
✅ **Team Collaboration** - Multiple developers can work on different modules
✅ **Easier Testing** - Each module can be tested independently
✅ **Better Version Control** - Git diffs are more meaningful
✅ **Reduced Merge Conflicts** - Changes are isolated to specific files
✅ **Self-Documenting** - File names describe functionality

