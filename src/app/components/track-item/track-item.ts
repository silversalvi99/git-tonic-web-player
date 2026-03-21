import { Component, computed, inject, input } from '@angular/core';
import { Track } from '../../models/track.model';
import { FormatDurationPipe } from '../../pipes/format-duration-pipe';
import { WebPlayer } from '../../services/web-player/web-player';

@Component({
  selector: 'app-track-item',
  standalone: true,
  imports: [FormatDurationPipe],
  templateUrl: './track-item.html',
  styleUrl: './track-item.css',
})
export class TrackItem {
  /** PlayerService instance */
  private readonly playerService = inject(WebPlayer);
  /** The track to display */
  track = input.required<Track>();

  /** Compted signal to check if the track is the current track */
  readonly isCurrentTrack = computed(
    () => this.playerService.currentTrack()?.id === this.track().id,
  );

  /**
   * Handle click on the track item, play the track
   */
  onItemClick(): void {
    this.playerService.playTrack(this.track());
  }
}
