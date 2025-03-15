"""
Prompt Library Extension for Open WebUI
Allows users to save, organize, and reuse effective prompts
"""

import os
import json
import logging
from pathlib import Path
from typing import Dict, List, Optional, Any

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("prompt_library")

# Global variables
_extension_instance = None
_config = {}

class PromptLibraryExtension:
    """Prompt Library Extension Class"""
    
    def __init__(self):
        """Initialize the extension"""
        self.name = "Prompt Library"
        self.version = "0.1.0"
        self.description = "Save, organize, and reuse effective prompts"
        self.author = "Open WebUI Team"
        
        # Load configuration
        self.config = self.load_config()
        
        # Initialize storage for prompts
        self.categories = {}
        self.prompts = {}
        self.templates = {}
        
        # Initialize loaded state
        self.is_loaded = False
    
    def initialize(self) -> bool:
        """
        Initialize the extension
        
        Returns:
            bool: True if initialization was successful, False otherwise
        """
        logger.info("Initializing Prompt Library Extension")
        
        try:
            # Load templates from static files
            self.load_templates()
            
            # Load saved prompts from storage
            self.load_prompts()
            
            # Register routes with the API
            self.register_routes()
            
            self.is_loaded = True
            logger.info("Prompt Library Extension initialized successfully")
            return True
            
        except Exception as e:
            logger.error(f"Error initializing Prompt Library Extension: {e}")
            return False
    
    def shutdown(self) -> bool:
        """
        Shutdown the extension
        
        Returns:
            bool: True if shutdown was successful, False otherwise
        """
        logger.info("Shutting down Prompt Library Extension")
        
        try:
            # Save any pending changes
            self.save_prompts()
            
            self.is_loaded = False
            logger.info("Prompt Library Extension shut down successfully")
            return True
            
        except Exception as e:
            logger.error(f"Error shutting down Prompt Library Extension: {e}")
            return False
    
    def load_config(self) -> Dict[str, Any]:
        """
        Load extension configuration from extension.json
        
        Returns:
            Dict[str, Any]: Configuration dictionary
        """
        try:
            # Get the directory of this file
            extension_dir = os.path.dirname(os.path.abspath(__file__))
            config_path = os.path.join(extension_dir, "extension.json")
            
            with open(config_path, "r") as f:
                data = json.load(f)
                return data.get("config", {})
                
        except Exception as e:
            logger.error(f"Error loading configuration: {e}")
            return {}
    
    def load_templates(self) -> None:
        """Load prompt templates from static files"""
        try:
            # Get templates directory
            extension_dir = os.path.dirname(os.path.abspath(__file__))
            templates_dir = os.path.join(extension_dir, "static", "templates")
            
            if not os.path.exists(templates_dir):
                logger.warning(f"Templates directory not found: {templates_dir}")
                return
            
            # Load templates from each JSON file
            for filename in os.listdir(templates_dir):
                if filename.endswith(".json"):
                    template_path = os.path.join(templates_dir, filename)
                    category = filename.replace(".json", "")
                    
                    with open(template_path, "r") as f:
                        templates = json.load(f)
                        self.templates[category] = templates
                        logger.info(f"Loaded {len(templates)} templates from {category}")
            
        except Exception as e:
            logger.error(f"Error loading templates: {e}")
    
    def load_prompts(self) -> None:
        """Load saved prompts from storage"""
        try:
            # In a real implementation, this would load from the database or filesystem
            # For this example, we'll just initialize with empty data
            
            # Default categories
            self.categories = {
                "general": {
                    "id": "general",
                    "name": "General",
                    "description": "General-purpose prompts",
                    "icon": "chat"
                },
                "writing": {
                    "id": "writing",
                    "name": "Writing",
                    "description": "Prompts for writing tasks",
                    "icon": "pencil"
                },
                "coding": {
                    "id": "coding",
                    "name": "Coding",
                    "description": "Prompts for programming tasks",
                    "icon": "code"
                },
                "research": {
                    "id": "research",
                    "name": "Research",
                    "description": "Prompts for research tasks",
                    "icon": "search"
                }
            }
            
            # Sample prompts
            self.prompts = {
                "sample-1": {
                    "id": "sample-1",
                    "title": "Detailed Explanation",
                    "content": "Explain [topic] in detail, covering its history, key concepts, and practical applications. Include examples to illustrate important points.",
                    "description": "Get a comprehensive explanation of any topic",
                    "category": "general",
                    "tags": ["explanation", "learning"],
                    "created_at": "2025-03-15T12:00:00Z",
                    "updated_at": "2025-03-15T12:00:00Z"
                },
                "sample-2": {
                    "id": "sample-2",
                    "title": "Code Review",
                    "content": "Review the following code for bugs, inefficiencies, and style issues. Suggest specific improvements with examples:\n\n```[language]\n[code]\n```",
                    "description": "Get feedback on code quality and suggestions for improvement",
                    "category": "coding",
                    "tags": ["code-review", "programming"],
                    "created_at": "2025-03-15T12:00:00Z",
                    "updated_at": "2025-03-15T12:00:00Z"
                }
            }
            
            logger.info(f"Loaded {len(self.categories)} categories and {len(self.prompts)} prompts")
            
        except Exception as e:
            logger.error(f"Error loading prompts: {e}")
    
    def save_prompts(self) -> None:
        """Save prompts to storage"""
        try:
            # In a real implementation, this would save to the database or filesystem
            logger.info(f"Saved {len(self.prompts)} prompts")
            
        except Exception as e:
            logger.error(f"Error saving prompts: {e}")
    
    def register_routes(self) -> None:
        """Register API routes"""
        try:
            # In a real implementation, this would register the API routes
            # with the Open WebUI API framework
            logger.info("Registered API routes")
            
        except Exception as e:
            logger.error(f"Error registering routes: {e}")
    
    def get_categories(self) -> List[Dict[str, Any]]:
        """
        Get all prompt categories
        
        Returns:
            List[Dict[str, Any]]: List of category dictionaries
        """
        return list(self.categories.values())
    
    def get_prompts(self, category: Optional[str] = None) -> List[Dict[str, Any]]:
        """
        Get prompts, optionally filtered by category
        
        Args:
            category (Optional[str]): Category ID to filter by
            
        Returns:
            List[Dict[str, Any]]: List of prompt dictionaries
        """
        if category:
            return [prompt for prompt in self.prompts.values() if prompt["category"] == category]
        return list(self.prompts.values())
    
    def get_prompt(self, prompt_id: str) -> Optional[Dict[str, Any]]:
        """
        Get a prompt by ID
        
        Args:
            prompt_id (str): Prompt ID
            
        Returns:
            Optional[Dict[str, Any]]: Prompt dictionary or None if not found
        """
        return self.prompts.get(prompt_id)
    
    def add_prompt(self, prompt: Dict[str, Any]) -> str:
        """
        Add a new prompt
        
        Args:
            prompt (Dict[str, Any]): Prompt data
            
        Returns:
            str: ID of the new prompt
        """
        # Generate ID if not provided
        if "id" not in prompt:
            import uuid
            prompt_id = f"prompt-{str(uuid.uuid4())[:8]}"
            prompt["id"] = prompt_id
        else:
            prompt_id = prompt["id"]
        
        # Add timestamps
        from datetime import datetime
        now = datetime.utcnow().isoformat() + "Z"
        prompt["created_at"] = now
        prompt["updated_at"] = now
        
        # Add to prompts dictionary
        self.prompts[prompt_id] = prompt
        
        # Save changes
        self.save_prompts()
        
        return prompt_id
    
    def update_prompt(self, prompt_id: str, prompt: Dict[str, Any]) -> bool:
        """
        Update an existing prompt
        
        Args:
            prompt_id (str): ID of the prompt to update
            prompt (Dict[str, Any]): Updated prompt data
            
        Returns:
            bool: True if updated successfully, False otherwise
        """
        if prompt_id not in self.prompts:
            return False
        
        # Update timestamp
        from datetime import datetime
        prompt["updated_at"] = datetime.utcnow().isoformat() + "Z"
        
        # Keep created_at from original
        prompt["created_at"] = self.prompts[prompt_id]["created_at"]
        
        # Update the prompt
        self.prompts[prompt_id] = prompt
        
        # Save changes
        self.save_prompts()
        
        return True
    
    def delete_prompt(self, prompt_id: str) -> bool:
        """
        Delete a prompt
        
        Args:
            prompt_id (str): ID of the prompt to delete
            
        Returns:
            bool: True if deleted successfully, False otherwise
        """
        if prompt_id not in self.prompts:
            return False
        
        # Remove the prompt
        del self.prompts[prompt_id]
        
        # Save changes
        self.save_prompts()
        
        return True
    
    def add_category(self, category: Dict[str, Any]) -> str:
        """
        Add a new category
        
        Args:
            category (Dict[str, Any]): Category data
            
        Returns:
            str: ID of the new category
        """
        # Generate ID if not provided
        if "id" not in category:
            category_id = category["name"].lower().replace(" ", "-")
            category["id"] = category_id
        else:
            category_id = category["id"]
        
        # Add to categories dictionary
        self.categories[category_id] = category
        
        # Save changes
        self.save_prompts()
        
        return category_id
    
    def get_templates(self, category: Optional[str] = None) -> Dict[str, List[Dict[str, Any]]]:
        """
        Get templates, optionally filtered by category
        
        Args:
            category (Optional[str]): Category to filter by
            
        Returns:
            Dict[str, List[Dict[str, Any]]]: Dictionary of templates by category
        """
        if category:
            return {category: self.templates.get(category, [])}
        return self.templates
    
    def export_prompts(self) -> Dict[str, Any]:
        """
        Export all prompts and categories
        
        Returns:
            Dict[str, Any]: Export data
        """
        return {
            "categories": self.categories,
            "prompts": self.prompts
        }
    
    def import_prompts(self, data: Dict[str, Any]) -> bool:
        """
        Import prompts and categories
        
        Args:
            data (Dict[str, Any]): Import data
            
        Returns:
            bool: True if imported successfully, False otherwise
        """
        try:
            # Validate data
            if "categories" not in data or "prompts" not in data:
                return False
            
            # Merge categories
            for category_id, category in data["categories"].items():
                self.categories[category_id] = category
            
            # Merge prompts
            for prompt_id, prompt in data["prompts"].items():
                self.prompts[prompt_id] = prompt
            
            # Save changes
            self.save_prompts()
            
            return True
            
        except Exception as e:
            logger.error(f"Error importing prompts: {e}")
            return False

# Module functions for extension initialization

def get_extension():
    """Get the extension instance"""
    global _extension_instance
    if _extension_instance is None:
        _extension_instance = PromptLibraryExtension()
    return _extension_instance

def initialize():
    """Initialize the extension"""
    extension = get_extension()
    return extension.initialize()

def shutdown():
    """Shutdown the extension"""
    extension = get_extension()
    return extension.shutdown()

# Initialize when module is imported
if __name__ != "__main__":
    logger.info("Prompt Library Extension loaded")
