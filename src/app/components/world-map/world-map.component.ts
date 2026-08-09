import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameStateService } from '../../services/game-state.service';
import { TOWNS } from '../../data/game-data';

@Component({
  selector: 'app-world-map',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="p-3 sm:p-4 max-w-md mx-auto space-y-4 pb-20 select-none">
      
      <!-- Current Location Banner -->
      <div class="bg-[#12121a]/90 border border-[#8b7355]/40 rounded-xl p-4 shadow-[0_0_15px_rgba(139,115,85,0.15)] flex items-center justify-between">
        <div>
          <div class="text-[10px] uppercase font-bold tracking-widest text-[#8b7355]">Current Realm</div>
          <h2 class="text-base font-serif font-bold text-[#d4af37] flex items-center gap-2 mt-0.5 uppercase tracking-wider">
            <span>🏰</span>
            <span>{{ state.currentTown().name }}</span>
          </h2>
          <p class="text-xs text-slate-400 mt-1 italic">{{ state.currentTown().description }}</p>
        </div>
        <div class="px-2.5 py-1 bg-[#8b7355]/20 border border-[#8b7355] rounded text-[10px] font-bold text-[#d4af37] tracking-wider uppercase">
          Kingdom
        </div>
      </div>

      <!-- Town Selection Grid -->
      <div class="space-y-2">
        <span class="block text-xs font-serif font-bold text-[#8b7355] uppercase tracking-widest px-1">Aden Kingdom Towns</span>
        
        <div class="grid grid-cols-2 gap-2.5">
          @for (town of towns; track town.id) {
            <button 
              (click)="selectTown(town.id)"
              class="p-3 rounded-xl border text-left transition-all active:scale-95 flex flex-col justify-between space-y-2 relative overflow-hidden group cursor-pointer"
              [ngClass]="state.currentTownId() === town.id 
                ? 'bg-[#1a1a24] border-2 border-[#d4af37] text-amber-200 shadow-[0_0_12px_rgba(212,175,55,0.25)]' 
                : 'bg-[#12121a]/80 border border-[#2a2a35] text-slate-400 hover:border-[#8b7355]'">
              
              <div class="flex items-center justify-between">
                <span class="text-2xl group-hover:scale-110 transition-transform">{{ getTownIcon(town.id) }}</span>
                <span class="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#0a0a0c] border border-[#3c3c4a] text-[#d4af37]">
                  {{ town.region }}
                </span>
              </div>

              <div>
                <div class="font-serif font-bold text-xs text-[#d4af37] group-hover:text-amber-200">{{ town.name }}</div>
                <div class="text-[10px] text-slate-400 font-mono mt-0.5">{{ town.huntingSpots.length }} Hunting Zones</div>
              </div>

              @if (state.currentTownId() === town.id) {
                <div class="absolute top-2 right-2 w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_6px_#22c55e]"></div>
              }
            </button>
          }
        </div>
      </div>

      <!-- Hunting Spots in Active Town -->
      <div class="space-y-2.5">
        <div class="text-[#8b7355] text-xs font-serif font-bold uppercase tracking-widest flex items-center gap-2">
          <div class="h-px flex-1 bg-[#2a2a35]"></div>
          <span>Hunting Grounds</span>
          <div class="h-px flex-1 bg-[#2a2a35]"></div>
        </div>

        <div class="space-y-2.5">
          @for (spot of state.currentTown().huntingSpots; track spot.id) {
            <button 
              type="button"
              (click)="state.selectHuntingSpot(spot)"
              [aria-label]="'Travel to ' + spot.name"
              class="w-full text-left bg-gradient-to-br from-[#1a1a24] to-[#0a0a0c] border border-[#3c3c4a] hover:border-[#d4af37] rounded-xl p-3.5 shadow-xl transition-all active:scale-95 cursor-pointer flex items-center justify-between gap-3 group focus:outline-none focus:ring-2 focus:ring-[#d4af37]">
              
              <div class="flex items-center gap-3">
                <div class="w-12 h-12 rounded-lg bg-[#0a0a0c] border border-[#8b7355]/40 flex items-center justify-center text-2xl shadow-inner shrink-0 group-hover:border-[#d4af37] group-hover:scale-105 transition-all">
                  <span>⚔️</span>
                </div>

                <div>
                  <div class="font-serif font-bold text-xs text-white group-hover:text-[#d4af37] flex items-center gap-2">
                    <span>{{ spot.name }}</span>
                    @if (spot.isSpecialZone) {
                      <span class="bg-red-950/80 text-red-400 font-mono text-[9px] px-1.5 py-0.5 rounded border border-red-800">
                        RAID / SPECIAL
                      </span>
                    }
                  </div>
                  <p class="text-[11px] text-slate-400 leading-snug italic mt-0.5 line-clamp-1">{{ spot.description }}</p>
                  
                  <div class="flex items-center gap-2 mt-1.5 font-mono text-[10px]">
                    <span class="text-[#d4af37] font-bold">Lvl {{ spot.recommendedLevel }}</span>
                    <span class="text-slate-600">&bull;</span>
                    <span class="text-slate-400">{{ spot.mobs.length }} Monster Types</span>
                  </div>
                </div>
              </div>

              <div class="text-[#8b7355] text-lg group-hover:text-[#d4af37] group-hover:translate-x-1 transition-transform pr-1">
                ➔
              </div>

            </button>
          }
        </div>

      </div>

    </div>
  `
})
export class WorldMapComponent {
  state = inject(GameStateService);
  towns = TOWNS;

  selectedTownTab = signal<string>('talking_island');

  getTownIcon(id: string): string {
    switch (id) {
      case 'talking_island': return '🏝️';
      case 'giran': return '🏰';
      case 'aden': return '🏛️';
      case 'oren': return '🏔️';
      default: return '🏰';
    }
  }

  selectTown(townId: string) {
    this.selectedTownTab.set(townId);
    this.state.travelToTown(townId);
  }
}
