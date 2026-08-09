import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameStateService } from '../../services/game-state.service';

@Component({
  selector: 'app-hud-header',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (state.character(); as char) {
      <header class="bg-gradient-to-b from-[#1a1a24] to-[#0a0a0c] border-b border-[#3c3c4a] p-2.5 sm:p-3 text-slate-100 select-none backdrop-blur-md shadow-2xl">
        <div class="max-w-md mx-auto flex items-center justify-between gap-2.5">
          
          <!-- Character Portrait & Level Badge -->
          <button 
            type="button"
            (click)="state.activeTab.set('hero')"
            aria-label="Open Hero Character Sheet"
            class="flex items-center gap-2.5 text-left cursor-pointer group focus:outline-none focus:ring-2 focus:ring-[#d4af37] rounded-xl p-0.5">
            <div class="relative w-11 h-11 bg-[#15151e] border-2 border-[#8b7355] rounded-lg shadow-[0_0_10px_rgba(139,115,85,0.3)] flex items-center justify-center overflow-hidden group-hover:border-[#d4af37] transition-colors">
              <span class="text-xl">{{ getRaceEmoji(char.race) }}</span>
              <div class="absolute inset-0 bg-[#8b7355]/10"></div>
              <span class="absolute -bottom-0.5 -right-0.5 bg-[#8b7355] text-black font-bold text-[9px] px-1 rounded shadow">
                LV {{ char.level }}
              </span>
            </div>

            <div>
              <div class="font-serif font-bold text-xs text-[#d4af37] uppercase tracking-wider leading-tight group-hover:text-amber-200">{{ char.name }}</div>
              <div class="text-[10px] text-[#8b7355] font-mono">{{ char.className }}</div>
            </div>
          </button>

          <!-- Status Vitals Bars (HP, MP, CP, EXP) -->
          <div class="flex-1 max-w-[160px] space-y-1 text-[9px] font-mono">
            
            <!-- CP Bar (Combat Protection) -->
            <div class="space-y-0.5">
              <div class="flex justify-between text-[#d4af37] leading-none text-[8px] font-bold">
                <span>CP</span>
                <span>{{ char.cp }}/{{ stats().maxCp }}</span>
              </div>
              <div class="w-full h-1.5 bg-[#1a1a1a] rounded-full overflow-hidden border border-[#333]">
                <div class="h-full bg-gradient-to-r from-amber-700 to-amber-500 shadow-[0_0_5px_rgba(245,158,11,0.5)] transition-all duration-300" 
                     [style.width.%]="(char.cp / stats().maxCp) * 100"></div>
              </div>
            </div>

            <!-- HP Bar -->
            <div class="space-y-0.5">
              <div class="flex justify-between text-red-400 leading-none text-[8px] font-bold">
                <span>HP</span>
                <span>{{ char.hp }}/{{ stats().maxHp }}</span>
              </div>
              <div class="w-full h-1.5 bg-[#1a1a1a] rounded-full overflow-hidden border border-[#333]">
                <div class="h-full bg-gradient-to-r from-red-900 to-red-600 shadow-[0_0_5px_rgba(220,38,38,0.5)] transition-all duration-300" 
                     [style.width.%]="(char.hp / stats().maxHp) * 100"></div>
              </div>
            </div>

            <!-- MP Bar -->
            <div class="space-y-0.5">
              <div class="flex justify-between text-blue-400 leading-none text-[8px] font-bold">
                <span>MP</span>
                <span>{{ char.mp }}/{{ stats().maxMp }}</span>
              </div>
              <div class="w-full h-1.5 bg-[#1a1a1a] rounded-full overflow-hidden border border-[#333]">
                <div class="h-full bg-gradient-to-r from-blue-900 to-blue-600 shadow-[0_0_5px_rgba(37,99,235,0.5)] transition-all duration-300" 
                     [style.width.%]="(char.mp / stats().maxMp) * 100"></div>
              </div>
            </div>

            <!-- EXP Bar -->
            <div class="space-y-0.5">
              <div class="flex justify-between text-emerald-400 leading-none text-[8px] font-bold">
                <span>EXP</span>
                <span>{{ (char.exp / char.maxExp * 100) | number:'1.0-1' }}%</span>
              </div>
              <div class="w-full h-1 bg-[#1a1a1a] rounded-full overflow-hidden border border-[#333]">
                <div class="h-full bg-gradient-to-r from-emerald-800 to-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.5)] transition-all duration-300" 
                     [style.width.%]="(char.exp / char.maxExp) * 100"></div>
              </div>
            </div>

          </div>

          <!-- Currency Overview & Character Switch Button -->
          <div class="text-right font-mono space-y-1">
            <div class="text-[#d4af37] text-xs font-bold flex items-center justify-end gap-1">
              <span>🪙</span>
              <span>{{ char.adena | number }}</span>
            </div>
            <button 
              type="button"
              (click)="state.character.set(null)"
              title="Switch Character / Hero Select"
              class="inline-flex items-center gap-1 bg-[#1a1a24] border border-[#3c3c4a] hover:border-[#d4af37] text-[9px] font-bold text-[#8b7355] hover:text-[#d4af37] px-2 py-0.5 rounded-md transition-colors cursor-pointer">
              <span>👥</span>
              <span>Switch</span>
            </button>
          </div>

        </div>
      </header>
    }
  `
})
export class HudHeaderComponent {
  state = inject(GameStateService);
  stats = this.state.computedStats;

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
}
