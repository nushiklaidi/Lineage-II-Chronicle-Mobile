import { Town, CharacterClass, Item, Skill, Quest, RaceType } from '../models/game.models';

export const RACE_INFO: Record<RaceType, { name: string; icon: string; bg: string; bonus: string; stats: { str: number; dex: number; con: number; int: number; wit: number; men: number } }> = {
  human: {
    name: 'Human',
    icon: 'person',
    bg: 'from-amber-700 to-amber-900',
    bonus: 'Balanced stats with high HP & Versatility',
    stats: { str: 40, dex: 30, con: 43, int: 21, wit: 11, men: 25 }
  },
  elf: {
    name: 'Elf',
    icon: 'auto_awesome',
    bg: 'from-emerald-700 to-teal-900',
    bonus: '+Movement, High Evasion, Fastest Casting Speed',
    stats: { str: 36, dex: 35, con: 36, int: 23, wit: 14, men: 26 }
  },
  dark_elf: {
    name: 'Dark Elf',
    icon: 'nightlight_round',
    bg: 'from-purple-800 to-slate-950',
    bonus: 'Highest Physical & Magical Damage, High Crit',
    stats: { str: 41, dex: 32, con: 32, int: 25, wit: 12, men: 26 }
  },
  orc: {
    name: 'Orc',
    icon: 'fitness_center',
    bg: 'from-red-800 to-stone-900',
    bonus: 'Extreme Health, Mass Physical Strength & Frenzy',
    stats: { str: 40, dex: 23, con: 47, int: 18, wit: 12, men: 27 }
  },
  dwarf: {
    name: 'Dwarf',
    icon: 'handyman',
    bg: 'from-yellow-700 to-amber-950',
    bonus: 'Spoil Ability for double mob drops, Item Crafting',
    stats: { str: 39, dex: 29, con: 45, int: 15, wit: 11, men: 27 }
  }
};

export const CHARACTER_CLASSES: CharacterClass[] = [
  // Tier 0 - Starters
  { id: 'human_fighter', name: 'Human Fighter', race: 'human', category: 'fighter', tier: 0, requiredLevel: 1, description: 'Melee specialist skilled with swords and shields.', icon: 'shield' },
  { id: 'human_mystic', name: 'Human Mystic', race: 'human', category: 'mage', tier: 0, requiredLevel: 1, description: 'Practitioner of elemental spellcasting and holy magic.', icon: 'auto_stories' },
  { id: 'elven_fighter', name: 'Elven Fighter', race: 'elf', category: 'fighter', tier: 0, requiredLevel: 1, description: 'Agile warrior with high evasion and quick strikes.', icon: 'bolt' },
  { id: 'elven_mystic', name: 'Elven Mystic', race: 'elf', category: 'mage', tier: 0, requiredLevel: 1, description: 'Fastest magic caster channeling light and water magic.', icon: 'water_drop' },
  { id: 'dark_fighter', name: 'Dark Fighter', race: 'dark_elf', category: 'fighter', tier: 0, requiredLevel: 1, description: 'Deadly assassin utilizing dark blades and critical strikes.', icon: 'potted_plant' },
  { id: 'dark_mystic', name: 'Dark Mystic', race: 'dark_elf', category: 'mage', tier: 0, requiredLevel: 1, description: 'Master of dark magic and overwhelming elemental destruction.', icon: 'dark_mode' },
  { id: 'orc_fighter', name: 'Orc Fighter', race: 'orc', category: 'fighter', tier: 0, requiredLevel: 1, description: 'Brutal brawler with massive HP and raw physical force.', icon: 'sports_martial_arts' },
  { id: 'dwarven_fighter', name: 'Dwarven Fighter', race: 'dwarf', category: 'fighter', tier: 0, requiredLevel: 1, description: 'Sturdy craftsman adept at spoiling monsters for rare loot.', icon: 'construction' },

  // Tier 1 - 1st Class Transfer (Lvl 20)
  { id: 'warrior', name: 'Warrior', race: 'human', category: 'fighter', tier: 1, requiredLevel: 20, description: 'Master of two-handed weapons and heavy offense.', icon: 'swords' },
  { id: 'knight', name: 'Knight', race: 'human', category: 'fighter', tier: 1, requiredLevel: 20, description: 'Impenetrable defender using heavy armor and shield taunts.', icon: 'shield' },
  { id: 'wizard', name: 'Wizard', race: 'human', category: 'mage', tier: 1, requiredLevel: 20, description: 'Destructive elemental mage harnessing fire and earth.', icon: 'local_fire_department' },
  { id: 'elven_knight', name: 'Elven Knight', race: 'elf', category: 'fighter', tier: 1, requiredLevel: 20, description: 'Swift tank blessed with holy defensive magic.', icon: 'verified_user' },
  { id: 'elven_scout', name: 'Elven Scout', race: 'elf', category: 'fighter', tier: 1, requiredLevel: 20, description: 'Deadly archer and dagger wielder with high movement speed.', icon: 'ads_click' },
  { id: 'palus_knight', name: 'Palus Knight', race: 'dark_elf', category: 'fighter', tier: 1, requiredLevel: 20, description: 'Dark knight draining enemy life while inflicting damage.', icon: 'gavel' },
  { id: 'assassin', name: 'Assassin', race: 'dark_elf', category: 'fighter', tier: 1, requiredLevel: 20, description: 'Lethal shadow blade specialist with massive critical hit chance.', icon: 'content_cut' },
  { id: 'orc_raider', name: 'Orc Raider', race: 'orc', category: 'fighter', tier: 1, requiredLevel: 20, description: 'Fearsome berserker wielding broad swords with Frenzy.', icon: 'whatshot' },
  { id: 'scavenger', name: 'Scavenger', race: 'dwarf', category: 'fighter', tier: 1, requiredLevel: 20, description: 'Master of Spoil, extracting extra items and blueprints.', icon: 'paid' },

  // Tier 2 - 2nd Class Transfer (Lvl 40)
  { id: 'paladin', name: 'Paladin', race: 'human', category: 'fighter', tier: 2, requiredLevel: 40, description: 'Holy guardian with impenetrable defense and undead bane skills.', icon: 'workspace_premium' },
  { id: 'treasure_hunter', name: 'Treasure Hunter', race: 'human', category: 'fighter', tier: 2, requiredLevel: 40, description: 'Premier dagger rogue executing lethal Backstabs.', icon: 'visibility' },
  { id: 'sorcerer', name: 'Sorcerer', race: 'human', category: 'mage', tier: 2, requiredLevel: 40, description: 'Archmage unleashing devastating Prominence firestorms.', icon: 'wb_sunny' },
  { id: 'temple_knight', name: 'Temple Knight', race: 'elf', category: 'fighter', tier: 2, requiredLevel: 40, description: 'Inviolable knight invoking Cubics to heal and protect.', icon: 'star' },
  { id: 'spellsinger', name: 'Spellsinger', race: 'elf', category: 'mage', tier: 2, requiredLevel: 40, description: 'Rapid water caster unleashing Ice Daggers and Hydro Blasts.', icon: 'ac_unit' },
  { id: 'abyss_walker', name: 'Abyss Walker', race: 'dark_elf', category: 'fighter', tier: 2, requiredLevel: 40, description: 'Shadow assassin delivering maximum lethal critical strikes.', icon: 'flare' },
  { id: 'spellhowler', name: 'Spellhowler', race: 'dark_elf', category: 'mage', tier: 2, requiredLevel: 40, description: 'Dark magician casting Hurricanes and Death Spikes for max damage.', icon: 'cyclone' },
  { id: 'destroyer', name: 'Destroyer', race: 'orc', category: 'fighter', tier: 2, requiredLevel: 40, description: 'Unstoppable titan activating Guts and Frenzy at low health.', icon: 'skull' },
  { id: 'bounty_hunter', name: 'Bounty Hunter', race: 'dwarf', category: 'fighter', tier: 2, requiredLevel: 40, description: 'Wealth master capable of spoiling rare A-grade weapons and armor.', icon: 'diamond' }
];

