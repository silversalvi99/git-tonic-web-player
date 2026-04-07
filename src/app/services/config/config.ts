import { httpResource } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NavidromeConfig } from '../../models/navidrome-config.model';

@Injectable({
  providedIn: 'root',
})
export class Config {
  /** Navidrome config resource */
  public readonly navidromeConfigResource = httpResource<NavidromeConfig>(
    () => 'assets/config.json',
  );
}
