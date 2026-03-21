import { Injectable, signal, effect, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

export type AppLanguage = 'it' | 'en' | 'es';
export type AppTheme = 'light' | 'dark' | 'system';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  /** Storage key */
  private readonly STORAGE_KEY = 'gin_tonic_settings';
  /** Translate service */
  private readonly translate = inject(TranslateService);

  /** Settings */
  readonly settings = signal({
    language: this.getInitialLanguage(),
    theme: this.getInitialTheme(),
  });

  constructor() {
    this.translate.use(this.settings().language);

    // Persist changes to localStorage and update translation service
    effect(() => {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.settings()));
      this.translate.use(this.settings().language);
    });
  }

  /**
   * Get initial language
   * @returns Initial language
   */
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

  /**
   * Get initial theme
   * @returns Initial theme
   */
  private getInitialTheme(): AppTheme {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed.theme) return parsed.theme;
      } catch (e) {
        console.error('Error parsing theme from localStorage', e);
      }
    }
    return 'dark'; // Default to dark
  }

  /**
   * Update language
   * @param lang Language to set
   */
  updateLanguage(lang: AppLanguage) {
    this.settings.update((s) => ({ ...s, language: lang }));
  }

  /**
   * Update theme
   * @param theme Theme to set
   */
  updateTheme(theme: AppTheme) {
    this.settings.update((s) => ({ ...s, theme }));
  }
}
