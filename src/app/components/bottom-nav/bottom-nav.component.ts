import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameStateService } from '../../services/game-state.service';

@Component({
  selector: 'app-bottom-nav',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="fixed bottom-0 left-0 right-0 z-40 bg-[#15151e]/95 backdrop-blur-md border-t border-[#3c3c4a] text-slate-100 select-none shadow-2xl">
      <div class="max-w-md mx-auto grid grid-cols-6 gap-1 p-2 text-center font-bold">
        
        <!-- Hero / Paperdoll Tab -->
        <button 
          (click)="state.activeTab.set('hero')"
          class="flex flex-col items-center justify-center py-1 rounded-lg transition-all active:scale-95 group cursor-pointer">
          <div class="w-10 h-10 rounded-lg flex items-center justify-center text-base transition-all"
               [ngClass]="state.activeTab() === 'hero' 
                 ? 'bg-[#8b7355] border-2 border-[#d4af37] text-black shadow-[0_0_10px_rgba(212,175,55,0.4)]' 
                 : 'bg-[#0a0a0c] border border-[#8b7355]/40 text-slate-300 group-hover:border-[#8b7355]'">
            <span>🛡️</span>
          </div>
          <span class="text-[9px] uppercase font-bold tracking-wider mt-1"
                [ngClass]="state.activeTab() === 'hero' ? 'text-[#d4af37]' : 'text-[#8b7355]'">
            Hero
          </span>
        </button>

        <!-- World Map Tab -->
        <button 
          (click)="state.activeTab.set('world')"
          class="flex flex-col items-center justify-center py-1 rounded-lg transition-all active:scale-95 group cursor-pointer">
          <div class="w-10 h-10 rounded-lg flex items-center justify-center text-base transition-all"
               [ngClass]="state.activeTab() === 'world' 
                 ? 'bg-[#8b7355] border-2 border-[#d4af37] text-black shadow-[0_0_10px_rgba(212,175,55,0.4)]' 
                 : 'bg-[#0a0a0c] border border-[#8b7355]/40 text-slate-300 group-hover:border-[#8b7355]'">
            <span>🗺️</span>
          </div>
          <span class="text-[9px] uppercase font-bold tracking-wider mt-1"
                [ngClass]="state.activeTab() === 'world' ? 'text-[#d4af37]' : 'text-[#8b7355]'">
            World
          </span>
        </button>

        <!-- Battle Tab -->
        <button 
          (click)="state.activeTab.set('battle')"
          class="flex flex-col items-center justify-center py-1 rounded-lg transition-all active:scale-95 group cursor-pointer relative">
          <div class="w-10 h-10 rounded-lg flex items-center justify-center text-base transition-all relative"
               [ngClass]="state.activeTab() === 'battle' 
                 ? 'bg-[#8b7355] border-2 border-[#d4af37] text-black shadow-[0_0_10px_rgba(212,175,55,0.4)]' 
                 : 'bg-[#0a0a0c] border border-[#8b7355]/40 text-slate-300 group-hover:border-[#8b7355]'">
            <span>⚔️</span>
            @if (state.activeMob()) {
              <span class="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></span>
            }
          </div>
          <span class="text-[9px] uppercase font-bold tracking-wider mt-1"
                [ngClass]="state.activeTab() === 'battle' ? 'text-[#d4af37]' : 'text-[#8b7355]'">
            Combat
          </span>
        </button>

        <!-- Inventory Tab -->
        <button 
          (click)="state.activeTab.set('inventory')"
          class="flex flex-col items-center justify-center py-1 rounded-lg transition-all active:scale-95 group cursor-pointer">
          <div class="w-10 h-10 rounded-lg flex items-center justify-center text-base transition-all"
               [ngClass]="state.activeTab() === 'inventory' 
                 ? 'bg-[#8b7355] border-2 border-[#d4af37] text-black shadow-[0_0_10px_rgba(212,175,55,0.4)]' 
                 : 'bg-[#0a0a0c] border border-[#8b7355]/40 text-slate-300 group-hover:border-[#8b7355]'">
            <span>🎒</span>
          </div>
          <span class="text-[9px] uppercase font-bold tracking-wider mt-1"
                [ngClass]="state.activeTab() === 'inventory' ? 'text-[#d4af37]' : 'text-[#8b7355]'">
            Items
          </span>
        </button>

        <!-- Shop & Enchant Tab -->
        <button 
          (click)="state.activeTab.set('shop')"
          class="flex flex-col items-center justify-center py-1 rounded-lg transition-all active:scale-95 group cursor-pointer">
          <div class="w-10 h-10 rounded-lg flex items-center justify-center text-base transition-all"
               [ngClass]="state.activeTab() === 'shop' 
                 ? 'bg-[#8b7355] border-2 border-[#d4af37] text-black shadow-[0_0_10px_rgba(212,175,55,0.4)]' 
                 : 'bg-[#0a0a0c] border border-[#8b7355]/40 text-slate-300 group-hover:border-[#8b7355]'">
            <span>⚒️</span>
          </div>
          <span class="text-[9px] uppercase font-bold tracking-wider mt-1"
                [ngClass]="state.activeTab() === 'shop' ? 'text-[#d4af37]' : 'text-[#8b7355]'">
            Forge
          </span>
        </button>

        <!-- Quests & Raids Tab -->
        <button 
          (click)="state.activeTab.set('quests')"
          class="flex flex-col items-center justify-center py-1 rounded-lg transition-all active:scale-95 group cursor-pointer">
          <div class="w-10 h-10 rounded-lg flex items-center justify-center text-base transition-all"
               [ngClass]="state.activeTab() === 'quests' 
                 ? 'bg-[#8b7355] border-2 border-[#d4af37] text-black shadow-[0_0_10px_rgba(212,175,55,0.4)]' 
                 : 'bg-[#0a0a0c] border border-[#8b7355]/40 text-slate-300 group-hover:border-[#8b7355]'">
            <span>📜</span>
          </div>
          <span class="text-[9px] uppercase font-bold tracking-wider mt-1"
                [ngClass]="state.activeTab() === 'quests' ? 'text-[#d4af37]' : 'text-[#8b7355]'">
            Quests
          </span>
        </button>

      </div>
    </div>
  `
})
export class BottomNavComponent {
  state = inject(GameStateService);
}
