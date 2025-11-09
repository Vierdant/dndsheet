<script lang="ts">
  import { onMount } from 'svelte'
  import OBR from '@owlbear-rodeo/sdk'
  import PlayerManager from './lib/PlayerManager'
  import { character, hasCharacter } from './lib/CharacterStore'
  
  import Header from './lib/components/Header.svelte'
  import Footer from './lib/components/Footer.svelte'
  import CharacterInfo from './lib/components/CharacterInfo.svelte'
  import AbilityScoresPlus from './lib/pages/sections/AbilityScoresPlus.svelte'
  import CharacterCreator from './lib/pages/CharacterCreator.svelte'
    import Skills from './lib/pages/sections/Skills.svelte';
    import { init } from './lib/integration/DicePlus';

  type Page = 'abilities' | 'saving-throws' | 'senses'
  let currentPage: string = 'abilities'

  onMount(async () => {
    await PlayerManager.init()
    const playerData = await PlayerManager.getPlayer()
    
    // Check if player has character data
    if (playerData?.data && Object.keys(playerData.data).length > 0) {
      character.set(playerData.data as any)
    } else {
      // Set to null to show character creator
      character.set(null)
    }

    // extension activity tracking
    await init();
  })

  function navigateToPage(page: string) {
    console.log("help")
    currentPage = page
  }

  function navigateBack() {
    currentPage = 'abilities'
  }
</script>

<main class="flex flex-col w-full h-full overflow-hidden" style="background-color: var(--color-bg-light)">
  <Header />

  {#if $hasCharacter}
    <CharacterInfo />
    <div class="flex-1 overflow-y-auto min-h-0">
      {#if currentPage === 'abilities'}
        <AbilityScoresPlus />
      {:else if currentPage === 'skills'}
        <Skills />
      {/if}
    </div>

    <Footer 
      {currentPage}
      onNavigateTo={navigateToPage}
      onNavigateBack={currentPage !== 'abilities' ? navigateBack : undefined} 
    />
  {:else}
    <CharacterCreator />
    <Footer />
  {/if}
</main>
