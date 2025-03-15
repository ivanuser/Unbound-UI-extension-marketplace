<script>
  import { onMount } from 'svelte';
  import { fade, slide } from 'svelte/transition';
  import PromptCard from './PromptCard.svelte';
  import PromptForm from './PromptForm.svelte';
  import CategoryList from './CategoryList.svelte';
  import { toast } from 'svelte-sonner';
  
  // Get window context (assuming i18n is available)
  let i18n = { t: (key) => key }; // Fallback if i18n is not available
  try {
    if (window && window.i18n) {
      i18n = window.i18n;
    }
  } catch (e) {
    console.warn('i18n not available, using fallback translations');
  }
  
  // State
  let categories = [];
  let prompts = [];
  let templates = {};
  let loading = true;
  let selectedCategory = 'all';
  let searchQuery = '';
  let showAddForm = false;
  let editingPrompt = null;
  
  // Fetch data on mount
  onMount(async () => {
    await Promise.all([
      fetchCategories(),
      fetchPrompts(),
      fetchTemplates()
    ]);
    loading = false;
  });
  
  // Computed values
  $: filteredPrompts = filterPrompts(prompts, selectedCategory, searchQuery);
  
  // Methods
  async function fetchCategories() {
    try {
      const response = await fetch('/api/extensions/prompt-library/categories', {
        headers: {
          'Authorization': `Bearer ${localStorage.token || ''}`
        }
      });
      
      if (response.ok) {
        categories = await response.json();
      } else {
        console.error('Failed to fetch categories:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  }
  
  async function fetchPrompts() {
    try {
      const response = await fetch('/api/extensions/prompt-library/prompts', {
        headers: {
          'Authorization': `Bearer ${localStorage.token || ''}`
        }
      });
      
      if (response.ok) {
        prompts = await response.json();
      } else {
        console.error('Failed to fetch prompts:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching prompts:', error);
    }
  }
  
  async function fetchTemplates() {
    try {
      const response = await fetch('/api/extensions/prompt-library/templates', {
        headers: {
          'Authorization': `Bearer ${localStorage.token || ''}`
        }
      });
      
      if (response.ok) {
        templates = await response.json();
      } else {
        console.error('Failed to fetch templates:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching templates:', error);
    }
  }
  
  function filterPrompts(promptList, category, query) {
    return promptList.filter(prompt => {
      // Filter by category
      if (category !== 'all' && prompt.category !== category) {
        return false;
      }
      
      // Filter by search query
      if (query) {
        const searchLower = query.toLowerCase();
        return (
          prompt.title.toLowerCase().includes(searchLower) ||
          prompt.description.toLowerCase().includes(searchLower) ||
          prompt.content.toLowerCase().includes(searchLower) ||
          prompt.tags.some(tag => tag.toLowerCase().includes(searchLower))
        );
      }
      
      return true;
    });
  }
  
  function handleCategorySelect(event) {
    selectedCategory = event.detail.id;
  }
  
  function handleAddPrompt() {
    editingPrompt = null;
    showAddForm = true;
  }
  
  function handleEditPrompt(event) {
    editingPrompt = event.detail;
    showAddForm = true;
  }
  
  function handleCancelForm() {
    showAddForm = false;
    editingPrompt = null;
  }
  
  async function handleSavePrompt(event) {
    const promptData = event.detail;
    
    try {
      let response;
      
      if (editingPrompt) {
        // Update existing prompt
        response = await fetch(`/api/extensions/prompt-library/prompts/${editingPrompt.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.token || ''}`
          },
          body: JSON.stringify(promptData)
        });
      } else {
        // Create new prompt
        response = await fetch('/api/extensions/prompt-library/prompts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.token || ''}`
          },
          body: JSON.stringify(promptData)
        });
      }
      
      if (response.ok) {
        const savedPrompt = await response.json();
        
        if (editingPrompt) {
          // Update in list
          prompts = prompts.map(p => p.id === savedPrompt.id ? savedPrompt : p);
          toast.success(i18n.t('Prompt updated successfully'));
        } else {
          // Add to list
          prompts = [...prompts, savedPrompt];
          toast.success(i18n.t('Prompt saved successfully'));
        }
        
        showAddForm = false;
        editingPrompt = null;
      } else {
        const error = await response.json();
        toast.error(error.detail || i18n.t('Failed to save prompt'));
      }
    } catch (error) {
      console.error('Error saving prompt:', error);
      toast.error(i18n.t('Error saving prompt'));
    }
  }
  
  async function handleDeletePrompt(event) {
    const promptId = event.detail.id;
    
    if (!confirm(i18n.t('Are you sure you want to delete this prompt?'))) {
      return;
    }
    
    try {
      const response = await fetch(`/api/extensions/prompt-library/prompts/${promptId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.token || ''}`
        }
      });
      
      if (response.ok) {
        // Remove from list
        prompts = prompts.filter(p => p.id !== promptId);
        toast.success(i18n.t('Prompt deleted successfully'));
      } else {
        const error = await response.json();
        toast.error(error.detail || i18n.t('Failed to delete prompt'));
      }
    } catch (error) {
      console.error('Error deleting prompt:', error);
      toast.error(i18n.t('Error deleting prompt'));
    }
  }
  
  async function handleUsePrompt(event) {
    const prompt = event.detail;
    
    try {
      // In a real implementation, this would insert the prompt into the conversation
      // For now, just copy to clipboard
      await navigator.clipboard.writeText(prompt.content);
      toast.success(i18n.t('Prompt copied to clipboard'));
    } catch (error) {
      console.error('Error using prompt:', error);
      toast.error(i18n.t('Error using prompt'));
    }
  }
  
  async function handleExport() {
    try {
      const response = await fetch('/api/extensions/prompt-library/export', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.token || ''}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        
        // Create download link
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'prompt-library-export.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        toast.success(i18n.t('Prompts exported successfully'));
      } else {
        const error = await response.json();
        toast.error(error.detail || i18n.t('Failed to export prompts'));
      }
    } catch (error) {
      console.error('Error exporting prompts:', error);
      toast.error(i18n.t('Error exporting prompts'));
    }
  }
  
  function handleImport() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      
      try {
        const reader = new FileReader();
        
        reader.onload = async (event) => {
          try {
            const data = JSON.parse(event.target.result);
            
            const response = await fetch('/api/extensions/prompt-library/import', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.token || ''}`
              },
              body: JSON.stringify(data)
            });
            
            if (response.ok) {
              // Reload data
              await Promise.all([
                fetchCategories(),
                fetchPrompts()
              ]);
              
              toast.success(i18n.t('Prompts imported successfully'));
            } else {
              const error = await response.json();
              toast.error(error.detail || i18n.t('Failed to import prompts'));
            }
          } catch (error) {
            console.error('Error parsing import file:', error);
            toast.error(i18n.t('Invalid import file'));
          }
        };
        
        reader.readAsText(file);
      } catch (error) {
        console.error('Error importing prompts:', error);
        toast.error(i18n.t('Error importing prompts'));
      }
    };
    
    input.click();
  }
</script>

<div class="prompt-library p-4">
  <div class="mb-4 flex justify-between items-center">
    <h2 class="text-2xl font-bold dark:text-white">{i18n.t('Prompt Library')}</h2>
    
    <div class="flex space-x-2">
      <button
        on:click={handleExport}
        class="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 dark:text-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm"
      >
        {i18n.t('Export')}
      </button>
      
      <button
        on:click={handleImport}
        class="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 dark:text-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm"
      >
        {i18n.t('Import')}
      </button>
      
      <button
        on:click={handleAddPrompt}
        class="px-3 py-1.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 rounded-md shadow-sm"
      >
        {i18n.t('Add Prompt')}
      </button>
    </div>
  </div>
  
  <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
    <div class="md:col-span-1">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
        <h3 class="text-lg font-medium mb-3 dark:text-white">{i18n.t('Categories')}</h3>
        
        {#if loading}
          <div class="animate-pulse">
            <div class="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
            <div class="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
            <div class="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
          </div>
        {:else}
          <CategoryList
            {categories}
            selectedCategory={selectedCategory}
            on:select={handleCategorySelect}
          />
        {/if}
      </div>
    </div>
    
    <div class="md:col-span-3">
      {#if showAddForm}
        <div transition:slide>
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-4">
            <h3 class="text-lg font-medium mb-3 dark:text-white">
              {editingPrompt ? i18n.t('Edit Prompt') : i18n.t('Add New Prompt')}
            </h3>
            
            <PromptForm
              prompt={editingPrompt}
              {categories}
              on:save={handleSavePrompt}
              on:cancel={handleCancelForm}
            />
          </div>
        </div>
      {/if}
      
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-medium dark:text-white">{i18n.t('Prompts')}</h3>
          
          <div class="relative">
            <input
              type="text"
              bind:value={searchQuery}
              placeholder={i18n.t('Search prompts...')}
              class="pl-8 pr-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <svg
              class="absolute left-2.5 top-2 h-4 w-4 text-gray-400 dark:text-gray-500"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
        </div>
        
        {#if loading}
          <div class="animate-pulse space-y-4">
            <div class="h-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div class="h-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        {:else if filteredPrompts.length === 0}
          <div
            class="py-8 text-center text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-750 rounded-lg"
          >
            {searchQuery
              ? i18n.t('No prompts found matching your search')
              : selectedCategory !== 'all'
              ? i18n.t('No prompts in this category')
              : i18n.t('No prompts yet. Click "Add Prompt" to create one.')}
          </div>
        {:else}
          <div class="space-y-4">
            {#each filteredPrompts as prompt (prompt.id)}
              <div transition:fade={{ duration: 150 }}>
                <PromptCard
                  {prompt}
                  {categories}
                  on:use={() => handleUsePrompt({ detail: prompt })}
                  on:edit={() => handleEditPrompt({ detail: prompt })}
                  on:delete={() => handleDeletePrompt({ detail: prompt })}
                />
              </div>
            {/each}
          </div>
        {/if}
      </div>
    </div>
  </div>
</div>

<style>
  .prompt-library {
    min-height: 500px;
  }
</style>
