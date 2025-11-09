<script lang="ts">
  export let currentPage: string = 'abilities'
  export let onNavigateTo: ((page: string) => void) | undefined = undefined
  export let onNavigateBack: (() => void) | undefined = undefined
  
  let showPageMenu = false

  function togglePageMenu() {
    showPageMenu = !showPageMenu
  }

  function closePageMenu() {
    showPageMenu = false
  }

  function handlePageClick(page: string) {
    console.log("help")
    if (onNavigateTo) {
      onNavigateTo(page)
    }
    showPageMenu = false
  }
</script>

<footer class="flex justify-between items-center px-4 py-3 border-t relative" style="border-color: var(--color-border-light); background-color: var(--color-bg-content)">
  <!-- Empty space on left for layout -->
  <div></div>
  
  <!-- Floating Navigation Group (Bottom Right) -->
  <div class="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2">
    <!-- Floating Menu -->
    {#if showPageMenu && onNavigateTo}
      <div class="absolute bottom-16 right-0 mb-2 border rounded-sm shadow-lg flex flex-col min-w-[180px]" style="background-color: rgba(27, 29, 36, 0.95); backdrop-filter: blur(8px); border-color: var(--color-border-light); border-radius: var(--border-radius-sm); padding: var(--spacing-sm)">
        
        <!-- Page Navigation Buttons with semi-transparent background -->
        <div class="flex flex-col gap-2 mb-2 px-2 py-2 rounded-sm" style="background-color: rgba(42, 46, 59, 0.5); backdrop-filter: blur(4px);">
          <button 
            class="px-3 py-2 bg-transparent border-none text-left cursor-pointer transition-colors duration-200 rounded-sm {currentPage === 'abilities' ? 'font-semibold' : ''}" 
            style="font-size: var(--font-size-md); color: {currentPage === 'abilities' ? 'var(--color-accent)' : 'var(--color-text-primary)'}; background-color: {currentPage === 'abilities' ? 'var(--color-accent-hover)' : 'transparent'}"
            onmouseenter={(e) => { if (currentPage !== 'abilities') e.currentTarget.style.backgroundColor = 'var(--color-accent-hover)' }}
            onmouseleave={(e) => { e.currentTarget.style.backgroundColor = currentPage === 'abilities' ? 'var(--color-accent-hover)' : 'transparent' }}
            onclick={() => handlePageClick('abilities')}
          >
            Abilities
          </button>
          <button 
            class="px-3 py-2 bg-transparent border-none text-left cursor-pointer transition-colors duration-200 rounded-sm {currentPage === 'saving-throws' ? 'font-semibold' : ''}" 
            style="font-size: var(--font-size-md); color: {currentPage === 'saving-throws' ? 'var(--color-accent)' : 'var(--color-text-primary)'}; background-color: {currentPage === 'saving-throws' ? 'var(--color-accent-hover)' : 'transparent'}"
            onmouseenter={(e) => { if (currentPage !== 'saving-throws') e.currentTarget.style.backgroundColor = 'var(--color-accent-hover)' }}
            onmouseleave={(e) => { e.currentTarget.style.backgroundColor = currentPage === 'saving-throws' ? 'var(--color-accent-hover)' : 'transparent' }}
            onclick={() => handlePageClick('skills')}
          >
            Skillss
          </button>
          <button 
            class="px-3 py-2 bg-transparent border-none text-left cursor-pointer transition-colors duration-200 rounded-sm {currentPage === 'senses' ? 'font-semibold' : ''}" 
            style="font-size: var(--font-size-md); color: {currentPage === 'senses' ? 'var(--color-accent)' : 'var(--color-text-primary)'}; background-color: {currentPage === 'senses' ? 'var(--color-accent-hover)' : 'transparent'}"
            onmouseenter={(e) => { if (currentPage !== 'senses') e.currentTarget.style.backgroundColor = 'var(--color-accent-hover)' }}
            onmouseleave={(e) => { e.currentTarget.style.backgroundColor = currentPage === 'senses' ? 'var(--color-accent-hover)' : 'transparent' }}
            onclick={() => handlePageClick('senses')}
          >
            Senses
          </button>
        </div>
      </div>
    {/if}
    
    <!-- Nav Buttons with semi-transparent background -->
    <div class="flex gap-2 items-center px-3 py-2 rounded-lg" style="">

      {#if onNavigateBack && currentPage !== 'abilities'}
        <button 
          class="bg-transparent border-none cursor-pointer p-1.5 flex items-center justify-center rounded-sm transition-colors duration-200 hover:bg-accent-hover" 
          style="color: var(--color-accent)"
          aria-label="Back" 
          onclick={onNavigateBack}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </button>
      {/if}
      
      <!-- Floating Action Button -->
      <button 
        class="w-12 h-12 rounded-full flex items-center justify-center cursor-pointer transition-all duration-200 hover:scale-110 active:scale-95 ml-1" 
        style="background-color: var(--color-accent); color: var(--color-text-primary);"
        aria-label="Open Menu"
        onclick={togglePageMenu}
      >
        {#if showPageMenu}
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        {:else}
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
        {/if}
      </button>
    </div>
  </div>
</footer>
