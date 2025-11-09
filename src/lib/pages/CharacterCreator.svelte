<script lang="ts">
  import { character, skillsMeta, type SkillKey } from '../CharacterStore'
  import type { CharacterData } from '../CharacterStore'
  import PlayerManager from '../PlayerManager'

  const steps = [
    'Character Preferences',
    'Abilities',
    'Skills',
    'Review'
  ] as const

  let currentStep = 0

  const classSavingThrowDefaults: Record<string, (keyof CharacterData['savingThrows'])[]> = {
    Barbarian: ['strength', 'constitution'],
    Bard: ['dexterity', 'charisma'],
    Cleric: ['wisdom', 'charisma'],
    Druid: ['intelligence', 'wisdom'],
    Fighter: ['strength', 'constitution'],
    Monk: ['strength', 'dexterity'],
    Paladin: ['wisdom', 'charisma'],
    Ranger: ['strength', 'dexterity'],
    Rogue: ['dexterity', 'intelligence'],
    Sorcerer: ['constitution', 'charisma'],
    Warlock: ['wisdom', 'charisma'],
    Wizard: ['intelligence', 'wisdom']
  }

  let formData: CharacterData = {
    name: '',
    race: '',
    class: '',
    level: 1,
    alignment: 'True Neutral',
    size: 'Medium',
    currentHP: 0,
    maxHP: 0,
    currentXP: 0,
    xpToNextLevel: 300,
    inspiration: false,
    proficiencyBonus: 2,
    walkingSpeed: 30,
    initiative: 0,
    armorClass: 10,
    abilities: {
      strength: 10,
      dexterity: 10,
      constitution: 10,
      intelligence: 10,
      wisdom: 10,
      charisma: 10
    },
    savingThrows: {
      strength: false,
      dexterity: false,
      constitution: false,
      intelligence: false,
      wisdom: false,
      charisma: false
    },
    passivePerception: 10,
    passiveInvestigation: 10,
    passiveInsight: 10,
    skills: Object.fromEntries(skillsMeta.map(s => [s.key, false])) as Record<SkillKey, boolean>,
    classInfo: { name: '' }
  }

  function next() { if (currentStep < steps.length - 1) currentStep += 1 }
  function prev() { if (currentStep > 0) currentStep -= 1 }

  function selectClass(name: string) {
    formData.class = name
    formData.classInfo = { ...(formData.classInfo || {}), name }
    // set default saving throw profs based on class
    const defaults = classSavingThrowDefaults[name]
    if (defaults) {
      for (const key of Object.keys(formData.savingThrows!)) {
        formData.savingThrows![key as keyof CharacterData['savingThrows']] = false
      }
      for (const k of defaults) {
        formData.savingThrows![k] = true
      }
    }
  }

  function toggleSkill(key: SkillKey) {
    formData.skills![key] = !formData.skills![key]
  }

  function addArrayItem(arr: string[], value: string) {
    const v = value.trim()
    if (v && !arr.includes(v)) arr.push(v)
  }

  async function handleSubmit() {
    if (formData.name && formData.race && formData.class) {
      if (!formData.currentHP && formData.maxHP) {
        formData.currentHP = formData.maxHP
      }
      character.set(formData)
      await PlayerManager.saveCharacter(formData)
    }
  }
</script>

