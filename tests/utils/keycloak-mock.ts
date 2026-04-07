import { Page } from '@playwright/test';

/**
 * Mocks the Keycloak global object to simulate an authenticated state.
 * This should be called before navigate to ensure the mock is in place
 * when the Angular app initializes.
 */
export async function mockKeycloak(page: Page) {
  await page.addInitScript(() => {
    const mockTokenPayload = {
      exp: Math.floor(Date.now() / 1000) + 3600,
      iat: Math.floor(Date.now() / 1000),
      sub: 'test-user-id',
      preferred_username: 'test-user',
      name: 'Test User',
      email: 'test@example.com',
      realm_access: { roles: ['user'] },
    };

    // Base64Url encoding for JWT
    const base64Url = (str: string) => {
      return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    };

    const mockToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${base64Url(JSON.stringify(mockTokenPayload))}.dummy-signature`;

    const mockKeycloakInstance = {
      init: () => {
        console.log('[MockKeycloak] init called');
        return Promise.resolve(true); // authenticated = true
      },
      login: () => {
        console.log('[MockKeycloak] login called');
        return Promise.resolve();
      },
      logout: () => {
        console.log('[MockKeycloak] logout called');
        return Promise.resolve();
      },
      updateToken: () => {
        console.log('[MockKeycloak] updateToken called');
        return Promise.resolve(true);
      },
      loadUserProfile: () => {
        console.log('[MockKeycloak] loadUserProfile called');
        return Promise.resolve({
          username: 'test-user',
          email: 'test@example.com',
          firstName: 'Test',
          lastName: 'User',
        });
      },
      authenticated: true,
      token: mockToken,
      idToken: mockToken,
      tokenParsed: mockTokenPayload,
      realmAccess: mockTokenPayload.realm_access,
      resourceAccess: {},
      subject: mockTokenPayload.sub,
      timeSkew: 0,
    };

    // We mock the Keycloak constructor on the window object
    // Many apps/libraries look for this if they don't have it bundled
    // or if it's expected to be global.
    (window as any).Keycloak = function () {
      console.log('[MockKeycloak] constructor called');
      return mockKeycloakInstance;
    };
  });
}
