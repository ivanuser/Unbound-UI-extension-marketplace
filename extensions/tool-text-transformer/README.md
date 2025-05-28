# Text Transformer Tool

A comprehensive text transformation extension for UnboundUI that provides advanced text manipulation utilities, case conversions, and formatting tools.

## Features

🔤 **Case Transformations**
- UPPERCASE conversion
- lowercase conversion  
- Title Case formatting
- camelCase conversion
- kebab-case conversion
- snake_case conversion

✨ **Text Operations**
- Text reversal
- Text cleaning (remove HTML, extra whitespace)
- Custom regex-based transformations
- Batch text processing

📊 **Text Analytics**
- Character count
- Word count
- Line count
- Paragraph count
- Real-time statistics

🔄 **History & Undo**
- Transformation history tracking
- Undo/redo functionality
- Recent transforms sidebar

⌨️ **Productivity Features**
- Customizable keyboard shortcuts
- Context menu integration
- Toolbar quick access
- Preview before applying

## Installation

### Via UnboundUI Extensions Marketplace

1. Open UnboundUI
2. Navigate to Extensions
3. Search for "Text Transformer Tool"
4. Click "Install"
5. The tool will be available in your toolbar

### Manual Installation

1. Download the extension files
2. Extract to your UnboundUI extensions directory
3. Restart UnboundUI
4. Access via toolbar or sidebar

## Usage

### Quick Transformations

1. **Select text** in any input field or editor
2. **Right-click** and choose "Transform Text"
3. **Select transformation** from the context menu
4. Text is instantly transformed

### Using the Toolbar

1. **Select text** you want to transform
2. **Click the Transform Text button** in the toolbar
3. **Choose transformation** in the dialog
4. **Preview changes** before applying
5. **Click Apply** to transform

### Sidebar Panel

The sidebar panel provides:
- **Quick transform buttons** for common operations
- **Text statistics** for selected or all text
- **Recent transforms history** for easy reuse

### Keyboard Shortcuts

Default shortcuts (customizable in settings):
- `Ctrl+Shift+U` - Convert to UPPERCASE
- `Ctrl+Shift+L` - Convert to lowercase  
- `Ctrl+Shift+T` - Convert to Title Case
- `Ctrl+Z` - Undo last transformation
- `Ctrl+Y` - Redo transformation

## Transformation Types

### Case Conversions

#### UPPERCASE
```
Input:  "Hello World"
Output: "HELLO WORLD"
```

#### lowercase
```
Input:  "Hello World"
Output: "hello world"
```

#### Title Case
```
Input:  "hello world example"
Output: "Hello World Example"
```

#### camelCase
```
Input:  "hello world example"
Output: "helloWorldExample"
```

#### kebab-case
```
Input:  "Hello World Example"
Output: "hello-world-example"
```

#### snake_case
```
Input:  "Hello World Example"
Output: "hello_world_example"
```

### Text Operations

#### Reverse Text
```
Input:  "Hello World"
Output: "dlroW olleH"
```

#### Clean Text
Removes HTML tags, extra whitespace, and special characters:
```
Input:  "<p>Hello    World!</p>   "
Output: "Hello World!"
```

### Custom Transformations

Create your own transformation patterns using:
- **Find and Replace** - Simple text substitution
- **Regular Expressions** - Advanced pattern matching
- **Multiple Patterns** - Chain multiple transformations

Example custom patterns:
```javascript
// Remove all numbers
Pattern: \d+
Replace: ""

// Convert emails to links
Pattern: ([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})
Replace: <a href="mailto:$1">$1</a>
```

## Configuration

### Settings

Access settings through the UnboundUI Settings > Extensions > Text Transformer:

#### Default Case
Choose the default transformation when using quick shortcuts:
- lowercase
- UPPERCASE  
- Title Case
- camelCase

#### Preserve Formatting
- **Enabled** - Maintain line breaks and spacing
- **Disabled** - Normalize whitespace

#### Show Preview
- **Enabled** - Preview changes before applying
- **Disabled** - Apply transformations immediately

#### Keyboard Shortcuts
Customize shortcuts for each transformation type:

```json
{
  "uppercase": "Ctrl+Shift+U",
  "lowercase": "Ctrl+Shift+L", 
  "titlecase": "Ctrl+Shift+T",
  "camelcase": "Ctrl+Shift+C",
  "kebabcase": "Ctrl+Shift+K",
  "snakecase": "Ctrl+Shift+S"
}
```

### Advanced Configuration

#### History Settings
```json
{
  "maxHistorySize": 50,
  "saveToStorage": true,
  "persistAcrossSessions": true
}
```

#### UI Integration
```json
{
  "toolbar": true,
  "sidebar": true, 
  "contextMenu": true,
  "statusBar": false
}
```

## API Integration

### Using in Other Extensions

The Text Transformer Tool provides an API for other extensions:

```javascript
// Get the tool instance
const textTransformer = await context.getExtension('tool-text-transformer');

// Transform text programmatically
const result = await textTransformer.transform('Hello World', 'uppercase');
console.log(result); // "HELLO WORLD"

// Get text statistics
const stats = textTransformer.getTextStats('Hello World');
console.log(stats);
// { characters: 11, words: 2, lines: 1, paragraphs: 1 }

// Register custom transformation
textTransformer.registerTransform('rot13', (text) => {
  return text.replace(/[a-zA-Z]/g, (char) => {
    const start = char <= 'Z' ? 65 : 97;
    return String.fromCharCode(((char.charCodeAt(0) - start + 13) % 26) + start);
  });
});
```

