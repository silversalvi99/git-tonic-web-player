import { Injectable, signal, effect, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

export type AppLanguage = 'it' | 'en' | 'es';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  private readonly STORAGE_KEY = 'gin_tonic_settings';
  private readonly translate = inject(TranslateService);

  // Extensible settings object
  readonly settings = signal({
    language: this.getInitialLanguage(),
  });

  constructor() {
    this.translate.setDefaultLang('it');
    this.translate.use(this.settings().language);

    // Persist changes to localStorage and update translation service
    effect(() => {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.settings()));
      this.translate.use(this.settings().language);
    });
  }

  private getInitialLanguage(): AppLanguage {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed.language) return parsed.language;
      } catch (e) {
        console.error('Error parsing settings from localStorage', e);
      }
    }

    const browserLang = this.translate.getBrowserLang();
    if (browserLang?.startsWith('en')) return 'en';
    if (browserLang?.startsWith('es')) return 'es';
    return 'it';
  }

  updateLanguage(lang: AppLanguage) {
    this.settings.update((s) => ({ ...s, language: lang }));
  }
}
