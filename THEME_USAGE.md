# RYM Extension Theme System

## Overview
Your extension now has a powerful, centralized theme system that gives you complete control over colors and themes without bloat.

## How It Works

### 1. **CSS Variables System**
- All colors are now defined as CSS custom properties in `styles/themes.css`
- Each theme (light, night, loveless, stereolab, lasvegas) has its own color palette
- Variables follow a consistent naming pattern: `--rym-[category]-[variant]`

### 2. **Theme Controller**
- JavaScript controller handles theme switching
- Persists theme choice in localStorage
- Provides both UI and programmatic access

## Available Themes

| Theme | Description | Primary Color |
|-------|-------------|---------------|
| `auto` | Smart theme (time-based: OK Computer/loveless/night) | Dynamic |
| `light` | OK Computer - Clean light theme | Blue (#66C1EE) |
| `loveless` | Loveless - Wine to pink gradient | Wine to Pink (#2e151b to #BF3B84) |
| `night` | Dark theme with blue accents | Light Blue (#64B5F6) |
| `stereolab` | Stereolab - Green to teal with golden yellow text | Forest Green to Casal (#337822 to #336475) |
| `lasvegas` | Las Vegas - Blue to red gradient | Blue to Red (#172467 to #ED2008) |

## Usage

### Console Commands
Open browser console on RYM and use these commands:

```javascript
// List all available themes
window.listThemes()

// Switch to a specific theme
window.switchTheme('auto')    // Smart time-based theme
window.switchTheme('stereolab')  // Custom stereolab theme
window.switchTheme('lasvegas')  // Custom las vegas theme

// Cycle through all themes (including custom ones)
window.cycleTheme()

// Show theme selector UI
window.showThemeSelector()

// Get current theme
window.getCurrentTheme()

// Quick switches
window.rymThemeController.switchToAuto()
window.rymThemeController.switchToStereolab()
window.rymThemeController.switchToLasVegas()
```

### Adding New Themes

1. **Add to CSS** - In `styles/themes.css`:
```css
.theme_mytheme {
  --rym-primary: #YOUR_COLOR;
  --rym-primary-light: #LIGHTER_VERSION;
  /* ... other variables ... */
}
```

2. **Add to JavaScript** - In the `RYMThemeController` class, update `availableThemes` and `extendedThemes`:
```javascript
// In the constructor of RYMThemeController
this.availableThemes = {
  'auto': 'Auto',
  'light': 'Light',
  'night': 'Night', 
  'loveless': 'Loveless',
  'stereolab': 'Stereolab',
  'lasvegas': 'Las Vegas',
  'mytheme': 'My Theme' // Add your theme here
};

// Also add to the cycling order
this.extendedThemes = ['auto', 'light', 'loveless', 'night', 'stereolab', 'lasvegas', 'mytheme'];
```

### Updating Existing Styles

Replace hardcoded colors with CSS variables:

**Before:**
```css
.my-element {
  background: #42A5F5;
  color: #ffffff;
  border: 1px solid rgba(0,0,0,0.12);
}
```

**After:**
```css
.my-element {
  background: var(--rym-primary);
  color: var(--rym-text-inverse);
  border: 1px solid var(--rym-border);
}
```

## CSS Variable Reference

### Colors
- `--rym-primary` - Main brand color
- `--rym-primary-light` - Lighter variant
- `--rym-primary-dark` - Darker variant
- `--rym-primary-alpha` - Transparent version

### Backgrounds
- `--rym-bg-primary` - Main background
- `--rym-bg-secondary` - Secondary background
- `--rym-bg-tertiary` - Third level background
- `--rym-bg-modal` - Modal/overlay background

### Text
- `--rym-text-primary` - Main text color
- `--rym-text-secondary` - Secondary text
- `--rym-text-muted` - Muted/disabled text
- `--rym-text-inverse` - Inverse text (for dark backgrounds)

### Interactive
- `--rym-hover-bg` - Hover background
- `--rym-active-bg` - Active/pressed background
- `--rym-border` - Standard border
- `--rym-border-light` - Light border
- `--rym-shadow` - Standard shadow
- `--rym-shadow-strong` - Strong shadow

### Header Specific
- `--rym-header-bg` - Header background
- `--rym-header-text` - Header text color

## New Features

### 🔄 **Enhanced Theme Cycling**
- **Extended Cycling**: Theme button now cycles through all 6 themes (auto, light, loveless, night, stereolab, lasvegas)
- **RYM Integration**: Seamlessly overrides RYM's original 3-theme cycling
- **Smart Detection**: Automatically detects and replaces existing theme buttons

### 🤖 **Auto Theme**
- **Time-Based**: Automatically switches between light (6AM-6PM), loveless (6PM-10PM), and night (10PM-6AM)
- **System Preference**: Respects your OS dark mode preference
- **Smart Default**: Perfect for users who want dynamic theming

### 🎨 **Theme Selector UI**
- **Visual Interface**: `window.showThemeSelector()` opens a beautiful theme picker
- **Live Preview**: See theme names and current selection
- **Easy Access**: Click any theme to switch instantly

### 🔗 **RYM Compatibility**
- **Seamless Integration**: Works with RYM's existing theme system
- **Storage Sync**: Syncs with both extension and RYM localStorage
- **Override Protection**: Safely overrides RYM's theme functions without breaking functionality

## Benefits

✅ **Centralized Control** - All colors in one place  
✅ **Easy Theme Creation** - Just add CSS variables  
✅ **No Bloat** - Clean, efficient system  
✅ **Persistent** - Remembers your choice  
✅ **Flexible** - Works with existing and new styles  
✅ **Console Access** - Easy testing and switching  
✅ **Extended Cycling** - All 6 themes in rotation  
✅ **Smart Auto Mode** - Time and preference based theming  
✅ **RYM Compatible** - Seamless integration with original site  

## Usage Tips

### Quick Theme Switching
- **Click Theme Button**: Cycles through all 6 themes
- **Console Commands**: Use `window.switchTheme('themeName')` for direct access
- **Theme Selector**: Use `window.showThemeSelector()` for visual selection

### Recommended Setup
1. Start with `auto` theme for smart switching
2. Try each custom theme (`stereolab`, `lasvegas`) to find your favorite
3. Use console commands to quickly test themes while browsing
4. Set up time-based preferences with the auto theme

## Next Steps

1. Replace more hardcoded colors in other CSS files with variables
2. Create additional custom themes for specific moods or times of day
3. Add theme preview functionality in the selector
4. Consider adding theme-specific animations or transitions

The enhanced system now gives you complete control with 6 beautiful themes, smart auto-switching, and seamless RYM integration!

