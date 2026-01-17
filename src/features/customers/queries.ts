import { supabase } from "../../lib/supabase";
import type { Customer } from "./types";

export async function fetchCustomers(): Promise<Customer[]> {
  const { data, error } = await supabase
    .from("customers")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}



export async function createCustomer(name: string) {
  const { error } = await supabase.from("customers").insert({ name });
  if (error) throw error;
}


/* ✅ ADD THIS */
export async function deleteCustomer(customerId: string) {
  const { error } = await supabase
    .from("customers")
    .delete()
    .eq("id", customerId);

  if (error) throw error;
}


export async function deleteCustomerCascade(customerId: string) {
  // 1️⃣ Get buildings
  const { data: buildings, error: bErr } = await supabase
    .from("buildings")
    .select("id")
    .eq("customer_id", customerId);

  if (bErr) throw bErr;

  const buildingIds = buildings?.map((b) => b.id) || [];

  // 2️⃣ Delete assets
  if (buildingIds.length > 0) {
    const { error: aErr } = await supabase
      .from("assets")
      .delete()
      .in("building_id", buildingIds);

    if (aErr) throw aErr;
  }

  // 3️⃣ Delete buildings
  const { error: dErr } = await supabase
    .from("buildings")
    .delete()
    .eq("customer_id", customerId);

  if (dErr) throw dErr;

  // 4️⃣ Delete customer
  const { error: cErr } = await supabase
    .from("customers")
    .delete()
    .eq("id", customerId);

  if (cErr) throw cErr;
}
