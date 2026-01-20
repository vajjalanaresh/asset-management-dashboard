import { useAuth0 } from "@auth0/auth0-react";
import { useEffect } from "react";
import { supabase } from "../lib/supabase";

export function useAuth0SupabaseSync() {
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    if (!isAuthenticated) return;

    const sync = async () => {
      const token = await getAccessTokenSilently();
      supabase.auth.setSession({
        access_token: token,
        refresh_token: "",
      });
    };

    sync();
  }, [isAuthenticated, getAccessTokenSilently]);
}
