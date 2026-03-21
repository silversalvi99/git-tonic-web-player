import { signal } from '@angular/core';
import { AppTheme } from '../services/settings/settings.service';

export const THEMES = signal<{ value: AppTheme; label: string; icon: string }[]>([
  { value: 'light', label: 'themeLight', icon: 'heroSun' },
  { value: 'dark', label: 'themeDark', icon: 'heroMoon' },
  { value: 'system', label: 'themeSystem', icon: 'heroComputerDesktop' },
]).asReadonly();
