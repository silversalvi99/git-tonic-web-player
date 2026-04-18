import { Component, inject, effect, Renderer2 } from '@angular/core';
import { SettingsService, AppTheme } from '../../services/settings/settings.service';

@Component({
  selector: 'app-theme-manager',
  standalone: true,
  templateUrl: './theme-manager.html',
  styleUrl: './theme-manager.css',
})
export class ThemeManagerComponent {
  /** SettingsService inject */
  private readonly settingsService = inject(SettingsService);
  /** Renderer2 inject */
  private readonly renderer = inject(Renderer2);

  constructor() {
    effect(() => {
      const theme = this.settingsService.settings().theme;
      this.applyTheme(theme);
    });

    // Listen for system theme changes
    if (window?.matchMedia) {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
        if (this.settingsService.settings().theme === 'system') {
          this.applyTheme('system');
        }
      });
    }
  }

  /**
   * Apply theme to the application
   * @param theme Theme to apply
   */
  private applyTheme(theme: AppTheme): void {
    const root = document.documentElement;
    const body = document.body;

    // Add transition class
    this.renderer.addClass(body, 'theme-transitioning');

    // Determine actual theme (eliminato l'assegnamento inutile)
    const actualTheme =
      theme === 'system'
        ? window.matchMedia('(prefers-color-scheme: light)').matches
          ? 'light'
          : 'dark'
        : (theme as 'light' | 'dark');

    // Apply theme class
    if (actualTheme === 'light') {
      this.renderer.removeClass(root, 'dark');
    } else {
      this.renderer.addClass(root, 'dark');
    }

    // Remove transition class after animation finishes
    setTimeout(() => {
      this.renderer.removeClass(body, 'theme-transitioning');
    }, 1000);
  }
}
