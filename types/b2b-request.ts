/**
 * B2B Request Types
 * Types for B2B custom bulk order requests
 */

export type B2BRequestStatus =
  | "pending"
  | "reviewed"
  | "quoted"
  | "converted"
  | "rejected";

export interface DeliveryAddress {
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface B2BRequest {
  id: string;
  userId?: string | null;
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  companyWebsite?: string | null;
  vatNumber?: string | null;
  productsInterested: string;
  estimatedQuantity: string;
  budgetRange?: string | null;
  preferredDeliveryDate?: string | null;
  deliveryAddress: DeliveryAddress;
  additionalNotes?: string | null;
  isExistingCustomer: boolean;
  status: B2BRequestStatus;
  adminNotes?: string | null;
  reviewedAt?: string | null;
  reviewedBy?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateB2BRequestInput {
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  companyWebsite?: string;
  vatNumber?: string;
  productsInterested: string;
  estimatedQuantity: string;
  budgetRange?: string;
  preferredDeliveryDate?: string;
  deliveryAddress: DeliveryAddress;
  additionalNotes?: string;
  isExistingCustomer?: boolean;
}

export interface AdminB2BRequest extends B2BRequest {
  reviewedByUser?: {
    id: string;
    email: string;
    fullName?: string;
  } | null;
}