export const ALL_ITEMS: Item[] = [
  // --- WEAPONS ---
  // No-Grade
  { id: 'short_sword', name: 'Short Sword', icon: 'colorize', type: 'weapon', slot: 'weapon', grade: 'NG', pAtk: 18, mAtk: 12, price: 500, description: 'Basic iron short sword for apprentice fighters.' },
  { id: 'apprentice_staff', name: 'Apprentice Staff', icon: 'auto_fix_high', type: 'weapon', slot: 'weapon', grade: 'NG', pAtk: 12, mAtk: 22, price: 500, description: 'Simple wooden staff infused with minor magic.' },
  { id: 'hunting_bow', name: 'Hunting Bow', icon: 'explore', type: 'weapon', slot: 'weapon', grade: 'NG', pAtk: 24, mAtk: 10, price: 750, description: 'Flexible wooden bow favored by wilderness hunters.' },

  // D-Grade
  { id: 'sword_of_revolution', name: 'Sword of Revolution', icon: 'gavel', type: 'weapon', slot: 'weapon', grade: 'D', pAtk: 58, mAtk: 38, price: 15000, description: 'A sturdy D-grade blade crafted for revolutionary soldiers.' },
  { id: 'staff_of_life', name: 'Staff of Life', icon: 'spa', type: 'weapon', slot: 'weapon', grade: 'D', pAtk: 38, mAtk: 64, price: 15000, description: 'Enchanted staff that amplifies MP and magic output.' },
  { id: 'elven_bow', name: 'Elven Bow', icon: 'shortcut', type: 'weapon', slot: 'weapon', grade: 'D', pAtk: 82, mAtk: 35, price: 18000, description: 'Crafted from elven wood for precise long-range shots.' },

  // C-Grade
  { id: 'dual_katana', name: 'Dual Katana', icon: 'content_cut', type: 'weapon', slot: 'weapon', grade: 'C', pAtk: 124, mAtk: 78, price: 85000, atkSpd: 15, description: 'Twin curved blades swinging in rapid deadly succession.' },
  { id: 'demon_staff', name: 'Demon Staff', icon: 'local_fire_department', type: 'weapon', slot: 'weapon', grade: 'C', pAtk: 88, mAtk: 142, price: 90000, castSpd: 12, description: 'Imbued with demonic essence for immense spell damage.' },
  { id: 'bow_of_peril', name: 'Bow of Peril', icon: 'gps_fixed', type: 'weapon', slot: 'weapon', grade: 'C', pAtk: 178, mAtk: 72, price: 95000, critRate: 10, description: 'Feared longbow that deals high critical damage.' },

  // B-Grade
  { id: 'sword_of_damascus', name: 'Sword of Damascus', icon: 'shield_moon', type: 'weapon', slot: 'weapon', grade: 'B', pAtk: 215, mAtk: 120, price: 350000, description: 'Folded steel blade renowned across Aden for cutting power.' },
  { id: 'sword_of_miracles', name: 'Sword of Miracles', icon: 'auto_awesome', type: 'weapon', slot: 'weapon', grade: 'B', pAtk: 145, mAtk: 220, price: 380000, castSpd: 15, description: 'Legendary spellblade radiating divine radiance.' },

  // A-Grade
  { id: 'tallum_blade', name: 'Tallum Blade', icon: 'flash_on', type: 'weapon', slot: 'weapon', grade: 'A', pAtk: 285, mAtk: 155, price: 1200000, description: 'Noble A-Grade sword forged in ancient fires.' },
  { id: 'soul_bow', name: 'Soul Bow', icon: 'electric_bolt', type: 'weapon', slot: 'weapon', grade: 'A', pAtk: 360, mAtk: 150, price: 1350000, critRate: 18, description: 'Absorbs souls to deliver devastating ranged strikes.' },
  { id: 'dragon_slayer', name: 'Dragon Slayer', icon: 'nature_people', type: 'weapon', slot: 'weapon', grade: 'A', pAtk: 410, mAtk: 210, price: 2500000, description: 'Colossal A-Grade two-handed sword forged to slay Antharas.' },
  { id: 'angel_slayer', name: 'Angel Slayer', icon: 'military_tech', type: 'weapon', slot: 'weapon', grade: 'A', pAtk: 340, mAtk: 190, price: 2400000, critRate: 25, atkSpd: 20, description: 'Ultimate A-Grade dagger delivering lethal backstabs.' },

  // --- ARMOR SETS ---
  // No-Grade Armor
  { id: 'wooden_chest', name: 'Wooden Breastplate', icon: 'check_box_outline_blank', type: 'armor', slot: 'chest', grade: 'NG', pDef: 22, price: 400, setBonusName: 'Wooden Set', description: 'Simple padded chest armor.' },
  { id: 'wooden_gaiters', name: 'Wooden Gaiters', icon: 'texture', type: 'armor', slot: 'pants', grade: 'NG', pDef: 14, price: 300, setBonusName: 'Wooden Set', description: 'Basic wooden leg guards.' },
  { id: 'wooden_helmet', name: 'Leather Helmet', icon: 'headset', type: 'armor', slot: 'helmet', grade: 'NG', pDef: 10, price: 250, description: 'Light leather headgear.' },

  // D-Grade Armor (Mithril Heavy / Knowledge Robe)
  { id: 'mithril_breastplate', name: 'Mithril Breastplate', icon: 'security', type: 'armor', slot: 'chest', grade: 'D', pDef: 58, price: 8000, setBonusName: 'Mithril Heavy Set', setBonusDescription: 'Set Bonus: +15% Max HP & +8% P.Def', description: 'Refining mithril metal for solid physical armor.' },
  { id: 'mithril_gaiters', name: 'Mithril Gaiters', icon: 'view_agenda', type: 'armor', slot: 'pants', grade: 'D', pDef: 38, price: 6000, setBonusName: 'Mithril Heavy Set', description: 'Mithril reinforced leg plating.' },
  { id: 'knowledge_robe', name: 'Knowledge Tunic', icon: 'dry_cleaning', type: 'armor', slot: 'chest', grade: 'D', pDef: 32, mDef: 28, price: 9000, setBonusName: 'Knowledge Set', setBonusDescription: 'Set Bonus: +10% M.Atk & +5% MP Regen', description: 'Robe embroidered with runes of knowledge.' },

  // C-Grade Armor (Karmian Robe Set / Composite Heavy)
  { id: 'karmian_chest', name: 'Karmian Tunic', icon: 'strikethrough_s', type: 'armor', slot: 'chest', grade: 'C', pDef: 65, mDef: 50, price: 45000, setBonusName: 'Karmian Set', setBonusDescription: 'Set Bonus: +15% Casting Speed & +5% P.Def', description: 'Iconic C-grade wizard robe tailored for fast magic.' },
  { id: 'karmian_pants', name: 'Karmian Stockings', icon: 'grid_view', type: 'armor', slot: 'pants', grade: 'C', pDef: 42, mDef: 35, price: 30000, setBonusName: 'Karmian Set', description: 'Silken stockings enchanted with defensive chants.' },
  { id: 'composite_armor', name: 'Composite Armor', icon: 'verified', type: 'armor', slot: 'chest', grade: 'C', pDef: 110, price: 55000, setBonusName: 'Composite Heavy Set', setBonusDescription: 'Set Bonus: +8% P.Def & +200 Max HP', description: 'Layered metal plates absorbing heavy blows.' },

  // B-Grade Armor (Zubei Set)
  { id: 'zubei_breastplate', name: 'Zubei Breastplate', icon: 'brightness_7', type: 'armor', slot: 'chest', grade: 'B', pDef: 165, price: 180000, setBonusName: 'Zubei Set', setBonusDescription: 'Set Bonus: +12% P.Def & +300 Max HP', description: 'Heavy B-grade armor with polished zubei steel.' },
  { id: 'zubei_gaiters', name: 'Zubei Gaiters', icon: 'calendar_view_week', type: 'armor', slot: 'pants', grade: 'B', pDef: 115, price: 130000, setBonusName: 'Zubei Set', description: 'Zubei leg protection.' },

  // A-Grade Armor (Dark Crystal / Tallum / Imperial Crusader / Major Arcana)
  { id: 'dark_crystal_robe', name: 'Dark Crystal Robe', icon: 'all_inclusive', type: 'armor', slot: 'chest', grade: 'A', pDef: 145, mDef: 120, price: 650000, setBonusName: 'Dark Crystal Set', setBonusDescription: 'Set Bonus: +15% Casting Speed, +8% Movement Speed & +5% P.Def', description: 'The premier A-Grade robe set for spellcasters.' },
  { id: 'tallum_heavy_armor', name: 'Tallum Plate Armor', icon: 'shield_with_house', type: 'armor', slot: 'chest', grade: 'A', pDef: 240, price: 750000, setBonusName: 'Tallum Heavy Set', setBonusDescription: 'Set Bonus: +8% Attack Speed & +15% Poison/Bleed Resist', description: 'Indestructible A-Grade heavy plate.' },
  { id: 'imperial_crusader_armor', name: 'Imperial Crusader Breastplate', icon: 'shield_moon', type: 'armor', slot: 'chest', grade: 'A', pDef: 350, price: 1800000, setBonusName: 'Imperial Crusader Set', setBonusDescription: 'Set Bonus: +8% P.Atk, +15% P.Def, +500 Max HP & Stun Immunity', description: 'Peak A-Grade armor worn by Aden champions.' },
  { id: 'major_arcana_robe', name: 'Major Arcana Robe', icon: 'diamond', type: 'armor', slot: 'chest', grade: 'A', pDef: 220, mDef: 210, price: 1600000, setBonusName: 'Major Arcana Set', setBonusDescription: 'Set Bonus: +17% M.Atk, +15% Casting Speed & +300 Max MP', description: 'Supreme A-Grade robe housing primordial arcana energy.' },

  // Boots & Gloves
  { id: 'boots_of_speed', name: 'Boots of Speed', icon: 'do_not_step', type: 'armor', slot: 'boots', grade: 'C', pDef: 28, price: 15000, description: 'Increases movement & turn readiness.' },
  { id: 'gloves_of_haste', name: 'Gloves of Haste', icon: 'back_hand', type: 'armor', slot: 'gloves', grade: 'C', pDef: 25, price: 15000, atkSpd: 8, description: 'Enhances weapon swing & cast speed.' },

  // Jewelry
  { id: 'elven_necklace', name: 'Elven Necklace', icon: 'military_tech', type: 'jewelry', slot: 'necklace', grade: 'D', mDef: 24, price: 6000, description: 'Enchanted elven pendant boosting M.Def.' },
  { id: 'black_ore_ring', name: 'Black Ore Ring', icon: 'donut_large', type: 'jewelry', slot: 'ring', grade: 'C', mDef: 36, price: 18000, description: 'Dark ring repelling offensive magic.' },

  // --- CONSUMABLES & SHOTS ---
  { id: 'hp_potion', name: 'Healing Potion', icon: 'healing', type: 'consumable', grade: 'NG', price: 100, stackable: true, quantity: 1, description: 'Restores 250 HP instantly during turn combat.' },
  { id: 'mp_potion', name: 'Mana Potion', icon: 'local_drink', type: 'consumable', grade: 'NG', price: 200, stackable: true, quantity: 1, description: 'Restores 150 MP instantly during turn combat.' },
  { id: 'soulshot_d', name: 'Soulshot (D-Grade)', icon: 'bolt', type: 'consumable', grade: 'D', price: 15, stackable: true, quantity: 100, description: 'Doubles physical attack power for one hit with a blue flash!' },
  { id: 'soulshot_c', name: 'Soulshot (C-Grade)', icon: 'bolt', type: 'consumable', grade: 'C', price: 30, stackable: true, quantity: 100, description: 'Doubles physical attack power for C-Grade weapons.' },
  { id: 'soulshot_b', name: 'Soulshot (B-Grade)', icon: 'bolt', type: 'consumable', grade: 'B', price: 60, stackable: true, quantity: 100, description: 'Doubles physical attack power for B-Grade weapons.' },
  { id: 'soulshot_a', name: 'Soulshot (A-Grade)', icon: 'bolt', type: 'consumable', grade: 'A', price: 120, stackable: true, quantity: 100, description: 'Doubles physical attack power for A-Grade weapons.' },

  // --- ENCHANT SCROLLS ---
  { id: 'scroll_enchant_weapon_d', name: 'Scroll: Enchant Weapon (D)', icon: 'auto_fix_high', type: 'scroll', grade: 'D', price: 12000, description: 'Increases D-Grade Weapon P.Atk/M.Atk (+1 to +16). Safe up to +3.' },
  { id: 'scroll_enchant_weapon_c', name: 'Scroll: Enchant Weapon (C)', icon: 'auto_fix_high', type: 'scroll', grade: 'C', price: 45000, description: 'Increases C-Grade Weapon stats. Weapon glows at +4, +7, +10!' },
  { id: 'scroll_enchant_weapon_b', name: 'Scroll: Enchant Weapon (B)', icon: 'auto_fix_high', type: 'scroll', grade: 'B', price: 120000, description: 'Increases B-Grade Weapon stats.' },
  { id: 'scroll_enchant_weapon_a', name: 'Scroll: Enchant Weapon (A)', icon: 'auto_fix_high', type: 'scroll', grade: 'A', price: 350000, description: 'Increases A-Grade Weapon stats to mythical aura levels!' },
  { id: 'scroll_enchant_armor', name: 'Scroll: Enchant Armor', icon: 'verified_user', type: 'scroll', grade: 'D', price: 8000, description: 'Increases Armor P.Def/M.Def (+1 to +16).' }
];

