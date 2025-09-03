#!/usr/bin/env node

/**
 * Validate all extension manifests against the unified schema
 * Ensures all required fields are present and have correct types
 */

const fs = require('fs');
const path = require('path');

const EXTENSIONS_DIR = path.join(__dirname, '..', 'extensions');

// Define the unified schema requirements
const requiredFields = {
  id: 'string',
  title: 'string',
  description: 'string',
  version: 'string',
  author: 'string',
  email: 'string',
  license: 'string',
  type: ['theme', 'tool', 'library', 'prompt-template', 'code-interpreter'],
  category: 'string',
  tags: 'array',
  keywords: 'array',
  compatibility: 'object',
  repository: 'string',
  mainFile: 'string',
  permissions: 'object',
  dependencies: 'object'
};

const optionalFields = {
  previewImageUrl: 'string',
  icon: 'string',
  config: 'object',
  downloads: 'number',
  averageRating: 'number',
  ratingCount: 'number'
};

const validationErrors = [];
const validationWarnings = [];

function validateFieldType(value, expectedType, fieldName) {
  if (Array.isArray(expectedType)) {
    // Enum validation
    return expectedType.includes(value);
  }
  
  if (expectedType === 'array') {
    return Array.isArray(value);
  }
  
  if (expectedType === 'object') {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
  }
  
  return typeof value === expectedType;
}

function validateManifest(manifestPath, extensionName) {
  console.log(`\n📋 Validating: ${extensionName}`);
  
  try {
    const content = fs.readFileSync(manifestPath, 'utf8');
    const manifest = JSON.parse(content);
    
    let hasErrors = false;
    let hasWarnings = false;
    
    // Check required fields
    Object.entries(requiredFields).forEach(([field, type]) => {
      if (!(field in manifest)) {
        console.log(`  ❌ Missing required field: ${field}`);
        validationErrors.push(`${extensionName}: Missing required field '${field}'`);
        hasErrors = true;
      } else if (!validateFieldType(manifest[field], type, field)) {
        if (Array.isArray(type)) {
          console.log(`  ❌ Invalid value for '${field}': '${manifest[field]}' (expected one of: ${type.join(', ')})`);
          validationErrors.push(`${extensionName}: Invalid value for '${field}'`);
        } else {
          console.log(`  ❌ Wrong type for '${field}': expected ${type}, got ${typeof manifest[field]}`);
          validationErrors.push(`${extensionName}: Wrong type for '${field}'`);
        }
        hasErrors = true;
      }
    });
    
    // Check for unknown fields
    const allKnownFields = [...Object.keys(requiredFields), ...Object.keys(optionalFields)];
    Object.keys(manifest).forEach(field => {
      if (!allKnownFields.includes(field)) {
        console.log(`  ⚠️  Unknown field: ${field}`);
        validationWarnings.push(`${extensionName}: Unknown field '${field}'`);
        hasWarnings = true;
      }
    });
    
    // Specific validations
    
    // 1. Check version format (should be semver-like)
    if (manifest.version && !/^\d+\.\d+\.\d+/.test(manifest.version)) {
      console.log(`  ⚠️  Version format should be semver (x.y.z): ${manifest.version}`);
      validationWarnings.push(`${extensionName}: Non-standard version format`);
      hasWarnings = true;
    }
    
    // 2. Check mainFile exists
    if (manifest.mainFile) {
      const mainFilePath = path.join(path.dirname(manifestPath), manifest.mainFile);
      if (!fs.existsSync(mainFilePath)) {
        console.log(`  ❌ mainFile not found: ${manifest.mainFile}`);
        validationErrors.push(`${extensionName}: mainFile not found`);
        hasErrors = true;
      }
    }
    
    // 3. Check icon and preview images exist if specified
    if (manifest.icon) {
      const iconPath = path.join(path.dirname(manifestPath), manifest.icon);
      if (!fs.existsSync(iconPath)) {
        console.log(`  ⚠️  Icon file not found: ${manifest.icon}`);
        validationWarnings.push(`${extensionName}: Icon file not found`);
        hasWarnings = true;
      }
    }
    
    if (manifest.previewImageUrl) {
      const previewPath = path.join(path.dirname(manifestPath), manifest.previewImageUrl);
      if (!fs.existsSync(previewPath)) {
        console.log(`  ⚠️  Preview image not found: ${manifest.previewImageUrl}`);
        validationWarnings.push(`${extensionName}: Preview image not found`);
        hasWarnings = true;
      }
    }
    
    // 4. Validate compatibility object structure
    if (manifest.compatibility && !manifest.compatibility.unboundUIVersion) {
      console.log(`  ❌ Missing compatibility.unboundUIVersion`);
      validationErrors.push(`${extensionName}: Missing compatibility.unboundUIVersion`);
      hasErrors = true;
    }
    
    // 5. Check for critical type mismatch
    if (manifest.type === 'prompt-templates') {
      console.log(`  ❌ Critical: Type should be 'prompt-template' not 'prompt-templates'`);
      validationErrors.push(`${extensionName}: Type mismatch - should be 'prompt-template'`);
      hasErrors = true;
    }
    
    if (!hasErrors && !hasWarnings) {
      console.log(`  ✅ All validations passed!`);
    } else if (!hasErrors && hasWarnings) {
      console.log(`  ✅ Valid with warnings`);
    }
    
    return !hasErrors;
    
  } catch (error) {
    console.log(`  ❌ Failed to parse manifest: ${error.message}`);
    validationErrors.push(`${extensionName}: Failed to parse manifest`);
    return false;
  }
}

function validateAllManifests() {
  console.log('🔍 Extension Manifest Schema Validation');
  console.log('========================================');
  
  // Get all extension directories
  const extensionDirs = fs.readdirSync(EXTENSIONS_DIR)
    .filter(dir => {
      const fullPath = path.join(EXTENSIONS_DIR, dir);
      return fs.statSync(fullPath).isDirectory();
    });
  
  let validCount = 0;
  let totalCount = 0;
  
  // Process each extension
  extensionDirs.forEach(dir => {
    const manifestPath = path.join(EXTENSIONS_DIR, dir, 'manifest.json');
    if (fs.existsSync(manifestPath)) {
      totalCount++;
      if (validateManifest(manifestPath, dir)) {
        validCount++;
      }
    } else {
      console.log(`\n📋 ${dir}`);
      console.log(`  ❌ No manifest.json found`);
      validationErrors.push(`${dir}: No manifest.json found`);
    }
  });
  
  // Print summary
  console.log('\n========================================');
  console.log('📊 Validation Summary');
  console.log('========================================');
  console.log(`Total extensions checked: ${totalCount}`);
  console.log(`✅ Valid manifests: ${validCount}`);
  console.log(`❌ Invalid manifests: ${totalCount - validCount}`);
  console.log(`⚠️  Total warnings: ${validationWarnings.length}`);
  
  if (validationErrors.length > 0) {
    console.log('\n❌ Errors found:');
    validationErrors.forEach(error => {
      console.log(`  - ${error}`);
    });
  }
  
  if (validationWarnings.length > 0) {
    console.log('\n⚠️  Warnings:');
    validationWarnings.forEach(warning => {
      console.log(`  - ${warning}`);
    });
  }
  
  if (validCount === totalCount) {
    console.log('\n🎉 All extension manifests are valid and comply with the unified schema!');
    return true;
  } else {
    console.log('\n⚠️  Some manifests need attention. Please fix the errors listed above.');
    return false;
  }
}

// Run validation
const success = validateAllManifests();
process.exit(success ? 0 : 1);