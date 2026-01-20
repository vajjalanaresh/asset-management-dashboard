import { supabase } from "../../lib/supabase";

export async function fetchDashboardStats() {
  const [
    customers,
    buildings,
    assets,
  ] = await Promise.all([
    supabase.from("customers").select("id", { count: "exact" }),
    supabase.from("buildings").select("id", { count: "exact" }),
    supabase.from("assets").select("status", { count: "exact" }),
  ]);

  const totalAssets = assets.count || 0;

  return {
    totalCustomers: customers.count || 0,
    totalBuildings: buildings.count || 0,
    totalAssets,
    activeAssets:
      assets.data?.filter((a) => a.status === "Active").length || 0,
    maintenanceAssets:
      assets.data?.filter((a) => a.status === "Maintenance").length || 0,
  };
}