export const ALL_SKILLS: Skill[] = [
  // Fighter Skills
  { id: 'power_strike', name: 'Power Strike', icon: 'gavel', mpCost: 15, type: 'active', target: 'single_enemy', powerMultiplier: 1.8, cooldownTurns: 0, description: 'Gathers strength to hit the target with 1.8x P.Atk.', requiredLevel: 1, spCost: 50 },
  { id: 'mortal_blow', name: 'Mortal Blow', icon: 'colorize', mpCost: 22, type: 'active', target: 'single_enemy', powerMultiplier: 2.4, cooldownTurns: 1, description: 'Lethal dagger attack aimed at vital points. 2.4x P.Atk with bonus crit rate.', requiredLevel: 10, spCost: 150 },
  { id: 'stun_shot', name: 'Stun Shot', icon: 'gps_fixed', mpCost: 28, type: 'active', target: 'single_enemy', powerMultiplier: 2.0, cooldownTurns: 2, description: 'Fires a heavy arrow that deals damage and stuns enemy for 1 turn.', requiredLevel: 20, spCost: 300 },
  { id: 'ultimate_defense', name: 'Ultimate Defense', icon: 'shield', mpCost: 35, type: 'active', target: 'self', powerMultiplier: 1.0, cooldownTurns: 3, description: 'Dramatically raises P.Def and M.Def by +150% for 2 turns.', requiredLevel: 20, spCost: 400 },
  { id: 'frenzy', name: 'Frenzy', icon: 'whatshot', mpCost: 40, type: 'active', target: 'self', powerMultiplier: 1.0, cooldownTurns: 3, description: 'Unleashes Orc bloodlust: +100% P.Atk for 3 turns when HP is below 60%.', requiredLevel: 40, spCost: 800 },
  { id: 'spoil', name: 'Spoil', icon: 'paid', mpCost: 18, type: 'active', target: 'single_enemy', powerMultiplier: 1.2, cooldownTurns: 1, description: 'Dwarven skill: Imbues monster with Spoil condition for 100% bonus loot upon defeat!', requiredLevel: 10, spCost: 200 },

  // Mage Skills
  { id: 'wind_strike', name: 'Wind Strike', icon: 'air', mpCost: 12, type: 'active', target: 'single_enemy', powerMultiplier: 1.6, cooldownTurns: 0, description: 'Channels wind blades dealing 1.6x M.Atk magic damage.', requiredLevel: 1, spCost: 50 },
  { id: 'hydro_blast', name: 'Hydro Blast', icon: 'water_drop', mpCost: 25, type: 'active', target: 'single_enemy', powerMultiplier: 2.3, cooldownTurns: 1, description: 'Spouts a high-pressure water column dealing 2.3x M.Atk.', requiredLevel: 20, spCost: 300 },
  { id: 'hurricane', name: 'Hurricane', icon: 'cyclone', mpCost: 35, type: 'active', target: 'single_enemy', powerMultiplier: 2.9, cooldownTurns: 1, description: 'Summons a raging dark storm dealing 2.9x M.Atk.', requiredLevel: 40, spCost: 750 },
  { id: 'drain_health', name: 'Drain Health', icon: 'local_hospital', mpCost: 30, type: 'active', target: 'single_enemy', powerMultiplier: 2.0, cooldownTurns: 2, description: 'Absorbs enemy life essence: deals magic damage and restores 50% damage as HP.', requiredLevel: 15, spCost: 250 },
  { id: 'battle_heal', name: 'Battle Heal', icon: 'healing', mpCost: 30, type: 'active', target: 'heal', powerMultiplier: 2.5, cooldownTurns: 1, description: 'Quick holy spell restoring 40% Max HP instantly.', requiredLevel: 10, spCost: 200 },

  // Passives
  { id: 'weapon_mastery', name: 'Weapon Mastery', icon: 'fitness_center', mpCost: 0, type: 'passive', target: 'self', powerMultiplier: 1.0, cooldownTurns: 0, description: 'Increases P.Atk and M.Atk by +10%.', requiredLevel: 5, spCost: 100 },
  { id: 'armor_mastery', name: 'Armor Mastery', icon: 'security', mpCost: 0, type: 'passive', target: 'self', powerMultiplier: 1.0, cooldownTurns: 0, description: 'Increases P.Def and Max HP by +12%.', requiredLevel: 5, spCost: 100 }
];

