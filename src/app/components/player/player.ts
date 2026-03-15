import { Component, inject } from '@angular/core';
import { Player as PlayerService } from '../../services/player/player.service';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { FormatDurationPipe } from '../../pipes/format-duration-pipe';

@Component({
  selector: 'app-player',
  imports: [CommonModule, FormatDurationPipe],
  templateUrl: './player.html',
  styleUrl: './player.css',
})
export class Player {
  protected readonly playerService = inject(PlayerService);

  onSeek(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.playerService.seek(parseFloat(target.value));
  }
}
