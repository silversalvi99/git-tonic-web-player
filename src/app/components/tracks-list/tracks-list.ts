import { Component, effect, inject } from '@angular/core';
import { RestApi } from '../../services/api/rest-api';
import { TrackItem } from '../track-item/track-item';
import { WebPlayer } from '../../services/web-player/web-player';

@Component({
  selector: 'app-tracks-list',
  imports: [TrackItem],
  templateUrl: './tracks-list.html',
  styleUrl: './tracks-list.css',
})
export class TracksList {
  /** Random tracks resource */
  readonly randomTrack = inject(RestApi).randomTracksResource;
  /** Player service */
  readonly player = inject(WebPlayer);

  constructor() {
    effect(() => {
      const tracks = this.randomTrack.value();
      if (tracks) {
        this.player.queue.set(tracks);
      }
    });
  }
}
