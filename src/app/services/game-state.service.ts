import { Injectable, signal, computed, inject } from '@angular/core';
import { Character, EquipmentSlot, Item, Mob, HuntingSpot, Quest, CombatActionLog, Skill, RaceType } from '../models/game.models';
import { ALL_ITEMS, ALL_SKILLS, INITIAL_QUESTS, RACE_INFO, TOWNS, CHARACTER_CLASSES } from '../data/game-data';
import { SoundService } from './sound.service';
import { AuthService, SavedCharacterFull } from './auth.service';

const SAVE_KEY = 'L2_CHRONICLE_SAVE_V1';

@Injectable({
  providedIn: 'root'
})
export class GameStateService {
  private soundService = inject(SoundService);
  private authService = inject(AuthService);

  // --- SIGNALS ---
  readonly activeTab = signal<'hero' | 'world' | 'battle' | 'inventory' | 'shop' | 'quests'>('world');
  readonly character = signal<Character | null>(null);
  readonly activeCharId = signal<string | null>(null);
  readonly equipped = signal<Record<EquipmentSlot, Item | null>>({
    weapon: null,
    shield: null,
    helmet: null,
    chest: null,
    pants: null,
    gloves: null,
    boots: null,
    necklace: null,
    earring: null,
    ring: null
  });
  readonly inventory = signal<Item[]>([]);
  readonly currentTownId = signal<string>('talking_island');
  readonly selectedSpot = signal<HuntingSpot | null>(null);

  // Combat State
  readonly activeMob = signal<Mob | null>(null);
  readonly mobCurrentHp = signal<number>(0);
  readonly isPlayerTurn = signal<boolean>(true);
  readonly combatLog = signal<CombatActionLog[]>([]);
  readonly autoBattle = signal<boolean>(false);
  readonly quests = signal<Quest[]>([]);
  readonly learnedSkills = signal<Skill[]>([]);

  // Derived Computed Stats
  readonly currentTown = computed(() => TOWNS.find(t => t.id === this.currentTownId()) || TOWNS[0]);

  readonly computedStats = computed(() => {
    const char = this.character();
    if (!char) return { pAtk: 10, mAtk: 10, pDef: 10, mDef: 10, maxHp: 100, maxMp: 50, maxCp: 150, critRate: 10, atkSpd: 100, castSpd: 100 };

    const eq = this.equipped();
    let weaponPAtk = 0;
    let weaponMAtk = 0;
    let totalPDef = 0;
    let totalMDef = 0;
    let bonusCrit = 0;
    let bonusAtkSpd = 0;
    let bonusCastSpd = 0;
    let bonusHp = 0;
    let bonusMp = 0;

    // Sum paperdoll equipment
    Object.values(eq).forEach(item => {
      if (!item) return;
      const enchant = item.enchantLevel || 0;
      if (item.pAtk) weaponPAtk += item.pAtk + (enchant * 4);
      if (item.mAtk) weaponMAtk += item.mAtk + (enchant * 3);
      if (item.pDef) totalPDef += item.pDef + (enchant * 2);
      if (item.mDef) totalMDef += item.mDef + (enchant * 2);
      if (item.critRate) bonusCrit += item.critRate;
      if (item.atkSpd) bonusAtkSpd += item.atkSpd;
      if (item.castSpd) bonusCastSpd += item.castSpd;
      if (item.maxHpBonus) bonusHp += item.maxHpBonus;
      if (item.maxMpBonus) bonusMp += item.maxMpBonus;
    });

    // Check Set Bonuses
    if (eq.chest?.setBonusName && eq.chest.setBonusName === eq.pants?.setBonusName) {
      if (eq.chest.setBonusName === 'Karmian Set') bonusCastSpd += 15;
      if (eq.chest.setBonusName === 'Dark Crystal Set') { bonusCastSpd += 15; totalPDef += 15; }
      if (eq.chest.setBonusName === 'Mithril Heavy Set') bonusHp += 150;
      if (eq.chest.setBonusName === 'Tallum Heavy Set') bonusAtkSpd += 12;
      if (eq.chest.setBonusName === 'Imperial Crusader Set') { bonusHp += 400; totalPDef += 35; }
    }

    const raceData = RACE_INFO[char.race];
    const levelMult = 1 + (char.level - 1) * 0.08;

    const finalPAtk = Math.round(((raceData.stats.str * 1.5) + weaponPAtk + 10) * levelMult);
    const finalMAtk = Math.round(((raceData.stats.int * 1.8) + weaponMAtk + 10) * levelMult);
    const finalPDef = Math.round(((raceData.stats.con * 0.8) + totalPDef + 20) * levelMult);
    const finalMDef = Math.round(((raceData.stats.men * 0.8) + totalMDef + 15) * levelMult);

    const calculatedMaxHp = Math.round((raceData.stats.con * 22 + char.level * 35 + bonusHp));
    const calculatedMaxMp = Math.round((raceData.stats.men * 12 + char.level * 20 + bonusMp));
    const calculatedMaxCp = Math.round(calculatedMaxHp * 1.5);

    return {
      pAtk: finalPAtk,
      mAtk: finalMAtk,
      pDef: finalPDef,
      mDef: finalMDef,
      maxHp: calculatedMaxHp,
      maxMp: calculatedMaxMp,
      maxCp: calculatedMaxCp,
      critRate: 10 + bonusCrit + Math.round(raceData.stats.dex * 0.5),
      atkSpd: 100 + bonusAtkSpd + Math.round(raceData.stats.dex * 0.8),
      castSpd: 100 + bonusCastSpd + Math.round(raceData.stats.wit * 1.2)
    };
  });

