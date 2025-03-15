<script>
  import { createEventDispatcher } from 'svelte';
  
  // Props
  export let categories = [];
  export let selectedCategory = 'all';
  
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
  
  // Methods
  function selectCategory(id) {
    selectedCategory = id;
    dispatch('select', { id });
  }
  
  // Get category icon
  function getCategoryIcon(category) {
    // Default to 'folder' if no icon specified
    return category.icon || 'folder';
  }
</script>

<div class="space-y-1">
  <button
    class="w-full flex items-center px-3 py-2 text-sm rounded-md {selectedCategory === 'all'
      ? 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100'
      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'}"
    on:click={() => selectCategory('all')}
  >
    <svg
      class="mr-2 h-4 w-4"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z"
      />
    </svg>
    {i18n.t('All Prompts')}
  </button>
  
  {#each categories as category (category.id)}
    <button
      class="w-full flex items-center px-3 py-2 text-sm rounded-md {selectedCategory === category.id
        ? 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100'
        : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'}"
      on:click={() => selectCategory(category.id)}
    >
      <!-- Use a simple fallback for icons since we don't have an icon library here -->
      <svg
        class="mr-2 h-4 w-4"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        {#if getCategoryIcon(category) === 'chat'}
          <path
            d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z"
          />
          <path
            d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z"
          />
        {:else if getCategoryIcon(category) === 'pencil'}
          <path
            d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"
          />
        {:else if getCategoryIcon(category) === 'code'}
          <path
            fill-rule="evenodd"
            d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z"
            clip-rule="evenodd"
          />
        {:else if getCategoryIcon(category) === 'search'}
          <path
            fill-rule="evenodd"
            d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
            clip-rule="evenodd"
          />
        {:else}
          <!-- Default folder icon -->
          <path
            d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"
          />
        {/if}
      </svg>
      {category.name}
    </button>
  {/each}
</div>
