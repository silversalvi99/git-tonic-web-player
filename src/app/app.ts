import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThemeManagerComponent } from './components/theme-manager/theme-manager';
import { Config } from './services/config/config';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ThemeManagerComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  /** NavidromeConfig ResourceRef */
  readonly navidromeConfig = inject(Config).navidromeConfigResource;
}
