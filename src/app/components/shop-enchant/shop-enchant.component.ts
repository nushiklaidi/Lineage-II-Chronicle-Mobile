import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameStateService } from '../../services/game-state.service';
import { SoundService } from '../../services/sound.service';
import { ALL_ITEMS } from '../../data/game-data';
import { Item } from '../../models/game.models';

interface EnchantOutcome {
  success: boolean;
  itemName: string;
  oldEnchant: number;
  newEnchant: number;
  refundAdena?: number;
}

@Component({
  selector: 'app-shop-enchant',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="p-3 sm:p-4 max-w-md mx-auto space-y-4 pb-20 select-none">
      
      <!-- Top Toggle: Shop vs Blacksmith Forge -->
      <div class="flex bg-[#0a0a0c] border border-[#3c3c4a] p-1 rounded-xl text-xs font-bold">
        <button 
          (click)="shopTab.set('shop')"
          class="flex-1 py-1.5 rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          [ngClass]="shopTab() === 'shop' ? 'bg-[#8b7355] text-black border border-[#d4af37] font-bold shadow-[0_0_8px_rgba(212,175,55,0.3)]' : 'text-[#8b7355] hover:text-[#d4af37]'">
          <span>🛒</span>
          <span>Merchant Shop</span>
        </button>
        <button 
          (click)="shopTab.set('enchant')"
          class="flex-1 py-1.5 rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          [ngClass]="shopTab() === 'enchant' ? 'bg-[#8b7355] text-black border border-[#d4af37] font-bold shadow-[0_0_8px_rgba(212,175,55,0.3)]' : 'text-[#8b7355] hover:text-[#d4af37]'">
          <span>⚒️</span>
          <span>Enchant Workshop</span>
        </button>
      </div>

      <!-- SECTION 1: MERCHANT SHOP -->
      @if (shopTab() === 'shop') {
        <div class="space-y-3">
          
          <!-- Category Filter -->
          <div class="flex gap-1 text-xs font-bold overflow-x-auto pb-0.5">
            @for (cat of ['all', 'consumable', 'weapon', 'armor', 'scroll']; track cat) {
              <button 
                (click)="shopCategory.set(cat)"
                class="px-3 py-1 rounded-lg border capitalize cursor-pointer font-serif"
                [ngClass]="shopCategory() === cat ? 'bg-[#8b7355] border-[#d4af37] text-black font-bold' : 'bg-[#12121a] border-[#3c3c4a] text-[#8b7355] hover:border-[#8b7355]'">
                {{ cat }}
              </button>
            }
          </div>

          <div class="space-y-2">
            @for (item of filteredShopItems(); track item.id) {
              <div class="bg-[#12121a]/90 border border-[#2a2a35] hover:border-[#8b7355] rounded-xl p-3 shadow-xl flex items-center justify-between gap-2">
                
                <div class="flex items-center gap-3">
                  <div class="w-12 h-12 rounded-lg bg-[#0a0a0c] border border-[#8b7355]/40 flex items-center justify-center text-2xl shadow-inner shrink-0">
                    <span>{{ getItemIcon(item) }}</span>
                  </div>

                  <div>
                    <div class="font-serif font-bold text-xs text-[#d4af37] uppercase tracking-wider">{{ item.name }}</div>
                    <div class="text-[10px] text-slate-400 line-clamp-1">{{ item.description }}</div>
                    
                    <div class="flex items-center gap-2 mt-1">
                      <span class="text-[9px] bg-[#0a0a0c] px-1.5 py-0.5 rounded border border-[#3c3c4a] text-[#8b7355] font-mono font-bold">
                        {{ item.grade }}-GRADE
                      </span>
                      <span class="text-[11px] text-[#d4af37] font-mono font-bold flex items-center gap-0.5">
                        🪙 {{ item.price | number }} Adena
                      </span>
                    </div>
                  </div>
                </div>

                <button 
                  (click)="state.buyItem(item)"
                  [disabled]="(state.character()?.adena || 0) < item.price"
                  class="px-3.5 py-2 rounded-lg bg-[#8b7355] text-black font-bold text-xs hover:bg-[#d4af37] shadow-[0_0_8px_rgba(212,175,55,0.3)] active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed shrink-0 transition-colors cursor-pointer">
                  Buy
                </button>

              </div>
            }
          </div>

        </div>
      }

      <!-- SECTION 2: ENCHANT WORKSHOP -->
      @if (shopTab() === 'enchant') {
        <div class="bg-[#12121a]/90 border border-[#2a2a35] rounded-xl p-4 shadow-2xl space-y-4 relative overflow-hidden"
             [ngClass]="{ 'animate-screen-jitter': forgePhase() === 'fail' }">
          
          <div class="text-center space-y-1">
            <h3 class="text-xs font-serif font-bold text-[#d4af37] uppercase tracking-widest flex items-center justify-center gap-1.5">
              <span>⚒️</span>
              <span>Blacksmith Enchanting Anvil</span>
              <span>⚒️</span>
            </h3>
            <p class="text-[10px] text-slate-400">Enhance equipment power up to +16. Safe up to +3!</p>
          </div>

          <!-- ANIMATED FORGE STAGE OVERLAY -->
          @if (isForging() || forgePhase() !== 'idle') {
            <div class="bg-[#0a080d] border-2 border-[#d4af37]/60 rounded-xl p-4 text-center space-y-3 relative shadow-[0_0_30px_rgba(212,175,55,0.2)]">
              
              <!-- Phase 1: Striking / Forging -->
              @if (forgePhase() === 'striking') {
                <div class="space-y-3 animate-forge-glow rounded-lg p-3">
                  <div class="text-xs font-serif font-bold text-amber-400 tracking-wider flex items-center justify-center gap-2">
                    <span class="animate-spin text-sm">🔥</span>
                    <span>BLACKSMITH FORGING ANVIL...</span>
                    <span class="animate-spin text-sm">🔥</span>
                  </div>

                  <!-- Item Box undergoing forge -->
                  <div class="relative w-24 h-24 mx-auto rounded-xl bg-[#161420] border-2 border-amber-400/80 flex items-center justify-center text-4xl shadow-2xl">
                    <span>{{ getItemIcon(selectedGear()!) }}</span>
                    
                    <!-- Swinging Hammer Animation -->
                    <div class="absolute -top-6 -right-6 text-4xl animate-hammer">
                      🔨
                    </div>

                    <!-- Spark Particles -->
                    <span class="absolute -top-2 left-2 text-xs animate-ping">✨</span>
                    <span class="absolute bottom-1 right-1 text-xs animate-pulse text-amber-400">⚡</span>
                  </div>

                  <!-- Strike Progress Bar -->
                  <div class="space-y-1">
                    <div class="text-[10px] font-mono text-amber-300">
                      Hammer Strike {{ strikeCount() }} / 3
                    </div>
                    <div class="w-full bg-[#1e1a29] h-2 rounded-full overflow-hidden border border-amber-500/40 p-0.5">
                      <div class="bg-gradient-to-r from-amber-600 via-amber-400 to-yellow-300 h-full rounded-full transition-all duration-300"
                           [style.width.%]="(strikeCount() / 3) * 100"></div>
                    </div>
                  </div>
                </div>
              }

              <!-- Phase 2: Success Animation -->
              @if (forgePhase() === 'success') {
                <div class="space-y-3 p-2">
                  <div class="text-xs font-serif font-bold text-emerald-400 tracking-wider flex items-center justify-center gap-1.5 animate-bounce">
                    <span>🎉</span>
                    <span>ENCHANTMENT SUCCESSFUL!</span>
                    <span>🎉</span>
                  </div>

                  <!-- Item Box Bursting with Light -->
                  <div class="relative w-24 h-24 mx-auto rounded-xl bg-gradient-to-br from-emerald-950 via-[#102a20] to-cyan-950 border-2 border-cyan-400 flex items-center justify-center text-4xl shadow-[0_0_35px_rgba(34,211,238,0.8)] animate-success-burst">
                    <span>{{ getItemIcon(lastOutcome() ? getDummyItemByName(lastOutcome()!.itemName) : selectedGear()!) }}</span>

                    <!-- Floating "+New" Badge -->
                    <div class="absolute -top-3 -right-3 bg-gradient-to-r from-cyan-400 to-emerald-400 text-black font-mono font-black text-sm px-2 py-0.5 rounded-full shadow-lg border border-white animate-float-success">
                      +{{ lastOutcome()?.newEnchant }}
                    </div>

                    <!-- Sparkle accents -->
                    <span class="absolute -top-4 -left-4 text-base animate-spin">✨</span>
                    <span class="absolute -bottom-3 -right-3 text-base animate-bounce">🌟</span>
                  </div>

                  <div class="space-y-1">
                    <div class="text-sm font-serif font-bold text-[#d4af37]">
                      {{ lastOutcome()?.itemName }}
                    </div>
                    <div class="text-xs font-mono text-cyan-300">
                      Upgraded to <span class="text-emerald-400 font-bold">+{{ lastOutcome()?.newEnchant }}</span>!
                    </div>
                  </div>

                  <button 
                    (click)="resetForgeState()"
                    class="px-5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-black font-bold text-xs rounded-lg shadow-md cursor-pointer transition-transform active:scale-95">
                    Continue Forging
                  </button>
                </div>
              }

              <!-- Phase 3: Failure / Shatter Animation -->
              @if (forgePhase() === 'fail') {
                <div class="space-y-3 p-2">
                  <div class="text-xs font-serif font-bold text-rose-500 tracking-wider flex items-center justify-center gap-1.5">
                    <span>💥</span>
                    <span>ENCHANTMENT FAILED!</span>
                    <span>💥</span>
                  </div>

                  <!-- Item Shattering Box -->
                  <div class="relative w-24 h-24 mx-auto rounded-xl bg-rose-950/80 border-2 border-rose-500/80 flex items-center justify-center text-4xl shadow-[0_0_30px_rgba(244,63,94,0.7)] animate-shatter">
                    <span class="opacity-40 grayscale">🗡️</span>
                    
                    <!-- Floating Shatter Warning -->
                    <div class="absolute top-0 text-rose-300 font-mono font-bold text-[10px] animate-float-shatter">
                      CRYSTALLIZED!
                    </div>
                  </div>

                  <div class="space-y-1">
                    <div class="text-xs font-serif font-bold text-rose-300">
                      {{ lastOutcome()?.itemName }} broke into crystals!
                    </div>
                    <div class="text-[11px] font-mono text-amber-300 flex items-center justify-center gap-1">
                      <span>🪙</span>
                      <span>+{{ lastOutcome()?.refundAdena | number }} Adena Refunded</span>
                    </div>
                  </div>

                  <button 
                    (click)="resetForgeState()"
                    class="px-5 py-1.5 bg-rose-800 hover:bg-rose-700 text-white font-bold text-xs rounded-lg shadow-md cursor-pointer transition-transform active:scale-95">
                    Close Anvil
                  </button>
                </div>
              }

            </div>
          } @else {

            <!-- Item & Scroll Selection Boxes -->
            <div class="grid grid-cols-2 gap-3">
              
              <!-- Target Item Box -->
              <div class="bg-[#0a0a0c] p-3 rounded-xl border border-[#3c3c4a] text-center space-y-2 relative">
                <div class="text-[10px] font-serif font-bold text-[#8b7355] uppercase tracking-wider">1. Target Gear</div>
                
                <div class="w-16 h-16 mx-auto rounded-lg bg-[#1a1a24] border-2 flex items-center justify-center text-3xl shadow-inner relative"
                     [ngClass]="selectedGear() ? 'border-[#d4af37]' : 'border-[#3c3c4a]'">
                  @if (selectedGear(); as gear) {
                    <span>{{ getItemIcon(gear) }}</span>
                    @if ((gear.enchantLevel || 0) > 0) {
                      <span class="absolute -top-1.5 -right-1.5 bg-cyan-500 text-black font-mono font-bold text-[9px] px-1 rounded-full shadow">
                        +{{ gear.enchantLevel }}
                      </span>
                    }
                  } @else {
                    <span class="text-[#8b7355]/40 text-xl">+0</span>
                  }
                </div>

                <div class="text-[11px] font-bold text-[#d4af37] truncate">
                  {{ selectedGear()?.name || 'Select Gear' }}
                </div>

                <!-- Gear Picker Dropdown -->
                <select 
                  #gearSelect
                  (change)="onGearSelect(gearSelect.value)"
                  class="w-full bg-[#1a1a24] border border-[#3c3c4a] text-xs text-[#d4af37] p-1.5 rounded-lg outline-none font-mono">
                  <option value="">-- Choose Equipment --</option>
                  @for (eq of enchantableGearList(); track eq.id) {
                    <option [value]="eq.id">
                      {{ eq.name }} (+{{ eq.enchantLevel || 0 }}) [{{ eq.grade }}]
                    </option>
                  }
                </select>
              </div>

              <!-- Scroll Selection Box -->
              <div class="bg-[#0a0a0c] p-3 rounded-xl border border-[#3c3c4a] text-center space-y-2 relative">
                <div class="text-[10px] font-serif font-bold text-[#8b7355] uppercase tracking-wider">2. Enchant Scroll</div>

                <div class="w-16 h-16 mx-auto rounded-lg bg-[#1a1a24] border-2 flex items-center justify-center text-3xl shadow-inner relative"
                     [ngClass]="selectedScroll() ? 'border-cyan-400' : 'border-[#3c3c4a]'">
                  @if (selectedScroll(); as scroll) {
                    <span>📜</span>
                    <span class="absolute -bottom-1 -right-1 bg-[#8b7355] text-black font-mono font-bold text-[9px] px-1 rounded-full">
                      x{{ scroll.quantity || 1 }}
                    </span>
                  } @else {
                    <span class="text-[#8b7355]/40 text-xl">📜</span>
                  }
                </div>

                <div class="text-[11px] font-bold text-cyan-300 truncate">
                  {{ selectedScroll()?.name || 'Select Scroll' }}
                </div>

                <select 
                  #scrollSelect
                  (change)="onScrollSelect(scrollSelect.value)"
                  class="w-full bg-[#1a1a24] border border-[#3c3c4a] text-xs text-[#d4af37] p-1.5 rounded-lg outline-none font-mono">
                  <option value="">-- Choose Scroll --</option>
                  @for (sc of enchantScrollList(); track sc.id) {
                    <option [value]="sc.id">
                      {{ sc.name }} (x{{ sc.quantity || 1 }})
                    </option>
                  }
                </select>
              </div>

            </div>

            <!-- Enchant Chance Notice -->
            @if (selectedGear() && selectedScroll()) {
              <div class="bg-[#0a0a0c] p-3 rounded-lg border border-[#3c3c4a] text-center space-y-1 font-mono text-xs">
                @let curLevel = selectedGear()?.enchantLevel || 0;
                @if (curLevel < 3) {
                  <div class="text-emerald-400 font-bold">✨ Safe Enchant (+{{ curLevel }} → +{{ curLevel + 1 }}): 100% Success Rate</div>
                } @else {
                  <div class="text-amber-400 font-bold">⚠️ Unsafe Enchant (+{{ curLevel }} → +{{ curLevel + 1 }}): 66% Success Rate</div>
                  <div class="text-[10px] text-rose-400">Failure will break item into Adena crystals!</div>
                }
              </div>
            }

            <!-- Perform Enchant Action -->
            <button 
              (click)="triggerEnchant()"
              [disabled]="!selectedGear() || !selectedScroll() || isForging()"
              class="w-full py-3.5 bg-[#8b7355] text-black font-serif font-bold text-xs uppercase tracking-wider rounded-lg shadow-[0_0_12px_rgba(212,175,55,0.4)] hover:bg-[#d4af37] active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer border border-[#d4af37]">
              <span>⚒️</span>
              <span>FORGE ENCHANT ITEM</span>
            </button>

          }

        </div>
      }

    </div>
  `
})
export class ShopEnchantComponent {
  state = inject(GameStateService);
  sound = inject(SoundService);

  shopTab = signal<'shop' | 'enchant'>('shop');
  shopCategory = signal<string>('all');

  selectedGear = signal<Item | null>(null);
  selectedScroll = signal<Item | null>(null);

  // Animation states
  isForging = signal<boolean>(false);
  forgePhase = signal<'idle' | 'striking' | 'success' | 'fail'>('idle');
  strikeCount = signal<number>(1);
  lastOutcome = signal<EnchantOutcome | null>(null);

  shopItems = ALL_ITEMS;

  filteredShopItems() {
    const cat = this.shopCategory();
    if (cat === 'all') return this.shopItems;
    return this.shopItems.filter(i => i.type === cat);
  }

  getItemIcon(item: Item): string {
    if (!item) return '📦';
    if (item.type === 'weapon') return '🗡️';
    if (item.type === 'armor') return '🛡️';
    if (item.type === 'jewelry') return '💎';
    if (item.type === 'scroll') return '📜';
    if (item.id === 'hp_potion') return '🧪';
    if (item.id === 'mp_potion') return '💧';
    if (item.id && item.id.startsWith('soulshot')) return '⚡';
    return '📦';
  }

  getDummyItemByName(name: string): Item {
    const found = ALL_ITEMS.find(i => i.name === name);
    return found || { id: 'dummy', name, type: 'weapon', grade: 'D', price: 100, description: '', icon: '🗡️' };
  }

  enchantableGearList(): Item[] {
    const eqList = Object.values(this.state.equipped()).filter(Boolean) as Item[];
    const invList = this.state.inventory().filter(i => i.type === 'weapon' || i.type === 'armor');
    return [...eqList, ...invList];
  }

  enchantScrollList(): Item[] {
    return this.state.inventory().filter(i => i.type === 'scroll');
  }

  onGearSelect(gearId: string) {
    const found = this.enchantableGearList().find(i => i.id === gearId) || null;
    this.selectedGear.set(found);
  }

  onScrollSelect(scrollId: string) {
    const found = this.enchantScrollList().find(i => i.id === scrollId) || null;
    this.selectedScroll.set(found);
  }

  triggerEnchant() {
    const gear = this.selectedGear();
    const scroll = this.selectedScroll();
    if (!gear || !scroll || this.isForging()) return;

    this.isForging.set(true);
    this.forgePhase.set('striking');
    this.strikeCount.set(1);
    this.sound.playHammerStrike();

    // Strike 2
    setTimeout(() => {
      this.strikeCount.set(2);
      this.sound.playHammerStrike();
    }, 380);

    // Strike 3
    setTimeout(() => {
      this.strikeCount.set(3);
      this.sound.playHammerStrike();
    }, 760);

    // Resolution phase
    setTimeout(() => {
      const curEnchant = gear.enchantLevel || 0;
      const outcome = this.state.enchantEquipment(gear, scroll);

      if (outcome.success) {
        this.forgePhase.set('success');
        this.lastOutcome.set({
          success: true,
          itemName: gear.name,
          oldEnchant: curEnchant,
          newEnchant: outcome.newEnchant
        });
      } else {
        this.forgePhase.set('fail');
        this.lastOutcome.set({
          success: false,
          itemName: gear.name,
          oldEnchant: curEnchant,
          newEnchant: 0,
          refundAdena: Math.round(gear.price * 0.4)
        });
      }

      this.selectedGear.set(null);
      this.selectedScroll.set(null);
      this.isForging.set(false);
    }, 1140);
  }

  resetForgeState() {
    this.forgePhase.set('idle');
    this.isForging.set(false);
    this.lastOutcome.set(null);
  }
}