  constructor() {
    this.loadGame();
  }

  // --- INITIALIZATION & SAVE/LOAD ---
  createCharacter(name: string, race: RaceType, isMage: boolean, gender: 'male' | 'female', faceIdx: number, hairIdx: number, hairColor: string) {
    const raceData = RACE_INFO[race];
    const startingClass = CHARACTER_CLASSES.find(c => c.race === race && (isMage ? c.category === 'mage' : c.category === 'fighter') && c.tier === 0)!;

    const baseStats = { ...raceData.stats };
    const charId = 'char_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);

    const newChar: Character = {
      name: name.trim() || 'HeroOfAden',
      race,
      classId: startingClass.id,
      className: startingClass.name,
      level: 1,
      exp: 0,
      maxExp: 100,
      sp: 50,
      hp: 200,
      maxHp: 200,
      mp: 100,
      maxMp: 100,
      cp: 300,
      maxCp: 300,
      baseStats,
      faceIndex: faceIdx,
      hairIndex: hairIdx,
      hairColor,
      gender,
      adena: 5000,
      soulshotsActive: true,
      soulshotGrade: 'NG',
      soulshotCount: 200,
      hpPotions: 10,
      mpPotions: 5
    };

    // Starter Equipment
    const starterWeapon = isMage ? ALL_ITEMS.find(i => i.id === 'apprentice_staff')! : ALL_ITEMS.find(i => i.id === 'short_sword')!;
    const starterChest = ALL_ITEMS.find(i => i.id === 'wooden_chest')!;
    const starterPants = ALL_ITEMS.find(i => i.id === 'wooden_gaiters')!;

    this.activeCharId.set(charId);
    this.character.set(newChar);
    this.equipped.set({
      weapon: starterWeapon,
      shield: null,
      helmet: null,
      chest: starterChest,
      pants: starterPants,
      gloves: null,
      boots: null,
      necklace: null,
      earring: null,
      ring: null
    });

    // Starter Inventory
    this.inventory.set([
      { ...ALL_ITEMS.find(i => i.id === 'hp_potion')!, quantity: 15 },
      { ...ALL_ITEMS.find(i => i.id === 'mp_potion')!, quantity: 10 },
      { ...ALL_ITEMS.find(i => i.id === 'soulshot_d')!, quantity: 500 },
      { ...ALL_ITEMS.find(i => i.id === 'scroll_enchant_weapon_d')!, quantity: 3 }
    ]);

    // Initial Skills
    const initialSkill = isMage ? ALL_SKILLS.find(s => s.id === 'wind_strike')! : ALL_SKILLS.find(s => s.id === 'power_strike')!;
    this.learnedSkills.set([{ ...initialSkill, learned: true }]);

    // Initial Quests
    this.quests.set(JSON.parse(JSON.stringify(INITIAL_QUESTS)));

    // Recalculate full HP/MP/CP
    const stats = this.computedStats();
    this.character.update(c => c ? { ...c, hp: stats.maxHp, maxHp: stats.maxHp, mp: stats.maxMp, maxMp: stats.maxMp, cp: stats.maxCp, maxCp: stats.maxCp } : null);

    this.saveGame();
    this.activeTab.set('world');
    this.authService.isCreatingNewChar.set(false);
  }

