# Code Interpreter Extension for Open WebUI

Execute code directly within Open WebUI conversations and visualize results with the Code Interpreter extension.

## Features

- **Code Execution**: Run Python, JavaScript, and R code directly in chat
- **Data Visualization**: Create charts and graphs from data
- **File Upload**: Process and analyze uploaded files
- **Interactive Results**: View and interact with code execution results
- **Persistent Sessions**: Maintain state between code executions in a conversation

## Installation

1. Open the Extension Manager in Open WebUI (Settings > Extensions)
2. Click on the "Marketplace" tab
3. Find "Code Interpreter" and click "Install"
4. Restart Open WebUI if prompted

## Usage

### Running Code

1. In any conversation, type code within a code block using triple backticks and the language name:

```python
import pandas as pd
import matplotlib.pyplot as plt

# Create a sample dataframe
df = pd.DataFrame({
    'x': range(1, 11),
    'y': [i**2 for i in range(1, 11)]
})

# Create a simple plot
plt.figure(figsize=(8, 4))
plt.plot(df['x'], df['y'], marker='o')
plt.title('Square Function')
plt.xlabel('x')
plt.ylabel('y = x²')
plt.grid(True)
plt.show()
```

2. The code will be executed and the results (including visualizations) will be displayed in the conversation

### Uploading and Analyzing Files

1. Upload a file (e.g., CSV, Excel) to the conversation
2. Use the Code Interpreter to process the file:

```python
import pandas as pd

# Load the uploaded file
df = pd.read_csv('uploaded_file.csv')

# Display the first few rows
df.head()

# Get basic statistics
df.describe()
```

## Supported Languages

- **Python** (with numpy, pandas, matplotlib, and scikit-learn)
- **JavaScript** (Node.js environment)
- **R** (basic statistical functions)

## Security

The Code Interpreter runs in a secure, sandboxed environment with:

- Limited execution time (default: 30 seconds)
- Memory limitations (default: 512MB)
- No network access (configurable)
- Limited file system access

## Configuration

Administrators can configure the Code Interpreter in the Extension Settings:

- **Enabled Languages**: Choose which programming languages to enable
- **Execution Limits**: Set maximum execution time and memory limits
- **Permissions**: Configure file system and network access
- **Pre-installed Packages**: Manage available Python packages

## For Developers

The Code Interpreter can be extended with custom visualizations and integrations. See the [developer documentation](https://github.com/open-webui/code-interpreter/docs/development.md) for details.

## Support

If you encounter any issues or have suggestions, please:

1. Check the [GitHub Issues](https://github.com/open-webui/code-interpreter/issues)
2. Submit a new issue if needed
3. Join the [Open WebUI Discord](https://discord.gg/openwebui) for community support

## License

This extension is released under the MIT License.
