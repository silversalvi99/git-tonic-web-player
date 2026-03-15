import { Component, inject, input, Input } from '@angular/core';
import { Track } from '../../models/track.model';
import { FormatDurationPipe } from '../../pipes/format-duration-pipe';
import { Player } from '../../services/player/player.service';

@Component({
  selector: 'app-track-item',
  standalone: true,
  imports: [FormatDurationPipe],
  templateUrl: './track-item.html',
  styleUrl: './track-item.css',
})
export class TrackItem {
  /** PlayerService instance */
  private readonly playerService = inject(Player);
  /** The track to display */
  track = input.required<Track>();
  /** The index of the track in the list */
  index = input.required<number>();

  /**
   * Handle click on the track item, play the track
   */
  onItemClick(): void {
    this.playerService.playTrack(this.track());
  }
}
