import { inject } from '@angular/core'; // Fondamentale per recuperare Location
import { Location } from '@angular/common'; // Il servizio che gestisce i path
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { AuthGuardData, createAuthGuard } from 'keycloak-angular';

/**
 * Checks if the user is authenticated and has access to the requested route.
 * @param _route The activated route.
 * @param state The router state.
 * @param authData The authentication guard data.
 * @returns A promise that resolves to a boolean or a UrlTree.
 */
const isAccessAllowed = async (
  _route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
  authData: AuthGuardData,
): Promise<boolean | UrlTree> => {
  const { authenticated, keycloak } = authData;
  const location = inject(Location);

  if (!authenticated) {
    const redirectPath = location.prepareExternalUrl('/home');

    await keycloak.login({
      redirectUri: window.location.origin + redirectPath,
    });

    return false;
  }

  return true;
};

export const authGuard = createAuthGuard<CanActivateFn>(isAccessAllowed);
