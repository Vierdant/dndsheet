<script lang="ts">
  import { character, editingMode } from '../CharacterStore'
  import PlayerManager from '../PlayerManager'
  import { get } from 'svelte/store'
  import { roll, DICE_PLUS } from '../integration/DicePlus'
 
  function updateName(value: string) {
    character.update(c => {
      if (!c) return c
      return { ...c, name: value }
    })
  }
 
  // Generic updater for top-level numeric fields
  function updateField(field: string, value: number): void {
    character.update(c => {
      if (!c) return c
      // @ts-ignore dynamic assignment
      return { ...c, [field]: Number(value) }
    })
  }
 
  function updateHP(current: number | null, max: number | null) {
    character.update(c => {
      if (!c) return c
      return { ...c, currentHP: current === null ? c.currentHP : Number(current), maxHP: max === null ? c.maxHP : Number(max) }
    })
  }
 
  async function toggleInspiration() {
    character.update(c => {
      if (!c) return c
      return { ...c, inspiration: !c.inspiration }
    })

    const char = get(character)
     if (char) {
        try {
          await PlayerManager.saveCharacter(char)
      } catch (e) {
        console.error('Failed to save character', e)
      }
    }
  }
</script>
 
<div class="p-4 border-b" style="background-color: var(--color-bg-dark); border-color: var(--color-bg-darker); border-width: 1px">
  <div class="flex gap-3 items-start">
    <div class="flex-shrink-0">
      <div class="w-16 h-16 rounded-full border-2 overflow-hidden flex items-center justify-center" style="border-color: var(--color-accent); background-color: var(--color-bg-darker)">
        <div class="w-full h-full bg-gradient-to-br from-[#3a3a3a] to-[var(--color-bg-dark)]"></div>
      </div>
    </div>
    <div class="flex-1 min-w-0">
      <div class="flex items-center gap-3 mb-1">
        {#if $editingMode}
          <input class="text-xl font-semibold text-white m-0 whitespace-nowrap overflow-hidden text-ellipsis bg-transparent border-none outline-none" value={$character!.name} on:input={(e) => updateName(e.currentTarget.value)} />
        {:else}
          <h1 class="text-xl font-semibold text-white m-0 whitespace-nowrap overflow-hidden text-ellipsis">{$character!.name}</h1>
        {/if}
        <button 
          class="bg-transparent border cursor-pointer whitespace-nowrap transition-all duration-200 hover:bg-accent-hover px-3 py-1 text-xs font-semibold rounded-sm" 
          style="border-color: var(--color-accent); color: var(--color-accent); border-width: 1px; font-size: var(--font-size-base)"
        >
          MANAGE
        </button>
      </div>
      <p class="text-sm text-gray-400 m-0 mb-3" style="font-size: var(--font-size-md); color: var(--color-text-light)">
        {$character!.race} {$character!.class} {$character!.level}
      </p>
      <div class="flex items-center gap-2 mt-2">
        <span class="text-xs font-medium" style="font-size: var(--font-size-sm); color: var(--color-text-light)">LVL {$character!.level}</span>
        <div class="flex-1 h-2 rounded-sm relative overflow-hidden" style="background-color: var(--color-bg-darker); border-radius: 3px">
          <div 
            class="absolute top-0 left-0 h-full transition-all duration-300" 
            style="background-color: var(--color-accent); width: {($character!.currentXP / $character!.xpToNextLevel) * 100}%"
          ></div>
          <span class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[9px] text-white font-semibold whitespace-nowrap z-10" style="font-size: var(--font-size-xs)">
            {$character!.currentXP}/{$character!.xpToNextLevel} XP
          </span>
        </div>
        <span class="text-xs font-medium" style="font-size: var(--font-size-sm); color: var(--color-text-light)">LVL {$character!.level + 1}</span>
      </div>
    </div>
    <div class="flex flex-col items-end gap-2 flex-shrink-0">
      <div class="flex flex-col items-end">
        <div class="text-xs font-medium mb-1" style="font-size: var(--font-size-sm); color: var(--color-text-primary)">HIT POINTS</div>
        {#if $editingMode}
          <div class="flex gap-2">
            <input 
              type="number" 
              class="bg-transparent border-b text-2xl font-bold leading-none text-white text-right placeholder:text-gray-500 focus:outline-none focus:ring-0" 
              style="border-color: var(--color-accent); border-width: 2px; padding: 0 0.5rem; width: 4rem"
              placeholder="Current" 
              bind:value={$character!.currentHP}
              on:input={(e) => updateHP(Number(e.currentTarget.value), null)}
            />
            <input 
              type="number" 
              class="bg-transparent border-b text-2xl font-bold leading-none text-white text-right placeholder:text-gray-500 focus:outline-none focus:ring-0" 
              style="border-color: var(--color-accent); border-width: 2px; padding: 0 0.5rem; width: 4rem"
              placeholder="Max" 
              bind:value={$character!.maxHP}
              on:input={(e) => updateHP(null, Number(e.currentTarget.value))}
            />
          </div>
        {:else}
          <div class="text-2xl font-bold leading-none" style="font-size: var(--font-size-2xl); color: var(--color-accent)">{$character!.currentHP}/{$character!.maxHP}</div>
        {/if}
      </div>
      <button 
        class="bg-transparent border cursor-pointer whitespace-nowrap transition-all duration-200 px-3 py-1.5 text-[10px] font-semibold rounded-sm" 
        style="border-color: var(--color-accent); color: var(--color-accent); border-width: 1px; font-size: var(--font-size-sm); padding: 6px var(--spacing-md); background-color: {$character!.inspiration ? 'var(--color-accent)' : 'transparent'}; color: {$character!.inspiration ? 'var(--color-bg-dark)' : 'var(--color-accent)'}"
        on:click={toggleInspiration}
      >
        HEROIC INSPIRATION
      </button>
    </div>
  </div>
</div>
 
<div class="flex gap-4 items-center p-4 border-b flex-wrap" style="background-color: var(--color-bg-dark); border-color: var(--color-bg-dark); border-width: 1px">
  <div class="flex flex-col items-center gap-1 flex-1" style="min-width: 80px">
    {#if $editingMode}
      <input type="number" value={$character!.proficiencyBonus} on:input={(e) => updateField('proficiencyBonus', Number(e.currentTarget.value))} class="text-xl font-bold leading-none text-white text-center bg-transparent border-b" style="font-size: var(--font-size-xl); border-color: var(--color-accent); border-width:1px; width:4rem" />
    {:else}
      <div class="text-xl font-bold leading-none text-white" style="font-size: var(--font-size-xl)">
      {#if $DICE_PLUS}
        <button class="bg-transparent border-none p-0" style="color:var(--color-text-white); font-weight:700; font-size:var(--font-size-xl); cursor:pointer" on:click={() => { const val = $character!.proficiencyBonus; const signed = val >= 0 ? `+${val}` : `${val}`; roll(`1d20kh1${signed}`) }} aria-label="Proficiency roll">+{$character!.proficiencyBonus}</button>
      {:else}
        +{$character!.proficiencyBonus}
      {/if}
      </div>
    {/if}
    <div class="text-xs font-medium text-center block text-white" style="font-size: var(--font-size-sm)">PROFICIENCY BONUS</div>
  </div>
  <div class="flex flex-col items-center gap-1 flex-1" style="min-width: 80px">
    {#if $editingMode}
      <input type="number" value={$character!.walkingSpeed} on:input={(e) => updateField('walkingSpeed', Number(e.currentTarget.value))} class="text-xl font-bold leading-none text-white text-center bg-transparent border-b" style="font-size: var(--font-size-xl); border-color: var(--color-accent); border-width:1px; width:5rem" />
      <div class="text-xs font-medium text-center block text-white" style="font-size: var(--font-size-sm)">WALKING SPEED</div>
    {:else}
      <div class="text-xl font-bold leading-none text-white" style="font-size: var(--font-size-xl)">{$character!.walkingSpeed} ft.</div>
      <div class="text-xs font-medium text-center block text-white" style="font-size: var(--font-size-sm)">WALKING SPEED</div>
    {/if}
  </div>
  <div class="flex flex-col items-center gap-1 flex-1" style="min-width: 80px">
    {#if $editingMode}
      <input type="number" value={$character!.initiative} on:input={(e) => updateField('initiative', Number(e.currentTarget.value))} class="text-xl font-bold leading-none text-white text-center bg-transparent border-b" style="font-size: var(--font-size-xl); border-color: var(--color-accent); border-width:1px; width:4rem" />
    {:else}
      <div class="text-xl font-bold leading-none text-white" style="font-size: var(--font-size-xl)">
      {#if $DICE_PLUS}
        <button class="bg-transparent border-none p-0" style="color:var(--color-text-white); font-weight:700; font-size:var(--font-size-xl); cursor:pointer" on:click={() => { const val = $character!.initiative; const signed = val >= 0 ? `+${val}` : `${val}`; roll(`1d20kh1${signed}`) }} aria-label="Initiative roll">+{$character!.initiative}</button>
      {:else}
        +{$character!.initiative}
      {/if}
      </div>
    {/if}
    <div class="text-xs font-medium text-center block text-white" style="font-size: var(--font-size-sm)">INITIATIVE</div>
  </div>
  <div class="flex flex-col items-center gap-1 flex-1" style="min-width: 80px">
    {#if $editingMode}
      <input type="number" value={$character!.armorClass} on:input={(e) => updateField('armorClass', Number(e.currentTarget.value))} class="text-xl font-bold leading-none text-white text-center bg-transparent border-b" style="font-size: var(--font-size-xl); border-color: var(--color-accent); border-width:1px; width:4rem" />
    {:else}
      <div class="text-xl font-bold leading-none text-white" style="font-size: var(--font-size-xl)">{$character!.armorClass}</div>
    {/if}
    <div class="text-xs font-medium text-center block text-white" style="font-size: var(--font-size-sm)">ARMOR CLASS</div>
  </div>
  <div class="flex flex-col gap-2 ml-auto">
    <button 
      class="bg-transparent border cursor-pointer whitespace-nowrap transition-all duration-200 hover:bg-accent-hover px-3 py-1.5 text-[10px] font-semibold rounded-sm" 
      style="border-color: var(--color-accent); color: var(--color-accent); border-width: 1px; font-size: var(--font-size-sm); padding: 6px var(--spacing-md)"
    >
      DEFENSES
    </button>
    <button 
      class="bg-transparent border cursor-pointer whitespace-nowrap transition-all duration-200 hover:bg-accent-hover px-3 py-1.5 text-[10px] font-semibold rounded-sm" 
      style="border-color: var(--color-accent); color: var(--color-accent); border-width: 1px; font-size: var(--font-size-sm); padding: 6px var(--spacing-md)"
    >
      CONDITIONS
    </button>
  </div>
</div>
