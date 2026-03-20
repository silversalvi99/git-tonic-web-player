import { Component, effect, inject } from '@angular/core';
import { RestApi } from '../../services/api/rest-api';
import { TrackItem } from '../track-item/track-item';
import { WebPlayer } from '../../services/web-player/web-player';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-tracks-list',
  imports: [TrackItem, TranslateModule],
  templateUrl: './tracks-list.html',
  styleUrl: './tracks-list.css',
})
export class TracksList {
  /** Random tracks resource */
  readonly tracks = inject(RestApi).tracks;
  /** Player service */
  private readonly player = inject(WebPlayer);

  constructor() {
    effect(() => {
      const tracks = this.tracks().value();
      if (tracks) {
        this.player.queue.set(tracks);
      }
    });
  }
}
