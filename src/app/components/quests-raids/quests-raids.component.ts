import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameStateService } from '../../services/game-state.service';
import { TOWNS } from '../../data/game-data';

@Component({
  selector: 'app-quests-raids',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="p-3 sm:p-4 max-w-md mx-auto space-y-4 pb-20 select-none">
      
      <!-- Top Toggle -->
      <div class="flex bg-[#0a0a0c] border border-[#3c3c4a] p-1 rounded-xl text-xs font-bold">
        <button 
          (click)="mainTab.set('quests')"
          class="flex-1 py-1.5 rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          [ngClass]="mainTab() === 'quests' ? 'bg-[#8b7355] text-black border border-[#d4af37] font-bold shadow-[0_0_8px_rgba(212,175,55,0.3)]' : 'text-[#8b7355] hover:text-[#d4af37]'">
          <span>📜</span>
          <span>Bounty Quests</span>
        </button>
        <button 
          (click)="mainTab.set('raids')"
          class="flex-1 py-1.5 rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          [ngClass]="mainTab() === 'raids' ? 'bg-[#8b7355] text-black border border-[#d4af37] font-bold shadow-[0_0_8px_rgba(212,175,55,0.3)]' : 'text-[#8b7355] hover:text-[#d4af37]'">
          <span>🐉</span>
          <span>Grand Raids</span>
        </button>
      </div>

      <!-- SECTION 1: BOUNTY QUESTS -->
      @if (mainTab() === 'quests') {
        <div class="space-y-3">
          
          <div class="flex justify-between items-center text-xs">
            <span class="font-serif font-bold text-[#d4af37] uppercase tracking-wider">Active Bounties</span>
            <span class="text-slate-400 font-mono">{{ completedCount() }} / {{ state.quests().length }} Complete</span>
          </div>

          @for (q of state.quests(); track q.id) {
            <div class="bg-[#12121a]/90 border border-[#2a2a35] hover:border-[#8b7355] rounded-xl p-4 shadow-xl space-y-3 transition-colors">
              
              <div class="flex items-start justify-between">
                <div>
                  <h3 class="font-serif font-bold text-sm text-[#d4af37] uppercase tracking-wider">{{ q.title }}</h3>
                  <p class="text-xs text-slate-300 mt-0.5">{{ q.description }}</p>
                </div>
                <span class="text-[10px] bg-[#0a0a0c] text-[#8b7355] font-mono px-2 py-0.5 rounded border border-[#3c3c4a]">
                  Lvl {{ q.requiredLevel }}+
                </span>
              </div>

              <!-- Progress Bar -->
              <div class="space-y-1">
                <div class="flex justify-between text-[11px] font-mono">
                  <span class="text-slate-400">Target: {{ q.targetMobName }}</span>
                  <span class="font-bold text-[#d4af37]">{{ q.currentAmount }} / {{ q.targetAmount }}</span>
                </div>

                <div class="w-full h-2.5 bg-[#0a0a0c] rounded-full overflow-hidden border border-[#3c3c4a] p-0.5">
                  <div class="h-full bg-gradient-to-r from-[#8b7355] to-[#d4af37] rounded-full transition-all duration-300 shadow-[0_0_8px_rgba(212,175,55,0.4)]"
                       [style.width.%]="(q.currentAmount / q.targetAmount) * 100"></div>
                </div>
              </div>

              <!-- Rewards & Claim -->
              <div class="flex items-center justify-between pt-2 border-t border-[#2a2a35] text-xs">
                <div class="flex items-center gap-2 font-mono text-[11px] text-[#d4af37]">
                  <span>🪙 {{ q.rewardAdena | number }}</span>
                  <span>✨ +{{ q.rewardExp }} EXP</span>
                </div>

                @if (q.claimed) {
                  <span class="text-emerald-400 font-bold bg-emerald-950/60 px-2.5 py-1 rounded border border-emerald-600 text-[10px]">
                    CLAIMED
                  </span>
                } @else if (q.completed) {
                  <button 
                    (click)="state.claimQuestReward(q.id)"
                    class="px-3.5 py-1.5 rounded-lg bg-[#8b7355] text-black font-bold hover:bg-[#d4af37] active:scale-95 shadow-[0_0_8px_rgba(212,175,55,0.3)] transition-colors cursor-pointer">
                    Claim Reward
                  </button>
                } @else {
                  <span class="text-slate-500 font-bold text-[10px]">IN PROGRESS</span>
                }
              </div>

            </div>
          }

        </div>
      }

      <!-- SECTION 2: GRAND RAIDS -->
      @if (mainTab() === 'raids') {
        <div class="bg-[#12121a]/90 border-2 border-red-900/60 rounded-xl p-4 shadow-2xl space-y-4">
          
          <div class="text-center space-y-1">
            <span class="text-4xl">🐉</span>
            <h3 class="text-sm font-serif font-bold text-red-400 uppercase tracking-widest">Grand Dragon Raid: Antharas</h3>
            <p class="text-xs text-slate-300">Assemble your equipment and challenge the legendary Earth Dragon!</p>
          </div>

          <div class="bg-[#0a0a0c] p-3 rounded-lg border border-[#3c3c4a] space-y-2 text-xs font-mono">
            <div class="flex justify-between"><span class="text-slate-400">Raid Boss:</span><span class="text-red-400 font-bold">Earth Dragon Antharas</span></div>
            <div class="flex justify-between"><span class="text-slate-400">Boss Level:</span><span class="text-[#d4af37] font-bold">Level 67 (Max)</span></div>
            <div class="flex justify-between"><span class="text-slate-400">Boss Health:</span><span class="text-red-500 font-bold">35,000 HP</span></div>
            <div class="flex justify-between"><span class="text-slate-400">A-Grade Drops:</span><span class="text-purple-300 font-bold">Dragon Slayer, Angel Slayer, Imperial Armor</span></div>
          </div>

          <button 
            (click)="startAntharasRaid()"
            class="w-full py-3.5 bg-gradient-to-r from-red-950 via-red-900 to-red-800 text-white font-serif font-bold text-xs uppercase tracking-wider rounded-lg border border-red-700 shadow-[0_0_15px_rgba(220,38,38,0.4)] hover:from-red-900 hover:to-red-700 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer">
            <span>⚔️</span>
            <span>CHALLENGE ANTHARAS GRAND RAID</span>
          </button>

        </div>
      }

    </div>
  `
})
export class QuestsRaidsComponent {
  state = inject(GameStateService);

  mainTab = signal<'quests' | 'raids'>('quests');

  completedCount() {
    return this.state.quests().filter(q => q.completed).length;
  }

  startAntharasRaid() {
    const adenTown = TOWNS.find(t => t.id === 'aden');
    const antharasSpot = adenTown?.huntingSpots.find(s => s.id === 'antharas_lair');
    if (antharasSpot) {
      this.state.selectHuntingSpot(antharasSpot);
    }
  }
}
