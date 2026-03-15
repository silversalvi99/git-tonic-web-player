import { HttpClient, httpResource } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { NavidromeConfig } from '../../models/navidrome-config.model';

@Injectable({
  providedIn: 'root',
})
export class Config {
  /** Navidrome config resource */
  public readonly navidromeConfigResource = httpResource<NavidromeConfig>(
    () => '/assets/config.json',
  );
}