  loadCharacterFromSaved(savedChar: SavedCharacterFull) {
    if (savedChar.character && savedChar.character.level > 67) {
      savedChar.character.level = 67;
      savedChar.character.exp = savedChar.character.maxExp;
    }
    this.activeCharId.set(savedChar.id);
    this.character.set(savedChar.character);
    this.equipped.set(savedChar.equipped || {
      weapon: null, shield: null, helmet: null, chest: null, pants: null,
      gloves: null, boots: null, necklace: null, earring: null, ring: null
    });
    this.inventory.set(savedChar.inventory || []);
    this.currentTownId.set(savedChar.currentTownId || 'talking_island');
    this.quests.set(savedChar.quests || JSON.parse(JSON.stringify(INITIAL_QUESTS)));
    this.learnedSkills.set(savedChar.learnedSkills || []);
    this.activeTab.set('world');
    this.authService.isCreatingNewChar.set(false);
  }

  saveGame() {
    const char = this.character();
    if (!char) return;

    const charId = this.activeCharId() || 'char_default';

    const savedData: SavedCharacterFull = {
      id: charId,
      userId: this.authService.currentUser()?.uid || 'guest',
      character: char,
      equipped: this.equipped(),
      inventory: this.inventory(),
      currentTownId: this.currentTownId(),
      quests: this.quests(),
      learnedSkills: this.learnedSkills(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(SAVE_KEY, JSON.stringify(savedData));
    }

    // Sync to Firestore if user logged in
    if (this.authService.currentUser()) {
      this.authService.saveCharacterToFirestore(savedData);
    }
  }

  loadGame() {
    if (typeof localStorage === 'undefined') return;
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return;
    try {
      const data: SavedCharacterFull = JSON.parse(raw);
      if (data && data.character) {
        if (data.character.level > 67) {
          data.character.level = 67;
          data.character.exp = data.character.maxExp;
        }
        this.activeCharId.set(data.id || 'char_default');
        this.character.set(data.character);
        if (data.equipped) this.equipped.set(data.equipped);
        if (data.inventory) this.inventory.set(data.inventory);
        if (data.currentTownId) this.currentTownId.set(data.currentTownId);
        if (data.quests) this.quests.set(data.quests);
        if (data.learnedSkills) this.learnedSkills.set(data.learnedSkills);
      }
    } catch {
      console.warn('Failed to parse save game');
    }
  }

  resetProgress() {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(SAVE_KEY);
    }
    this.character.set(null);
    this.activeCharId.set(null);
    this.activeTab.set('hero');
  }

  // --- TOWN & SPOT TRAVEL ---
  travelToTown(townId: string) {
    this.currentTownId.set(townId);
    this.selectedSpot.set(null);
    this.saveGame();
  }

  selectHuntingSpot(spot: HuntingSpot) {
    this.selectedSpot.set(spot);
    this.activeTab.set('battle');
    this.startCombatWithRandomMob(spot);
  }

