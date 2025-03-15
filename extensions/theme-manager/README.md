# Theme Manager Extension for Open WebUI

Customize the appearance of Open WebUI with the Theme Manager extension. Apply pre-built themes or create your own to personalize your experience.

## Features

- **Theme Gallery**: Browse and apply a variety of pre-built themes
- **Theme Editor**: Create and customize your own themes
- **Component Styling**: Customize specific UI components
- **Import/Export**: Share themes with others
- **Scheduled Themes**: Apply themes based on time of day (light/dark)

## Installation

1. Open the Extension Manager in Open WebUI (Settings > Extensions)
2. Click on the "Marketplace" tab
3. Find "Theme Manager" and click "Install"
4. Restart Open WebUI if prompted

## Usage

### Applying Themes

1. Click on the "Theme Manager" icon in the sidebar
2. Browse available themes in the gallery
3. Click "Apply" to activate a theme

### Creating Custom Themes

1. In the Theme Manager, click "Create New Theme"
2. Use the visual editor to customize colors, fonts, and spacing
3. Preview changes in real-time
4. Save your theme with a name and description

## Included Themes

The extension comes with several pre-built themes:

- **Modern Light**: Clean, minimal light theme
- **Modern Dark**: Dark variant of the Modern theme
- **Retro Terminal**: Nostalgic terminal-inspired theme
- **Ocean Blue**: Calm, blue-tinted theme
- **Forest Green**: Nature-inspired green theme
- **High Contrast**: Accessibility-focused theme

## For Developers

### Creating Theme Packages

You can create shareable theme packages using the following structure:

```json
{
  "name": "My Custom Theme",
  "description": "A custom theme for Open WebUI",
  "author": "Your Name",
  "version": "1.0.0",
  "colors": {
    "primary": "#3b82f6",
    "secondary": "#10b981",
    "background": "#ffffff",
    "text": "#1f2937"
    // Additional color variables
  },
  "fonts": {
    "body": "Inter, sans-serif",
    "heading": "Inter, sans-serif",
    "code": "Fira Code, monospace"
  },
  "components": {
    // Component-specific styling
  }
}
```

## Support

If you encounter any issues or have suggestions, please:

1. Check the [GitHub Issues](https://github.com/open-webui/theme-manager/issues)
2. Submit a new issue if needed
3. Join the [Open WebUI Discord](https://discord.gg/openwebui) for community support

## License

This extension is released under the MIT License.
