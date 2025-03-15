<script>
  import { createEventDispatcher } from 'svelte';
  
  // Props
  export let prompt = null;
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
  
  // Form state
  let title = '';
  let content = '';
  let description = '';
  let category = '';
  let tagsInput = '';
  
  // Initialize form if editing
  $: if (prompt) {
    title = prompt.title;
    content = prompt.content;
    description = prompt.description;
    category = prompt.category;
    tagsInput = prompt.tags ? prompt.tags.join(', ') : '';
  }
  
  // Methods
  function handleSubmit() {
    // Validate form
    if (!title.trim()) {
      alert(i18n.t('Please enter a title'));
      return;
    }
    
    if (!content.trim()) {
      alert(i18n.t('Please enter content'));
      return;
    }
    
    if (!category) {
      alert(i18n.t('Please select a category'));
      return;
    }
    
    // Process tags (comma-separated)
    const tags = tagsInput
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);
    
    // Create prompt data
    const promptData = {
      title,
      content,
      description,
      category,
      tags
    };
    
    // Dispatch save event
    dispatch('save', promptData);
  }
  
  function handleCancel() {
    dispatch('cancel');
  }
</script>

<form on:submit|preventDefault={handleSubmit} class="space-y-4">
  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
    <div>
      <label for="title" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {i18n.t('Title')} *
      </label>
      <input
        type="text"
        id="title"
        bind:value={title}
        required
        class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
    </div>
    
    <div>
      <label for="category" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {i18n.t('Category')} *
      </label>
      <select
        id="category"
        bind:value={category}
        required
        class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        <option value="" disabled selected>{i18n.t('Select a category')}</option>
        {#each categories as cat}
          <option value={cat.id}>{cat.name}</option>
        {/each}
      </select>
    </div>
  </div>
  
  <div>
    <label for="description" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
      {i18n.t('Description')}
    </label>
    <input
      type="text"
      id="description"
      bind:value={description}
      class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      placeholder={i18n.t('Brief description of what this prompt does')}
    />
  </div>
  
  <div>
    <label for="content" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
      {i18n.t('Prompt Content')} *
    </label>
    <textarea
      id="content"
      bind:value={content}
      required
      rows="6"
      class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono"
      placeholder={i18n.t('Enter your prompt text here')}
    ></textarea>
    <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
      {i18n.t('Use [placeholders] for parts you want to customize each time')}
    </p>
  </div>
  
  <div>
    <label for="tags" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
      {i18n.t('Tags')}
    </label>
    <input
      type="text"
      id="tags"
      bind:value={tagsInput}
      class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      placeholder={i18n.t('writing, analysis, summary (comma separated)')}
    />
  </div>
  
  <div class="flex justify-end space-x-2 pt-2">
    <button
      type="button"
      on:click={handleCancel}
      class="px-4 py-2 text-sm font-medium text-gray-700 bg-white dark:text-gray-300 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
    >
      {i18n.t('Cancel')}
    </button>
    
    <button
      type="submit"
      class="px-4 py-2 text-sm font-medium text-white bg-blue-600 dark:bg-blue-500 border border-transparent rounded-md shadow-sm hover:bg-blue-700 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
    >
      {prompt ? i18n.t('Update') : i18n.t('Save')}
    </button>
  </div>
</form>
