import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameStateService } from '../../services/game-state.service';

@Component({
  selector: 'app-combat',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (state.activeMob(); as mob) {
      <div class="p-3 sm:p-4 max-w-md mx-auto space-y-3.5 pb-20 select-none">
        
        <!-- Header Location & Auto Battle Toggle -->
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <button 
              (click)="state.executePlayerAction('flee')"
              class="w-8 h-8 rounded-lg bg-[#1a1a24] border border-[#3c3c4a] text-slate-300 flex items-center justify-center text-xs hover:border-[#8b7355] hover:text-[#d4af37] transition-colors cursor-pointer shadow">
              <span>👈</span>
            </button>
            <span class="text-xs font-serif font-bold text-[#d4af37] uppercase tracking-wider">
              {{ state.selectedSpot()?.name || 'Hunting Grounds' }}
            </span>
          </div>

          <!-- Auto Farm Toggle Button -->
          <button 
            (click)="toggleAutoBattle()"
            class="px-3 py-1.5 rounded-lg text-xs font-bold border transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer"
            [ngClass]="state.autoBattle() 
              ? 'bg-[#8b7355] border-[#d4af37] text-black font-bold shadow-[0_0_10px_rgba(212,175,55,0.4)] animate-pulse' 
              : 'bg-[#12121a] border-[#3c3c4a] text-[#8b7355] hover:border-[#8b7355]'">
            <span>🔄</span>
            <span>AUTO HUNT {{ state.autoBattle() ? 'ON' : 'OFF' }}</span>
          </button>
        </div>

        <!-- MONSTER CARD -->
        <div class="bg-gradient-to-b from-[#1a1a24] via-[#12121a] to-[#0a0a0c] border-2 border-[#8b7355] rounded-xl p-4 shadow-2xl relative overflow-hidden text-center space-y-3">
          
          <div class="flex items-center justify-between text-xs">
            <span class="bg-red-950/80 text-red-400 border border-red-800 px-2 py-0.5 rounded font-mono font-bold text-[10px]">
              Lvl {{ mob.level }} {{ mob.isBoss ? 'GRAND RAID BOSS' : 'MOB' }}
            </span>
            <span class="text-slate-400 font-mono text-[11px]">
              {{ state.mobCurrentHp() }} / {{ mob.maxHp }} HP
            </span>
          </div>

          <!-- Monster Avatar Sprite -->
          <div class="relative py-2 flex items-center justify-center">
            <div class="w-24 h-24 rounded-full bg-[#0a0a0c] border-2 border-[#8b7355] flex items-center justify-center text-6xl shadow-[0_0_15px_rgba(139,115,85,0.3)] relative transform transition-transform"
                 [ngClass]="{'scale-105 border-[#d4af37]': !state.isPlayerTurn()}">
              <span>{{ mob.avatarUrl }}</span>
              <div class="absolute inset-0 bg-gradient-to-t from-[#8b7355]/20 via-transparent to-transparent"></div>
            </div>
          </div>

          <!-- Monster Name & Health Bar -->
          <div>
            <h3 class="font-serif font-bold text-sm text-[#d4af37] uppercase tracking-wider">{{ mob.name }}</h3>
            <div class="w-full h-3 bg-[#0a0a0c] rounded-full overflow-hidden border border-[#3c3c4a] mt-1.5 relative p-0.5 shadow-inner">
              <div class="h-full bg-gradient-to-r from-red-900 via-red-600 to-amber-500 rounded-full transition-all duration-300 shadow-[0_0_8px_rgba(220,38,38,0.5)]"
                   [style.width.%]="(state.mobCurrentHp() / mob.maxHp) * 100"></div>
            </div>
          </div>

        </div>

        <!-- LIVE COMBAT LOG FEED -->
        <div class="bg-[#0a0a0c] border border-[#2a2a35] rounded-xl p-3 h-32 overflow-y-auto space-y-1.5 font-mono text-xs shadow-inner">
          @for (log of state.combatLog(); track log.id) {
            <div class="flex items-start gap-1.5 leading-snug"
                 [ngClass]="{
                   'text-[#d4af37] font-bold': log.isCritical,
                   'text-cyan-300': log.isSoulshot,
                   'text-emerald-400': log.isHeal,
                   'text-rose-400': log.actor === 'mob'
                 }">
              <span class="text-[10px] text-[#8b7355] shrink-0">
                {{ log.actor === 'player' ? '⚔️' : '👹' }}
              </span>
              <span>{{ log.text }}</span>
            </div>
          }
        </div>

        <!-- PLAYER COMBAT ACTION CONTROLS -->
        <div class="bg-[#12121a]/90 border border-[#2a2a35] rounded-xl p-3 shadow-2xl space-y-2.5">
          
          <!-- Turn Indicator -->
          <div class="flex items-center justify-between text-xs px-1 font-bold">
            <span class="text-[#d4af37] font-serif flex items-center gap-1">
              <span>⚡</span>
              <span>{{ state.isPlayerTurn() ? 'Your Turn to Strike!' : mob.name + ' is attacking...' }}</span>
            </span>
            <span class="text-[11px] text-slate-400 font-mono">
              MP: {{ state.character()?.mp }} / {{ stats().maxMp }}
            </span>
          </div>

          <!-- Primary Attack & Soulshot Controls -->
          <div class="grid grid-cols-2 gap-2">
            <!-- Normal Attack -->
            <button 
              (click)="state.executePlayerAction('attack')"
              [disabled]="!state.isPlayerTurn()"
              class="py-3 px-4 rounded-xl bg-gradient-to-r from-red-950 via-red-900 to-red-800 text-white font-serif font-bold text-xs uppercase tracking-wider border border-red-700 shadow-[0_0_10px_rgba(220,38,38,0.3)] hover:from-red-900 hover:to-red-700 active:scale-95 transition-all disabled:opacity-40 cursor-pointer flex items-center justify-center gap-1.5">
              <span>🗡️</span>
              <span>Attack</span>
            </button>

            <!-- Soulshot Toggle -->
            <button 
              (click)="state.toggleSoulshots()"
              class="py-3 px-4 rounded-xl border text-xs font-bold transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
              [ngClass]="state.character()?.soulshotsActive && (state.character()?.soulshotCount || 0) > 0 
                ? 'bg-blue-950 border-cyan-400 text-cyan-200 shadow-[0_0_10px_rgba(34,211,238,0.3)] animate-pulse' 
                : 'bg-[#1a1a24] border-[#3c3c4a] text-slate-400 hover:border-[#8b7355]'">
              <span>⚡</span>
              <span>SS {{ state.character()?.soulshotsActive ? 'ACTIVE' : 'OFF' }}</span>
            </button>
          </div>

          <!-- Class Active Skills Grid -->
          <div>
            <div class="text-[10px] font-serif font-bold text-[#8b7355] uppercase tracking-wider mb-1 px-1">Class Skills</div>
            <div class="grid grid-cols-2 gap-1.5">
              @for (sk of state.learnedSkills(); track sk.id) {
                <button 
                  (click)="state.executePlayerAction('skill', sk)"
                  [disabled]="!state.isPlayerTurn() || (state.character()?.mp || 0) < sk.mpCost"
                  class="p-2 rounded-lg bg-[#0a0a0c] border border-[#3c3c4a] hover:border-[#d4af37] text-left transition-all active:scale-95 disabled:opacity-40 cursor-pointer flex items-center justify-between">
                  <div class="flex items-center gap-1.5 overflow-hidden">
                    <span class="text-sm">✨</span>
                    <div class="truncate">
                      <div class="font-bold text-xs text-[#d4af37] truncate">{{ sk.name }}</div>
                      <div class="text-[9px] text-cyan-400 font-mono">{{ sk.mpCost }} MP</div>
                    </div>
                  </div>
                </button>
              }
            </div>
          </div>

          <!-- Quick Potions & Flee -->
          <div class="grid grid-cols-3 gap-1.5 pt-1.5 border-t border-[#2a2a35] text-xs font-bold">
            <button 
              (click)="state.executePlayerAction('potion')"
              class="py-2 bg-[#0a0a0c] border border-red-900 text-rose-300 hover:border-red-600 rounded-lg flex items-center justify-center gap-1 active:scale-95 cursor-pointer">
              <span>🧪</span>
              <span>HP ({{ state.character()?.hpPotions }})</span>
            </button>

            <button 
              (click)="state.executePlayerAction('flee')"
              class="col-span-2 py-2 bg-[#0a0a0c] border border-[#3c3c4a] text-slate-300 hover:border-[#8b7355] rounded-lg flex items-center justify-center gap-1 active:scale-95 cursor-pointer font-serif">
              <span>🏃</span>
              <span>Retreat to Town</span>
            </button>
          </div>

        </div>

      </div>
    } @else {
      <!-- Empty Battle Screen fallback -->
      <div class="p-8 max-w-md mx-auto text-center space-y-4">
        <div class="text-4xl">🗺️</div>
        <h3 class="font-serif font-bold text-[#d4af37] text-sm uppercase">No Active Mob Encounter</h3>
        <p class="text-xs text-slate-400">Select a hunting ground on the World Map to begin turn-based combat!</p>
        <button 
          (click)="state.activeTab.set('world')"
          class="px-4 py-2 bg-[#8b7355] text-black font-bold text-xs rounded-lg hover:bg-[#d4af37] shadow-[0_0_10px_rgba(212,175,55,0.3)] transition-all cursor-pointer">
          Open World Map
        </button>
      </div>
    }
  `
})
export class CombatComponent {
  state = inject(GameStateService);
  stats = this.state.computedStats;

  toggleAutoBattle() {
    this.state.autoBattle.update(v => !v);
  }
}
