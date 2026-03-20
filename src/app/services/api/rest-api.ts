import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Config } from '../config/config';
import { Md5 } from 'ts-md5';
import { TrackMapper } from '../../mappers/track.mapper';
import { RandomSongsResponse, SearchResponse } from '../../models/track.model';
import { catchError, delay, map, of } from 'rxjs';
import { rxResource } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root',
})
export class RestApi {
  /** ConfigService inject */
  private readonly configService = inject(Config);
  /** HttpClient inject */
  private readonly http = inject(HttpClient);
  /** Search term signal */
  readonly searchTerm = signal('');
  /** Refresh tracks signal */
  readonly refreshTracks = signal(0);

  /**
   * Navidrome auth params signal
   */
  private readonly navidromeAuthParams = computed(() => {
    this.refreshTracks();
    const navidromeConfigValue = this.configService.navidromeConfigResource.value();

    if (!navidromeConfigValue) {
      return null;
    }

    const navidromeToken = Md5.hashStr(navidromeConfigValue.password + navidromeConfigValue.salt);
    return `u=${navidromeConfigValue.user}&t=${navidromeToken}&s=${navidromeConfigValue.salt}&v=${navidromeConfigValue.version}&c=${navidromeConfigValue.clientName}&f=json`;
  });

  /**
   * Resouce that load random track from api
   */
  private readonly randomTracksResource = rxResource({
    params: () => {
      this.refreshTracks();
      const navidromeConfigValue = this.configService.navidromeConfigResource.value();
      const authParams = this.navidromeAuthParams();

      if (!navidromeConfigValue || !authParams) {
        return;
      }

      return { url: `${navidromeConfigValue.baseUrl}/getRandomSongs.view?${authParams}` };
    },
    stream: ({ params }) => {
      const navidromeBaseUrl = this.configService.navidromeConfigResource.value()?.baseUrl;
      const navidromeAuthParams = this.navidromeAuthParams();

      if (!navidromeBaseUrl || !navidromeAuthParams) {
        return of([]);
      }

      return this.http.get<RandomSongsResponse>(params.url).pipe(
        map((res) => {
          const rawSongs = res['subsonic-response'].randomSongs?.song || [];
          return rawSongs.map((song) =>
            TrackMapper.fromNavidrome(song, navidromeBaseUrl, navidromeAuthParams),
          );
        }),
        delay(1000),
        catchError((err) => {
          console.error('Error in RestApi resource loader:', err);
          return of([]);
        }),
      );
    },
  });

  /**
   * Resource that load search track from api via query string
   */
  private readonly searchTracksResource = rxResource({
    params: () => {
      const navidromeConfigValue = this.configService.navidromeConfigResource.value();
      const authParams = this.navidromeAuthParams();

      if (!navidromeConfigValue || !authParams) {
        return;
      }

      return {
        url: `${navidromeConfigValue.baseUrl}/search3.view?${authParams}&query=${this.searchTerm()}`,
      };
    },
    stream: ({ params }) => {
      const navidromeBaseUrl = this.configService.navidromeConfigResource.value()?.baseUrl;
      const navidromeAuthParams = this.navidromeAuthParams();

      if (!navidromeBaseUrl || !navidromeAuthParams) {
        return of([]);
      }

      return this.http.get<SearchResponse>(params.url).pipe(
        map((res) => {
          const rawSongs = res['subsonic-response'].searchResult3?.song || [];
          return rawSongs.map((song) =>
            TrackMapper.fromNavidrome(song, navidromeBaseUrl, navidromeAuthParams),
          );
        }),
        delay(1000),
        catchError((err) => {
          console.error('Error in RestApi resource loader:', err);
          return of([]);
        }),
      );
    },
  });

  /**
   * Computed signal that return the random tracks resource or the search tracks resource
   */
  tracks = computed(() => {
    return this.searchTerm() ? this.searchTracksResource : this.randomTracksResource;
  });

  /**
   * Refresh the random tracks resource
   */
  refreshRandomTracks() {
    this.randomTracksResource.reload();
  }
}
