import { Component, computed, inject } from '@angular/core';
import { AppLanguage, SettingsService } from '../../services/settings/settings.service';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroLanguage, heroCheck, heroCog6Tooth } from '@ng-icons/heroicons/outline';
import { Sidebar } from '../../components/sidebar/sidebar';
import { Tabs } from '../../components/tabs/tabs';
import { Player } from '../../components/player/player';
import { WebPlayer } from '../../services/web-player/web-player';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-settings',
  imports: [NgIcon, Sidebar, Tabs, Player, TranslateModule],
  providers: [provideIcons({ heroLanguage, heroCheck, heroCog6Tooth })],
  templateUrl: './settings.html',
  styleUrl: './settings.css',
})
export class Settings {
  private readonly settingsService = inject(SettingsService);
  private readonly webPlayer = inject(WebPlayer);

  readonly currentSettings = this.settingsService.settings;

  /** Signal that return true if the player is visible */
  readonly isPlayerVisible = computed(() => {
    return !!this.webPlayer.currentTrack();
  });

  readonly languages: { label: string; value: AppLanguage }[] = [
    { label: 'Italiano', value: 'it' },
    { label: 'English', value: 'en' },
    { label: 'Español', value: 'es' },
  ];

  updateLanguage(lang: AppLanguage) {
    if (this.currentSettings().language === lang) return;
    this.settingsService.updateLanguage(lang);
  }

  onLanguageChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.updateLanguage(select.value as AppLanguage);
  }
}