### Events

Listen to transformation events:

```javascript
context.on('text-transformer:transform', (event) => {
  console.log('Text transformed:', event.type, event.before, event.after);
});

context.on('text-transformer:history-updated', (event) => {
  console.log('History updated:', event.historySize);
});
```

## Development

### Building from Source

```bash
# Clone the repository
git clone https://github.com/unboundui/sample-extensions.git
cd sample-extensions/tool-text-transformer

# Install dependencies
npm install

# Build the extension
npm run build

# Run tests
npm test

# Lint code
npm run lint
```

### Project Structure

```
tool-text-transformer/
├── src/
│   ├── index.js              # Main tool class
│   ├── transformations/      # Transformation logic
│   │   ├── case.js
│   │   ├── format.js
│   │   └── custom.js
│   ├── components/           # UI components
│   │   ├── TransformDialog.js
│   │   ├── SidebarPanel.js
│   │   └── HistoryList.js
│   └── utils/               # Utility functions
│       ├── text-stats.js
│       └── validation.js
├── tests/                   # Unit tests
├── docs/                    # Documentation
├── assets/                  # Icons and images
└── dist/                    # Built extension
```

### Adding New Transformations

1. Create transformation function:
```javascript
// src/transformations/custom.js
export function leet(text) {
  const leetMap = {
    'a': '4', 'e': '3', 'i': '1', 
    'o': '0', 's': '5', 't': '7'
  };
  
  return text.toLowerCase().replace(/[aeios]/g, char => leetMap[char] || char);
}
```

2. Register in main class:
```javascript
// src/index.js
import { leet } from './transformations/custom.js';

registerCommands() {
  // ... existing commands
  this.context.registerCommand('text.transform.leet', () => {
    const text = this.context.getSelectedText();
    const transformed = leet(text);
    this.handleTransform(transformed, 'leet');
  });
}
```

3. Add to UI:
```javascript
// Add to context menu
submenu: [
  // ... existing items
  { id: 'leet', label: 'L33t Sp34k', command: 'text.transform.leet' }
]
```

### Testing

```javascript
// tests/transformations.test.js
import { describe, it, expect } from 'vitest';
import TextTransformerTool from '../src/index.js';

describe('Text Transformations', () => {
  let tool;
  
  beforeEach(() => {
    tool = new TextTransformerTool();
  });

  it('should convert to uppercase', () => {
    expect(tool.toUpperCase('hello world')).toBe('HELLO WORLD');
  });

  it('should convert to camelCase', () => {
    expect(tool.toCamelCase('hello world')).toBe('helloWorld');
  });

  it('should preserve formatting when enabled', () => {
    tool.settings = { preserveFormatting: true };
    expect(tool.toUpperCase('hello\n  world')).toBe('HELLO\n  WORLD');
  });
});
```

## Performance

The Text Transformer Tool is optimized for performance:

- **Lazy Loading** - Components loaded only when needed
- **Efficient Algorithms** - Optimized transformation functions
- **Memory Management** - Limited history size with cleanup
- **Debounced Updates** - Statistics updated efficiently
- **Minimal DOM Impact** - Non-blocking UI updates

### Performance Metrics

- **Startup Time**: < 50ms
- **Transform Time**: < 5ms for texts up to 10,000 characters
- **Memory Usage**: < 2MB for normal operation
- **History Storage**: Configurable, default 50 items

## Troubleshooting

### Common Issues

#### Tool Not Appearing in Toolbar
1. Verify UnboundUI version compatibility (>=1.0.0)
2. Check extension is properly installed and activated
3. Restart UnboundUI application
4. Check browser console for errors

#### Transformations Not Working
1. Ensure text is properly selected
2. Check if text contains special characters that block transformation
3. Verify extension permissions in settings
4. Try with simple text first

#### Keyboard Shortcuts Not Working
1. Check for shortcut conflicts with other extensions
2. Verify shortcuts in extension settings
3. Ensure UnboundUI has focus when using shortcuts
4. Try resetting shortcuts to defaults

#### Performance Issues
1. Reduce history size in settings
2. Disable preview for large texts
3. Clear transformation history
4. Restart UnboundUI

### Getting Help

- **Documentation**: [Extension Docs](https://extensions.unboundui.dev)
- **Issues**: [GitHub Issues](https://github.com/unboundui/sample-extensions/issues)
- **Community**: [Discord Server](https://discord.gg/unboundui)
- **Email**: extensions@unboundui.dev

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Ways to Contribute

- 🐛 **Report bugs** and issues
- 💡 **Suggest new transformations** and features
- 📝 **Improve documentation** and examples
- 🧪 **Add tests** and improve test coverage
- 🎨 **Enhance UI/UX** design and usability
- 🔧 **Submit pull requests** with improvements

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Changelog

### Version 1.0.0 (2024-01-15)
- Initial release
- Core text transformations (case, format, reverse, clean)
- UI integration (toolbar, sidebar, context menu)
- Keyboard shortcuts and customization
- History and undo/redo functionality
- Text statistics and analytics
- Custom transformation patterns
- Performance optimizations
- Comprehensive documentation

---

*Transform your text with ease! 🔤✨*
