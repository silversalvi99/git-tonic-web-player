import { Component, inject, input, Input } from '@angular/core';
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

  /**
   * Handle click on the track item, play the track
   */
  onItemClick(): void {
    this.playerService.playTrack(this.track());
  }
}
