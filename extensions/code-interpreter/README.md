# Code Interpreter Extension

A powerful code execution environment that supports multiple programming languages including Python, JavaScript, and more. Execute code snippets safely in isolated environments with real-time output.

## Features

- **Multi-language Support**: Python, JavaScript, TypeScript, Bash
- **Secure Execution**: Sandboxed environment for safe code execution
- **Real-time Output**: Live feedback during code execution
- **Session Management**: Maintain execution context across runs
- **Error Handling**: Comprehensive error reporting and debugging

## Installation

1. Open UnboundUI Extensions page
2. Search for "Code Interpreter Extension"
3. Click "Install"
4. The interpreter will be available in your development tools

## Usage

```javascript
// Execute Python code
const result = await codeInterpreter.executeCode(`
print("Hello from Python!")
x = 5 + 3
print(f"Result: {x}")
`, 'python');

// Execute JavaScript code
const jsResult = await codeInterpreter.executeCode(`
console.log("Hello from JavaScript!");
const result = [1, 2, 3].map(x => x * 2);
console.log(result);
`, 'javascript');
```

## Supported Languages

- **Python**: Full Python 3.x support with common libraries
- **JavaScript**: ES6+ JavaScript execution
- **TypeScript**: TypeScript compilation and execution
- **Bash**: Shell script execution (limited)

## Security

- Code runs in isolated sandbox environments
- No access to sensitive system resources
- Memory and execution time limits enforced
- Network access restricted

## License

MIT License - see LICENSE file for details.