  // --- COMBAT SYSTEM ---
  startCombatWithRandomMob(spot?: HuntingSpot) {
    const targetSpot = spot || this.selectedSpot();
    if (!targetSpot || targetSpot.mobs.length === 0) return;

    const randomIndex = Math.floor(Math.random() * targetSpot.mobs.length);
    const templateMob = targetSpot.mobs[randomIndex];

    const mob: Mob = { ...templateMob, hp: templateMob.maxHp };
    this.activeMob.set(mob);
    this.mobCurrentHp.set(mob.maxHp);
    this.isPlayerTurn.set(true);

    this.addCombatLog({
      id: Date.now().toString(),
      actor: 'mob',
      text: `Encountered ${mob.name} (Lvl ${mob.level}) in ${targetSpot.name}!`
    });
  }

  toggleSoulshots() {
    this.character.update(c => {
      if (!c) return null;
      const nextState = !c.soulshotsActive;
      if (nextState) this.soundService.playSoulshot();
      return { ...c, soulshotsActive: nextState };
    });
  }

  executePlayerAction(action: 'attack' | 'skill' | 'potion' | 'flee', skill?: Skill) {
    const char = this.character();
    const mob = this.activeMob();
    if (!char || !mob || !this.isPlayerTurn()) return;

    const stats = this.computedStats();

    if (action === 'flee') {
      this.addCombatLog({ id: Date.now().toString(), actor: 'player', text: 'You safely retreated back to town.' });
      this.activeMob.set(null);
      this.activeTab.set('world');
      return;
    }

    if (action === 'potion') {
      if (char.hpPotions > 0 && char.hp < stats.maxHp) {
        const healAmt = 250;
        const newHp = Math.min(stats.maxHp, char.hp + healAmt);
        this.character.update(c => c ? { ...c, hp: newHp, hpPotions: c.hpPotions - 1 } : null);
        this.soundService.playMagic();
        this.addCombatLog({ id: Date.now().toString(), actor: 'player', text: `Used Healing Potion! Restored +${healAmt} HP.`, isHeal: true });
      } else {
        this.addCombatLog({ id: Date.now().toString(), actor: 'player', text: 'No HP Potions available or already at full HP!' });
      }
      return;
    }

    // Check Soulshots
    let useShot = false;
    if (char.soulshotsActive && char.soulshotCount > 0) {
      useShot = true;
      this.character.update(c => c ? { ...c, soulshotCount: c.soulshotCount - 1 } : null);
      this.soundService.playSoulshot();
    }

    let multiplier = 1.0;
    let isMagicSkill = false;

    if (action === 'skill' && skill) {
      if (char.mp < skill.mpCost) {
        this.addCombatLog({ id: Date.now().toString(), actor: 'player', text: 'Insufficient MP to cast skill!' });
        return;
      }
      this.character.update(c => c ? { ...c, mp: c.mp - skill.mpCost } : null);
      multiplier = skill.powerMultiplier;

      if (skill.target === 'heal') {
        const healAmt = Math.round(stats.maxHp * 0.4);
        const newHp = Math.min(stats.maxHp, char.hp + healAmt);
        this.character.update(c => c ? { ...c, hp: newHp } : null);
        this.soundService.playMagic();
        this.addCombatLog({ id: Date.now().toString(), actor: 'player', text: `Cast ${skill.name}! Healed +${healAmt} HP.`, isHeal: true });
        this.triggerMobTurn();
        return;
      }

      if (skill.target === 'self') {
        this.soundService.playMagic();
        this.addCombatLog({ id: Date.now().toString(), actor: 'player', text: `Activated ${skill.name}! Defensive aura increased.` });
        this.triggerMobTurn();
        return;
      }

      if (skill.id === 'wind_strike' || skill.id === 'hydro_blast' || skill.id === 'hurricane' || skill.id === 'drain_health') {
        isMagicSkill = true;
      }
    }

    // Calculate Damage
    const baseAtk = isMagicSkill ? stats.mAtk : stats.pAtk;
    const targetDef = isMagicSkill ? mob.mDef : mob.pDef;

    let rawDamage = (baseAtk * multiplier * (0.9 + Math.random() * 0.2)) - (targetDef * 0.35);
    if (useShot) rawDamage *= 2.0;

    // Crit calculation
    const isCrit = Math.random() * 100 < stats.critRate;
    if (isCrit) rawDamage *= 2.0;

    const finalDamage = Math.max(1, Math.round(rawDamage));

    if (isMagicSkill) this.soundService.playMagic();
    else if (isCrit) this.soundService.playCrit();
    else this.soundService.playAttack();

    const newMobHp = Math.max(0, this.mobCurrentHp() - finalDamage);
    this.mobCurrentHp.set(newMobHp);

    let logText = `Dealt ${finalDamage} damage to ${mob.name}`;
    if (useShot) logText += ' [SOULSHOT!]';
    if (isCrit) logText += ' ★ CRITICAL HIT!';

    this.addCombatLog({
      id: Date.now().toString(),
      actor: 'player',
      text: logText,
      damage: finalDamage,
      isCritical: isCrit,
      isSoulshot: useShot
    });

    // Check if Mob is Dead
    if (newMobHp <= 0) {
      this.handleMobDefeated(mob);
    } else {
      this.isPlayerTurn.set(false);
      setTimeout(() => this.triggerMobTurn(), 700);
    }
  }

