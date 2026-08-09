export type RaceType = 'human' | 'elf' | 'dark_elf' | 'orc' | 'dwarf';
export type ClassCategory = 'fighter' | 'mage';

export interface BaseStats {
  str: number; // Physical attack power
  dex: number; // Attack speed, evasion, crit rate
  con: number; // HP, CP, HP regen
  int: number; // Magic attack power
  wit: number; // Casting speed, magic crit
  men: number; // MP, M.Def, MP regen
}

export interface CharacterClass {
  id: string;
  name: string;
  race: RaceType;
  category: ClassCategory;
  tier: 0 | 1 | 2; // 0 = Starter, 1 = 1st Transfer (Lvl 20), 2 = 2nd Transfer (Lvl 40)
  requiredLevel: number;
  description: string;
  icon: string;
}

export type EquipmentSlot = 
  | 'weapon' 
  | 'shield' 
  | 'helmet' 
  | 'chest' 
  | 'pants' 
  | 'gloves' 
  | 'boots' 
  | 'necklace' 
  | 'earring' 
  | 'ring';

export type ItemGrade = 'NG' | 'D' | 'C' | 'B' | 'A' | 'S';

export interface Item {
  id: string;
  name: string;
  icon: string;
  type: 'weapon' | 'armor' | 'jewelry' | 'consumable' | 'scroll' | 'material';
  slot?: EquipmentSlot;
  grade: ItemGrade;
  pAtk?: number;
  mAtk?: number;
  pDef?: number;
  mDef?: number;
  critRate?: number;
  atkSpd?: number;
  castSpd?: number;
  maxHpBonus?: number;
  maxMpBonus?: number;
  setBonusName?: string;
  setBonusDescription?: string;
  price: number;
  enchantLevel?: number; // +0 to +16
  stackable?: boolean;
  quantity?: number;
  description: string;
}

export interface Skill {
  id: string;
  name: string;
  icon: string;
  mpCost: number;
  type: 'active' | 'passive';
  target: 'single_enemy' | 'all_enemies' | 'self' | 'heal';
  powerMultiplier: number; // e.g. 1.8x P.Atk or M.Atk
  cooldownTurns: number;
  currentCooldown?: number;
  description: string;
  requiredLevel: number;
  spCost: number;
  learned?: boolean;
}

export interface Character {
  name: string;
  race: RaceType;
  classId: string;
  className: string;
  level: number;
  exp: number;
  maxExp: number;
  sp: number; // Skill Points
  
  // Current combat resources
  hp: number;
  maxHp: number;
  mp: number;
  maxMp: number;
  cp: number; // Combat Points (shield)
  maxCp: number;

  // Attributes
  baseStats: BaseStats;
  
  // Customization
  faceIndex: number;
  hairIndex: number;
  hairColor: string;
  gender: 'male' | 'female';

  // Currency & Shots
  adena: number;
  soulshotsActive: boolean;
  soulshotGrade: ItemGrade;
  soulshotCount: number;

  // Quick potions count
  hpPotions: number;
  mpPotions: number;
}

export interface Mob {
  id: string;
  name: string;
  level: number;
  isBoss?: boolean;
  avatarUrl: string;
  hp: number;
  maxHp: number;
  pAtk: number;
  mAtk: number;
  pDef: number;
  mDef: number;
  expReward: number;
  spReward: number;
  adenaMin: number;
  adenaMax: number;
  possibleDrops: { item: Item; chance: number }[]; // chance 0-1
}

export interface HuntingSpot {
  id: string;
  name: string;
  townId: string;
  recommendedLevel: string;
  minLevel: number;
  description: string;
  backgroundImage: string;
  mobs: Mob[];
  isSpecialZone?: boolean; // e.g. Cruma Tower, Dragon Valley
}

export interface Town {
  id: string;
  name: string;
  region: string;
  description: string;
  bgGradient: string;
  accentColor: string;
  huntingSpots: HuntingSpot[];
  availableServices: ('shop' | 'blacksmith' | 'guild' | 'arena')[];
}

export interface Quest {
  id: string;
  title: string;
  townId: string;
  requiredLevel: number;
  targetMobName: string;
  targetAmount: number;
  currentAmount: number;
  completed: boolean;
  claimed: boolean;
  rewardAdena: number;
  rewardExp: number;
  rewardItem?: Item;
  description: string;
}

export interface CombatActionLog {
  id: string;
  actor: 'player' | 'mob';
  text: string;
  isCritical?: boolean;
  isSoulshot?: boolean;
  isHeal?: boolean;
  isMiss?: boolean;
  damage?: number;
}
