/**
 * B2B Request Service
 * Handles B2B custom bulk order requests
 */

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { createServiceRoleClient } from "@/lib/supabase/service-role";
import type {
  B2BRequest,
  CreateB2BRequestInput,
  AdminB2BRequest,
} from "@/types/b2b-request";

/**
 * Create a new B2B request
 * Uses service role client to bypass RLS for public submissions
 */
export async function createB2BRequest(
  input: CreateB2BRequestInput
): Promise<{ success: boolean; data?: B2BRequest; error?: string }> {
  // Try to get current user if authenticated (for linking the request)
  let userId: string | null = null;
  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    userId = user?.id || null;
  } catch (error) {
    // If user lookup fails, continue with null (anonymous submission)
    console.log("No authenticated user, creating anonymous B2B request");
  }

  // Use service role client to bypass RLS for public submissions
  const supabase = createServiceRoleClient();

  const insertData = {
    user_id: userId,
    company_name: input.companyName,
    contact_name: input.contactName,
    email: input.email,
    phone: input.phone,
    company_website: input.companyWebsite || null,
    vat_number: input.vatNumber || null,
    products_interested: input.productsInterested,
    estimated_quantity: input.estimatedQuantity,
    budget_range: input.budgetRange || null,
    preferred_delivery_date: input.preferredDeliveryDate || null,
    delivery_address: input.deliveryAddress,
    additional_notes: input.additionalNotes || null,
    is_existing_customer: input.isExistingCustomer || false,
    status: "pending" as const,
  };

  const { data, error } = await supabase
    .from("b2b_requests")
    // @ts-expect-error - b2b_requests table type not fully recognized by TypeScript
    .insert(insertData)
    .select()
    .single();

  if (error) {
    console.error("Error creating B2B request:", error);
    return { success: false, error: error.message };
  }

  return {
    success: true,
    data: mapB2BRequestFromDB(data),
  };
}

/**
 * Get all B2B requests (Admin only - uses service role)
 */
export async function getAllB2BRequests(): Promise<AdminB2BRequest[]> {
  const supabase = createServiceRoleClient();

  const { data, error } = await supabase
    .from("b2b_requests")
    .select(
      `
      *,
      reviewed_by_user:users!b2b_requests_reviewed_by_fkey (
        id,
        email,
        full_name
      )
    `
    )
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching B2B requests:", error);
    return [];
  }

  return (data || []).map((item: any) => mapAdminB2BRequestFromDB(item));
}

/**
 * Get B2B request by ID (Admin only)
 */
export async function getB2BRequestById(
  id: string
): Promise<AdminB2BRequest | null> {
  const supabase = createServiceRoleClient();

  const { data, error } = await supabase
    .from("b2b_requests")
    .select(
      `
      *,
      reviewed_by_user:users!b2b_requests_reviewed_by_fkey (
        id,
        email,
        full_name
      )
    `
    )
    .eq("id", id)
    .single();

  if (error || !data) {
    console.error("Error fetching B2B request:", error);
    return null;
  }

  return mapAdminB2BRequestFromDB(data);
}

/**
 * Update B2B request status (Admin only)
 */
export async function updateB2BRequestStatus(
  id: string,
  status: B2BRequest["status"],
  adminNotes?: string,
  reviewedBy?: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = createServiceRoleClient();

  const updateData: Record<string, unknown> = {
    status,
    updated_at: new Date().toISOString(),
  };

  if (adminNotes !== undefined) {
    updateData.admin_notes = adminNotes;
  }

  if (status !== "pending" && reviewedBy) {
    updateData.reviewed_at = new Date().toISOString();
    updateData.reviewed_by = reviewedBy;
  }

  const { error } = await supabase
    .from("b2b_requests")
    // @ts-expect-error - b2b_requests table type not fully recognized by TypeScript
    .update(updateData)
    .eq("id", id);

  if (error) {
    console.error("Error updating B2B request:", error);
    return { success: false, error: error.message };
  }

  return { success: true };
}

/**
 * Get pending B2B requests count (Admin only)
 */
export async function getPendingB2BRequestsCount(): Promise<number> {
  const supabase = createServiceRoleClient();

  const { count, error } = await supabase
    .from("b2b_requests")
    .select("*", { count: "exact", head: true })
    .eq("status", "pending");

  if (error) {
    console.error("Error fetching pending B2B requests count:", error);
    return 0;
  }

  return count || 0;
}

/**
 * Map database record to B2BRequest type
 */
function mapB2BRequestFromDB(data: any): B2BRequest {
  return {
    id: data.id,
    userId: data.user_id,
    companyName: data.company_name,
    contactName: data.contact_name,
    email: data.email,
    phone: data.phone,
    companyWebsite: data.company_website,
    vatNumber: data.vat_number,
    productsInterested: data.products_interested,
    estimatedQuantity: data.estimated_quantity,
    budgetRange: data.budget_range,
    preferredDeliveryDate: data.preferred_delivery_date,
    deliveryAddress: data.delivery_address,
    additionalNotes: data.additional_notes,
    isExistingCustomer: data.is_existing_customer,
    status: data.status,
    adminNotes: data.admin_notes,
    reviewedAt: data.reviewed_at,
    reviewedBy: data.reviewed_by,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
}

/**
 * Map database record to AdminB2BRequest type
 */
function mapAdminB2BRequestFromDB(data: any): AdminB2BRequest {
  const base = mapB2BRequestFromDB(data);
  return {
    ...base,
    reviewedByUser: data.reviewed_by_user
      ? {
          id: data.reviewed_by_user.id,
          email: data.reviewed_by_user.email,
          fullName: data.reviewed_by_user.full_name,
        }
      : null,
  };
}