  private triggerMobTurn() {
    const mob = this.activeMob();
    const char = this.character();
    if (!mob || !char) return;

    const stats = this.computedStats();

    const rawMobDamage = (mob.pAtk * (0.9 + Math.random() * 0.2)) - (stats.pDef * 0.35);
    const finalMobDamage = Math.max(1, Math.round(rawMobDamage));

    this.soundService.playAttack();

    // CP shield damage first!
    let currentCp = char.cp;
    let currentHp = char.hp;

    if (currentCp > 0) {
      if (currentCp >= finalMobDamage) {
        currentCp -= finalMobDamage;
      } else {
        const overflow = finalMobDamage - currentCp;
        currentCp = 0;
        currentHp = Math.max(0, currentHp - overflow);
      }
    } else {
      currentHp = Math.max(0, currentHp - finalMobDamage);
    }

    this.character.update(c => c ? { ...c, cp: currentCp, hp: currentHp } : null);

    this.addCombatLog({
      id: Date.now().toString(),
      actor: 'mob',
      text: `${mob.name} attacked you for ${finalMobDamage} damage!`
    });

    if (currentHp <= 0) {
      // Player Defeated
      this.addCombatLog({ id: Date.now().toString(), actor: 'mob', text: 'You were defeated in combat! Reviving in town...' });
      setTimeout(() => {
        this.character.update(c => c ? { ...c, hp: Math.round(stats.maxHp * 0.5), cp: 0 } : null);
        this.activeMob.set(null);
        this.activeTab.set('world');
      }, 1500);
    } else {
      this.isPlayerTurn.set(true);
      if (this.autoBattle()) {
        setTimeout(() => this.executePlayerAction('attack'), 600);
      }
    }
  }

  private handleMobDefeated(mob: Mob) {
    this.soundService.playCoin();

    const adenaReward = Math.floor(Math.random() * (mob.adenaMax - mob.adenaMin + 1)) + mob.adenaMin;
    const expReward = mob.expReward;
    const spReward = mob.spReward;

    this.addCombatLog({
      id: Date.now().toString(),
      actor: 'player',
      text: `★ Defeated ${mob.name}! Rewards: +${expReward} EXP, +${spReward} SP, +${adenaReward} Adena.`,
      isCritical: true
    });

    // Handle Item Drops
    const dropsAdded: string[] = [];
    mob.possibleDrops.forEach(drop => {
      if (Math.random() <= drop.chance) {
        this.addItemToInventory(drop.item);
        dropsAdded.push(drop.item.name);
      }
    });

    if (dropsAdded.length > 0) {
      this.addCombatLog({
        id: Date.now().toString(),
        actor: 'player',
        text: `📦 Looted item: ${dropsAdded.join(', ')}!`
      });
    }

    // Update Quests
    this.quests.update(ql => ql.map(q => {
      if (!q.completed && q.targetMobName === mob.name) {
        const nextAmt = q.currentAmount + 1;
        const isDone = nextAmt >= q.targetAmount;
        return { ...q, currentAmount: nextAmt, completed: isDone };
      }
      return q;
    }));

    // Grant XP, SP, Adena
    this.grantExpAndSp(expReward, spReward, adenaReward);

    this.activeMob.set(null);

    // Auto Battle next spawn
    if (this.autoBattle()) {
      setTimeout(() => this.startCombatWithRandomMob(), 1200);
    }
  }

