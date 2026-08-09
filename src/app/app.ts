import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameStateService } from './services/game-state.service';
import { AuthService } from './services/auth.service';
import { AuthComponent } from './components/auth/auth.component';
import { CharacterSelectComponent } from './components/character-select/character-select.component';
import { HudHeaderComponent } from './components/hud-header/hud-header.component';
import { CharacterCreationComponent } from './components/character-creation/character-creation.component';
import { PaperdollComponent } from './components/paperdoll/paperdoll.component';
import { WorldMapComponent } from './components/world-map/world-map.component';
import { CombatComponent } from './components/combat/combat.component';
import { InventoryComponent } from './components/inventory/inventory.component';
import { ShopEnchantComponent } from './components/shop-enchant/shop-enchant.component';
import { QuestsRaidsComponent } from './components/quests-raids/quests-raids.component';
import { BottomNavComponent } from './components/bottom-nav/bottom-nav.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    AuthComponent,
    CharacterSelectComponent,
    HudHeaderComponent,
    CharacterCreationComponent,
    PaperdollComponent,
    WorldMapComponent,
    CombatComponent,
    InventoryComponent,
    ShopEnchantComponent,
    QuestsRaidsComponent,
    BottomNavComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  state = inject(GameStateService);
  auth = inject(AuthService);
}
