import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameStateService } from '../../services/game-state.service';
import { Item } from '../../models/game.models';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="p-3 sm:p-4 max-w-md mx-auto space-y-4 pb-20 select-none">
      
      <!-- Category Filter Pills -->
      <div class="flex items-center justify-between gap-1 bg-[#0a0a0c] border border-[#3c3c4a] p-1 rounded-xl text-xs font-bold">
        <button 
          (click)="filterCategory.set('all')"
          class="flex-1 py-1.5 rounded-lg transition-colors text-center cursor-pointer"
          [ngClass]="filterCategory() === 'all' ? 'bg-[#8b7355] text-black border border-[#d4af37] font-bold shadow-[0_0_8px_rgba(212,175,55,0.3)]' : 'text-[#8b7355] hover:text-[#d4af37]'">
          All
        </button>
        <button 
          (click)="filterCategory.set('weapon')"
          class="flex-1 py-1.5 rounded-lg transition-colors text-center cursor-pointer"
          [ngClass]="filterCategory() === 'weapon' ? 'bg-[#8b7355] text-black border border-[#d4af37] font-bold shadow-[0_0_8px_rgba(212,175,55,0.3)]' : 'text-[#8b7355] hover:text-[#d4af37]'">
          Weapons
        </button>
        <button 
          (click)="filterCategory.set('armor')"
          class="flex-1 py-1.5 rounded-lg transition-colors text-center cursor-pointer"
          [ngClass]="filterCategory() === 'armor' ? 'bg-[#8b7355] text-black border border-[#d4af37] font-bold shadow-[0_0_8px_rgba(212,175,55,0.3)]' : 'text-[#8b7355] hover:text-[#d4af37]'">
          Armor
        </button>
        <button 
          (click)="filterCategory.set('consumable')"
          class="flex-1 py-1.5 rounded-lg transition-colors text-center cursor-pointer"
          [ngClass]="filterCategory() === 'consumable' ? 'bg-[#8b7355] text-black border border-[#d4af37] font-bold shadow-[0_0_8px_rgba(212,175,55,0.3)]' : 'text-[#8b7355] hover:text-[#d4af37]'">
          Items
        </button>
      </div>

      <!-- Inventory Item Grid -->
      <div class="bg-[#12121a]/90 border border-[#2a2a35] rounded-xl p-3 shadow-2xl">
        <div class="grid grid-cols-4 gap-2">
          @for (item of filteredInventory(); track item.id + $index) {
            <button 
              type="button"
              (click)="selectedItem.set(item)"
              [aria-label]="item.name"
              class="aspect-square rounded-lg bg-[#1a1a24] border transition-all p-1 flex flex-col items-center justify-between cursor-pointer relative group hover:scale-105 active:scale-95 shadow-inner focus:outline-none focus:ring-2 focus:ring-[#d4af37]"
              [ngClass]="getGradeBorderClass(item.grade)">
              
              <!-- Item Grade Pill -->
              <span class="absolute top-1 left-1 text-[8px] font-bold px-1 rounded text-black"
                    [ngClass]="getGradeBgClass(item.grade)">
                {{ item.grade }}
              </span>

              <!-- Enchant Badge -->
              @if ((item.enchantLevel || 0) > 0) {
                <span class="absolute top-1 right-1 bg-cyan-500 text-black font-mono font-bold text-[8px] px-1 rounded-full shadow">
                  +{{ item.enchantLevel }}
                </span>
              }

              <span class="text-2xl my-auto">{{ getItemIcon(item) }}</span>

              <span class="w-full text-center truncate">
                <span class="text-[9px] font-bold text-[#d4af37] block truncate">{{ item.name }}</span>
                @if (item.quantity && item.quantity > 1) {
                  <span class="text-[8px] text-amber-400 font-mono">x{{ item.quantity }}</span>
                }
              </span>
            </button>
          } @empty {
            <div class="col-span-4 p-8 text-center text-xs text-slate-400 space-y-2">
              <span class="text-2xl block">🎒</span>
              <span>No items in this category yet. Hunt monsters or visit the town shop!</span>
            </div>
          }
        </div>
      </div>

      <!-- ITEM DETAIL MODAL -->
      @if (selectedItem(); as item) {
        <div class="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div class="bg-[#12121a] border-2 border-[#8b7355] rounded-xl p-5 max-w-xs w-full space-y-4 shadow-[0_0_25px_rgba(139,115,85,0.3)] relative animate-in fade-in zoom-in duration-200">
            
            <button 
              (click)="selectedItem.set(null)"
              class="absolute top-3 right-3 text-slate-400 hover:text-white text-base cursor-pointer">
              ✕
            </button>

            <div class="flex items-center gap-3">
              <div class="w-14 h-14 rounded-lg bg-[#0a0a0c] border-2 flex items-center justify-center text-3xl shadow-inner shrink-0"
                   [ngClass]="getGradeBorderClass(item.grade)">
                <span>{{ getItemIcon(item) }}</span>
              </div>

              <div>
                <div class="font-serif font-bold text-sm text-[#d4af37] uppercase tracking-wider">
                  {{ item.name }}
                  @if ((item.enchantLevel || 0) > 0) {
                    <span class="text-cyan-400 font-bold ml-1">+{{ item.enchantLevel }}</span>
                  }
                </div>
                <div class="flex items-center gap-1.5 mt-0.5">
                  <span class="text-[9px] font-bold px-1.5 py-0.5 rounded text-black" [ngClass]="getGradeBgClass(item.grade)">
                    {{ item.grade }}-GRADE
                  </span>
                  <span class="text-[10px] text-[#8b7355] font-mono capitalize">{{ item.type }}</span>
                </div>
              </div>
            </div>

            <!-- Item Stats -->
            <div class="bg-[#0a0a0c] p-3 rounded-lg border border-[#3c3c4a] space-y-1 text-xs font-mono">
              @if (item.pAtk) { <div class="flex justify-between"><span class="text-[#8b7355]">P.Atk:</span><span class="text-[#d4af37] font-bold">+{{ item.pAtk }}</span></div> }
              @if (item.mAtk) { <div class="flex justify-between"><span class="text-[#8b7355]">M.Atk:</span><span class="text-purple-300 font-bold">+{{ item.mAtk }}</span></div> }
              @if (item.pDef) { <div class="flex justify-between"><span class="text-[#8b7355]">P.Def:</span><span class="text-[#d4af37] font-bold">+{{ item.pDef }}</span></div> }
              @if (item.mDef) { <div class="flex justify-between"><span class="text-[#8b7355]">M.Def:</span><span class="text-purple-300 font-bold">+{{ item.mDef }}</span></div> }
              @if (item.setBonusName) { <div class="text-[10px] text-[#d4af37] pt-1 font-serif">Set: {{ item.setBonusName }}</div> }
            </div>

            <p class="text-xs text-slate-300 leading-relaxed italic border-y border-[#2a2a35] py-2">{{ item.description }}</p>

            <!-- Actions -->
            <div class="grid grid-cols-2 gap-2 pt-2">
              @if (item.type === 'weapon' || item.type === 'armor' || item.type === 'jewelry') {
                <button 
                  (click)="equipSelectedItem(item)"
                  class="py-2 bg-[#8b7355] text-black font-bold text-xs rounded-lg hover:bg-[#d4af37] shadow-[0_0_10px_rgba(212,175,55,0.3)] transition-all cursor-pointer">
                  Equip Item
                </button>
              }

              @if (item.type === 'scroll' || item.type === 'weapon' || item.type === 'armor') {
                <button 
                  (click)="goToEnchantWorkshop()"
                  class="py-2 bg-[#1a1a24] border border-[#d4af37] text-[#d4af37] font-bold text-xs rounded-lg hover:bg-[#8b7355] hover:text-black transition-colors cursor-pointer flex items-center justify-center gap-1">
                  <span>⚒️</span>
                  <span>Workshop</span>
                </button>
              } @else {
                <button 
                  (click)="selectedItem.set(null)"
                  class="py-2 bg-[#1a1a24] border border-[#3c3c4a] text-slate-300 font-bold text-xs rounded-lg hover:text-white cursor-pointer">
                  Close
                </button>
              }
            </div>

          </div>
        </div>
      }

    </div>
  `
})
export class InventoryComponent {
  state = inject(GameStateService);

  filterCategory = signal<'all' | 'weapon' | 'armor' | 'consumable'>('all');
  selectedItem = signal<Item | null>(null);

  filteredInventory = computed(() => {
    const inv = this.state.inventory();
    const cat = this.filterCategory();
    if (cat === 'all') return inv;
    return inv.filter(i => i.type === cat);
  });

  getItemIcon(item: Item): string {
    if (item.type === 'weapon') return '🗡️';
    if (item.type === 'armor') return '🛡️';
    if (item.type === 'jewelry') return '💎';
    if (item.type === 'scroll') return '📜';
    if (item.id === 'hp_potion') return '🧪';
    if (item.id === 'mp_potion') return '💧';
    if (item.id.startsWith('soulshot')) return '⚡';
    return '📦';
  }

  getGradeBorderClass(grade: string): string {
    switch (grade) {
      case 'S': return 'border-amber-400/80 shadow-amber-500/20';
      case 'A': return 'border-purple-400/80 shadow-purple-500/20';
      case 'B': return 'border-blue-400/80 shadow-blue-500/20';
      case 'C': return 'border-emerald-400/80 shadow-emerald-500/20';
      case 'D': return 'border-yellow-600/80';
      default: return 'border-slate-800';
    }
  }

  getGradeBgClass(grade: string): string {
    switch (grade) {
      case 'S': return 'bg-amber-400';
      case 'A': return 'bg-purple-400';
      case 'B': return 'bg-blue-400';
      case 'C': return 'bg-emerald-400';
      case 'D': return 'bg-yellow-600';
      default: return 'bg-slate-500';
    }
  }

  equipSelectedItem(item: Item) {
    this.state.equipItem(item);
    this.selectedItem.set(null);
  }

  goToEnchantWorkshop() {
    this.selectedItem.set(null);
    this.state.activeTab.set('shop');
  }
}
