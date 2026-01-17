import { supabase } from '../../lib/supabase';

export async function fetchDashboardStats() {
  const [customers, buildings, assets] = await Promise.all([
    supabase.from('customers').select('id', { count: 'exact', head: true }),
    supabase.from('buildings').select('id', { count: 'exact', head: true }),
    supabase.from('assets').select('id', { count: 'exact', head: true }),
  ]);

  if (customers.error || buildings.error || assets.error) {
    throw new Error('Failed to fetch dashboard stats');
  }

  return {
    customers: customers.count ?? 0,
    buildings: buildings.count ?? 0,
    assets: assets.count ?? 0,
  };
}
