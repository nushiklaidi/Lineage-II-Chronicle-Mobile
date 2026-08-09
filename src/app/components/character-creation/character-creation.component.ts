import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GameStateService } from '../../services/game-state.service';
import { AuthService } from '../../services/auth.service';
import { RACE_INFO } from '../../data/game-data';
import { RaceType } from '../../models/game.models';

@Component({
  selector: 'app-character-creation',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between p-4 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-950/30 via-slate-950 to-black relative">
      
      <!-- Top Title & Back Button -->
      <div class="text-center mt-2 relative">
        @if (auth.userCharacters().length > 0) {
          <button 
            (click)="auth.isCreatingNewChar.set(false)"
            class="absolute left-0 top-0 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs font-bold text-amber-400 hover:border-amber-400 cursor-pointer flex items-center gap-1">
            <span>←</span>
            <span>Back</span>
          </button>
        }
        <h1 class="text-3xl font-black bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500 bg-clip-text text-transparent tracking-widest uppercase drop-shadow-md">
          Lineage II
        </h1>
        <p class="text-xs text-amber-500/80 font-medium tracking-wider uppercase mt-1">Chronicle Mobile RPG</p>
      </div>

      <!-- Main Creation Box -->
      <div class="max-w-md mx-auto w-full space-y-4 my-auto bg-slate-900/80 border border-amber-500/30 p-4 sm:p-6 rounded-2xl backdrop-blur shadow-2xl">
        
        <!-- Step 1: Race Selection -->
        <div>
          <span class="block text-xs font-bold text-amber-400 uppercase tracking-wider mb-2">Select Race</span>
          <div class="grid grid-cols-5 gap-1.5">
            @for (rKey of races; track rKey) {
              <button 
                (click)="selectedRace.set(rKey)"
                class="flex flex-col items-center justify-center p-2 rounded-xl border transition-all active:scale-95 cursor-pointer"
                [ngClass]="selectedRace() === rKey 
                  ? 'bg-amber-500/20 border-amber-400 text-amber-200 shadow-lg shadow-amber-500/20 ring-1 ring-amber-400' 
                  : 'bg-slate-800/80 border-slate-700/80 text-slate-400 hover:border-slate-500'">
                <span class="text-xl">{{ getRaceEmoji(rKey) }}</span>
                <span class="text-[10px] font-bold mt-1 capitalize">{{ rKey.replace('_', ' ') }}</span>
              </button>
            }
          </div>
          
          <!-- Selected Race Traits -->
          <div class="mt-2.5 p-2.5 bg-slate-950/70 border border-slate-800 rounded-xl text-xs space-y-1">
            <div class="flex justify-between font-bold text-amber-300">
              <span>{{ raceData().name }} Specialization</span>
              <span class="text-slate-400 font-normal text-[11px]">{{ raceData().bonus }}</span>
            </div>
            <!-- Base Stats Grid -->
            <div class="grid grid-cols-6 gap-1 text-[10px] text-center pt-1 font-mono text-slate-300">
              <div class="bg-slate-900 p-1 rounded border border-slate-800"><span class="text-red-400">STR</span> {{ raceData().stats.str }}</div>
              <div class="bg-slate-900 p-1 rounded border border-slate-800"><span class="text-yellow-400">DEX</span> {{ raceData().stats.dex }}</div>
              <div class="bg-slate-900 p-1 rounded border border-slate-800"><span class="text-green-400">CON</span> {{ raceData().stats.con }}</div>
              <div class="bg-slate-900 p-1 rounded border border-slate-800"><span class="text-purple-400">INT</span> {{ raceData().stats.int }}</div>
              <div class="bg-slate-900 p-1 rounded border border-slate-800"><span class="text-cyan-400">WIT</span> {{ raceData().stats.wit }}</div>
              <div class="bg-slate-900 p-1 rounded border border-slate-800"><span class="text-blue-400">MEN</span> {{ raceData().stats.men }}</div>
            </div>
          </div>
        </div>

        <!-- Step 2: Class Category (Fighter vs Mage) -->
        <div>
          <span class="block text-xs font-bold text-amber-400 uppercase tracking-wider mb-2">Class Archetype</span>
          <div class="grid grid-cols-2 gap-2">
            <button 
              (click)="isMage.set(false)"
              class="flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-bold transition-all active:scale-95 cursor-pointer"
              [ngClass]="!isMage() ? 'bg-amber-500/20 border-amber-400 text-amber-200' : 'bg-slate-800 border-slate-700 text-slate-400'">
              <span class="text-lg">🗡️</span>
              <span>Fighter</span>
            </button>
            <button 
              (click)="isMage.set(true)"
              class="flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-bold transition-all active:scale-95 cursor-pointer"
              [ngClass]="isMage() ? 'bg-amber-500/20 border-amber-400 text-amber-200' : 'bg-slate-800 border-slate-700 text-slate-400'">
              <span class="text-lg">✨</span>
              <span>Mystic (Mage)</span>
            </button>
          </div>
        </div>

        <!-- Step 3: Character Customization & Name -->
        <div class="space-y-3">
          <div>
            <label for="charNameInput" class="block text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">Character Name</label>
            <input 
              id="charNameInput"
              type="text" 
              [(ngModel)]="charName"
              placeholder="Enter character name..."
              maxLength="16"
              class="w-full bg-slate-950 border border-slate-700 focus:border-amber-500 rounded-xl px-3 py-2 text-sm text-amber-100 placeholder-slate-600 outline-none transition-colors" />
          </div>

          <!-- Face & Hair Selection -->
          <div class="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span class="block text-slate-400 mb-1">Face Style</span>
              <div class="flex gap-1">
                @for (idx of [1,2,3,4]; track idx) {
                  <button 
                    (click)="selectedFace.set(idx)"
                    class="flex-1 py-1 rounded border text-center font-bold cursor-pointer"
                    [ngClass]="selectedFace() === idx ? 'bg-amber-500/30 border-amber-400 text-amber-200' : 'bg-slate-800 border-slate-700 text-slate-400'">
                    #{{ idx }}
                  </button>
                }
              </div>
            </div>

            <div>
              <span class="block text-slate-400 mb-1">Hair Color</span>
              <div class="flex gap-1.5 items-center pt-0.5">
                @for (c of ['#e2e8f0', '#fbbf24', '#b45309', '#0284c7', '#7e22ce']; track c) {
                  <button 
                    (click)="selectedHairColor.set(c)"
                    [aria-label]="'Hair color ' + c"
                    class="w-6 h-6 rounded-full border-2 transition-transform active:scale-90 cursor-pointer"
                    [style.background-color]="c"
                    [ngClass]="selectedHairColor() === c ? 'border-amber-400 scale-110 shadow-md' : 'border-transparent opacity-70'">
                  </button>
                }
              </div>
            </div>
          </div>
        </div>

        <!-- Submit Button -->
        <button 
          (click)="confirmCreation()"
          [disabled]="!charName.trim()"
          class="w-full bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 text-slate-950 font-black py-3 px-4 rounded-xl shadow-lg hover:brightness-110 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider text-sm flex items-center justify-center gap-2 cursor-pointer">
          <span>⚔️</span>
          <span>Enter World of Aden</span>
        </button>

      </div>

      <!-- Footer Note -->
      <div class="text-center text-[10px] text-slate-500 mb-2">
        Lineage II Chronicle Mobile &bull; Turn-Based Combat & Paperdoll System
      </div>

    </div>
  `
})
export class CharacterCreationComponent {
  private state = inject(GameStateService);
  auth = inject(AuthService);

  races: RaceType[] = ['human', 'elf', 'dark_elf', 'orc', 'dwarf'];
  selectedRace = signal<RaceType>('human');
  isMage = signal<boolean>(false);
  selectedFace = signal<number>(1);
  selectedHairColor = signal<string>('#fbbf24');
  charName = 'Kaelen';

  raceData = computed(() => RACE_INFO[this.selectedRace()]);

  getRaceEmoji(race: RaceType): string {
    switch (race) {
      case 'human': return '🗡️';
      case 'elf': return '🧝';
      case 'dark_elf': return '🧝‍♂️';
      case 'orc': return '👹';
      case 'dwarf': return '⚒️';
    }
  }

  confirmCreation() {
    if (!this.charName.trim()) return;
    this.state.createCharacter(
      this.charName,
      this.selectedRace(),
      this.isMage(),
      'male',
      this.selectedFace(),
      1,
      this.selectedHairColor()
    );
  }
}