  grantExpAndSp(expGain: number, spGain: number, adenaGain: number) {
    this.character.update(c => {
      if (!c) return null;

      const MAX_LEVEL = 67;

      if (c.level >= MAX_LEVEL) {
        return {
          ...c,
          level: MAX_LEVEL,
          exp: c.maxExp,
          sp: c.sp + spGain,
          adena: c.adena + adenaGain
        };
      }

      let newExp = c.exp + expGain;
      let newLevel = c.level;
      let maxExp = c.maxExp;
      let leveledUp = false;

      while (newExp >= maxExp && newLevel < MAX_LEVEL) {
        newExp -= maxExp;
        newLevel += 1;
        maxExp = Math.round(maxExp * 1.35);
        leveledUp = true;
      }

      if (newLevel >= MAX_LEVEL) {
        newLevel = MAX_LEVEL;
        newExp = maxExp;
      }

      if (leveledUp) {
        this.soundService.playLevelUp();
        this.addCombatLog({
          id: Date.now().toString(),
          actor: 'player',
          text: newLevel === MAX_LEVEL
            ? `🎉 MAXIMUM LEVEL REACHED! You reached Level ${MAX_LEVEL}! Max HP, MP & CP restored!`
            : `🎉 LEVEL UP! You reached Level ${newLevel}! Max HP, MP & CP restored!`,
          isCritical: true
        });
      }

      const stats = this.computedStats();

      return {
        ...c,
        level: newLevel,
        exp: newExp,
        maxExp,
        sp: c.sp + spGain,
        adena: c.adena + adenaGain,
        hp: leveledUp ? stats.maxHp : c.hp,
        mp: leveledUp ? stats.maxMp : c.mp,
        cp: leveledUp ? stats.maxCp : c.cp
      };
    });

    this.saveGame();
  }

  // --- PAPERDOLL & INVENTORY ---
  equipItem(item: Item) {
    if (!item.slot) return;
    const current = this.equipped();
    const slot = item.slot;

    // Swap item
    const oldItem = current[slot];

    this.equipped.update(eq => ({ ...eq, [slot]: item }));
    this.inventory.update(inv => {
      const filtered = inv.filter(i => i.id !== item.id);
      if (oldItem) filtered.push(oldItem);
      return filtered;
    });

    this.soundService.playCoin();
    this.saveGame();
  }

  unequipItem(slot: EquipmentSlot) {
    const current = this.equipped();
    const item = current[slot];
    if (!item) return;

    this.equipped.update(eq => ({ ...eq, [slot]: null }));
    this.addItemToInventory(item);
    this.saveGame();
  }

  addItemToInventory(item: Item) {
    this.inventory.update(inv => {
      if (item.stackable) {
        const existing = inv.find(i => i.id === item.id);
        if (existing) {
          return inv.map(i => i.id === item.id ? { ...i, quantity: (i.quantity || 1) + (item.quantity || 1) } : i);
        }
      }
      return [...inv, { ...item }];
    });
  }

  // --- SHOP & ENCHANTING ---
  buyItem(item: Item, qty = 1) {
    const char = this.character();
    if (!char) return;

    const totalPrice = item.price * qty;
    if (char.adena < totalPrice) {
      alert('Not enough Adena!');
      return;
    }

    this.character.update(c => c ? { ...c, adena: c.adena - totalPrice } : null);

    if (item.id === 'hp_potion') {
      this.character.update(c => c ? { ...c, hpPotions: c.hpPotions + qty } : null);
    } else if (item.id === 'mp_potion') {
      this.character.update(c => c ? { ...c, mpPotions: c.mpPotions + qty } : null);
    } else if (item.type === 'consumable' && item.id.startsWith('soulshot')) {
      this.character.update(c => c ? { ...c, soulshotCount: c.soulshotCount + (qty * 100) } : null);
    } else {
      this.addItemToInventory({ ...item, quantity: qty });
    }

    this.soundService.playCoin();
    this.saveGame();
  }

