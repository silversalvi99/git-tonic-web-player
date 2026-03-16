import { Component, inject } from '@angular/core';
import { WebPlayer as PlayerService } from '../../services/web-player/web-player';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { FormatDurationPipe } from '../../pipes/format-duration-pipe';
import { Track } from '../../models/track.model';

@Component({
  selector: 'app-player',
  imports: [CommonModule, FormatDurationPipe],
  templateUrl: './player.html',
  styleUrl: './player.css',
})
export class Player {
  protected readonly webPlayer = inject(PlayerService);

  onSeek(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.webPlayer.seek(parseFloat(target.value));
  }

  onVolumeChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.webPlayer.setVolume(parseFloat(target.value));
  }

  toggleMute(): void {
    if (this.webPlayer.volume() > 0) {
      this.webPlayer.setVolume(0);
    } else {
      this.webPlayer.setVolume(1);
    }
  }
}
