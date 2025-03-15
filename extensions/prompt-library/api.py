"""
API endpoints for the Prompt Library extension
"""

from typing import Dict, List, Optional, Any
import logging
from fastapi import APIRouter, HTTPException, Depends, Query, Body, Path
from pydantic import BaseModel

# Import the extension
from . import get_extension

# Setup logging
logger = logging.getLogger("prompt_library.api")

# Create router
router = APIRouter(prefix="/api/extensions/prompt-library", tags=["prompt-library"])

# Models for API requests and responses
class PromptBase(BaseModel):
    """Base model for prompt data"""
    title: str
    content: str
    description: str
    category: str
    tags: List[str] = []

class PromptCreate(PromptBase):
    """Model for creating a prompt"""
    pass

class PromptUpdate(PromptBase):
    """Model for updating a prompt"""
    pass

class Prompt(PromptBase):
    """Model for prompt data with ID and timestamps"""
    id: str
    created_at: str
    updated_at: str

class CategoryBase(BaseModel):
    """Base model for category data"""
    name: str
    description: str
    icon: str = "folder"

class CategoryCreate(CategoryBase):
    """Model for creating a category"""
    pass

class Category(CategoryBase):
    """Model for category data with ID"""
    id: str

class ImportData(BaseModel):
    """Model for import data"""
    categories: Dict[str, Any]
    prompts: Dict[str, Any]

# API Routes

@router.get("/categories", response_model=List[Category])
async def get_categories():
    """Get all categories"""
    extension = get_extension()
    return extension.get_categories()

@router.post("/categories", response_model=Category)
async def create_category(category: CategoryCreate):
    """Create a new category"""
    extension = get_extension()
    
    # Convert to dictionary
    category_dict = category.dict()
    
    # Add the category
    category_id = extension.add_category(category_dict)
    
    # Return the category
    return extension.categories[category_id]

@router.get("/prompts", response_model=List[Prompt])
async def get_prompts(category: Optional[str] = None):
    """Get all prompts, optionally filtered by category"""
    extension = get_extension()
    return extension.get_prompts(category)

@router.get("/prompts/{prompt_id}", response_model=Prompt)
async def get_prompt(prompt_id: str):
    """Get a prompt by ID"""
    extension = get_extension()
    prompt = extension.get_prompt(prompt_id)
    
    if prompt is None:
        raise HTTPException(status_code=404, detail=f"Prompt not found: {prompt_id}")
    
    return prompt

@router.post("/prompts", response_model=Prompt)
async def create_prompt(prompt: PromptCreate):
    """Create a new prompt"""
    extension = get_extension()
    
    # Convert to dictionary
    prompt_dict = prompt.dict()
    
    # Add the prompt
    prompt_id = extension.add_prompt(prompt_dict)
    
    # Return the prompt
    return extension.prompts[prompt_id]

@router.put("/prompts/{prompt_id}", response_model=Prompt)
async def update_prompt(prompt_id: str, prompt: PromptUpdate):
    """Update a prompt"""
    extension = get_extension()
    
    # Check if prompt exists
    if extension.get_prompt(prompt_id) is None:
        raise HTTPException(status_code=404, detail=f"Prompt not found: {prompt_id}")
    
    # Convert to dictionary
    prompt_dict = prompt.dict()
    prompt_dict["id"] = prompt_id
    
    # Update the prompt
    success = extension.update_prompt(prompt_id, prompt_dict)
    
    if not success:
        raise HTTPException(status_code=400, detail="Failed to update prompt")
    
    # Return the updated prompt
    return extension.prompts[prompt_id]

@router.delete("/prompts/{prompt_id}")
async def delete_prompt(prompt_id: str):
    """Delete a prompt"""
    extension = get_extension()
    
    # Check if prompt exists
    if extension.get_prompt(prompt_id) is None:
        raise HTTPException(status_code=404, detail=f"Prompt not found: {prompt_id}")
    
    # Delete the prompt
    success = extension.delete_prompt(prompt_id)
    
    if not success:
        raise HTTPException(status_code=400, detail="Failed to delete prompt")
    
    return {"message": f"Prompt deleted: {prompt_id}"}

@router.get("/templates")
async def get_templates(category: Optional[str] = None):
    """Get templates, optionally filtered by category"""
    extension = get_extension()
    return extension.get_templates(category)

@router.post("/export")
async def export_prompts():
    """Export all prompts and categories"""
    extension = get_extension()
    return extension.export_prompts()

@router.post("/import")
async def import_prompts(data: ImportData):
    """Import prompts and categories"""
    extension = get_extension()
    
    # Convert to dictionary
    import_data = data.dict()
    
    # Import the data
    success = extension.import_prompts(import_data)
    
    if not success:
        raise HTTPException(status_code=400, detail="Failed to import prompts")
    
    return {"message": "Prompts imported successfully"}

def register_routes(app):
    """
    Register routes with the FastAPI app
    
    Args:
        app: FastAPI application instance
    """
    app.include_router(router)
    logger.info("Registered Prompt Library API routes")
