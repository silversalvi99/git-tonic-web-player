import { Component, effect, inject, signal } from '@angular/core';
import { WebPlayer as PlayerService } from '../../services/web-player/web-player';
import { CommonModule } from '@angular/common';
import { ColorExtractor } from '../../utils/color-extractor';
import { MiniPlayer } from './components/mini-player/mini-player';
import { ExpandedPlayer } from './components/expanded-player/expanded-player';

@Component({
  selector: 'app-player',
  standalone: true,
  imports: [CommonModule, MiniPlayer, ExpandedPlayer],
  templateUrl: './player.html',
  styleUrl: './player.css',
})
export class Player {
  /** Web player service inject */
  protected readonly webPlayer = inject(PlayerService);

  /** Signal to store extracted colors for ambient background */
  protected readonly currentColors = signal<string[]>(['#18181b', '#27272a', '#3f3f46']);
  /** Signal to track if the background is light (to adapt text color) */
  protected readonly isLightBackground = signal<boolean>(false);
  /** Signal to track if the open mode is closing (for animations) */
  protected readonly isClosing = signal<boolean>(false);

  constructor() {
    // Effect to extract colors when track changes
    effect(async () => {
      const track = this.webPlayer.currentTrack();
      if (track) {
        const result = await ColorExtractor.extract(track.coverFull);
        this.currentColors.set(result.colors);
        this.isLightBackground.set(result.isLight);
      }
    });
  }

  /**
   * Toggle the expanded player view with closing animation support
   */
  toggleOpenMode(): void {
    if (this.webPlayer.isOpenMode()) {
      // Start closing animation
      this.isClosing.set(true);
      // Wait for animation to finish (500ms match CSS)
      setTimeout(() => {
        this.webPlayer.isOpenMode.set(false);
        this.isClosing.set(false);
      }, 500);
    } else {
      this.webPlayer.isOpenMode.set(true);
    }
  }
}