  enchantEquipment(targetItem: Item, scrollItem: Item): { success: boolean; newEnchant: number } {
    const char = this.character();
    if (!char) return { success: false, newEnchant: 0 };

    // Remove 1 scroll
    this.inventory.update(inv => {
      return inv.map(i => {
        if (i.id === scrollItem.id) {
          const newQty = (i.quantity || 1) - 1;
          return newQty > 0 ? { ...i, quantity: newQty } : null;
        }
        return i;
      }).filter(Boolean) as Item[];
    });

    const currentEnchant = targetItem.enchantLevel || 0;
    const isSafe = currentEnchant < 3;
    const successRate = isSafe ? 1.0 : 0.66;

    const isSuccess = Math.random() <= successRate;

    if (isSuccess) {
      const nextEnchant = currentEnchant + 1;
      this.soundService.playEnchantSuccess();

      // Update in inventory or equipped
      this.updateItemEnchantLevel(targetItem, nextEnchant);
      this.saveGame();
      return { success: true, newEnchant: nextEnchant };
    } else {
      this.soundService.playEnchantFail();
      // Crystallize item: remove target item, grant Adena refund
      this.removeItemFromInventoryOrEquipped(targetItem);
      const refundAdena = Math.round(targetItem.price * 0.4);
      this.character.update(c => c ? { ...c, adena: c.adena + refundAdena } : null);
      this.saveGame();
      return { success: false, newEnchant: 0 };
    }
  }

  private updateItemEnchantLevel(item: Item, newEnchant: number) {
    // Check inventory
    this.inventory.update(inv => inv.map(i => i.id === item.id ? { ...i, enchantLevel: newEnchant } : i));

    // Check paperdoll
    const eq = this.equipped();
    Object.entries(eq).forEach(([slot, eqItem]) => {
      if (eqItem && eqItem.id === item.id) {
        this.equipped.update(e => ({ ...e, [slot]: { ...eqItem, enchantLevel: newEnchant } }));
      }
    });
  }

  private removeItemFromInventoryOrEquipped(item: Item) {
    this.inventory.update(inv => inv.filter(i => i.id !== item.id));
    const eq = this.equipped();
    Object.entries(eq).forEach(([slot, eqItem]) => {
      if (eqItem && eqItem.id === item.id) {
        this.equipped.update(e => ({ ...e, [slot]: null }));
      }
    });
  }

  // --- CLASS TRANSFER & SKILLS ---
  transferClass(newClassId: string) {
    const char = this.character();
    if (!char) return;

    const targetClass = CHARACTER_CLASSES.find(c => c.id === newClassId);
    if (!targetClass) return;

    this.character.update(c => c ? {
      ...c,
      classId: targetClass.id,
      className: targetClass.name
    } : null);

    this.soundService.playLevelUp();
    this.saveGame();
  }

  learnSkill(skill: Skill) {
    const char = this.character();
    if (!char || char.sp < skill.spCost) return;

    this.character.update(c => c ? { ...c, sp: c.sp - skill.spCost } : null);
    this.learnedSkills.update(sk => [...sk, { ...skill, learned: true }]);
    this.soundService.playMagic();
    this.saveGame();
  }

  claimQuestReward(questId: string) {
    const qList = this.quests();
    const q = qList.find(x => x.id === questId);
    if (!q || !q.completed || q.claimed) return;

    this.quests.update(ql => ql.map(x => x.id === questId ? { ...x, claimed: true } : x));

    if (q.rewardItem) this.addItemToInventory(q.rewardItem);
    this.grantExpAndSp(q.rewardExp, 100, q.rewardAdena);

    this.soundService.playCoin();
    this.saveGame();
  }

  private addCombatLog(log: CombatActionLog) {
    this.combatLog.update(logs => [log, ...logs.slice(0, 30)]);
  }
}
