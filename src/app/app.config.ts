import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';
import { routes } from './app.routes';
import { Config } from './services/config/config';
import { toObservable } from '@angular/core/rxjs-interop';
import { filter, first } from 'rxjs';
import {
  AutoRefreshTokenService,
  provideKeycloak,
  UserActivityService,
  withAutoRefreshToken,
} from 'keycloak-angular';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
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
    provideKeycloak({
      config: {
        url: window.env.apiDomain,
        realm: window.env.keycloakRealm,
        clientId: window.env.keycloakClientId,
      },
      initOptions: {
        onLoad: 'check-sso',
        silentCheckSsoRedirectUri: window.location.origin + '/assets/silent-check-sso.html',
        checkLoginIframe: false,
      },
      features: [withAutoRefreshToken()],
      providers: [AutoRefreshTokenService, UserActivityService],
    }),
  ],
};
