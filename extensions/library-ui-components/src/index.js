/**
 * UnboundUI Component Library
 * Comprehensive collection of reusable UI components and utilities
 */

// UI Components
export const Button = ({ children, variant = 'primary', size = 'medium', onClick, disabled = false, ...props }) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200';
  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    secondary: 'bg-gray-600 hover:bg-gray-700 text-white',
    outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50'
  };
  const sizes = {
    small: 'px-3 py-1.5 text-sm',
    medium: 'px-4 py-2 text-base',
    large: 'px-6 py-3 text-lg'
  };

  return {
    type: 'button',
    className: `${baseClasses} ${variants[variant]} ${sizes[size]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`,
    onClick: disabled ? undefined : onClick,
    children,
    ...props
  };
};

export const Modal = ({ isOpen, onClose, title, children, size = 'medium' }) => {
  if (!isOpen) return null;

  const sizes = {
    small: 'max-w-md',
    medium: 'max-w-lg', 
    large: 'max-w-2xl',
    full: 'max-w-6xl'
  };

  return {
    type: 'div',
    className: 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50',
    children: {
      type: 'div',
      className: `bg-white rounded-lg shadow-xl ${sizes[size]} w-full max-h-[90vh] overflow-hidden`,
      children: [
        {
          type: 'div',
          className: 'flex items-center justify-between p-6 border-b',
          children: [
            { type: 'h2', className: 'text-xl font-semibold', children: title },
            { type: 'button', onClick: onClose, children: '×', className: 'text-2xl' }
          ]
        },
        {
          type: 'div',
          className: 'p-6 overflow-y-auto',
          children
        }
      ]
    }
  };
};

export const Input = ({ label, error, helperText, ...props }) => {
  return {
    type: 'div',
    className: 'space-y-1',
    children: [
      label && { type: 'label', className: 'block text-sm font-medium text-gray-700', children: label },
      {
        type: 'input',
        className: `w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          error ? 'border-red-500' : 'border-gray-300'
        }`,
        ...props
      },
      error && { type: 'p', className: 'text-sm text-red-600', children: error },
      helperText && { type: 'p', className: 'text-sm text-gray-500', children: helperText }
    ]
  };
};

// Utility Functions
export const formatDate = (date, options = {}) => {
  const defaultOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };
  return new Intl.DateTimeFormat('en-US', { ...defaultOptions, ...options }).format(new Date(date));
};

export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy to clipboard:', err);
    return false;
  }
};

// React Hooks
export const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      setStoredValue(value);
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  };

  return [storedValue, setValue];
};

export const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Main Library Class
class UIComponentsLibrary {
  constructor() {
    this.name = 'UnboundUI Component Library';
    this.version = '1.0.0';
    this.initialized = false;
  }

  async initialize() {
    try {
      if (typeof unboundUI !== 'undefined') {
        unboundUI.registerExtension(this);
        this.initialized = true;
        unboundUI.logger.info('UI Components Library extension initialized');
      }
    } catch (error) {
      console.error('Failed to initialize UI Components Library:', error);
    }
  }

  getComponents() {
    return {
      Button,
      Modal,
      Input
    };
  }

  getUtilities() {
    return {
      formatDate,
      formatFileSize,
      debounce,
      copyToClipboard
    };
  }

  getHooks() {
    return {
      useLocalStorage,
      useDebounce
    };
  }

  activate() {
    unboundUI.logger.info('UI Components Library extension activated');
  }

  deactivate() {
    unboundUI.logger.info('UI Components Library extension deactivated');
  }
}

// Initialize and export
const uiLibrary = new UIComponentsLibrary();
uiLibrary.initialize();

export default uiLibrary;
