"""
Data models for the Prompt Library extension
"""

from typing import Dict, List, Optional, Any
from pydantic import BaseModel, Field
from datetime import datetime

class PromptCategory(BaseModel):
    """Prompt category model"""
    id: str
    name: str
    description: str
    icon: str = "folder"
    
    class Config:
        orm_mode = True

class Prompt(BaseModel):
    """Prompt model"""
    id: str
    title: str
    content: str
    description: str
    category: str
    tags: List[str] = []
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Config:
        orm_mode = True

class PromptTemplate(BaseModel):
    """Prompt template model"""
    id: str
    title: str
    content: str
    description: str
    category: str
    tags: List[str] = []
    variables: List[Dict[str, Any]] = []
    
    class Config:
        orm_mode = True

class ImportExportData(BaseModel):
    """Model for import/export data"""
    categories: Dict[str, PromptCategory]
    prompts: Dict[str, Prompt]
    
    class Config:
        orm_mode = True

# Storage functions (in a real implementation, these would interact with a database)

_categories: Dict[str, PromptCategory] = {}
_prompts: Dict[str, Prompt] = {}

def get_categories() -> List[PromptCategory]:
    """Get all categories"""
    return list(_categories.values())

def get_category(category_id: str) -> Optional[PromptCategory]:
    """Get a category by ID"""
    return _categories.get(category_id)

def add_category(category: PromptCategory) -> str:
    """Add a category"""
    _categories[category.id] = category
    return category.id

def update_category(category_id: str, category: PromptCategory) -> bool:
    """Update a category"""
    if category_id not in _categories:
        return False
    _categories[category_id] = category
    return True

def delete_category(category_id: str) -> bool:
    """Delete a category"""
    if category_id not in _categories:
        return False
    del _categories[category_id]
    return True

def get_prompts(category: Optional[str] = None) -> List[Prompt]:
    """Get prompts, optionally filtered by category"""
    if category:
        return [prompt for prompt in _prompts.values() if prompt.category == category]
    return list(_prompts.values())

def get_prompt(prompt_id: str) -> Optional[Prompt]:
    """Get a prompt by ID"""
    return _prompts.get(prompt_id)

def add_prompt(prompt: Prompt) -> str:
    """Add a prompt"""
    _prompts[prompt.id] = prompt
    return prompt.id

def update_prompt(prompt_id: str, prompt: Prompt) -> bool:
    """Update a prompt"""
    if prompt_id not in _prompts:
        return False
    prompt.updated_at = datetime.utcnow()
    _prompts[prompt_id] = prompt
    return True

def delete_prompt(prompt_id: str) -> bool:
    """Delete a prompt"""
    if prompt_id not in _prompts:
        return False
    del _prompts[prompt_id]
    return True

def export_data() -> ImportExportData:
    """Export all data"""
    return ImportExportData(
        categories={category.id: category for category in _categories.values()},
        prompts={prompt.id: prompt for prompt in _prompts.values()}
    )

def import_data(data: ImportExportData) -> bool:
    """Import data"""
    try:
        # Merge categories
        for category_id, category in data.categories.items():
            _categories[category_id] = category
        
        # Merge prompts
        for prompt_id, prompt in data.prompts.items():
            _prompts[prompt_id] = prompt
        
        return True
    except Exception:
        return False
