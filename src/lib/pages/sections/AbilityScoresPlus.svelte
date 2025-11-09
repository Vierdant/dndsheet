<script lang="ts">
  import { character, getAbilityModifier, editingMode, abilityAbbr } from '../../CharacterStore'
  import type { AbilityKey } from '../../CharacterStore'
  import { roll, DICE_PLUS } from '../../integration/DicePlus';
 
  const abilityNames = {
    strength: 'STRENGTH',
    dexterity: 'DEXTERITY',
    constitution: 'CONSTITUTION',
    intelligence: 'INTELLIGENCE',
    wisdom: 'WISDOM',
    charisma: 'CHARISMA'
  }

  // Helpers to update the character store
  function updateAbility(key: AbilityKey, value: number) {
    character.update(c => {
      if (!c) return c
      return { ...c, abilities: { ...c.abilities, [key]: Number(value) } }
    })
  }

  function toggleSavingThrow(key: AbilityKey) {
    character.update(c => {
      if (!c) return c
      return { ...c, savingThrows: { ...c.savingThrows, [key]: !c.savingThrows[key] } }
    })
  }

  function updateSense(field: 'passivePerception' | 'passiveInvestigation' | 'passiveInsight', value: number) {
    character.update(c => {
      if (!c) return c
      return { ...c, [field]: Number(value) } as any
    })
  }
</script>

