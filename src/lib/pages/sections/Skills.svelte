<script lang="ts">
  import { character, skillsMeta, abilityAbbr, getAbilityModifier, getSkillBonus } from '../../CharacterStore'
  import { roll, DICE_PLUS } from '../../integration/DicePlus'
  import type { SkillKey } from '../../CharacterStore'

  function toggleProficiency(key: SkillKey) {
    character.update((c) => {
      if (!c) return c
      return {
        ...c,
        skills: { ...c.skills, [key]: !c.skills[key] }
      }
    })
  }
</script>

<div class="p-4 flex-1 overflow-y-auto" style="background-color: var(--color-bg-content)">
  <div class="flex flex-col gap-3 max-w-2xl mx-auto w-full">
    <h2 class="text-sm font-bold text-center m-0" style="font-size: var(--font-size-lg); color: var(--color-text-primary)">SKILLS</h2>
    {#if $character}
      <div class="w-full">
        <div class="grid grid-cols-[42px_46px_1fr_70px] items-center px-2 text-[11px] font-semibold" style="color: var(--color-text-secondary)">
          <div class="uppercase">Prof</div>
          <div class="uppercase">Mod</div>
          <div class="uppercase">Skill</div>
          <div class="uppercase text-right pr-1">Bonus</div>
        </div>
        <div class="mt-1 rounded-md overflow-hidden" style="border: 1px solid var(--color-bg-darker-border)">
          {#each skillsMeta as s, i}
            {@const abilityScore = $character.abilities[s.ability]}
            {@const baseMod = getAbilityModifier(abilityScore)}
            {@const proficient = $character.skills[s.key]}
            {@const bonus = getSkillBonus($character, s.key)}
            <div class="grid grid-cols-[42px_46px_1fr_70px] items-center px-2" style="background-color: var(--color-bg-content); border-bottom: 1px solid var(--color-bg-darker-border)">
              <button aria-label="Toggle proficiency" class="w-4 h-4 rounded-full border-2 cursor-pointer ml-2" style="border-color: var(--color-text-primary); background-color: {proficient ? 'var(--color-text-primary)' : 'transparent'}" on:click={() => toggleProficiency(s.key)}></button>
              <div class="text-xs font-semibold text-center" style="color: var(--color-text-primary)">{abilityAbbr[s.ability]}</div>
              <div class="py-3 text-sm" style="color: var(--color-text-primary)">{s.name}</div>
              <div class="flex justify-end py-3 pr-1">
                {#if $DICE_PLUS}
                  <button
                    class="w-12 h-8 flex items-center justify-center font-semibold"
                    style="border-radius: var(--border-radius-sm); font-size: var(--font-size-lg); color: var(--color-text-primary); background-color: var(--color-bg-content); border: 1px solid var(--color-accent); background: transparent; cursor: pointer;"
                    on:click={() => {
                      const val = bonus
                      const signed = val >= 0 ? `+${val}` : `${val}`
                      roll(`1d20kh1${signed}`)
                    }}
                    aria-label="Skill roll"
                  >
                    {bonus >= 0 ? '+' : ''}{bonus}
                  </button>
                {:else}
                  <div class="w-12 h-8 flex items-center justify-center font-semibold" style="border-radius: var(--border-radius-sm); font-size: var(--font-size-lg); color: var(--color-text-primary); background-color: var(--color-bg-content); border: 1px solid var(--color-accent)">
                    {bonus >= 0 ? '+' : ''}{bonus}
                  </div>
                {/if}
               </div>
             </div>
           {/each}
         </div>
       </div>
     {/if}
   </div>
 </div>