<div class="p-4 flex-1 overflow-y-auto" style="background-color: var(--color-bg-content)">
  <div class="mb-4 text-center">
    <h1 class="text-xl font-bold m-0 mb-1" style="font-size: var(--font-size-xl); color: var(--color-text-primary)">Create Character</h1>
  </div>

  <div class="grid grid-cols-5 gap-4 items-center">
    <div class="flex justify-center">
      <button
        type="button"
        onclick={prev}
        disabled={currentStep === 0}
        class="flex items-center justify-center w-8 h-8 border rounded-sm text-xs font-semibold transition-all duration-200"
        style="border-color: var(--color-accent); color: var(--color-accent); opacity: {currentStep === 0 ? 0.5 : 1};"
      >
        ←
      </button>
    </div>
    <!-- Steps Container -->
    <form
      onsubmit={(e) => e.preventDefault()}
      class="max-w-[720px] mx-auto col-span-3"
    >
      {#if currentStep === 0}
        <!-- Info -->
        <div class="grid grid-cols-2 gap-3">
        <div>
            <label for="name" class="block text-xs font-semibold mb-1" style="font-size: var(--font-size-md); color: var(--color-text-primary)">Character Name *</label>
            <input id="name" class="w-full px-3 py-2 border rounded-sm text-xs font-inherit focus:outline-none focus:border-accent"
            style="border-color: var(--color-border-light); border-radius: var(--border-radius-sm); font-size: var(--font-size-md); background-color: var(--color-bg-darker); color: var(--color-text-primary); border-width: 1px"
              bind:value={formData.name} placeholder="Enter character name" required />
        </div>
        <div>
            <label for="race" class="block text-xs font-semibold mb-1" style="font-size: var(--font-size-md); color: var(--color-text-primary)">Race *</label>
            <input id="race" class="w-full px-3 py-2 border rounded-sm text-xs font-inherit focus:outline-none focus:border-accent"
            style="border-color: var(--color-border-light); border-radius: var(--border-radius-sm); font-size: var(--font-size-md); background-color: var(--color-bg-darker); color: var(--color-text-primary); border-width: 1px"
              bind:value={formData.race} placeholder="e.g., Human" required />
      </div>
        <div>
            <label for="alignment" class="block text-xs font-semibold mb-1" style="font-size: var(--font-size-md); color: var(--color-text-primary)">Alignment</label>
            <select id="alignment" class="w-full px-3 py-2 border rounded-sm text-xs font-inherit focus:outline-none focus:border-accent"
            style="border-color: var(--color-border-light); border-radius: var(--border-radius-sm); font-size: var(--font-size-md); background-color: var(--color-bg-darker); color: var(--color-text-primary); border-width: 1px"
              bind:value={formData.alignment}>
              <option>Lawful Good</option><option>Lawful Neutral</option><option>Lawful Evil</option>
              <option>Chaotic Evil</option><option>Chaotic Neutral</option><option>Chaotic Good</option>
              <option>True Neutral</option><option>Neutral Good</option><option>Neutral Evil</option>
            </select>
        </div>
        <div>
            <label for="level" class="block text-xs font-semibold mb-1" style="font-size: var(--font-size-md); color: var(--color-text-primary)">Level</label>
            <input id="level" type="number" min="1" max="20" class="w-full px-3 py-2 border rounded-sm text-xs font-inherit focus:outline-none focus:border-accent"
            style="border-color: var(--color-border-light); border-radius: var(--border-radius-sm); font-size: var(--font-size-md); background-color: var(--color-bg-darker); color: var(--color-text-primary); border-width: 1px"
              bind:value={formData.level} />
        </div>
        
          <div>
            <label for="class" class="block text-xs font-semibold mb-1" style="font-size: var(--font-size-md); color: var(--color-text-primary)">Class *</label>
            <select id="class" class="w-full px-3 py-2 border rounded-sm text-xs focus:outline-none focus:border-accent"
              style="border-color: var(--color-border-light); border-radius: var(--border-radius-sm); font-size: var(--font-size-md); background-color: var(--color-bg-darker); color: var(--color-text-primary); border-width: 1px"
              bind:value={formData.class} onchange={(e) => selectClass((e.target as HTMLSelectElement).value)}>
              <option value="">Select class</option>
              {#each Object.keys(classSavingThrowDefaults) as c}
                <option value={c}>{c}</option>
              {/each}
            </select>
          </div>
          <div>
            <label for="subclass" class="block text-xs font-semibold mb-1" style="font-size: var(--font-size-md); color: var(--color-text-primary)">Subclass (optional)</label>
            <input id="subclass" class="w-full px-3 py-2 border rounded-sm text-xs focus:outline-none focus:border-accent"
              style="border-color: var(--color-border-light); border-radius: var(--border-radius-sm); font-size: var(--font-size-md); background-color: var(--color-bg-darker); color: var(--color-text-primary); border-width: 1px"
              bind:value={formData.classInfo.subclass} />
          </div>
        <div>
            <label for="size" class="block text-xs font-semibold mb-1" style="font-size: var(--font-size-md); color: var(--color-text-primary)">Size</label>
            <select id="size" class="w-full px-3 py-2 border rounded-sm text-xs font-inherit focus:outline-none focus:border-accent"
            style="border-color: var(--color-border-light); border-radius: var(--border-radius-sm); font-size: var(--font-size-md); background-color: var(--color-bg-darker); color: var(--color-text-primary); border-width: 1px"
              bind:value={formData.size}>
              <option>Tiny</option><option>Small</option><option>Medium</option><option>Large</option><option>Huge</option><option>Gargantuan</option>
            </select>
          </div>
        </div>
      {/if}
  
      {#if currentStep === 1}
        <!-- Abilities & Combat Core -->
        <div class="grid grid-cols-3 gap-3 max-sm:grid-cols-2">
          <div class="flex flex-col gap-1">
            <label for="strength" class="text-[10px] text-center" style="font-size: var(--font-size-sm); color: var(--color-text-primary)">STR</label>
            <input id="strength" type="number" min="1" max="30" class="px-3 py-2 border rounded-sm text-xs text-center focus:outline-none focus:border-accent"
              style="border-color: var(--color-border-light); border-radius: var(--border-radius-sm); font-size: var(--font-size-md); background-color: var(--color-bg-darker); color: var(--color-text-primary); border-width: 1px"
              bind:value={formData.abilities.strength} />
          </div>
          <div class="flex flex-col gap-1">
            <label for="dexterity" class="text-[10px] text-center" style="font-size: var(--font-size-sm); color: var(--color-text-primary)">DEX</label>
            <input id="dexterity" type="number" min="1" max="30" class="px-3 py-2 border rounded-sm text-xs text-center focus:outline-none focus:border-accent"
              style="border-color: var(--color-border-light); border-radius: var(--border-radius-sm); font-size: var(--font-size-md); background-color: var(--color-bg-darker); color: var(--color-text-primary); border-width: 1px"
              bind:value={formData.abilities.dexterity} />
          </div>
          <div class="flex flex-col gap-1">
            <label for="constitution" class="text-[10px] text-center" style="font-size: var(--font-size-sm); color: var(--color-text-primary)">CON</label>
            <input id="constitution" type="number" min="1" max="30" class="px-3 py-2 border rounded-sm text-xs text-center focus:outline-none focus:border-accent"
              style="border-color: var(--color-border-light); border-radius: var(--border-radius-sm); font-size: var(--font-size-md); background-color: var(--color-bg-darker); color: var(--color-text-primary); border-width: 1px"
              bind:value={formData.abilities.constitution} />
          </div>
          <div class="flex flex-col gap-1">
            <label for="intelligence" class="text-[10px] text-center" style="font-size: var(--font-size-sm); color: var(--color-text-primary)">INT</label>
            <input id="intelligence" type="number" min="1" max="30" class="px-3 py-2 border rounded-sm text-xs text-center focus:outline-none focus:border-accent"
              style="border-color: var(--color-border-light); border-radius: var(--border-radius-sm); font-size: var(--font-size-md); background-color: var(--color-bg-darker); color: var(--color-text-primary); border-width: 1px"
              bind:value={formData.abilities.intelligence} />
          </div>
          <div class="flex flex-col gap-1">
            <label for="wisdom" class="text-[10px] text-center" style="font-size: var(--font-size-sm); color: var(--color-text-primary)">WIS</label>
            <input id="wisdom" type="number" min="1" max="30" class="px-3 py-2 border rounded-sm text-xs text-center focus:outline-none focus:border-accent"
              style="border-color: var(--color-border-light); border-radius: var(--border-radius-sm); font-size: var(--font-size-md); background-color: var(--color-bg-darker); color: var(--color-text-primary); border-width: 1px"
              bind:value={formData.abilities.wisdom} />
          </div>
          <div class="flex flex-col gap-1">
            <label for="charisma" class="text-[10px] text-center" style="font-size: var(--font-size-sm); color: var(--color-text-primary)">CHA</label>
            <input id="charisma" type="number" min="1" max="30" class="px-3 py-2 border rounded-sm text-xs text-center focus:outline-none focus:border-accent"
              style="border-color: var(--color-border-light); border-radius: var(--border-radius-sm); font-size: var(--font-size-md); background-color: var(--color-bg-darker); color: var(--color-text-primary); border-width: 1px"
              bind:value={formData.abilities.charisma} />
          </div>
        </div>
        <div class="grid grid-cols-3 gap-3 mt-4">
          <div>
            <label for="maxHP" class="block text-xs font-semibold mb-1" style="font-size: var(--font-size-md); color: var(--color-text-primary); color: var(--color-text-primary)">Max HP</label>
            <input id="maxHP" type="number" min="1" class="w-full px-3 py-2 border rounded-sm text-xs focus:outline-none focus:border-accent"
              style="border-color: var(--color-border-light); border-radius: var(--border-radius-sm); font-size: var(--font-size-md); background-color: var(--color-bg-darker); color: var(--color-text-primary); border-width: 1px"
              bind:value={formData.maxHP} />
          </div>
          <div>
            <label for="armorClass" class="block text-xs font-semibold mb-1" style="font-size: var(--font-size-md); color: var(--color-text-primary)">Armor Class</label>
            <input id="armorClass" type="number" min="0" class="w-full px-3 py-2 border rounded-sm text-xs focus:outline-none focus:border-accent"
              style="border-color: var(--color-border-light); border-radius: var(--border-radius-sm); font-size: var(--font-size-md); background-color: var(--color-bg-darker); color: var(--color-text-primary); border-width: 1px"
              bind:value={formData.armorClass} />
          </div>
          <div>
            <label for="walkingSpeed" class="block text-xs font-semibold mb-1" style="font-size: var(--font-size-md); color: var(--color-text-primary)">Walking Speed</label>
            <input id="walkingSpeed" type="number" min="0" class="w-full px-3 py-2 border rounded-sm text-xs focus:outline-none focus:border-accent"
              style="border-color: var(--color-border-light); border-radius: var(--border-radius-sm); font-size: var(--font-size-md); background-color: var(--color-bg-darker); color: var(--color-text-primary); border-width: 1px"
              bind:value={formData.walkingSpeed} />
          </div>
        </div>
        <div class="grid grid-cols-2 gap-3">
        </div>
        <div class="mt-4">
          <div class="text-xs font-semibold mb-2" style="font-size: var(--font-size-md); color: var(--color-text-primary)">Saving Throw Proficiencies</div>
          <div class="grid grid-cols-3 gap-y-2">
            <label class="flex items-center gap-2 text-xs" style="color: var(--color-text-primary)"><input type="checkbox" bind:checked={formData.savingThrows.strength} />Strength</label>
            <label class="flex items-center gap-2 text-xs" style="color: var(--color-text-primary)"><input type="checkbox" bind:checked={formData.savingThrows.dexterity} />Dexterity</label>
            <label class="flex items-center gap-2 text-xs" style="color: var(--color-text-primary)"><input type="checkbox" bind:checked={formData.savingThrows.constitution} />Constitution</label>
            <label class="flex items-center gap-2 text-xs" style="color: var(--color-text-primary)"><input type="checkbox" bind:checked={formData.savingThrows.intelligence} />Intelligence</label>
            <label class="flex items-center gap-2 text-xs" style="color: var(--color-text-primary)"><input type="checkbox" bind:checked={formData.savingThrows.wisdom} />Wisdom</label>
            <label class="flex items-center gap-2 text-xs" style="color: var(--color-text-primary)"><input type="checkbox" bind:checked={formData.savingThrows.charisma} />Charisma</label>
          </div>
        </div>
      {/if}
  
      {#if currentStep === 2}
        <!-- Skills Selection -->
        <div class="grid grid-cols-2 gap-y-2">
          {#each skillsMeta as s}
            <label class="flex items-center gap-2 text-xs" style="color: var(--color-text-primary)">
              <input type="checkbox" checked={formData.skills![s.key]} onchange={() => toggleSkill(s.key)} />
              {s.name}
            </label>
          {/each}
        </div>
      {/if}
  
      {#if currentStep === 3}
        <!-- Review -->
        <div class="text-xs" style="color: var(--color-text-primary)">
          <div class="grid grid-cols-2 gap-2">
            <div><strong>Name:</strong> {formData.name}</div>
            <div><strong>Race:</strong> {formData.race}</div>
            <div><strong>Class:</strong> {formData.class}</div>
            <div><strong>Level:</strong> {formData.level}</div>
            <div><strong>Alignment:</strong> {formData.alignment}</div>
            <div><strong>Skills:</strong> {Object.entries(formData.skills!).filter(([_,v]) => v).map(([k]) => k).join(', ')}</div>
          </div>
        </div>
      <div class="mt-4 flex justify-center">
          <button type="button" onclick={handleSubmit}
          class="bg-transparent border cursor-pointer whitespace-nowrap transition-all duration-200 hover:bg-accent-hover px-5 py-4 text-xs font-semibold rounded-sm" 
            style="border-color: var(--color-accent); color: var(--color-accent); border-width: 1px; font-size: var(--font-size-md); padding: var(--spacing-md) var(--spacing-xl)">
          Create Character
        </button>
        </div>
      {/if}
  

      </form>
      <div class="flex justify-center col-start-5">
        <button
          type="button"
          onclick={next}
          disabled={currentStep === steps.length - 1}
          class="flex items-center justify-center w-8 h-8 border rounded-sm text-xs font-semibold transition-all duration-200"
          style="border-color: var(--color-accent); color: var(--color-accent); opacity: {currentStep === steps.length - 1 ? 0.5 : 1};"
        >
          →
        </button>
      </div>
  </div>
  
</div>

