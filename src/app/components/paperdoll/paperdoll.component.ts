import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameStateService } from '../../services/game-state.service';
import { EquipmentSlot, Item } from '../../models/game.models';
import { CHARACTER_CLASSES, ALL_SKILLS } from '../../data/game-data';
import { Character2dViewComponent } from './character-2d-view.component';

@Component({
  selector: 'app-paperdoll',
  standalone: true,
  imports: [CommonModule, Character2dViewComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (state.character(); as char) {
      <div class="p-3 sm:p-4 max-w-md mx-auto space-y-4 pb-20 select-none">
        
        <!-- Sub Navigation Tabs -->
        <div class="flex bg-[#0a0a0c] border border-[#3c3c4a] p-1 rounded-xl text-xs font-bold overflow-x-auto">
          <button 
            (click)="subTab.set('gear')"
            class="flex-1 py-1.5 rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer min-w-[70px]"
            [ngClass]="subTab() === 'gear' ? 'bg-[#8b7355] text-black font-bold border border-[#d4af37] shadow-[0_0_8px_rgba(212,175,55,0.3)]' : 'text-[#8b7355] hover:text-[#d4af37]'">
            <span>🛡️</span>
            <span>Gear</span>
          </button>
          <button 
            (click)="subTab.set('view')"
            class="flex-1 py-1.5 rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer min-w-[70px]"
            [ngClass]="subTab() === 'view' ? 'bg-[#8b7355] text-black font-bold border border-[#d4af37] shadow-[0_0_8px_rgba(212,175,55,0.3)]' : 'text-[#8b7355] hover:text-[#d4af37]'">
            <span>👁️</span>
            <span>View</span>
          </button>
          <button 
            (click)="subTab.set('stats')"
            class="flex-1 py-1.5 rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer min-w-[65px]"
            [ngClass]="subTab() === 'stats' ? 'bg-[#8b7355] text-black font-bold border border-[#d4af37] shadow-[0_0_8px_rgba(212,175,55,0.3)]' : 'text-[#8b7355] hover:text-[#d4af37]'">
            <span>📊</span>
            <span>Stats</span>
          </button>
          <button 
            (click)="subTab.set('class')"
            class="flex-1 py-1.5 rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer min-w-[65px]"
            [ngClass]="subTab() === 'class' ? 'bg-[#8b7355] text-black font-bold border border-[#d4af37] shadow-[0_0_8px_rgba(212,175,55,0.3)]' : 'text-[#8b7355] hover:text-[#d4af37]'">
            <span>📜</span>
            <span>Class</span>
          </button>
          <button 
            (click)="subTab.set('skills')"
            class="flex-1 py-1.5 rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer min-w-[65px]"
            [ngClass]="subTab() === 'skills' ? 'bg-[#8b7355] text-black font-bold border border-[#d4af37] shadow-[0_0_8px_rgba(212,175,55,0.3)]' : 'text-[#8b7355] hover:text-[#d4af37]'">
            <span>✨</span>
            <span>Skills</span>
          </button>
        </div>

        <!-- TAB 1: PAPERDOLL EQUIPMENT -->
        @if (subTab() === 'gear') {
          <div class="bg-[#12121a]/90 border border-[#2a2a35] rounded-xl p-4 shadow-2xl space-y-4 relative">
            <div class="absolute top-2 left-4 text-[10px] uppercase text-[#8b7355] font-bold tracking-widest">Inventory / Equipment</div>

            <!-- Character Paperdoll Grid -->
            <div class="relative flex items-center justify-between gap-2 min-h-[230px] pt-4">
              
              <!-- Left Column: Helm, Chest, Pants, Gloves, Boots -->
              <div class="flex flex-col gap-2 z-10">
                <ng-container *ngTemplateOutlet="slotItem; context: { slot: 'helmet', label: 'Helm', icon: '🧢' }"></ng-container>
                <ng-container *ngTemplateOutlet="slotItem; context: { slot: 'chest', label: 'Armor', icon: '🛡️' }"></ng-container>
                <ng-container *ngTemplateOutlet="slotItem; context: { slot: 'pants', label: 'Gaiters', icon: '👖' }"></ng-container>
                <ng-container *ngTemplateOutlet="slotItem; context: { slot: 'gloves', label: 'Gloves', icon: '🧤' }"></ng-container>
                <ng-container *ngTemplateOutlet="slotItem; context: { slot: 'boots', label: 'Boots', icon: '🥾' }"></ng-container>
              </div>

              <!-- Center Avatar Silhouette & Set Bonus -->
              <div class="flex-1 flex flex-col items-center justify-center text-center p-2 relative">
                <div class="w-24 h-24 rounded-full bg-[#0a0a0c] border-2 border-[#8b7355] flex items-center justify-center text-5xl shadow-[0_0_15px_rgba(139,115,85,0.2)] relative overflow-hidden mb-2">
                  <span>{{ getRaceEmoji(char.race) }}</span>
                  <div class="absolute inset-0 bg-gradient-to-t from-[#8b7355]/20 via-transparent to-transparent"></div>
                </div>

                <div class="font-serif font-bold text-sm text-[#d4af37] tracking-wider uppercase">{{ char.name }}</div>
                <div class="text-[11px] text-[#8b7355] font-mono">Level {{ char.level }} {{ char.className }}</div>

                <!-- Set Bonus Active -->
                @if (activeSetBonus(); as setBonus) {
                  <div class="mt-2 bg-[#1a1a24] border border-[#d4af37]/40 text-[10px] text-amber-200 px-2 py-1 rounded-lg font-mono shadow-[0_0_8px_rgba(212,175,55,0.2)]">
                    <span class="font-bold text-[#d4af37]">✨ Set Active:</span> {{ setBonus }}
                  </div>
                }
              </div>

              <!-- Right Column: Weapon, Shield, Jewelry -->
              <div class="flex flex-col gap-2 z-10">
                <ng-container *ngTemplateOutlet="slotItem; context: { slot: 'weapon', label: 'Weapon', icon: '🗡️' }"></ng-container>
                <ng-container *ngTemplateOutlet="slotItem; context: { slot: 'shield', label: 'Offhand', icon: '🛡️' }"></ng-container>
                <ng-container *ngTemplateOutlet="slotItem; context: { slot: 'necklace', label: 'Neck', icon: '📿' }"></ng-container>
                <ng-container *ngTemplateOutlet="slotItem; context: { slot: 'earring', label: 'Earring', icon: '💎' }"></ng-container>
                <ng-container *ngTemplateOutlet="slotItem; context: { slot: 'ring', label: 'Ring', icon: '💍' }"></ng-container>
              </div>

            </div>

            <!-- Quick Combat Overview -->
            <div class="grid grid-cols-2 gap-2 text-xs pt-3 border-t border-[#2a2a35] font-mono">
              <div class="bg-[#0a0a0c] p-2 rounded-lg border border-[#3c3c4a] flex justify-between">
                <span class="text-[#8b7355]">P.Atk:</span>
                <span class="font-bold text-[#d4af37]">{{ stats().pAtk }}</span>
              </div>
              <div class="bg-[#0a0a0c] p-2 rounded-lg border border-[#3c3c4a] flex justify-between">
                <span class="text-[#8b7355]">P.Def:</span>
                <span class="font-bold text-[#d4af37]">{{ stats().pDef }}</span>
              </div>
              <div class="bg-[#0a0a0c] p-2 rounded-lg border border-[#3c3c4a] flex justify-between">
                <span class="text-[#8b7355]">M.Atk:</span>
                <span class="font-bold text-purple-300">{{ stats().mAtk }}</span>
              </div>
              <div class="bg-[#0a0a0c] p-2 rounded-lg border border-[#3c3c4a] flex justify-between">
                <span class="text-[#8b7355]">M.Def:</span>
                <span class="font-bold text-purple-300">{{ stats().mDef }}</span>
              </div>
            </div>

          </div>
        }

        <!-- TAB 2: 2D CHARACTER VIEW -->
        @if (subTab() === 'view') {
          <app-character-2d-view />
        }

        <!-- TAB 2: FULL STATS BREAKDOWN -->
        @if (subTab() === 'stats') {
          <div class="bg-[#12121a]/90 border border-[#2a2a35] rounded-xl p-4 shadow-2xl space-y-3">
            <h3 class="text-xs font-serif font-bold text-[#d4af37] uppercase tracking-widest">Combat Stats Overview</h3>
            
            <div class="grid grid-cols-2 gap-2 text-xs font-mono">
              <div class="bg-[#0a0a0c] p-2.5 rounded-lg border border-[#3c3c4a] space-y-1">
                <div class="text-[#8b7355] text-[10px] uppercase font-bold">Physical Attack</div>
                <div class="text-base font-bold text-[#d4af37]">{{ stats().pAtk }}</div>
              </div>
              <div class="bg-[#0a0a0c] p-2.5 rounded-lg border border-[#3c3c4a] space-y-1">
                <div class="text-[#8b7355] text-[10px] uppercase font-bold">Physical Defense</div>
                <div class="text-base font-bold text-[#d4af37]">{{ stats().pDef }}</div>
              </div>
              <div class="bg-[#0a0a0c] p-2.5 rounded-lg border border-[#3c3c4a] space-y-1">
                <div class="text-[#8b7355] text-[10px] uppercase font-bold">Magic Attack</div>
                <div class="text-base font-bold text-purple-300">{{ stats().mAtk }}</div>
              </div>
              <div class="bg-[#0a0a0c] p-2.5 rounded-lg border border-[#3c3c4a] space-y-1">
                <div class="text-[#8b7355] text-[10px] uppercase font-bold">Magic Defense</div>
                <div class="text-base font-bold text-purple-300">{{ stats().mDef }}</div>
              </div>
              <div class="bg-[#0a0a0c] p-2.5 rounded-lg border border-[#3c3c4a] space-y-1">
                <div class="text-[#8b7355] text-[10px] uppercase font-bold">Critical Rate</div>
                <div class="text-base font-bold text-amber-300">{{ stats().critRate }}%</div>
              </div>
              <div class="bg-[#0a0a0c] p-2.5 rounded-lg border border-[#3c3c4a] space-y-1">
                <div class="text-[#8b7355] text-[10px] uppercase font-bold">Attack Speed</div>
                <div class="text-base font-bold text-cyan-300">{{ stats().atkSpd }}</div>
              </div>
            </div>

            <h3 class="text-xs font-serif font-bold text-[#d4af37] uppercase tracking-widest pt-2">Base Racial Attributes</h3>
            <div class="grid grid-cols-3 gap-2 text-xs text-center font-mono">
              <div class="bg-[#0a0a0c] p-2 rounded-lg border border-[#3c3c4a]"><span class="text-red-400 font-bold block">STR</span> {{ char.baseStats.str }}</div>
              <div class="bg-[#0a0a0c] p-2 rounded-lg border border-[#3c3c4a]"><span class="text-amber-400 font-bold block">DEX</span> {{ char.baseStats.dex }}</div>
              <div class="bg-[#0a0a0c] p-2 rounded-lg border border-[#3c3c4a]"><span class="text-emerald-400 font-bold block">CON</span> {{ char.baseStats.con }}</div>
              <div class="bg-[#0a0a0c] p-2 rounded-lg border border-[#3c3c4a]"><span class="text-purple-400 font-bold block">INT</span> {{ char.baseStats.int }}</div>
              <div class="bg-[#0a0a0c] p-2 rounded-lg border border-[#3c3c4a]"><span class="text-cyan-400 font-bold block">WIT</span> {{ char.baseStats.wit }}</div>
              <div class="bg-[#0a0a0c] p-2 rounded-lg border border-[#3c3c4a]"><span class="text-blue-400 font-bold block">MEN</span> {{ char.baseStats.men }}</div>
            </div>

            <!-- Reset Progress -->
            <div class="pt-3 border-t border-[#2a2a35] text-center">
              <button 
                (click)="state.resetProgress()"
                class="text-xs text-rose-400 hover:text-rose-300 underline font-medium cursor-pointer">
                Reset Progress & Create New Character
              </button>
            </div>
          </div>
        }

        <!-- TAB 3: CLASS TRANSFER GUILD -->
        @if (subTab() === 'class') {
          <div class="bg-[#12121a]/90 border border-[#2a2a35] rounded-xl p-4 shadow-2xl space-y-3">
            <div class="flex justify-between items-center">
              <h3 class="text-xs font-serif font-bold text-[#d4af37] uppercase tracking-widest">Grand Master Guild</h3>
              <span class="text-[11px] text-[#8b7355] font-mono">Current: {{ char.className }}</span>
            </div>

            <!-- Available Class Transfers -->
            <div class="space-y-2">
              @for (cBranch of availableClassTransfers(); track cBranch.id) {
                <div class="bg-[#0a0a0c] p-3 rounded-xl border border-[#3c3c4a] space-y-2">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                      <span class="text-xl">📜</span>
                      <div>
                        <div class="font-serif font-bold text-sm text-[#d4af37]">{{ cBranch.name }}</div>
                        <div class="text-[10px] text-[#8b7355] font-mono">Tier {{ cBranch.tier }} Transfer &bull; Lvl {{ cBranch.requiredLevel }}+</div>
                      </div>
                    </div>

                    <button 
                      (click)="state.transferClass(cBranch.id)"
                      [disabled]="char.level < cBranch.requiredLevel"
                      class="px-3 py-1.5 rounded bg-[#8b7355] text-black text-xs font-bold hover:bg-[#d4af37] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors">
                      Advance
                    </button>
                  </div>
                  <p class="text-xs text-slate-400 leading-relaxed">{{ cBranch.description }}</p>
                </div>
              } @empty {
                <div class="text-center p-6 bg-[#0a0a0c] rounded-xl border border-[#3c3c4a] text-xs text-slate-400">
                  <span>🏆 You have achieved the peak class advancement for your path!</span>
                </div>
              }
            </div>
          </div>
        }

        <!-- TAB 4: SKILL TREE -->
        @if (subTab() === 'skills') {
          <div class="bg-[#12121a]/90 border border-[#2a2a35] rounded-xl p-4 shadow-2xl space-y-3">
            <div class="flex justify-between items-center">
              <h3 class="text-xs font-serif font-bold text-[#d4af37] uppercase tracking-widest">Skill Mastery</h3>
              <span class="text-xs text-[#d4af37] font-bold bg-[#1a1a24] px-2.5 py-0.5 rounded border border-[#8b7355] font-mono">
                {{ char.sp | number }} SP
              </span>
            </div>

            <div class="space-y-2">
              @for (sk of allAvailableSkills(); track sk.id) {
                <div class="bg-[#0a0a0c] p-3 rounded-xl border border-[#3c3c4a] flex items-center justify-between gap-2">
                  <div class="flex items-center gap-2.5">
                    <div class="w-10 h-10 rounded-lg bg-[#1a1a24] border border-[#8b7355]/40 flex items-center justify-center text-xl shrink-0">
                      <span>⚡</span>
                    </div>
                    <div>
                      <div class="font-bold text-xs text-[#d4af37]">{{ sk.name }}</div>
                      <div class="text-[10px] text-slate-400 leading-tight">{{ sk.description }}</div>
                      <div class="text-[10px] text-cyan-400 font-mono mt-0.5">Cost: {{ sk.mpCost }} MP | Lvl {{ sk.requiredLevel }}+</div>
                    </div>
                  </div>

                  @if (isSkillLearned(sk.id)) {
                    <span class="text-[10px] text-emerald-400 font-bold bg-emerald-950/60 border border-emerald-800 px-2 py-1 rounded-lg shrink-0">
                      Mastered
                    </span>
                  } @else {
                    <button 
                      (click)="state.learnSkill(sk)"
                      [disabled]="char.sp < sk.spCost || char.level < sk.requiredLevel"
                      class="px-2.5 py-1.5 rounded bg-[#8b7355] text-black text-xs font-bold hover:bg-[#d4af37] disabled:opacity-40 cursor-pointer shrink-0 transition-colors">
                      Learn ({{ sk.spCost }} SP)
                    </button>
                  }
                </div>
              }
            </div>
          </div>
        }

      </div>
    }

    <!-- Template snippet for Slot Items -->
    <ng-template #slotItem let-slot="slot" let-label="label" let-icon="icon">
      @let item = getEquippedItem(slot);
      <button 
        type="button"
        (click)="item ? state.unequipItem(slot) : null"
        [aria-label]="item ? 'Unequip ' + item.name : 'Empty ' + label + ' slot'"
        class="w-13 h-13 rounded-lg bg-[#1a1a24] border border-[#8b7355]/40 transition-all flex flex-col items-center justify-center relative group cursor-pointer shadow-inner focus:outline-none focus:ring-2 focus:ring-[#d4af37]"
        [ngClass]="item ? getEnchantGlowClass(item.enchantLevel || 0) : 'border-[#3c3c4a] hover:border-[#8b7355]'">
        
        @if (item) {
          <span class="text-xl leading-none">{{ getItemIcon(item) }}</span>
          <span class="text-[8px] font-bold text-[#d4af37] truncate max-w-[42px] px-0.5 mt-0.5">
            {{ item.name.split(' ')[0] }}
          </span>
          @if ((item.enchantLevel || 0) > 0) {
            <span class="absolute -top-1.5 -right-1.5 bg-cyan-500 text-black font-black text-[9px] px-1 rounded-full border border-black shadow">
              +{{ item.enchantLevel }}
            </span>
          }
        } @else {
          <span class="text-[#8b7355] text-lg opacity-40">{{ icon }}</span>
          <span class="text-[7px] text-[#8b7355] font-bold uppercase mt-0.5 tracking-tighter">{{ label }}</span>
        }
      </button>
    </ng-template>
  `
})
export class PaperdollComponent {
  state = inject(GameStateService);

  subTab = signal<'gear' | 'view' | 'stats' | 'class' | 'skills'>('gear');
  stats = this.state.computedStats;

  activeSetBonus = signal<string | null>(null);

  constructor() {
    const eq = this.state.equipped();
    if (eq.chest?.setBonusName && eq.chest.setBonusName === eq.pants?.setBonusName) {
      this.activeSetBonus.set(eq.chest.setBonusDescription || eq.chest.setBonusName);
    }
  }

  getEquippedItem(slot: string): Item | null {
    return this.state.equipped()[slot as EquipmentSlot] || null;
  }

  getRaceEmoji(race: string): string {
    switch (race) {
      case 'human': return '🗡️';
      case 'elf': return '🧝';
      case 'dark_elf': return '🧝‍♂️';
      case 'orc': return '👹';
      case 'dwarf': return '⚒️';
      default: return '🛡️';
    }
  }

  getItemIcon(item: Item): string {
    if (item.type === 'weapon') return '🗡️';
    if (item.type === 'armor') return '🛡️';
    if (item.type === 'jewelry') return '💎';
    return '📦';
  }

  getEnchantGlowClass(enchant: number): string {
    if (enchant >= 10) return 'border-[#d4af37] bg-slate-800 shadow-[0_0_12px_rgba(212,175,55,0.6)] ring-1 ring-[#d4af37] animate-pulse';
    if (enchant >= 7) return 'border-purple-400 bg-slate-800 shadow-[0_0_10px_rgba(168,85,247,0.4)]';
    if (enchant >= 4) return 'border-cyan-400 bg-slate-800 shadow-[0_0_8px_rgba(34,211,238,0.4)]';
    return 'border-[#8b7355] bg-slate-800 shadow-[0_0_6px_rgba(139,115,85,0.3)]';
  }

  availableClassTransfers() {
    const char = this.state.character();
    if (!char) return [];
    return CHARACTER_CLASSES.filter(c => c.race === char.race && c.requiredLevel > 1 && c.id !== char.classId);
  }

  allAvailableSkills() {
    return ALL_SKILLS;
  }

  isSkillLearned(skillId: string): boolean {
    return this.state.learnedSkills().some(s => s.id === skillId);
  }
}
