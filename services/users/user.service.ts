/**
 * User Service - Saved Addresses
 * Handles CRUD for `saved_addresses` and default address management
 */

import { createClient } from "@/lib/supabase/client";
import { fetchWithRetry } from "@/lib/utils/retry";
import { SupabaseClient } from "@supabase/supabase-js";

export interface SavedAddressInput {
  name: string;
  first_name: string;
  last_name: string;
  company?: string | null;
  address_line_1: string;
  address_line_2?: string | null;
  city: string;
  state: string;
  postal_code: string;
  country?: string;
  phone?: string | null;
  is_default?: boolean;
}

export interface SavedAddress extends SavedAddressInput {
  id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export async function getSavedAddresses(
  userId: string
): Promise<SavedAddress[]> {
  // Prefer server API (service role) to avoid RLS/network edge cases
  try {
    const res = await fetchWithRetry(`/api/user/addresses/${userId}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    const data = (await res.json()) as SavedAddress[];
    return data || [];
  } catch (apiErr) {
    console.warn("⚠️ Fallback to client Supabase for addresses", apiErr);

    const supabase = createClient() as SupabaseClient;
    const { data, error } = await supabase
      .from("saved_addresses")
      .select("*")
      .eq("user_id", userId)
      .order("is_default", { ascending: false })
      .order("created_at", { ascending: false });

    if (error) {
      console.error("❌ Error fetching saved addresses:", error);
      throw error;
    }

    return (data as unknown as SavedAddress[]) || [];
  }
}

export async function createSavedAddress(
  userId: string,
  input: SavedAddressInput,
  makeDefault?: boolean
): Promise<SavedAddress> {
  const supabase = createClient() as SupabaseClient;

  // If making default, unset other defaults first
  if (makeDefault || input.is_default) {
    const { error: unsetErr } = await supabase
      .from("saved_addresses")
      .update({ is_default: false } as Record<string, unknown>)
      .eq("user_id", userId);
    if (unsetErr) {
      console.error("Error unsetting previous default addresses:", unsetErr);
      throw unsetErr;
    }
  }

  const { data, error } = await supabase
    .from("saved_addresses")
    .insert({
      user_id: userId,
      ...input,
      is_default: Boolean(makeDefault || input.is_default) || false,
      country: input.country || "US",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    } as Record<string, unknown>)
    .select("*")
    .single();

  if (error) {
    console.error("Error creating saved address:", error);
    throw error;
  }

  return data as unknown as SavedAddress;
}

export async function updateSavedAddress(
  userId: string,
  addressId: string,
  input: Partial<SavedAddressInput>
): Promise<SavedAddress> {
  const supabase = createClient() as SupabaseClient;

  // If toggling default to true, unset others
  if (input.is_default) {
    const { error: unsetErr } = await supabase
      .from("saved_addresses")
      .update({ is_default: false } as Record<string, unknown>)
      .eq("user_id", userId);
    if (unsetErr) {
      console.error("Error unsetting previous default addresses:", unsetErr);
      throw unsetErr;
    }
  }

  const { data, error } = await supabase
    .from("saved_addresses")
    .update({
      ...input,
      updated_at: new Date().toISOString(),
    } as Record<string, unknown>)
    .eq("id", addressId)
    .eq("user_id", userId)
    .select("*")
    .single();

  if (error) {
    console.error("Error updating saved address:", error);
    throw error;
  }

  return data as unknown as SavedAddress;
}

export async function deleteSavedAddress(
  userId: string,
  addressId: string
): Promise<void> {
  const supabase = createClient() as SupabaseClient;

  const { error } = await supabase
    .from("saved_addresses")
    .delete()
    .eq("id", addressId)
    .eq("user_id", userId);

  if (error) {
    console.error("Error deleting saved address:", error);
    throw error;
  }
}

export async function setDefaultSavedAddress(
  userId: string,
  addressId: string
): Promise<void> {
  const supabase = createClient() as SupabaseClient;

  const { error: unsetErr } = await supabase
    .from("saved_addresses")
    .update({ is_default: false } as Record<string, unknown>)
    .eq("user_id", userId);
  if (unsetErr) {
    console.error("Error unsetting previous default addresses:", unsetErr);
    throw unsetErr;
  }

  const { error } = await supabase
    .from("saved_addresses")
    .update({ is_default: true } as Record<string, unknown>)
    .eq("id", addressId)
    .eq("user_id", userId);

  if (error) {
    console.error("Error setting default address:", error);
    throw error;
  }
}

export async function getDefaultSavedAddress(
  userId: string
): Promise<SavedAddress | null> {
  const supabase = createClient() as SupabaseClient;

  const { data, error } = await supabase
    .from("saved_addresses")
    .select("*")
    .eq("user_id", userId)
    .eq("is_default", true)
    .maybeSingle();

  if (error) {
    console.error("Error fetching default saved address:", error);
    throw error;
  }

  return (data as unknown as SavedAddress) || null;
}
