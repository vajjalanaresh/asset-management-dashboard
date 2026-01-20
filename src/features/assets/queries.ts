import { supabase } from '../../lib/supabase';
import type { Asset } from './types';
import type { AssetStatus } from "../../types/status";

export async function fetchAssets(buildingId: string): Promise<Asset[]> {
  const { data, error } = await supabase
    .from('assets')
    .select('*')
    .eq('building_id', buildingId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}


export async function createAsset(data: {
  building_id: string;
  name: string;
  type?: string;
  status: AssetStatus;
}) {
  const { error } = await supabase.from("assets").insert(data);
  if (error) throw error;
}

export async function fetchAssetById(assetId: string) {
  const { data, error } = await supabase
    .from("assets")
    .select("*")
    .eq("id", assetId)
    .single();

  if (error) throw error;
  return data;
}

export async function updateAssetStatus(
  assetId: string,
  status: string,
) {
  const { error } = await supabase
    .from("assets")
    .update({ status })
    .eq("id", assetId);

  if (error) throw error;
}

export async function updateAsset(
  assetId: string,
  data: {
    name?: string;
    type?: string;
    status?: AssetStatus;
  }
) {
  const { error } = await supabase
    .from("assets")
    .update(data)
    .eq("id", assetId);

  if (error) throw error;
}

export async function fetchAllAssets(status?: string) {
  let query = supabase.from("assets").select("*");

  if (status) {
    query = query.eq("status", status);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data;
}

export async function deleteAsset(assetId: string) {
  const { error } = await supabase
    .from("assets")
    .delete()
    .eq("id", assetId);

  if (error) throw error;
}
