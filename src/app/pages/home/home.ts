import { Component } from '@angular/core';
import { TracksList } from '../../components/tracks-list/tracks-list';
import { SearchSongs } from '../../components/search-songs/search-songs';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-home',
  imports: [TracksList, SearchSongs, TranslateModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {}
