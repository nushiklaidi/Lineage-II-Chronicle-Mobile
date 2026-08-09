import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService, SavedCharacterFull } from '../../services/auth.service';
import { GameStateService } from '../../services/game-state.service';

@Component({
  selector: 'app-character-select',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen bg-[#0a0a0c] text-slate-200 p-4 sm:p-6 flex flex-col items-center justify-between relative overflow-hidden select-none">
      
      <!-- Background Ambient Atmosphere -->
      <div class="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_20%,#3b2f1e_0%,#0a0a0c_70%)] opacity-40"></div>

      <!-- Top User Bar -->
      <header class="w-full max-w-4xl flex items-center justify-between bg-[#12121a]/90 border border-[#3c3c4a] px-4 py-3 rounded-2xl shadow-xl z-10">
        <div class="flex items-center gap-2">
          <span class="text-xl">🛡️</span>
          <div>
            <div class="text-[10px] text-[#8b7355] font-mono uppercase tracking-wider">Logged In Account</div>
            <div class="text-xs font-bold text-[#d4af37] font-mono truncate max-w-[180px] sm:max-w-xs">
              {{ auth.currentUser()?.email }}
            </div>
          </div>
        </div>

        <button 
          (click)="auth.logout()"
          class="px-3 py-1.5 rounded-lg bg-[#1a1a24] border border-[#3c3c4a] hover:border-red-600 text-slate-300 hover:text-red-400 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5">
          <span>🚪</span>
          <span>Log Out</span>
        </button>
      </header>

      <!-- Main Character Selection Card / Grid -->
      <main class="w-full max-w-4xl my-6 space-y-6 z-10">
        
        <!-- Section Title -->
        <div class="text-center space-y-1">
          <h2 class="text-xl sm:text-2xl font-serif font-bold text-[#d4af37] uppercase tracking-widest">
            Select Your Hero
          </h2>
          <p class="text-xs text-slate-400 font-serif">
            Choose a character to enter the Realm of Aden or create a new hero.
          </p>
        </div>

        <!-- CHARACTER LIST GRID -->
        @if (auth.userCharacters().length === 0) {
          <!-- Empty State -->
          <div class="bg-[#12121a]/90 border-2 border-dashed border-[#3c3c4a] rounded-2xl p-8 text-center space-y-4">
            <span class="text-4xl block">⚔️</span>
            <div class="space-y-1">
              <h3 class="text-sm font-serif font-bold text-[#d4af37]">No Characters Found</h3>
              <p class="text-xs text-slate-400">You haven't created any heroes yet. Begin your journey now!</p>
            </div>
            <button 
              (click)="auth.isCreatingNewChar.set(true)"
              class="px-6 py-3 rounded-xl bg-gradient-to-r from-[#8b7355] via-[#d4af37] to-[#8b7355] text-black font-serif font-bold text-xs uppercase tracking-wider border border-[#d4af37] shadow-[0_0_15px_rgba(212,175,55,0.4)] hover:brightness-110 active:scale-95 transition-all cursor-pointer">
              ✨ Create First Character
            </button>
          </div>
        } @else {
          <!-- Character Cards Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            @for (item of auth.userCharacters(); track item.id) {
              <div 
                class="bg-[#12121a]/95 border-2 rounded-2xl p-4 shadow-xl space-y-4 transition-all duration-300 hover:scale-[1.02] flex flex-col justify-between"
                [ngClass]="state.activeCharId() === item.id ? 'border-[#d4af37] shadow-[0_0_20px_rgba(212,175,55,0.3)]' : 'border-[#2a2a35] hover:border-[#8b7355]'">
                
                <!-- Character Card Header -->
                <div class="flex items-start justify-between">
                  <div class="space-y-0.5">
                    <span class="text-[10px] font-mono text-[#8b7355] font-bold uppercase tracking-wider">
                      Lvl {{ item.character.level }}
                    </span>
                    <h3 class="text-base font-serif font-bold text-[#d4af37] tracking-wider uppercase">
                      {{ item.character.name }}
                    </h3>
                    <div class="text-xs text-slate-300">
                      {{ item.character.className }}
                    </div>
                  </div>

                  <!-- Race Icon / Badge -->
                  <div class="bg-[#0a0a0c] p-2 rounded-xl border border-[#3c3c4a] text-center">
                    <span class="text-2xl">{{ getRaceEmoji(item.character.race) }}</span>
                    <div class="text-[9px] font-mono text-slate-400 capitalize mt-0.5">
                      {{ item.character.race.replace('_', ' ') }}
                    </div>
                  </div>
                </div>

                <!-- Stats Summary -->
                <div class="bg-[#0a0a0c] p-2.5 rounded-xl border border-[#2a2a35] grid grid-cols-2 gap-2 text-xs font-mono">
                  <div>
                    <span class="text-slate-500 text-[10px] block">WEAPON</span>
                    <span class="text-[#d4af37] font-bold truncate block">
                      {{ item.equipped.weapon ? item.equipped.weapon.name : 'Bare Fists' }}
                    </span>
                  </div>
                  <div>
                    <span class="text-slate-500 text-[10px] block">ADENA</span>
                    <span class="text-amber-300 font-bold block">
                      🪙 {{ item.character.adena | number }}
                    </span>
                  </div>
                </div>

                <!-- Action Buttons -->
                <div class="flex items-center gap-2 pt-2 border-t border-[#2a2a35]">
                  <button 
                    (click)="selectChar(item)"
                    class="flex-1 py-2.5 rounded-xl bg-[#8b7355] text-black font-serif font-bold text-xs uppercase tracking-wider hover:bg-[#d4af37] active:scale-95 transition-all shadow-[0_0_10px_rgba(212,175,55,0.3)] cursor-pointer">
                    ⚔️ Play
                  </button>
                  <button 
                    (click)="confirmDelete(item)"
                    class="px-3 py-2.5 rounded-xl bg-red-950/60 border border-red-800 text-red-400 hover:bg-red-900 hover:text-white text-xs font-bold transition-all cursor-pointer">
                    🗑️
                  </button>
                </div>

              </div>
            }
          </div>

          <!-- Create Another Character Button -->
          <div class="text-center pt-4">
            <button 
              (click)="auth.isCreatingNewChar.set(true)"
              class="px-6 py-3 rounded-xl bg-[#12121a] border-2 border-[#8b7355] hover:border-[#d4af37] text-[#d4af37] font-serif font-bold text-xs uppercase tracking-wider shadow-lg hover:brightness-110 active:scale-95 transition-all cursor-pointer inline-flex items-center gap-2">
              <span>✨</span>
              <span>Create New Character</span>
            </button>
          </div>
        }

      </main>

      <!-- Footer Info -->
      <footer class="text-[10px] font-mono text-slate-500 text-center z-10">
        Lineage II Chronicle • Cloud Character Engine • Firebase Firestore
      </footer>

      <!-- Delete Confirmation Modal -->
      @if (deletingChar(); as targetChar) {
        <div class="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div class="bg-[#12121a] border-2 border-red-700 rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-2xl">
            <div class="text-center space-y-2">
              <span class="text-3xl block">⚠️</span>
              <h3 class="text-base font-serif font-bold text-red-400 uppercase tracking-wider">Delete Character?</h3>
              <p class="text-xs text-slate-300">
                Are you sure you want to permanently delete <strong class="text-[#d4af37]">{{ targetChar.character.name }}</strong> (Lvl {{ targetChar.character.level }})? This action cannot be undone.
              </p>
            </div>

            <div class="flex items-center gap-2 pt-2">
              <button 
                (click)="deletingChar.set(null)"
                class="flex-1 py-2 rounded-xl bg-[#1a1a24] border border-[#3c3c4a] text-slate-300 font-bold text-xs hover:border-[#8b7355] cursor-pointer">
                Cancel
              </button>
              <button 
                (click)="executeDelete(targetChar.id)"
                class="flex-1 py-2 rounded-xl bg-red-700 hover:bg-red-600 text-white font-bold text-xs uppercase shadow cursor-pointer">
                Delete
              </button>
            </div>
          </div>
        </div>
      }

    </div>
  `
})
export class CharacterSelectComponent {
  auth = inject(AuthService);
  state = inject(GameStateService);

  deletingChar = signal<SavedCharacterFull | null>(null);

  selectChar(item: SavedCharacterFull) {
    this.state.loadCharacterFromSaved(item);
  }

  confirmDelete(item: SavedCharacterFull) {
    this.deletingChar.set(item);
  }

  async executeDelete(charId: string) {
    await this.auth.deleteCharacterFromFirestore(charId);
    this.deletingChar.set(null);
  }

  getRaceEmoji(race: string): string {
    switch (race) {
      case 'human': return '🛡️';
      case 'elf': return '🧝';
      case 'dark_elf': return '🧝‍♂️';
      case 'orc': return '👹';
      case 'dwarf': return '⚒️';
      default: return '⚔️';
    }
  }
}
