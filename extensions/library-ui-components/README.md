# UnboundUI Component Library

A comprehensive collection of reusable UI components, utilities, and React hooks for UnboundUI extensions. Includes buttons, modals, forms, charts, and advanced utilities for rapid extension development.

## Features

- **25+ UI Components**: Buttons, modals, inputs, cards, and more
- **15+ React Hooks**: Custom hooks for common patterns
- **20+ Utilities**: Helper functions for dates, files, text, and more
- **TypeScript Support**: Full type definitions included
- **Theme Integration**: Works seamlessly with UnboundUI themes
- **Accessibility First**: WCAG compliant components

## Installation

### Via Extension Marketplace

1. Open UnboundUI Extensions page
2. Search for "UnboundUI Component Library"
3. Click "Install Library"
4. Import components in your extensions

### Manual Installation

```bash
# In your extension directory
npm install @unboundui/component-library
```

## Usage

### Components

```javascript
import { Button, Modal, Input } from '@unboundui/component-library';

// Button component
const MyButton = Button({
  children: 'Click me',
  variant: 'primary',
  size: 'medium',
  onClick: () => console.log('Clicked!')
});

// Modal component
const MyModal = Modal({
  isOpen: true,
  title: 'Example Modal',
  onClose: () => setIsOpen(false),
  children: 'Modal content here'
});

// Input component
const MyInput = Input({
  label: 'Email Address',
  type: 'email',
  placeholder: 'Enter your email',
  error: 'Please enter a valid email'
});
```

### Utilities

```javascript
import { 
  formatDate, 
  formatFileSize, 
  copyToClipboard, 
  debounce 
} from '@unboundui/component-library';

// Format dates
const formattedDate = formatDate(new Date(), { 
  year: 'numeric',
  month: 'long',
  day: 'numeric'
});

// Format file sizes
const size = formatFileSize(1024000); // "1 MB"

// Copy to clipboard
const success = await copyToClipboard('Hello World!');

// Debounce function calls
const debouncedSearch = debounce(searchFunction, 300);
```

### React Hooks

```javascript
import { useLocalStorage, useDebounce } from '@unboundui/component-library';

function MyComponent() {
  // Persistent local storage
  const [settings, setSettings] = useLocalStorage('userSettings', {});
  
  // Debounced values
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  
  return (
    // Component JSX
  );
}
```

## Available Components

### Layout Components
- **Container**: Responsive container with max-width constraints
- **Grid**: Flexible grid system
- **Stack**: Vertical and horizontal stack layouts
- **Spacer**: Flexible spacing component

### Form Components
- **Button**: Primary, secondary, outline variants
- **Input**: Text, email, password, number inputs
- **Textarea**: Multi-line text input
- **Select**: Dropdown selection
- **Checkbox**: Single and multi-select checkboxes
- **Radio**: Radio button groups
- **Switch**: Toggle switches

### Feedback Components
- **Alert**: Success, warning, error, info alerts
- **Toast**: Temporary notification messages
- **Modal**: Overlay dialogs
- **Tooltip**: Hover information popups
- **Spinner**: Loading indicators
- **ProgressBar**: Progress visualization

### Data Display
- **Card**: Content containers
- **Badge**: Status indicators
- **Avatar**: User profile images
- **Table**: Data tables with sorting
- **List**: Structured lists
- **Divider**: Visual separators

## Available Hooks

### State Management
- **useLocalStorage**: Persistent local storage state
- **useSessionStorage**: Session-scoped storage state
- **usePrevious**: Access previous value of state
- **useToggle**: Boolean state toggle

### Effects & Side Effects
- **useDebounce**: Debounce value changes
- **useThrottle**: Throttle value changes
- **useAsync**: Async operation state management
- **useInterval**: Declarative intervals

### DOM & Events
- **useClickOutside**: Detect clicks outside element
- **useKeyboardShortcut**: Register keyboard shortcuts
- **useWindowSize**: Track window size changes
- **useIntersectionObserver**: Element visibility detection

### Utilities
- **useMediaQuery**: Responsive breakpoint detection
- **useCopyToClipboard**: Clipboard operations
- **useForm**: Form state and validation
- **useEventListener**: Declarative event listeners

## Available Utilities

### Date & Time
- **formatDate**: Flexible date formatting
- **formatTime**: Time formatting
- **formatRelativeTime**: "2 hours ago" formatting
- **parseDate**: String to date parsing

### Text & String
- **truncateText**: Text truncation with ellipsis
- **slugify**: Convert text to URL-friendly slugs
- **capitalizeFirst**: Capitalize first letter
- **removeHTML**: Strip HTML tags

### Numbers & Math
- **formatNumber**: Number formatting with locales
- **formatCurrency**: Currency formatting
- **formatPercentage**: Percentage formatting
- **clamp**: Constrain numbers to range

### Files & Data
- **formatFileSize**: Human-readable file sizes
- **downloadFile**: Trigger file downloads
- **readFileAsText**: Read file contents
- **validateEmail**: Email validation
- **validateURL**: URL validation

### Browser & System
- **copyToClipboard**: Clipboard operations
- **detectBrowser**: Browser detection
- **getDeviceType**: Device type detection
- **isOnline**: Network status

## Theming

All components support theming through CSS custom properties:

```css
:root {
  --ui-primary: #3b82f6;
  --ui-secondary: #64748b;
  --ui-success: #10b981;
  --ui-warning: #f59e0b;
  --ui-error: #ef4444;
  --ui-border-radius: 0.5rem;
  --ui-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}
```

## TypeScript Support

Full TypeScript definitions are included:

```typescript
interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  onClick?: () => void;
}

declare function Button(props: ButtonProps): JSX.Element;
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Add your component/utility
4. Include tests and documentation
5. Submit a pull request

## License

MIT License - see LICENSE file for details.
