<script lang="ts">
    import OBR from "@owlbear-rodeo/sdk";
    import { editingMode, character } from '../CharacterStore'
    import PlayerManager from '../PlayerManager'
    import { get } from 'svelte/store'
 
   let showMenu = false
 
   function toggleMenu() {
     showMenu = !showMenu

     OBR.player.getMetadata().then((metadata) => {
       console.log(metadata)
     })
     OBR.scene.getMetadata().then((metadata) => {
       console.log(metadata)
     })
     OBR.room.getMetadata().then((metadata) => {
       console.log(metadata)
     })
     console.log(window.localStorage)
   }
 
   async function toggleEditing() {
     const prev = get(editingMode)
     const next = !prev
     editingMode.set(next)
 
     // If exiting editing mode, persist character data
     if (!next) {
       const char = get(character)
       if (char) {
         try {
           await PlayerManager.saveCharacter(char)
         } catch (e) {
           console.error('Failed to save character', e)
         }
       }
     }
   }
 </script>
 
 <header class="flex justify-between items-center px-4 py-3" style="background-color: var(--color-bg-dark); color: var(--color-text-white); border-bottom: 1px solid var(--color-bg-dark)">
   <div class="flex items-center">
   </div>
   <div class="flex gap-2 items-center">
     <button 
       class="bg-transparent border-none cursor-pointer p-1 flex items-center justify-center rounded-sm transition-colors duration-200"
       style="color: var(--color-text-primary)"
       on:mouseenter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-accent-hover)'}
       on:mouseleave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
       aria-label="Menu"
       on:click={toggleMenu}
     >
       <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2">
         <path d="M3 5h14M3 10h14M3 15h14"/>
       </svg>
     </button>
 
     <!-- Editing mode toggle -->
     <button
       class="bg-transparent border-none cursor-pointer p-1 flex items-center justify-center rounded-sm transition-colors duration-200"
       style="color: var(--color-text-primary)"
       on:mouseenter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-accent-hover)'}
       on:mouseleave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
       aria-label="Toggle edit mode"
       on:click={toggleEditing}
     >
       <!-- simple pencil icon -->
       <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
         <path d="M12 20h9" />
         <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
       </svg>
     </button>
   </div>
 </header>
