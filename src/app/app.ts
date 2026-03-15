import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Config } from './services/config/config';
import { Player } from './components/player/player';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  /** NavidromeConfig ResourceRef */
  readonly navidromeConfig = inject(Config).navidromeConfigResource;
}
