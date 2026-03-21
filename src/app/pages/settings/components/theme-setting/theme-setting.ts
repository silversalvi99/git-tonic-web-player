import { Component, inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroSun, heroMoon, heroComputerDesktop } from '@ng-icons/heroicons/outline';
import { AppTheme, SettingsService } from '../../../../services/settings/settings.service';
import { THEMES } from '../../../../constants/themes.constants';

@Component({
  selector: 'app-theme-setting',
  standalone: true,
  imports: [TranslateModule, NgIcon],
  providers: [provideIcons({ heroSun, heroMoon, heroComputerDesktop })],
  templateUrl: './theme-setting.html',
  styleUrl: './theme-setting.css',
})
export class ThemeSettingComponent {
  /** SettingsService inject */
  private readonly settingsService = inject(SettingsService);
  /** Current settings */
  readonly currentSettings = this.settingsService.settings;
  /** Available themes */
  readonly themes = THEMES;

  /**
   * Handle theme change
   * @param theme Theme to set
   */
  onThemeChange(theme: AppTheme): void {
    this.settingsService.updateTheme(theme);
  }
}
