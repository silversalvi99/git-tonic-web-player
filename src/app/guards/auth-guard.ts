import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { AuthGuardData, createAuthGuard } from 'keycloak-angular';

/**
 * Checks if the user is authenticated and has access to the requested route.
 * @param route The activated route.
 * @param state The router state.
 * @param authData The authentication guard data.
 * @returns A promise that resolves to a boolean or a UrlTree.
 */
const isAccessAllowed = async (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
  authData: AuthGuardData,
): Promise<boolean | UrlTree> => {
  const { authenticated, keycloak } = authData;

  if (!authenticated) {
    await keycloak.login({
      redirectUri: window.location.origin + state.url,
    });

    return false;
  }

  return true;
};

export const authGuard = createAuthGuard<CanActivateFn>(isAccessAllowed);