export const TOWNS: Town[] = [
  {
    id: 'talking_island',
    name: 'Talking Island Village',
    region: 'Starting Kingdom',
    description: 'The peaceful starter village where young human, elf, and dark elf adventurers learn the basics of combat.',
    bgGradient: 'from-blue-900 via-indigo-950 to-slate-900',
    accentColor: 'border-blue-500/50 text-blue-400',
    availableServices: ['shop', 'blacksmith', 'guild'],
    huntingSpots: [
      {
        id: 'gremlin_meadows',
        name: 'Gremlin Meadows',
        townId: 'talking_island',
        recommendedLevel: 'Lvl 1 - 10',
        minLevel: 1,
        description: 'Grassy plains outside village swarming with mischievous Gremlins and Keltirs.',
        backgroundImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1000&auto=format&fit=crop',
        mobs: [
          {
            id: 'gremlin',
            name: 'Gremlin',
            level: 2,
            avatarUrl: '👹',
            hp: 60,
            maxHp: 60,
            pAtk: 12,
            mAtk: 5,
            pDef: 15,
            mDef: 10,
            expReward: 25,
            spReward: 8,
            adenaMin: 15,
            adenaMax: 35,
            possibleDrops: [
              { item: ALL_ITEMS.find(i => i.id === 'hp_potion')!, chance: 0.4 },
              { item: ALL_ITEMS.find(i => i.id === 'short_sword')!, chance: 0.05 }
            ]
          },
          {
            id: 'keltir',
            name: 'Elder Keltir',
            level: 5,
            avatarUrl: '🐺',
            hp: 120,
            maxHp: 120,
            pAtk: 22,
            mAtk: 10,
            pDef: 25,
            mDef: 18,
            expReward: 65,
            spReward: 20,
            adenaMin: 40,
            adenaMax: 90,
            possibleDrops: [
              { item: ALL_ITEMS.find(i => i.id === 'wooden_chest')!, chance: 0.1 },
              { item: ALL_ITEMS.find(i => i.id === 'hp_potion')!, chance: 0.5 }
            ]
          }
        ]
      },
      {
        id: 'elven_ruins',
        name: 'Elven Ruins Underground',
        townId: 'talking_island',
        recommendedLevel: 'Lvl 10 - 20',
        minLevel: 10,
        description: 'Ancient subterranean labyrinth inhabited by Skeleton Soldiers and Werewolves.',
        backgroundImage: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1000&auto=format&fit=crop',
        mobs: [
          {
            id: 'skeleton_infantry',
            name: 'Skeleton Infantry',
            level: 14,
            avatarUrl: '💀',
            hp: 280,
            maxHp: 280,
            pAtk: 48,
            mAtk: 20,
            pDef: 45,
            mDef: 35,
            expReward: 180,
            spReward: 60,
            adenaMin: 120,
            adenaMax: 250,
            possibleDrops: [
              { item: ALL_ITEMS.find(i => i.id === 'sword_of_revolution')!, chance: 0.03 },
              { item: ALL_ITEMS.find(i => i.id === 'soulshot_d')!, chance: 0.6 }
            ]
          },
          {
            id: 'werewolf_chieftain',
            name: 'Werewolf Chieftain',
            level: 18,
            avatarUrl: '🐺',
            hp: 420,
            maxHp: 420,
            pAtk: 68,
            mAtk: 30,
            pDef: 60,
            mDef: 48,
            expReward: 320,
            spReward: 110,
            adenaMin: 280,
            adenaMax: 550,
            possibleDrops: [
              { item: ALL_ITEMS.find(i => i.id === 'mithril_breastplate')!, chance: 0.05 },
              { item: ALL_ITEMS.find(i => i.id === 'scroll_enchant_weapon_d')!, chance: 0.08 }
            ]
          }
        ]
      }
    ]
  },

  {
    id: 'giran',
    name: 'Giran Castle Town',
    region: 'Commercial Hub of Aden',
    description: 'The vast bustling commercial capital where traders gather to buy weapons, armor sets, and enchant scrolls.',
    bgGradient: 'from-amber-900 via-yellow-950 to-slate-900',
    accentColor: 'border-amber-500/50 text-amber-400',
    availableServices: ['shop', 'blacksmith', 'guild', 'arena'],
    huntingSpots: [
      {
        id: 'death_pass',
        name: 'Death Pass',
        townId: 'giran',
        recommendedLevel: 'Lvl 20 - 35',
        minLevel: 20,
        description: 'Perilous canyon infested with Wyrms, Cave Maidens, and Skeleton Archers.',
        backgroundImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1000&auto=format&fit=crop',
        mobs: [
          {
            id: 'skeleton_archer',
            name: 'Skeleton Sniper',
            level: 28,
            avatarUrl: '🏹',
            hp: 680,
            maxHp: 680,
            pAtk: 115,
            mAtk: 45,
            pDef: 95,
            mDef: 80,
            expReward: 680,
            spReward: 220,
            adenaMin: 600,
            adenaMax: 1200,
            possibleDrops: [
              { item: ALL_ITEMS.find(i => i.id === 'elven_bow')!, chance: 0.04 },
              { item: ALL_ITEMS.find(i => i.id === 'soulshot_c')!, chance: 0.5 }
            ]
          },
          {
            id: 'cave_maiden',
            name: 'Cave Maiden',
            level: 33,
            avatarUrl: '🧙‍♀️',
            hp: 950,
            maxHp: 950,
            pAtk: 140,
            mAtk: 110,
            pDef: 120,
            mDef: 130,
            expReward: 1050,
            spReward: 350,
            adenaMin: 1100,
            adenaMax: 2200,
            possibleDrops: [
              { item: ALL_ITEMS.find(i => i.id === 'karmian_chest')!, chance: 0.05 },
              { item: ALL_ITEMS.find(i => i.id === 'scroll_enchant_weapon_c')!, chance: 0.07 }
            ]
          }
        ]
      },
      {
        id: 'dragon_valley',
        name: 'Dragon Valley',
        townId: 'giran',
        recommendedLevel: 'Lvl 35 - 50',
        minLevel: 35,
        isSpecialZone: true,
        description: 'Legendary canyon carved by dragons. Home to Drake Lords, Malruk Knights, and Kariks.',
        backgroundImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1000&auto=format&fit=crop',
        mobs: [
          {
            id: 'malruk_knight',
            name: 'Malruk Knight',
            level: 42,
            avatarUrl: '🗡️',
            hp: 1600,
            maxHp: 1600,
            pAtk: 240,
            mAtk: 95,
            pDef: 220,
            mDef: 180,
            expReward: 2100,
            spReward: 700,
            adenaMin: 2500,
            adenaMax: 5000,
            possibleDrops: [
              { item: ALL_ITEMS.find(i => i.id === 'dual_katana')!, chance: 0.04 },
              { item: ALL_ITEMS.find(i => i.id === 'zubei_breastplate')!, chance: 0.03 }
            ]
          },
          {
            id: 'dragon_bearer',
            name: 'Dragon Bearer Karik',
            level: 48,
            avatarUrl: '🐲',
            hp: 2400,
            maxHp: 2400,
            pAtk: 320,
            mAtk: 160,
            pDef: 290,
            mDef: 240,
            expReward: 3800,
            spReward: 1200,
            adenaMin: 4500,
            adenaMax: 9000,
            possibleDrops: [
              { item: ALL_ITEMS.find(i => i.id === 'bow_of_peril')!, chance: 0.03 },
              { item: ALL_ITEMS.find(i => i.id === 'scroll_enchant_weapon_b')!, chance: 0.08 }
            ]
          }
        ]
      }
    ]
  },

  {
    id: 'oren',
    name: 'Oren Castle Town',
    region: 'Northern Frontier',
    description: 'Cold northern fortress city guarding against the magical Sea of Spores and Ivory Tower magic masters.',
    bgGradient: 'from-teal-900 via-cyan-950 to-slate-900',
    accentColor: 'border-cyan-500/50 text-cyan-400',
    availableServices: ['shop', 'blacksmith', 'guild'],
    huntingSpots: [
      {
        id: 'sea_of_spores',
        name: 'Sea of Spores',
        townId: 'oren',
        recommendedLevel: 'Lvl 40 - 55',
        minLevel: 40,
        description: 'Mystical toxic zone filled with gigante fungi, spider queens, and Orfen minions.',
        backgroundImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1000&auto=format&fit=crop',
        mobs: [
          {
            id: 'giant_fungus',
            name: 'Spore Zombie',
            level: 46,
            avatarUrl: '🧟',
            hp: 2100,
            maxHp: 2100,
            pAtk: 280,
            mAtk: 140,
            pDef: 260,
            mDef: 220,
            expReward: 3200,
            spReward: 1000,
            adenaMin: 3800,
            adenaMax: 7500,
            possibleDrops: [
              { item: ALL_ITEMS.find(i => i.id === 'sword_of_miracles')!, chance: 0.03 },
              { item: ALL_ITEMS.find(i => i.id === 'soulshot_b')!, chance: 0.6 }
            ]
          },
          {
            id: 'rot_tree',
            name: 'Rotting Tree Giant',
            level: 52,
            avatarUrl: '🌲',
            hp: 3100,
            maxHp: 3100,
            pAtk: 380,
            mAtk: 190,
            pDef: 340,
            mDef: 280,
            expReward: 5200,
            spReward: 1600,
            adenaMin: 6000,
            adenaMax: 12000,
            possibleDrops: [
              { item: ALL_ITEMS.find(i => i.id === 'dark_crystal_robe')!, chance: 0.03 },
              { item: ALL_ITEMS.find(i => i.id === 'scroll_enchant_weapon_a')!, chance: 0.06 }
            ]
          }
        ]
      }
    ]
  },

  {
    id: 'aden',
    name: 'Aden Castle Capital',
    region: 'Royal Seat of the Realm',
    description: 'The magnificent royal capital city of Elmoreden. High-level warriors gather here to raid Cruma Tower and Antharas.',
    bgGradient: 'from-amber-800 via-rose-950 to-slate-900',
    accentColor: 'border-amber-400/60 text-amber-300',
    availableServices: ['shop', 'blacksmith', 'guild', 'arena'],
    huntingSpots: [
      {
        id: 'cruma_tower',
        name: 'Cruma Tower (Floor 1 & 2)',
        townId: 'aden',
        recommendedLevel: 'Lvl 45 - 65',
        minLevel: 45,
        isSpecialZone: true,
        description: 'Titan relic tower containing automated mechanical golems, Porta, Core guardians, and ancient armor drops.',
        backgroundImage: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1000&auto=format&fit=crop',
        mobs: [
          {
            id: 'porta_golem',
            name: 'Titan Golem Porta',
            level: 50,
            avatarUrl: '🤖',
            hp: 3500,
            maxHp: 3500,
            pAtk: 410,
            mAtk: 180,
            pDef: 420,
            mDef: 310,
            expReward: 5800,
            spReward: 1800,
            adenaMin: 7000,
            adenaMax: 14000,
            possibleDrops: [
              { item: ALL_ITEMS.find(i => i.id === 'tallum_blade')!, chance: 0.03 },
              { item: ALL_ITEMS.find(i => i.id === 'tallum_heavy_armor')!, chance: 0.03 }
            ]
          },
          {
            id: 'excuro_beast',
            name: 'Cruma Excuro',
            level: 58,
            avatarUrl: '👾',
            hp: 4800,
            maxHp: 4800,
            pAtk: 520,
            mAtk: 240,
            pDef: 480,
            mDef: 390,
            expReward: 8500,
            spReward: 2600,
            adenaMin: 11000,
            adenaMax: 22000,
            possibleDrops: [
              { item: ALL_ITEMS.find(i => i.id === 'soul_bow')!, chance: 0.02 },
              { item: ALL_ITEMS.find(i => i.id === 'scroll_enchant_weapon_a')!, chance: 0.08 }
            ]
          }
        ]
      },
      {
        id: 'antharas_lair',
        name: "Antharas' Lair (A-Grade Raid)",
        townId: 'aden',
        recommendedLevel: 'Lvl 58 - 67',
        minLevel: 55,
        isSpecialZone: true,
        description: 'The burning subterranean lair of the Earth Dragon Antharas. Dropping legendary A-Grade weapons!',
        backgroundImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1000&auto=format&fit=crop',
        mobs: [
          {
            id: 'dragon_knight',
            name: 'Antharas Dragon Knight',
            level: 64,
            avatarUrl: '🐲',
            hp: 8500,
            maxHp: 8500,
            pAtk: 880,
            mAtk: 450,
            pDef: 750,
            mDef: 650,
            expReward: 18000,
            spReward: 5500,
            adenaMin: 25000,
            adenaMax: 50000,
            possibleDrops: [
              { item: ALL_ITEMS.find(i => i.id === 'dragon_slayer')!, chance: 0.02 },
              { item: ALL_ITEMS.find(i => i.id === 'imperial_crusader_armor')!, chance: 0.02 },
              { item: ALL_ITEMS.find(i => i.id === 'scroll_enchant_weapon_a')!, chance: 0.1 }
            ]
          },
          {
            id: 'antharas_boss',
            name: 'Earth Dragon Antharas (Grand Raid)',
            level: 67,
            isBoss: true,
            avatarUrl: '🐉',
            hp: 35000,
            maxHp: 35000,
            pAtk: 1450,
            mAtk: 980,
            pDef: 1200,
            mDef: 1100,
            expReward: 120000,
            spReward: 35000,
            adenaMin: 250000,
            adenaMax: 600000,
            possibleDrops: [
              { item: ALL_ITEMS.find(i => i.id === 'dragon_slayer')!, chance: 0.25 },
              { item: ALL_ITEMS.find(i => i.id === 'angel_slayer')!, chance: 0.25 },
              { item: ALL_ITEMS.find(i => i.id === 'major_arcana_robe')!, chance: 0.25 },
              { item: ALL_ITEMS.find(i => i.id === 'scroll_enchant_weapon_a')!, chance: 0.8 }
            ]
          }
        ]
      }
    ]
  }
];

