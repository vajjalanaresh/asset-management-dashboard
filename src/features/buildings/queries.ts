import { supabase } from '../../lib/supabase';
import type { Building } from './types';

export async function fetchBuildings(customerId: string): Promise<Building[]> {
  const { data, error } = await supabase
    .from('buildings')
    .select('*')
    .eq('customer_id', customerId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function createBuilding(input: {
  customer_id: string;
  name: string;
  address?: string;
  status: 'Active' | 'Inactive';
  square_footage?: number;
}) {
  const { error } = await supabase.from('buildings').insert(input);
  if (error) throw error;
}


/* Fetch all buildings (for dashboard / overview) */
export async function fetchAllBuildings() {
  const { data, error } = await supabase
    .from("buildings")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function deleteBuildingCascade(buildingId: string) {
  // 1️⃣ Delete assets first
  const { error: assetError } = await supabase
    .from("assets")
    .delete()
    .eq("building_id", buildingId);

  if (assetError) throw assetError;

  // 2️⃣ Delete building
  const { error: buildingError } = await supabase
    .from("buildings")
    .delete()
    .eq("id", buildingId);

  if (buildingError) throw buildingError;
}