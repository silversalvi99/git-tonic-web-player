import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideTranslateService } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';
import { routes } from './app.routes';
import { Config } from './services/config/config';
import { toObservable } from '@angular/core/rxjs-interop';
import { filter, first } from 'rxjs';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(),
    provideTranslateService({
      loader: provideTranslateHttpLoader({ prefix: 'assets/i18n/' }),
      fallbackLang: 'it',
    }),
    provideAppInitializer(() => {
      const navidromConfigResource = inject(Config).navidromeConfigResource;

      return toObservable(navidromConfigResource.isLoading).pipe(
        filter((loading) => loading === false),
        first(),
      );
    }),
  ],
};
