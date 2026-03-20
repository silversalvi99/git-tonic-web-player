import { Component, computed, inject } from '@angular/core';
import { Sidebar } from '../../components/sidebar/sidebar';
import { Tabs } from '../../components/tabs/tabs';
import { TracksList } from '../../components/tracks-list/tracks-list';
import { Player } from '../../components/player/player';
import { SearchSongs } from '../../components/search-songs/search-songs';
import { WebPlayer } from '../../services/web-player/web-player';

@Component({
  selector: 'app-home',
  imports: [Sidebar, Tabs, TracksList, Player, SearchSongs],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  /** Web player service inject */
  private readonly webPlayer = inject(WebPlayer);
  /** Signal that return true if the player is visible */
  readonly isPlayerVisible = computed(() => {
    return !!this.webPlayer.currentTrack();
  });
}
