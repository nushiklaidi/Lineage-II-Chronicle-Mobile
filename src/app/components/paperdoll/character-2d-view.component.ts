import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameStateService } from '../../services/game-state.service';
import { RaceType } from '../../models/game.models';

@Component({
  selector: 'app-character-2d-view',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (state.character(); as char) {
      <div class="bg-[#12121a]/95 border border-[#2a2a35] rounded-xl p-4 shadow-2xl space-y-4 text-slate-200 select-none">
        
        <!-- Header Controls & Stage Selector -->
        <div class="flex items-center justify-between border-b border-[#2a2a35] pb-2 text-xs">
          <div class="flex items-center gap-1.5">
            <span class="text-base">👁️</span>
            <span class="font-serif font-bold text-[#d4af37] uppercase tracking-wider">2D Hero Stage</span>
          </div>

          <!-- Background Environment Picker -->
          <div class="flex items-center gap-1">
            <span class="text-[10px] text-[#8b7355] font-mono">Stage:</span>
            <select 
              #bgSelect
              (change)="bgStage.set(bgSelect.value)"
              class="bg-[#0a0a0c] border border-[#3c3c4a] text-[10px] text-[#d4af37] px-2 py-0.5 rounded font-mono outline-none cursor-pointer">
              <option value="giran">Giran Town Plaza</option>
              <option value="aden">Aden Castle Hall</option>
              <option value="elven">Elven Sacred Tree</option>
              <option value="dragon">Dragon Valley</option>
            </select>
          </div>
        </div>

        <!-- MAIN 2D STAGE CANVAS / SVG -->
        <div 
          class="relative w-full h-[360px] rounded-xl border-2 border-[#8b7355] overflow-hidden flex flex-col items-center justify-between p-3 shadow-[0_0_20px_rgba(0,0,0,0.8)] transition-all duration-500"
          [ngClass]="getBgStageClass(bgStage())">
          
          <!-- Background Atmospheric Particles & Ambient Overlay -->
          <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 pointer-events-none"></div>

          <!-- Top Character Badge Plate -->
          <div class="z-20 text-center space-y-0.5 mt-1">
            <div class="inline-flex items-center gap-1.5 bg-black/70 backdrop-blur border border-[#8b7355] px-3 py-1 rounded-full shadow-lg">
              <span class="text-[10px] font-mono text-amber-400 font-bold">Lvl {{ char.level }}</span>
              <span class="text-xs font-serif font-bold text-[#d4af37] tracking-wider uppercase">{{ char.name }}</span>
              <span class="text-[10px] text-slate-300 font-mono">({{ char.className }})</span>
            </div>
            
            <!-- Active Weapon Aura Title -->
            @if (weaponEnchantLevel() >= 4) {
              <div class="text-[9px] font-mono font-bold tracking-widest uppercase animate-pulse"
                   [ngClass]="{
                     'text-cyan-400': weaponEnchantLevel() < 7,
                     'text-purple-400': weaponEnchantLevel() >= 7 && weaponEnchantLevel() < 10,
                     'text-amber-300': weaponEnchantLevel() >= 10
                   }">
                ✨ {{ getEnchantTitle(weaponEnchantLevel()) }} ✨
              </div>
            }
          </div>

          <!-- 2D AVATAR FIGURE CONTAINER -->
          <div class="relative z-10 w-full flex-1 flex items-center justify-center my-2">
            
            <!-- Character Aura Glow Rings Behind Body -->
            <div 
              class="absolute rounded-full pointer-events-none transition-all duration-700"
              [ngClass]="{
                'w-48 h-48 bg-cyan-500/20 blur-xl animate-pulse': weaponEnchantLevel() >= 4 && weaponEnchantLevel() < 7,
                'w-56 h-56 bg-purple-500/25 blur-2xl animate-pulse': weaponEnchantLevel() >= 7 && weaponEnchantLevel() < 10,
                'w-64 h-64 bg-amber-400/30 blur-2xl animate-pulse': weaponEnchantLevel() >= 10,
                'w-40 h-40 bg-[#8b7355]/10 blur-lg': weaponEnchantLevel() < 4
              }">
            </div>

            <!-- SVG 2D CHARACTER FIGURE -->
            <svg 
              viewBox="0 0 200 280" 
              class="h-full max-h-[260px] drop-shadow-[0_10px_15px_rgba(0,0,0,0.9)] transition-transform duration-300"
              [ngClass]="getStanceTransformClass(stance())">
              
              <!-- Ground Shadow -->
              <ellipse cx="100" cy="265" rx="50" ry="8" fill="#000000" opacity="0.6" />

              <!-- Magic Circle on Ground if Casting Stance -->
              @if (stance() === 'cast') {
                <g class="animate-spin" style="transform-origin: 100px 265px; animation-duration: 8s;">
                  <ellipse cx="100" cy="265" rx="60" ry="12" fill="none" stroke="#22d3ee" stroke-width="1.5" stroke-dasharray="4 2" opacity="0.8" />
                  <ellipse cx="100" cy="265" rx="45" ry="9" fill="none" stroke="#d4af37" stroke-width="1" opacity="0.6" />
                </g>
              }

              <!-- LAYER 1: BACK SHIELD or OFFHAND (Left Hand / Right in Mirror) -->
              @if (equippedShield(); as shield) {
                <g transform="translate(45, 120)">
                  <!-- Shield Body -->
                  <path d="M 0 0 Q 20 -10 40 0 L 35 45 Q 20 60 0 45 Z" fill="#1a1a24" stroke="#d4af37" stroke-width="2" />
                  <!-- Shield Emblem -->
                  <path d="M 20 10 L 25 25 L 20 35 L 15 25 Z" fill="#8b7355" />
                </g>
              }

              <!-- LAYER 2: CHARACTER BODY SILHOUETTE & LEGS -->
              <!-- Legs & Sabatons/Boots -->
              <g id="legs">
                <!-- Left Leg -->
                <rect x="78" y="170" width="16" height="75" rx="6" [attr.fill]="armorColors().pants" stroke="#0a0a0c" stroke-width="1.5" />
                <!-- Right Leg -->
                <rect x="106" y="170" width="16" height="75" rx="6" [attr.fill]="armorColors().pants" stroke="#0a0a0c" stroke-width="1.5" />
                
                <!-- Boots -->
                <path d="M 74 235 L 94 235 L 96 258 L 70 258 Z" [attr.fill]="armorColors().boots" stroke="#3c3c4a" stroke-width="1.5" />
                <path d="M 106 235 L 126 235 L 130 258 L 104 258 Z" [attr.fill]="armorColors().boots" stroke="#3c3c4a" stroke-width="1.5" />
                <!-- Boot Trim -->
                <rect x="73" y="233" width="22" height="5" fill="#d4af37" rx="1" />
                <rect x="105" y="233" width="22" height="5" fill="#d4af37" rx="1" />
              </g>

              <!-- LAYER 3: TORSO & CHEST ARMOR -->
              <g id="torso">
                <!-- Base Body Trunk -->
                <path d="M 70 95 L 130 95 L 122 175 L 78 175 Z" [attr.fill]="armorColors().chest" stroke="#1a1a24" stroke-width="2" />
                
                <!-- Chest Armor Trim & Crest -->
                <path d="M 85 95 L 100 130 L 115 95 Z" fill="#8b7355" opacity="0.8" />
                <circle cx="100" cy="120" r="6" fill="#d4af37" stroke="#0a0a0c" stroke-width="1" />

                <!-- Belt / Waist Guard -->
                <rect x="75" y="165" width="50" height="12" fill="#2a2a35" stroke="#d4af37" stroke-width="1.5" rx="2" />
                <rect x="94" y="163" width="12" height="16" fill="#d4af37" rx="1" />
              </g>

              <!-- LAYER 4: SHOULDERS & PAULDRONS -->
              <g id="pauldrons">
                <!-- Left Shoulder Pauldron -->
                <path d="M 55 90 C 55 75, 75 75, 78 95 Z" [attr.fill]="armorColors().shoulders" stroke="#d4af37" stroke-width="1.5" />
                <!-- Right Shoulder Pauldron -->
                <path d="M 145 90 C 145 75, 125 75, 122 95 Z" [attr.fill]="armorColors().shoulders" stroke="#d4af37" stroke-width="1.5" />
              </g>

              <!-- LAYER 5: ARMS & GAUNTLETS -->
              <g id="arms">
                <!-- Left Arm -->
                <rect x="58" y="98" width="14" height="60" rx="5" [attr.fill]="armorColors().gloves" stroke="#0a0a0c" stroke-width="1.5" transform="rotate(8 65 98)" />
                <!-- Right Arm -->
                <rect x="128" y="98" width="14" height="60" rx="5" [attr.fill]="armorColors().gloves" stroke="#0a0a0c" stroke-width="1.5" transform="rotate(-8 135 98)" />
              </g>

              <!-- LAYER 6: WEAPON IN HAND (Right Hand) -->
              <g id="weapon" transform="translate(140, 100) rotate(-25)">
                <!-- Weapon Aura Effect -->
                @if (weaponEnchantLevel() >= 4) {
                  <path 
                    d="M 2 -40 L 12 50 L -8 50 Z" 
                    [attr.fill]="getAuraColor(weaponEnchantLevel())" 
                    opacity="0.5" 
                    class="animate-pulse" />
                }

                <!-- Sword Blade / Staff / Bow -->
                @if (weaponType() === 'bow') {
                  <!-- Bow Curve -->
                  <path d="M -15 -40 Q 15 10 -15 60" fill="none" stroke="#8b7355" stroke-width="4" />
                  <line x1="-15" y1="-40" x2="-15" y2="60" stroke="#d4af37" stroke-width="1" />
                } @else if (weaponType() === 'staff') {
                  <!-- Magic Staff -->
                  <rect x="0" y="-50" width="6" height="120" fill="#4a3b2c" rx="2" />
                  <circle cx="3" cy="-55" r="10" fill="#38bdf8" stroke="#d4af37" stroke-width="2" />
                } @else {
                  <!-- Sword / Greatsword Blade -->
                  <path d="M 3 -50 L 8 20 L 5 40 L 1 40 L -2 20 Z" fill="#e2e8f0" stroke="#475569" stroke-width="1" />
                  <!-- Hilt & Crossguard -->
                  <rect x="-8" y="40" width="22" height="5" fill="#d4af37" rx="1" />
                  <rect x="1" y="45" width="4" height="18" fill="#1e293b" />
                  <circle cx="3" cy="65" r="4" fill="#d4af37" />
                }
              </g>

              <!-- LAYER 7: HEAD, FACE & RACE FEATURES -->
              <g id="head">
                <!-- Neck -->
                <rect x="92" y="75" width="16" height="20" [attr.fill]="raceSkinColor(char.race)" />

                <!-- Head Base -->
                <ellipse cx="100" cy="65" rx="18" ry="22" [attr.fill]="raceSkinColor(char.race)" stroke="#1a1a24" stroke-width="1" />

                <!-- Race Ears (Elven Pointed Ears) -->
                @if (char.race === 'elf' || char.race === 'dark_elf') {
                  <!-- Left Pointed Ear -->
                  <path d="M 83 62 Q 65 52 75 70 Z" [attr.fill]="raceSkinColor(char.race)" stroke="#1a1a24" stroke-width="1" />
                  <!-- Right Pointed Ear -->
                  <path d="M 117 62 Q 135 52 125 70 Z" [attr.fill]="raceSkinColor(char.race)" stroke="#1a1a24" stroke-width="1" />
                }

                <!-- Facial Features (Eyes, Eyebrows) -->
                <ellipse cx="93" cy="64" rx="2.5" ry="3.5" fill="#0f172a" />
                <ellipse cx="107" cy="64" rx="2.5" ry="3.5" fill="#0f172a" />
                <circle cx="94" cy="63" r="1" fill="#ffffff" />
                <circle cx="108" cy="63" r="1" fill="#ffffff" />

                <!-- Eyebrows -->
                <line x1="89" y1="58" x2="97" y2="59" stroke="#1e293b" stroke-width="1.5" />
                <line x1="103" y1="59" x2="111" y2="58" stroke="#1e293b" stroke-width="1.5" />

                <!-- Hair Style -->
                <path 
                  d="M 80 62 C 80 40, 120 40, 120 62 C 115 50, 85 50, 80 62 Z" 
                  [attr.fill]="char.hairColor || '#d4af37'" 
                  stroke="#0a0a0c" 
                  stroke-width="1" />

                <!-- Helmet Layer (If equipped & Helmet Toggle ON) -->
                @if (showHelmet() && equippedHelmet()) {
                  <g id="helmet">
                    <path d="M 78 68 C 75 35, 125 35, 122 68 L 118 76 L 82 76 Z" fill="#2a2a35" stroke="#d4af37" stroke-width="2" />
                    <rect x="85" y="60" width="30" height="4" fill="#0a0a0c" rx="1" />
                    <!-- Crown Gem / Plume -->
                    <path d="M 100 40 L 105 25 L 95 25 Z" fill="#ef4444" />
                  </g>
                }
              </g>

            </svg>

          </div>

          <!-- Bottom Action Buttons overlay on Stage -->
          <div class="z-20 w-full flex items-center justify-between gap-2 bg-black/80 backdrop-blur p-2 rounded-lg border border-[#3c3c4a]">
            <!-- Stance Selector -->
            <div class="flex items-center gap-1">
              <button 
                (click)="stance.set('idle')"
                class="px-2 py-1 rounded text-[10px] font-bold border cursor-pointer transition-colors"
                [ngClass]="stance() === 'idle' ? 'bg-[#8b7355] text-black border-[#d4af37]' : 'bg-[#1a1a24] text-slate-400 border-[#3c3c4a]'">
                Idle
              </button>
              <button 
                (click)="stance.set('combat')"
                class="px-2 py-1 rounded text-[10px] font-bold border cursor-pointer transition-colors"
                [ngClass]="stance() === 'combat' ? 'bg-[#8b7355] text-black border-[#d4af37]' : 'bg-[#1a1a24] text-slate-400 border-[#3c3c4a]'">
                Attack
              </button>
              <button 
                (click)="stance.set('cast')"
                class="px-2 py-1 rounded text-[10px] font-bold border cursor-pointer transition-colors"
                [ngClass]="stance() === 'cast' ? 'bg-[#8b7355] text-black border-[#d4af37]' : 'bg-[#1a1a24] text-slate-400 border-[#3c3c4a]'">
                Cast
              </button>
            </div>

            <!-- Helmet Toggle Button -->
            <button 
              (click)="showHelmet.set(!showHelmet())"
              class="px-2.5 py-1 rounded text-[10px] font-bold border border-[#3c3c4a] bg-[#1a1a24] text-[#d4af37] hover:border-[#8b7355] cursor-pointer">
              Helm: {{ showHelmet() ? 'ON' : 'OFF' }}
            </button>
          </div>

        </div>

        <!-- GEAR & POWER SUMMARY CARD -->
        <div class="bg-[#0a0a0c] border border-[#3c3c4a] rounded-xl p-3 space-y-2">
          <div class="flex items-center justify-between text-xs font-serif font-bold text-[#d4af37]">
            <span>⚔️ Active Gear Visuals</span>
            <span class="font-mono text-[11px] text-amber-300">Power Rating: {{ powerRating() | number }}</span>
          </div>

          <div class="grid grid-cols-2 gap-2 text-xs font-mono">
            <div class="bg-[#12121a] p-2 rounded-lg border border-[#2a2a35] flex items-center gap-2">
              <span class="text-lg">🗡️</span>
              <div class="truncate">
                <div class="text-[10px] text-[#8b7355] uppercase">Weapon</div>
                <div class="font-bold text-[#d4af37] truncate">
                  {{ equippedWeapon()?.name || 'Bare Fists' }}
                  @if (weaponEnchantLevel() > 0) {
                    <span class="text-cyan-400 ml-1">+{{ weaponEnchantLevel() }}</span>
                  }
                </div>
              </div>
            </div>

            <div class="bg-[#12121a] p-2 rounded-lg border border-[#2a2a35] flex items-center gap-2">
              <span class="text-lg">🛡️</span>
              <div class="truncate">
                <div class="text-[10px] text-[#8b7355] uppercase">Armor Set</div>
                <div class="font-bold text-[#d4af37] truncate">
                  {{ equippedChest()?.name || 'Trainee Vest' }}
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    }
  `
})
export class Character2dViewComponent {
  state = inject(GameStateService);

  bgStage = signal<string>('giran');
  stance = signal<'idle' | 'combat' | 'cast'>('idle');
  showHelmet = signal<boolean>(true);

  equippedWeapon = computed(() => this.state.equipped().weapon || null);
  equippedChest = computed(() => this.state.equipped().chest || null);
  equippedShield = computed(() => this.state.equipped().shield || null);
  equippedHelmet = computed(() => this.state.equipped().helmet || null);

  weaponEnchantLevel = computed(() => this.equippedWeapon()?.enchantLevel || 0);

  powerRating = computed(() => {
    const s = this.state.computedStats();
    return s.pAtk + s.pDef + s.mAtk + s.mDef;
  });

  weaponType(): string {
    const w = this.equippedWeapon();
    if (!w) return 'sword';
    const name = w.name.toLowerCase();
    if (name.includes('bow')) return 'bow';
    if (name.includes('staff') || name.includes('wand')) return 'staff';
    return 'sword';
  }

  raceSkinColor(race: RaceType): string {
    switch (race) {
      case 'human': return '#f8fafc';
      case 'elf': return '#fef3c7';
      case 'dark_elf': return '#a5b4fc';
      case 'orc': return '#86efac';
      case 'dwarf': return '#fed7aa';
      default: return '#f8fafc';
    }
  }

  armorColors() {
    const chest = this.equippedChest();
    if (!chest) {
      return { chest: '#334155', pants: '#1e293b', gloves: '#0f172a', boots: '#0f172a', shoulders: '#475569' };
    }
    const grade = chest.grade;
    if (grade === 'S') {
      return { chest: '#b45309', pants: '#78350f', gloves: '#d4af37', boots: '#d4af37', shoulders: '#d4af37' };
    } else if (grade === 'A') {
      return { chest: '#581c87', pants: '#3b0764', gloves: '#c084fc', boots: '#c084fc', shoulders: '#a855f7' };
    } else if (grade === 'B') {
      return { chest: '#1e3a8a', pants: '#172554', gloves: '#60a5fa', boots: '#60a5fa', shoulders: '#3b82f6' };
    }
    return { chest: '#334155', pants: '#1e293b', gloves: '#0f172a', boots: '#0f172a', shoulders: '#475569' };
  }

  getBgStageClass(stage: string): string {
    switch (stage) {
      case 'aden': return 'bg-gradient-to-b from-amber-950/80 via-[#12121a] to-[#0a0a0c]';
      case 'elven': return 'bg-gradient-to-b from-emerald-950/80 via-[#12121a] to-[#0a0a0c]';
      case 'dragon': return 'bg-gradient-to-b from-red-950/80 via-[#12121a] to-[#0a0a0c]';
      default: return 'bg-gradient-to-b from-slate-900 via-[#12121a] to-[#0a0a0c]';
    }
  }

  getStanceTransformClass(stance: string): string {
    switch (stance) {
      case 'combat': return 'scale-105 -rotate-2 transition-all duration-300';
      case 'cast': return 'scale-110 translate-y-[-6px] transition-all duration-300';
      default: return 'animate-pulse';
    }
  }

  getEnchantTitle(enchant: number): string {
    if (enchant >= 10) return '+10 Legendary Divine Glow';
    if (enchant >= 7) return '+7 Majestic Arcane Spark';
    if (enchant >= 4) return '+4 Radiant Soulshot Aura';
    return '';
  }

  getAuraColor(enchant: number): string {
    if (enchant >= 10) return '#f59e0b';
    if (enchant >= 7) return '#a855f7';
    return '#22d3ee';
  }
}
