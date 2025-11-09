import { writable, derived } from 'svelte/store'

export interface CharacterData {
  name: string
  race: string
  class: string
  level: number
  portrait?: string
  alignment?: string
  size?: 'Tiny' | 'Small' | 'Medium' | 'Large' | 'Huge' | 'Gargantuan'
  
  // Health & Experience
  currentHP: number
  maxHP: number
  currentXP: number
  xpToNextLevel: number
  inspiration: boolean
  
  // Core Stats
  proficiencyBonus: number
  walkingSpeed: number
  initiative: number
  armorClass: number
  
  // Ability Scores
  abilities: {
    strength: number
    dexterity: number
    constitution: number
    wisdom: number
    intelligence: number
    charisma: number
  }
  
  // Saving Throws (proficiency)
  savingThrows: {
    strength: boolean
    dexterity: boolean
    constitution: boolean
    intelligence: boolean
    wisdom: boolean
    charisma: boolean
  }
  
  // Senses
  passivePerception: number
  passiveInvestigation: number
  passiveInsight: number

  // Skill Proficiencies (5e)
  skills: Record<SkillKey, boolean>

  // Class info (future-proof)
  classInfo: {
    name: string
    subclass?: string
  }
}

function getAbilityModifier(score: number): number {
  return Math.floor((score - 10) / 2)
}

export const character = writable<CharacterData | null>(null)

// Derived store to check if character exists
export const hasCharacter = derived(
  character,
  $character => $character !== null
)

export { getAbilityModifier }

// NEW: global editing mode flag used by components to toggle editability
export const editingMode = writable(false)

// Skills metadata for 5e
export type AbilityKey = keyof CharacterData['abilities']

export type SkillKey =
  | 'acrobatics'
  | 'animalHandling'
  | 'arcana'
  | 'athletics'
  | 'deception'
  | 'history'
  | 'insight'
  | 'intimidation'
  | 'investigation'
  | 'medicine'
  | 'nature'
  | 'perception'
  | 'performance'
  | 'persuasion'
  | 'religion'
  | 'sleightOfHand'
  | 'stealth'
  | 'survival'

export interface SkillMeta {
  key: SkillKey
  name: string
  ability: AbilityKey
}

export const skillsMeta: SkillMeta[] = [
  { key: 'acrobatics', name: 'Acrobatics', ability: 'dexterity' },
  { key: 'animalHandling', name: 'Animal Handling', ability: 'wisdom' },
  { key: 'arcana', name: 'Arcana', ability: 'intelligence' },
  { key: 'athletics', name: 'Athletics', ability: 'strength' },
  { key: 'deception', name: 'Deception', ability: 'charisma' },
  { key: 'history', name: 'History', ability: 'intelligence' },
  { key: 'insight', name: 'Insight', ability: 'wisdom' },
  { key: 'intimidation', name: 'Intimidation', ability: 'charisma' },
  { key: 'investigation', name: 'Investigation', ability: 'intelligence' },
  { key: 'medicine', name: 'Medicine', ability: 'wisdom' },
  { key: 'nature', name: 'Nature', ability: 'intelligence' },
  { key: 'perception', name: 'Perception', ability: 'wisdom' },
  { key: 'performance', name: 'Performance', ability: 'charisma' },
  { key: 'persuasion', name: 'Persuasion', ability: 'charisma' },
  { key: 'religion', name: 'Religion', ability: 'intelligence' },
  { key: 'sleightOfHand', name: 'Sleight of Hand', ability: 'dexterity' },
  { key: 'stealth', name: 'Stealth', ability: 'dexterity' },
  { key: 'survival', name: 'Survival', ability: 'wisdom' }
]

export const abilityAbbr: Record<AbilityKey, string> = {
  strength: 'STR',
  dexterity: 'DEX',
  constitution: 'CON',
  intelligence: 'INT',
  wisdom: 'WIS',
  charisma: 'CHA'
}

export function getSkillBonus(char: CharacterData, skillKey: SkillKey): number {
  const meta = skillsMeta.find(s => s.key === skillKey)!
  const abilityScore = char.abilities[meta.ability]
  const base = getAbilityModifier(abilityScore)
  const proficient = char.skills[skillKey]
  return base + (proficient ? char.proficiencyBonus : 0)
}

