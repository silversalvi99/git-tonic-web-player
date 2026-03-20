import { Component, effect, inject, signal } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroArrowPath, heroXMark } from '@ng-icons/heroicons/outline';
import { debounce, form, FormField } from '@angular/forms/signals';
import { RestApi } from '../../services/api/rest-api';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-search-songs',
  imports: [FormField, NgIcon, TranslateModule],
  providers: [provideIcons({ heroXMark, heroArrowPath })],
  templateUrl: './search-songs.html',
  styleUrl: './search-songs.css',
})
export class SearchSongs {
  /** RestApi inject */
  private readonly restApi = inject(RestApi);
  /** Form control signal */
  searchForm = form(signal({ search: '' }), (schema) => {
    debounce(schema.search, 800);
  });

  constructor() {
    effect(() => {
      const searchTerm = this.searchForm().value().search;
      this.restApi.searchTerm.set(searchTerm);
    });
  }

  refresh() {
    this.searchForm.search().value.set('');
    this.restApi.refreshTracks.update((count) => count + 1);
  }
}
