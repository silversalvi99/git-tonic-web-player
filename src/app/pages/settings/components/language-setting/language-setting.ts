import { Component, inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroLanguage } from '@ng-icons/heroicons/outline';
import { AppLanguage, SettingsService } from '../../../../services/settings/settings.service';
import { LANGUAGES } from '../../../../constants/languages.constants';

@Component({
  selector: 'app-language-setting',
  standalone: true,
  imports: [TranslateModule, NgIcon],
  providers: [provideIcons({ heroLanguage })],
  templateUrl: './language-setting.html',
  styleUrl: './language-setting.css',
})
export class LanguageSettingComponent {
  /** SettingsService inject */
  private readonly settingsService = inject(SettingsService);
  /** Current settings */
  readonly currentSettings = this.settingsService.settings;
  /** Available languages */
  readonly languages = LANGUAGES;

  /**
   * Handle language change
   * @param event Event
   */
  updateLanguage(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.settingsService.updateLanguage(select.value as AppLanguage);
  }

  /**
   * Handle language blur
   * @param event Event
   */
  onLanguageBlur(event: Event): void {
    const select = event.target as HTMLSelectElement;
    select.blur();
  }
}
