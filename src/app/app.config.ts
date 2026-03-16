import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { Config } from './services/config/config';
import { toObservable } from '@angular/core/rxjs-interop';
import { filter, first } from 'rxjs';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideAppInitializer(() => {
      const navidromConfigResource = inject(Config).navidromeConfigResource;

      return toObservable(navidromConfigResource.isLoading).pipe(
        filter((loading) => loading === false),
        first(),
      );
    }),
  ],
};
