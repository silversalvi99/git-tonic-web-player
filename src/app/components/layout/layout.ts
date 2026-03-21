import { Component, computed, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Sidebar } from '../sidebar/sidebar';
import { Player } from '../player/player';
import { Tabs } from '../tabs/tabs';
import { WebPlayer } from '../../services/web-player/web-player';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, Sidebar, Player, Tabs],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
})
export class Layout {
  /** Web player service inject */
  private readonly webPlayer = inject(WebPlayer);
  /** Signal that return true if the player is visible */
  readonly isPlayerVisible = computed(() => {
    return !!this.webPlayer.currentTrack();
  });
}