<div class="p-4 flex-1 border-b border-b-2 pb-6 overflow-y-auto" style="background-color: var(--color-bg-content); border-color: var(--color-bg-darker-border);">
  <div class="grid grid-cols-3 gap-6 max-sm:grid-cols-3">
    {#if $character}
      {#each Object.entries($character.abilities) as [key, score]}
        {@const modifier = getAbilityModifier(score)}
        {@const abilityName = abilityNames[key as keyof typeof abilityNames]}
        <div 
          class="border-2 rounded-lg flex flex-col items-center relative"
          style="
            background-color: var(--color-bg-content);
            border-color: var(--color-accent);
            border-radius: var(--border-radius-md);
            padding: var(--spacing-lg) var(--spacing-xl);
            min-height: 120px;
          "
        >
          <div class="font-semibold text-center mb-2" style="font-size: var(--font-size-lg); color: var(--color-text-primary)">{abilityName}</div>
          {#if $DICE_PLUS}
            <button
              class="font-bold leading-none mb-2"
              style="font-size: 28px; color: var(--color-text-primary); background: transparent; border: none; cursor: pointer; padding: 0;"
              on:click={() => roll("1d20kh1+" + modifier)}
              aria-label="Ability modifier"
            >
              {modifier >= 0 ? '+' : ''}{modifier}
            </button>
          {:else}
            <div class="font-bold leading-none mb-2" style="font-size: 28px; color: var(--color-text-primary)">{modifier >= 0 ? '+' : ''}{modifier}</div>
          {/if}
          <div 
            class="absolute left-1/2 -translate-x-1/2" 
            style="bottom: -1rem; width: 2.2rem; height: 2.2rem; border: 2px solid var(--color-accent); border-radius: 9999px; display: flex; align-items: center; justify-content: center; font-weight: 600; font-size: 15px; color: var(--color-text-primary); background: var(--color-bg-content);"
          >
            {#if $editingMode}
              <input
                type="number"
                min="1"
                max="30"
                value={score}
                on:input={(e) => updateAbility(key as AbilityKey, +e.currentTarget.value)}
                class="w-12 text-center bg-transparent border-none outline-none"
                style="font-weight:600; font-size:14px; color:var(--color-text-primary)"
              />
            {:else}
              <span>{score}</span>
            {/if}
          </div>
        </div>
      {/each}
    {/if}
  </div>
</div>
<div class="p-4 flex-1 border-b border-b-2 pb-6 overflow-y-auto text-center" style="background-color: var(--color-bg-content); border-color: var(--color-bg-darker-border);">
  <h2 class="text-sm font-bold m-0 mb-4" style="font-size: var(--font-size-lg); color: var(--color-text-primary)">SAVING THROWS</h2>
  {#if $character}
    <div class="grid grid-cols-2 gap-y-4 justify-items-center">
      {#each Object.entries($character.abilities) as [key, score], idx}
        {@const modifier = getAbilityModifier(score)}
        {@const isProficient = $character.savingThrows[key as keyof typeof $character.savingThrows]}
        {@const finalModifier = modifier + (isProficient ? $character.proficiencyBonus : 0)}
        {@const abbr = abilityAbbr[key as keyof typeof abilityAbbr]}
        <div class="flex items-center justify-center gap-3">
          <span class="text-xs font-semibold underline min-w-[40px] text-center" style="font-size: var(--font-size-md); color: var(--color-text-primary)">{abbr}</span>
          {#if $DICE_PLUS}
            <button
              class="w-11 h-9 flex items-center justify-center font-semibold"
              style="border-radius: var(--border-radius-sm); font-size: var(--font-size-lg); color: var(--color-text-primary); background-color: var(--color-bg-content); border-width: 1px; border: 1px solid var(--color-accent); background: transparent; cursor: pointer;"
              on:click={() => {
                const val = finalModifier
                const signed = val >= 0 ? `+${val}` : `${val}`
                roll(`1d20kh1${signed}`)
              }}
              aria-label="Saving throw roll"
            >
              {finalModifier >= 0 ? '+' : ''}{finalModifier}
            </button>
          {:else}
            <div class="w-11 h-9 flex items-center justify-center font-semibold" style="border-radius: var(--border-radius-sm); font-size: var(--font-size-lg); color: var(--color-text-primary); background-color: var(--color-bg-content); border-width: 1px; border: 1px solid var(--color-accent)">
              {finalModifier >= 0 ? '+' : ''}{finalModifier}
            </div>
          {/if}
          {#if $editingMode}
            <input type="checkbox" checked={isProficient} on:change={() => toggleSavingThrow(key as AbilityKey)} aria-label="Toggle proficiency" />
          {:else}
            <div class="w-4 h-4 border-2 rounded-full" style="border-color: var(--color-text-primary); border-radius: var(--border-radius-full); border-width: 2px; background-color: {isProficient ? 'var(--color-text-primary)' : 'var(--color-bg-content)'}"></div>
          {/if}
        </div>
      {/each}
    </div>
  {/if}
</div>
<div class="p-4 flex-1 pb-12 overflow-y-auto flex flex-col items-center justify-center text-center" style="background-color: var(--color-bg-content)">
  <div class="flex flex-col items-center mb-3 w-full">
    <h2 class="text-sm font-bold m-0" style="font-size: var(--font-size-lg); color: var(--color-text-primary)">SENSES</h2>
  </div>
  {#if $character}
    <div class="flex flex-col items-center w-full max-w-xs mx-auto">
      <div class="flex flex-col gap-4 items-center">
        <div class="flex flex-row items-center justify-center gap-3">
          <div class="w-14 h-8 border rounded-sm flex items-center justify-center font-semibold" style="border-color: var(--color-accent); border-radius: var(--border-radius-sm); font-size: var(--font-size-lg); color: var(--color-text-primary); background-color: var(--color-bg-content); border-width: 1px">
            {#if $editingMode}
              <input type="number" min="0" max="30" value={$character.passivePerception} on:input={(e) => updateSense('passivePerception', +e.currentTarget.value)} class="w-12 text-center bg-transparent border-none outline-none" style="font-weight:600; font-size:14px; color:var(--color-text-primary)" />
            {:else}
              {$character.passivePerception}
            {/if}
          </div>
          <span class="text-xs font-semibold" style="font-size: var(--font-size-md); color: var(--color-text-primary)">PASSIVE PERCEPTION</span>
        </div>
        <div class="flex flex-row items-center justify-center gap-3">
          <div class="w-14 h-8 border rounded-sm flex items-center justify-center font-semibold" style="border-color: var(--color-accent); border-radius: var(--border-radius-sm); font-size: var(--font-size-lg); color: var(--color-text-primary); background-color: var(--color-bg-content); border-width: 1px">
            {#if $editingMode}
              <input type="number" min="0" max="30" value={$character.passiveInvestigation} on:input={(e) => updateSense('passiveInvestigation', +e.currentTarget.value)} class="w-12 text-center bg-transparent border-none outline-none" style="font-weight:600; font-size:14px; color:var(--color-text-primary)" />
            {:else}
              {$character.passiveInvestigation}
            {/if}
          </div>
          <span class="text-xs font-semibold" style="font-size: var(--font-size-md); color: var(--color-text-primary)">PASSIVE INVESTIGATION</span>
        </div>
        <div class="flex flex-row items-center justify-center gap-3">
          <div class="w-14 h-8 border rounded-sm flex items-center justify-center font-semibold" style="border-color: var(--color-accent); border-radius: var(--border-radius-sm); font-size: var(--font-size-lg); color: var(--color-text-primary); background-color: var(--color-bg-content); border-width: 1px">
            {#if $editingMode}
              <input type="number" min="0" max="30" value={$character.passiveInsight} on:input={(e) => updateSense('passiveInsight', +e.currentTarget.value)} class="w-12 text-center bg-transparent border-none outline-none" style="font-weight:600; font-size:14px; color:var(--color-text-primary)" />
            {:else}
              {$character.passiveInsight}
            {/if}
          </div>
          <span class="text-xs font-semibold" style="font-size: var(--font-size-md); color: var(--color-text-primary)">PASSIVE INSIGHT</span>
        </div>
      </div>
    </div>
  {/if}
</div>
