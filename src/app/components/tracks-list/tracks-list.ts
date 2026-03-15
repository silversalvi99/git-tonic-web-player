import { Component, computed, inject, input } from '@angular/core';
import { RestApi } from '../../services/api/rest-api';
import { TrackItem } from '../track-item/track-item';

@Component({
  selector: 'app-tracks-list',
  imports: [TrackItem],
  templateUrl: './tracks-list.html',
  styleUrl: './tracks-list.css',
})
export class TracksList {
  /** Random tracks resource */
  readonly randomTrack = inject(RestApi).randomTracksResource;
}
