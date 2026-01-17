import { supabase } from "../lib/supabase";

export const apiService = {
  /* ---------------- DASHBOARD STATS ---------------- */

  async getStats() {
    const [
      customers,
      buildings,
      assets,
      activeAssets,
      maintenanceAssets,
    ] = await Promise.all([
      supabase.from("customers").select("id", { count: "exact", head: true }),
      supabase.from("buildings").select("id", { count: "exact", head: true }),
      supabase.from("assets").select("id", { count: "exact", head: true }),
      supabase
        .from("assets")
        .select("id", { count: "exact", head: true })
        .eq("status", "Active"),
      supabase
        .from("assets")
        .select("id", { count: "exact", head: true })
        .eq("status", "Maintenance"),
    ]);

    if (
      customers.error ||
      buildings.error ||
      assets.error ||
      activeAssets.error ||
      maintenanceAssets.error
    ) {
      throw new Error("Failed to fetch dashboard stats");
    }

    return {
      totalCustomers: customers.count ?? 0,
      totalBuildings: buildings.count ?? 0,
      totalAssets: assets.count ?? 0,
      activeAssets: activeAssets.count ?? 0,
      maintenanceAssets: maintenanceAssets.count ?? 0,
    };
  },

  /* ---------------- AI INSIGHTS (REAL DATA INPUT) ---------------- */

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async getAIInsights(stats: any) {
    // later you can call an AI API
    return `• ${stats.activeAssets} assets are currently active.
• ${stats.maintenanceAssets} assets are under maintenance.
• Asset distribution is healthy overall.`;
  },

  /* ---------------- CUSTOMERS ---------------- */

  async getCustomers() {
    const { data, error } = await supabase
      .from("customers")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data ?? [];
  },

  /* ---------------- BUILDINGS ---------------- */

  async getBuildings(customerId?: string) {
    let query = supabase.from("buildings").select("*");

    if (customerId) {
      query = query.eq("customer_id", customerId);
    }

    const { data, error } = await query.order("created_at", {
      ascending: false,
    });

    if (error) throw error;
    return data ?? [];
  },

  /* ---------------- ASSETS ---------------- */

  async getAssets(buildingId?: string) {
    let query = supabase.from("assets").select("*");

    if (buildingId) {
      query = query.eq("building_id", buildingId);
    }

    const { data, error } = await query.order("created_at", {
      ascending: false,
    });

    if (error) throw error;
    return data ?? [];
  },
};