export const INITIAL_QUESTS: Quest[] = [
  {
    id: 'quest_talking_island',
    title: 'Cleanse the Gremlin Meadows',
    townId: 'talking_island',
    requiredLevel: 1,
    targetMobName: 'Gremlin',
    targetAmount: 5,
    currentAmount: 0,
    completed: false,
    claimed: false,
    rewardAdena: 2000,
    rewardExp: 350,
    rewardItem: ALL_ITEMS.find(i => i.id === 'sword_of_revolution'),
    description: 'Defeat 5 Gremlins outside Talking Island Village to receive a D-grade weapon!'
  },
  {
    id: 'quest_cruma_tower',
    title: 'Investigation of Cruma Tower',
    townId: 'aden',
    requiredLevel: 45,
    targetMobName: 'Titan Golem Porta',
    targetAmount: 3,
    currentAmount: 0,
    completed: false,
    claimed: false,
    rewardAdena: 50000,
    rewardExp: 25000,
    rewardItem: ALL_ITEMS.find(i => i.id === 'scroll_enchant_weapon_a'),
    description: 'Destroy 3 Titan Golem Portas inside Cruma Tower to earn an A-Grade Enchant Scroll!'
  },
  {
    id: 'quest_dragon_valley',
    title: 'Slay the Dragon Bearers',
    townId: 'giran',
    requiredLevel: 35,
    targetMobName: 'Dragon Bearer Karik',
    targetAmount: 4,
    currentAmount: 0,
    completed: false,
    claimed: false,
    rewardAdena: 35000,
    rewardExp: 15000,
    rewardItem: ALL_ITEMS.find(i => i.id === 'bow_of_peril'),
    description: 'Halt the Karik invasion in Dragon Valley to win a Bow of Peril.'
  }
];
