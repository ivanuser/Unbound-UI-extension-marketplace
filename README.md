# Open-WebUI Extension Marketplace

<p align="center">
  <img src="assets/images/extensplace-logo.png" alt="Open-WebUI Extensplace" width="300" />
</p>

## Overview

The Open-WebUI Extension Marketplace is a centralized repository for discovering, distributing, and managing extensions for Open-WebUI. This repository serves as both the backend API and extension registry for the marketplace.

## Features

- **Extension Discovery**: Browse and search for extensions by category and type
- **Detailed Information**: View comprehensive information about each extension
- **Versioning**: Manage extension versions and updates
- **Categorization**: Organized by function and use case
- **Ratings**: Community-driven ratings and reviews

## Repository Structure

```
open-webui-extension-marketplace/
├── api/                        # Marketplace API endpoints
│   └── v1/                     # API version 1
│       ├── extensions.json     # Extensions listing
│       ├── categories.json     # Categories listing
│       ├── featured.json       # Featured extensions
│       └── search.json         # Search API
├── extensions/                 # Extension directories
│   └── {extension-id}/         # Individual extension
│       ├── manifest.json       # Extension metadata
│       ├── README.md           # Extension documentation
│       ├── preview.png         # Extension preview image
│       └── releases/           # Release packages
│           ├── latest.json     # Latest release info
│           └── {version}.zip   # Release package
└── index.json                  # Marketplace index
```

## Contributing

If you want to publish your extension to the marketplace, please follow our [contribution guidelines](CONTRIBUTING.md).

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
