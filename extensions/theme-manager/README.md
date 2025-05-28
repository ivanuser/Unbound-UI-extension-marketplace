# Theme Manager Extension

Advanced theme management system for UnboundUI. Create, customize, and switch between themes with real-time preview. Includes a theme builder with color picker, typography controls, and component styling options.

## Features

- **Theme Creation**: Build custom themes from scratch
- **Real-time Preview**: See changes instantly as you edit
- **Color Picker**: Advanced color selection tools
- **Pre-built Themes**: Light, dark, and auto (system) themes included
- **Theme Export/Import**: Share themes with the community
- **Component Styling**: Fine-tune individual UI components

## Installation

1. Open UnboundUI Extensions page
2. Search for "Theme Manager Extension"
3. Click "Install"
4. Access theme manager via the settings menu

## Usage

### Basic Theme Switching

```javascript
// Apply a theme
themeManager.applyTheme('dark');

// Get all available themes
const themes = themeManager.getAllThemes();

// Create custom theme
const customThemeId = themeManager.createCustomTheme('My Theme', {
  primary: '#ff6b6b',
  secondary: '#4ecdc4',
  background: '#2c3e50',
  surface: '#34495e',
  text: '#ecf0f1'
});
```

### Theme Creation

1. Click "Create New Theme" in the theme manager
2. Choose a base theme or start from scratch
3. Use the color picker to customize colors
4. Preview changes in real-time
5. Save and apply your custom theme

### Color Customization

The theme manager provides controls for:
- **Primary Colors**: Main brand colors
- **Secondary Colors**: Accent and highlight colors
- **Background Colors**: Page and component backgrounds
- **Text Colors**: Various text hierarchies
- **Border Colors**: Borders and dividers

### Advanced Features

- **Typography Settings**: Font families, sizes, and weights
- **Spacing Controls**: Margins, padding, and layout spacing
- **Border Radius**: Corner rounding for components
- **Shadow Settings**: Drop shadows and elevation
- **Animation Timing**: Transition and animation speeds

## Default Themes

### Light Theme
Clean, bright theme perfect for daytime use with high contrast and excellent readability.

### Dark Theme
Eye-friendly dark theme designed for low-light environments and extended use.

### Auto Theme
Automatically switches between light and dark themes based on your system preferences.

## Creating Custom Themes

1. Start with a base theme
2. Modify colors using the color picker
3. Adjust typography and spacing
4. Preview across different components
5. Export for sharing or backup

## Accessibility

All themes created with the theme manager are tested for:
- **WCAG Contrast Requirements**: Ensuring readable text
- **Color Blindness Support**: Compatible with various color vision types
- **High Contrast Mode**: Support for system accessibility settings

## License

MIT License - see LICENSE file for details.
