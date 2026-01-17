import { useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { useQueryClient } from "@tanstack/react-query";

export function useDashboardRealtime() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel("dashboard-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "assets" },
        () => {
          queryClient.invalidateQueries({
            queryKey: ["dashboard-stats"],
          });
        }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "buildings" },
        () => {
          queryClient.invalidateQueries({
            queryKey: ["dashboard-stats"],
          });
        }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "customers" },
        () => {
          queryClient.invalidateQueries({
            queryKey: ["dashboard-stats"],
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);
}
