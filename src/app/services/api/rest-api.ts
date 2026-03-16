import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, resource } from '@angular/core';
import { Config } from '../config/config';
import { Md5 } from 'ts-md5';
import { TrackMapper } from '../../mappers/track.mapper';
import { SubsonicResponse, Track } from '../../models/track.model';
import { firstValueFrom, map } from 'rxjs';
import { sleep } from '../../utils/utils';

@Injectable({
  providedIn: 'root',
})
export class RestApi {
  /** ConfigService inject */
  private readonly configService = inject(Config);
  /** HttpClient inject */
  private readonly http = inject(HttpClient);

  /**
   * Navidrome auth params signal
   */
  private readonly navidromeAuthParams = computed(() => {
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
  public readonly randomTracksResource = resource({
    params: () => {
      const navidromeConfigValue = this.configService.navidromeConfigResource.value();
      const authParams = this.navidromeAuthParams();

      if (!navidromeConfigValue || !authParams) {
        return;
      }

      return { url: `${navidromeConfigValue.baseUrl}/getRandomSongs.view?${authParams}&size=30` };
    },
    loader: async ({ params }) => {
      if (!params.url) {
        return;
      }

      const navidromeBaseUrl = this.configService.navidromeConfigResource.value()?.baseUrl;
      if (!navidromeBaseUrl) {
        return;
      }

      const navidromeAuthParams = this.navidromeAuthParams();
      if (!navidromeAuthParams) {
        return;
      }

      console.log('Fetching random tracks from:', params.url);
      const getSongs$ = this.http.get<SubsonicResponse>(params.url).pipe(
        map((res) => {
          console.log('Received API response:', res);
          const rawSongs = res['subsonic-response'].randomSongs?.song || [];
          return rawSongs.map((song) =>
            TrackMapper.fromNavidrome(song, navidromeBaseUrl, navidromeAuthParams),
          );
        }),
      );
      await sleep(1000);
      try {
        const result = await firstValueFrom(getSongs$);
        console.log('Mapped tracks:', result?.length || 0);
        return result;
      } catch (err) {
        console.error('Error in RestApi resource loader:', err);
        throw err;
      }
    },
  });

  /**
   * Refresh the random track resource
   */
  refresh() {
    this.randomTracksResource.reload();
  }
}
