#!/usr/bin/env node

/**
 * Update all extension manifests to use the unified schema
 * This script ensures all extensions have consistent schema fields
 */

const fs = require('fs');
const path = require('path');

const EXTENSIONS_DIR = path.join(__dirname, '..', 'extensions');
const API_DIR = path.join(__dirname, '..', 'api');

// Unified schema template with default values
const schemaDefaults = {
  // These fields should exist in all manifests
  email: 'extensions@unboundui.dev',
  license: 'MIT',
  compatibility: {
    unboundUIVersion: '>=1.0.0'
  },
  repository: 'https://github.com/ivanuser/Unbound-UI-extension-marketplace',
  dependencies: {
    unboundui: '>=1.0.0'
  }
};

// Fields that should be validated/normalized
const typeMapping = {
  'prompt-templates': 'prompt-template', // Already fixed but keeping for safety
  'prompt-template': 'prompt-template',
  'theme': 'theme',
  'tool': 'tool',
  'library': 'library',
  'code-interpreter': 'code-interpreter'
};

function updateManifest(manifestPath) {
  console.log(`Processing: ${manifestPath}`);
  
  try {
    // Read existing manifest
    const content = fs.readFileSync(manifestPath, 'utf8');
    const manifest = JSON.parse(content);
    
    // Store original for comparison
    const originalManifest = JSON.stringify(manifest, null, 2);
    
    // Fix type field if needed
    if (manifest.type && typeMapping[manifest.type]) {
      manifest.type = typeMapping[manifest.type];
    }
    
    // Add missing fields from defaults
    if (!manifest.email && schemaDefaults.email) {
      manifest.email = schemaDefaults.email;
    }
    
    if (!manifest.license && schemaDefaults.license) {
      manifest.license = schemaDefaults.license;
    }
    
    if (!manifest.compatibility) {
      manifest.compatibility = schemaDefaults.compatibility;
    }
    
    if (!manifest.repository) {
      manifest.repository = schemaDefaults.repository;
    }
    
    if (!manifest.dependencies) {
      manifest.dependencies = schemaDefaults.dependencies;
    }
    
    // Ensure permissions field exists (can be empty object if no special permissions needed)
    if (!manifest.permissions) {
      manifest.permissions = {};
    }
    
    // Ensure all string arrays exist
    if (!manifest.tags) {
      manifest.tags = [];
    }
    
    if (!manifest.keywords) {
      manifest.keywords = [];
    }
    
    // Order fields consistently
    const orderedManifest = {
      id: manifest.id,
      title: manifest.title,
      description: manifest.description,
      version: manifest.version,
      author: manifest.author,
      email: manifest.email,
      license: manifest.license,
      type: manifest.type,
      category: manifest.category,
      tags: manifest.tags,
      keywords: manifest.keywords,
      compatibility: manifest.compatibility,
      repository: manifest.repository,
      mainFile: manifest.mainFile,
      previewImageUrl: manifest.previewImageUrl,
      icon: manifest.icon,
      permissions: manifest.permissions,
      dependencies: manifest.dependencies,
      config: manifest.config // Optional field
    };
    
    // Remove undefined fields
    Object.keys(orderedManifest).forEach(key => {
      if (orderedManifest[key] === undefined) {
        delete orderedManifest[key];
      }
    });
    
    // Check if changes were made
    const newContent = JSON.stringify(orderedManifest, null, 2);
    if (newContent !== originalManifest) {
      fs.writeFileSync(manifestPath, newContent + '\n', 'utf8');
      console.log(`  ✓ Updated ${path.basename(path.dirname(manifestPath))}`);
      return true;
    } else {
      console.log(`  - No changes needed for ${path.basename(path.dirname(manifestPath))}`);
      return false;
    }
  } catch (error) {
    console.error(`  ✗ Error processing ${manifestPath}:`, error.message);
    return false;
  }
}

function updateAllManifests() {
  console.log('Starting manifest update process...\n');
  
  // Get all extension directories
  const extensionDirs = fs.readdirSync(EXTENSIONS_DIR)
    .filter(dir => {
      const fullPath = path.join(EXTENSIONS_DIR, dir);
      return fs.statSync(fullPath).isDirectory();
    });
  
  let updatedCount = 0;
  let totalCount = 0;
  
  // Process each extension
  extensionDirs.forEach(dir => {
    const manifestPath = path.join(EXTENSIONS_DIR, dir, 'manifest.json');
    if (fs.existsSync(manifestPath)) {
      totalCount++;
      if (updateManifest(manifestPath)) {
        updatedCount++;
      }
    }
  });
  
  console.log(`\nSummary:`);
  console.log(`- Total extensions processed: ${totalCount}`);
  console.log(`- Manifests updated: ${updatedCount}`);
  console.log(`- Manifests already compliant: ${totalCount - updatedCount}`);
  
  // Also update API files
  console.log('\nUpdating API files...');
  updateApiFile(path.join(API_DIR, 'marketplace-api-extensions.json'));
}

function updateApiFile(apiPath) {
  if (!fs.existsSync(apiPath)) {
    console.log(`  - API file not found: ${apiPath}`);
    return;
  }
  
  try {
    const content = fs.readFileSync(apiPath, 'utf8');
    const extensions = JSON.parse(content);
    
    let updated = false;
    extensions.forEach(ext => {
      // Apply same type mapping
      if (ext.type && typeMapping[ext.type]) {
        const newType = typeMapping[ext.type];
        if (ext.type !== newType) {
          ext.type = newType;
          updated = true;
        }
      }
      
      // Update keywords if they contain old type
      if (ext.keywords && Array.isArray(ext.keywords)) {
        ext.keywords = ext.keywords.map(keyword => {
          if (keyword === 'prompt-templates') {
            updated = true;
            return 'prompt-template';
          }
          return keyword;
        });
      }
    });
    
    if (updated) {
      fs.writeFileSync(apiPath, JSON.stringify(extensions, null, 2) + '\n', 'utf8');
      console.log(`  ✓ Updated API file`);
    } else {
      console.log(`  - API file already compliant`);
    }
  } catch (error) {
    console.error(`  ✗ Error updating API file:`, error.message);
  }
}

// Run the update process
updateAllManifests();

console.log('\n✅ Manifest update process complete!');