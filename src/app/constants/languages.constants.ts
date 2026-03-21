import { signal } from '@angular/core';
import { AppLanguage } from '../services/settings/settings.service';

export const LANGUAGES = signal<{ value: AppLanguage; label: string }[]>([
  { value: 'it', label: 'Italiano' },
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Español' },
]).asReadonly();
