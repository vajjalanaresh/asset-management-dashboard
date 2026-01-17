import { Auth0Provider } from "@auth0/auth0-react";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <Auth0Provider
      domain={import.meta.env.AUTH0_DOMAIN}
      clientId={import.meta.env.AUTH0_CLIENT_ID}
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: import.meta.env.AUTH0_AUDIENCE,
      }}
    >
      {children}
    </Auth0Provider>
  );
}
