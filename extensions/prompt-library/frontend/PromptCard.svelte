<script>
  import { createEventDispatcher } from 'svelte';
  
  // Props
  export let prompt;
  export let categories = [];
  
  // Get window context (assuming i18n is available)
  let i18n = { t: (key) => key }; // Fallback if i18n is not available
  try {
    if (window && window.i18n) {
      i18n = window.i18n;
    }
  } catch (e) {
    console.warn('i18n not available, using fallback translations');
  }
  
  // Event dispatcher
  const dispatch = createEventDispatcher();
  
  // Derived values
  $: category = categories.find(c => c.id === prompt.category) || {
    name: prompt.category,
    icon: 'folder'
  };
  
  // Format date helper
  function formatDate(dateStr) {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (e) {
      return dateStr;
    }
  }
  
  // Event handlers
  function handleUse() {
    dispatch('use', prompt);
  }
  
  function handleEdit() {
    dispatch('edit', prompt);
  }
  
  function handleDelete() {
    dispatch('delete', prompt);
  }
  
  // Toggle content visibility
  let showContent = false;
  function toggleContent() {
    showContent = !showContent;
  }
</script>

<div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
  <div class="p-4">
    <div class="flex justify-between items-start mb-2">
      <h4 class="text-lg font-medium dark:text-white">{prompt.title}</h4>
      
      <span
        class="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      >
        {category.name}
      </span>
    </div>
    
    <p class="text-sm text-gray-600 dark:text-gray-300 mb-3">
      {prompt.description}
    </p>
    
    {#if prompt.tags && prompt.tags.length > 0}
      <div class="flex flex-wrap gap-1 mb-3">
        {#each prompt.tags as tag}
          <span
            class="inline-block px-2 py-0.5 text-xs font-medium rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
          >
            {tag}
          </span>
        {/each}
      </div>
    {/if}
    
    <button
      on:click={toggleContent}
      class="text-sm text-blue-600 dark:text-blue-400 hover:underline"
    >
      {showContent ? i18n.t('Hide content') : i18n.t('Show content')}
    </button>
    
    {#if showContent}
      <div class="mt-2 p-3 bg-gray-50 dark:bg-gray-750 rounded-md text-sm font-mono whitespace-pre-wrap break-words border border-gray-200 dark:border-gray-700">
        {prompt.content}
      </div>
    {/if}
    
    <div class="mt-3 text-xs text-gray-500 dark:text-gray-400">
      {i18n.t('Updated')}: {formatDate(prompt.updated_at)}
    </div>
  </div>
  
  <div class="bg-gray-50 dark:bg-gray-750 px-4 py-2 flex justify-between">
    <button
      on:click={handleUse}
      class="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
    >
      {i18n.t('Use Prompt')}
    </button>
    
    <div class="flex space-x-3">
      <button
        on:click={handleEdit}
        class="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
      >
        {i18n.t('Edit')}
      </button>
      
      <button
        on:click={handleDelete}
        class="text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
      >
        {i18n.t('Delete')}
      </button>
    </div>
  </div>
</div>
