declare global {
  interface Window {
    env: {
      apiDomain: string;
      keycloakRealm: string;
      keycloakClientId: string;
      appName: string;
    };
  }
}
export {};
