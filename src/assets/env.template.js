(function (window) {
  window['env'] = window['env'] || {};

  window['env']['apiDomain'] = '${API_DOMAIN}';
  window['env']['keycloakRealm'] = '${KEYCLOAK_REALM}';
  window['env']['keycloakClientId'] = '${KEYCLOAK_CLIENT_ID}';
})(this);
