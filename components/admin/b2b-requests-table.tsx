"use client";

import { useState, useMemo } from "react";
import {
  Briefcase,
  Search,
  Filter,
  Calendar,
  Mail,
  Phone,
  MapPin,
  Package,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  Save,
  Loader2,
} from "lucide-react";
import type { AdminB2BRequest } from "@/types/b2b-request";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface B2BRequestsTableProps {
  requests: AdminB2BRequest[];
  loading?: boolean;
  onStatusUpdate?: (id: string, status: AdminB2BRequest["status"]) => void;
}

const statusConfig: Record<
  AdminB2BRequest["status"],
  { label: string; className: string }
> = {
  pending: {
    label: "Pending",
    className: "bg-yellow-100 text-yellow-800 border-yellow-200",
  },
  reviewed: {
    label: "Reviewed",
    className: "bg-blue-100 text-blue-800 border-blue-200",
  },
  quoted: {
    label: "Quoted",
    className: "bg-purple-100 text-purple-800 border-purple-200",
  },
  converted: {
    label: "Converted",
    className: "bg-emerald-100 text-emerald-800 border-emerald-200",
  },
  rejected: {
    label: "Rejected",
    className: "bg-red-100 text-red-800 border-red-200",
  },
};

export function B2BRequestsTable({
  requests,
  loading,
  onStatusUpdate,
}: B2BRequestsTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedRequest, setSelectedRequest] =
    useState<AdminB2BRequest | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [editingStatus, setEditingStatus] = useState<AdminB2BRequest["status"] | null>(null);
  const [editingAdminNotes, setEditingAdminNotes] = useState<string>("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  // Memoize filtered requests
  const filteredRequests = useMemo(() => {
    return requests
      .filter((request) => {
        if (searchTerm) {
          const searchLower = searchTerm.toLowerCase();
          return (
            request.companyName.toLowerCase().includes(searchLower) ||
            request.contactName.toLowerCase().includes(searchLower) ||
            request.email.toLowerCase().includes(searchLower) ||
            request.phone.toLowerCase().includes(searchLower) ||
            request.productsInterested.toLowerCase().includes(searchLower)
          );
        }
        return true;
      })
      .filter((request) => {
        if (statusFilter === "all") return true;
        return request.status === statusFilter;
      })
      .sort((a, b) => {
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      });
  }, [requests, searchTerm, statusFilter]);

  const handleViewDetails = (request: AdminB2BRequest) => {
    setSelectedRequest(request);
    setEditingStatus(request.status);
    setEditingAdminNotes(request.adminNotes || "");
    setUpdateError(null);
    setUpdateSuccess(false);
    setIsDetailDialogOpen(true);
  };

  const handleStatusUpdate = async () => {
    if (!selectedRequest) return;

    setIsUpdating(true);
    setUpdateError(null);
    setUpdateSuccess(false);

    try {
      const response = await fetch("/api/admin/b2b-requests", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          requestId: selectedRequest.id,
          status: editingStatus,
          adminNotes: editingAdminNotes || undefined,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to update request");
      }

      setUpdateSuccess(true);
      
      // Update local state
      if (onStatusUpdate) {
        onStatusUpdate(selectedRequest.id, editingStatus!);
      }

      // Update selected request
      setSelectedRequest({
        ...selectedRequest,
        status: editingStatus!,
        adminNotes: editingAdminNotes,
        reviewedAt: editingStatus !== "pending" ? new Date().toISOString() : selectedRequest.reviewedAt,
      });

      // Clear success message after 2 seconds
      setTimeout(() => {
        setUpdateSuccess(false);
      }, 2000);
    } catch (error) {
      setUpdateError(error instanceof Error ? error.message : "Failed to update request");
    } finally {
      setIsUpdating(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return <B2BRequestsTableSkeleton />;
  }

  if (requests.length === 0) {
    return (
      <div className="flex items-center justify-center py-12 sm:py-16">
        <div className="text-center space-y-4 max-w-md px-4">
          <div className="flex justify-center">
            <div className="rounded-full bg-linear-to-br from-emerald-100 to-teal-100 p-4 border border-emerald-200">
              <Briefcase className="h-8 w-8 text-emerald-600" strokeWidth={2} />
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-300">
            <p className="text-lg font-semibold text-gray-900">
              No B2B requests found
            </p>
            <p className="mt-2 text-sm text-gray-600">
              B2B requests will appear here once businesses submit custom quote
              requests
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="w-full space-y-4 sm:space-y-6">
        {/* Filters */}
        <div className="px-4 sm:px-6 pt-4 sm:pt-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search requests..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 w-full border border-gray-300 rounded-lg focus:border-emerald-500 focus:ring-emerald-500"
              />
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Filter className="h-4 w-4 text-muted-foreground shrink-0" />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="reviewed">Reviewed</SelectItem>
                  <SelectItem value="quoted">Quoted</SelectItem>
                  <SelectItem value="converted">Converted</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">
                  Company
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">
                  Contact
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">
                  Products
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">
                  Quantity
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">
                  Date
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRequests.map((request) => (
                <tr
                  key={request.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Briefcase className="h-4 w-4 text-emerald-600" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {request.companyName}
                        </div>
                        {request.vatNumber && (
                          <div className="text-xs text-gray-500">
                            VAT: {request.vatNumber}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-sm text-gray-900">
                      {request.contactName}
                    </div>
                    <div className="text-xs text-gray-500">{request.email}</div>
                    <div className="text-xs text-gray-500">{request.phone}</div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-sm text-gray-900 max-w-xs truncate">
                      {request.productsInterested}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {request.estimatedQuantity}
                    </div>
                    {request.budgetRange && (
                      <div className="text-xs text-gray-500">
                        {request.budgetRange}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                        statusConfig[request.status].className
                      }`}
                    >
                      {statusConfig[request.status].label}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(request.createdAt)}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewDetails(request)}
                      className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredRequests.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No requests match your filters</p>
          </div>
        )}
      </div>

      {/* Detail Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {selectedRequest && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-emerald-600" />
                  B2B Request Details
                </DialogTitle>
                <DialogDescription>
                  Request submitted on {formatDate(selectedRequest.createdAt)}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6 mt-4">
                {/* Company Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Company Information
                  </h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label className="text-xs text-gray-500">Company Name</Label>
                      <p className="text-sm font-medium text-gray-900">
                        {selectedRequest.companyName}
                      </p>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500">Contact Name</Label>
                      <p className="text-sm font-medium text-gray-900">
                        {selectedRequest.contactName}
                      </p>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500">Email</Label>
                      <p className="text-sm text-gray-900">
                        {selectedRequest.email}
                      </p>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500">Phone</Label>
                      <p className="text-sm text-gray-900">
                        {selectedRequest.phone}
                      </p>
                    </div>
                    {selectedRequest.companyWebsite && (
                      <div>
                        <Label className="text-xs text-gray-500">
                          Website
                        </Label>
                        <a
                          href={selectedRequest.companyWebsite}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-emerald-600 hover:underline"
                        >
                          {selectedRequest.companyWebsite}
                        </a>
                      </div>
                    )}
                    {selectedRequest.vatNumber && (
                      <div>
                        <Label className="text-xs text-gray-500">VAT Number</Label>
                        <p className="text-sm text-gray-900">
                          {selectedRequest.vatNumber}
                        </p>
                      </div>
                    )}
                    <div>
                      <Label className="text-xs text-gray-500">
                        Existing Customer
                      </Label>
                      <p className="text-sm text-gray-900">
                        {selectedRequest.isExistingCustomer ? "Yes" : "No"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Request Details */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Request Details
                  </h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="md:col-span-2">
                      <Label className="text-xs text-gray-500">
                        Products Interested
                      </Label>
                      <p className="text-sm text-gray-900 mt-1">
                        {selectedRequest.productsInterested}
                      </p>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500">
                        Estimated Quantity
                      </Label>
                      <p className="text-sm font-medium text-gray-900">
                        {selectedRequest.estimatedQuantity}
                      </p>
                    </div>
                    {selectedRequest.budgetRange && (
                      <div>
                        <Label className="text-xs text-gray-500">
                          Budget Range
                        </Label>
                        <p className="text-sm font-medium text-gray-900">
                          {selectedRequest.budgetRange}
                        </p>
                      </div>
                    )}
                    {selectedRequest.preferredDeliveryDate && (
                      <div>
                        <Label className="text-xs text-gray-500">
                          Preferred Delivery Date
                        </Label>
                        <p className="text-sm text-gray-900">
                          {new Date(
                            selectedRequest.preferredDeliveryDate
                          ).toLocaleDateString("en-GB")}
                        </p>
                      </div>
                    )}
                    {selectedRequest.additionalNotes && (
                      <div className="md:col-span-2">
                        <Label className="text-xs text-gray-500">
                          Additional Notes
                        </Label>
                        <p className="text-sm text-gray-900 mt-1 whitespace-pre-wrap">
                          {selectedRequest.additionalNotes}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Delivery Address */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Delivery Address
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-900">
                      {selectedRequest.deliveryAddress.addressLine1}
                      {selectedRequest.deliveryAddress.addressLine2 && (
                        <>, {selectedRequest.deliveryAddress.addressLine2}</>
                      )}
                      <br />
                      {selectedRequest.deliveryAddress.city},{" "}
                      {selectedRequest.deliveryAddress.state}
                      <br />
                      {selectedRequest.deliveryAddress.postalCode}
                      <br />
                      {selectedRequest.deliveryAddress.country}
                    </p>
                  </div>
                </div>

                {/* Status & Admin Notes */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Status & Notes
                  </h3>
                  
                  {/* Status Update */}
                  <div className="space-y-2">
                    <Label className="text-xs text-gray-500">Status</Label>
                    <Select
                      value={editingStatus || selectedRequest.status}
                      onValueChange={(value) => setEditingStatus(value as AdminB2BRequest["status"])}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="reviewed">Reviewed</SelectItem>
                        <SelectItem value="quoted">Quoted</SelectItem>
                        <SelectItem value="converted">Converted</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Admin Notes */}
                  <div className="space-y-2">
                    <Label className="text-xs text-gray-500">
                      Admin Notes
                    </Label>
                    <Textarea
                      value={editingAdminNotes}
                      onChange={(e) => setEditingAdminNotes(e.target.value)}
                      placeholder="Add internal notes about this request..."
                      rows={4}
                      className="w-full"
                    />
                    <p className="text-xs text-gray-500">
                      These notes are only visible to admins
                    </p>
                  </div>

                  {/* Review Info */}
                  {selectedRequest.reviewedAt && (
                    <div>
                      <Label className="text-xs text-gray-500">
                        Reviewed At
                      </Label>
                      <p className="text-sm text-gray-900">
                        {formatDate(selectedRequest.reviewedAt)}
                      </p>
                      {selectedRequest.reviewedByUser && (
                        <p className="text-xs text-gray-500 mt-1">
                          by {selectedRequest.reviewedByUser.fullName || selectedRequest.reviewedByUser.email}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Update Button */}
                  <div className="flex items-center gap-3 pt-2">
                    <Button
                      onClick={handleStatusUpdate}
                      disabled={
                        isUpdating ||
                        (editingStatus === selectedRequest.status &&
                          editingAdminNotes === (selectedRequest.adminNotes || ""))
                      }
                      className="bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isUpdating ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Updating...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Update Status & Notes
                        </>
                      )}
                    </Button>
                    {updateSuccess && (
                      <span className="text-sm text-emerald-600 font-medium">
                        Updated successfully!
                      </span>
                    )}
                  </div>

                  {/* Error Message */}
                  {updateError && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                      <p className="text-sm text-red-800">{updateError}</p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

function B2BRequestsTableSkeleton() {
  return (
    <div className="w-full space-y-4">
      <div className="px-4 sm:px-6 pt-4 sm:pt-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="h-10 bg-gray-200 rounded-lg w-full sm:w-64 animate-pulse" />
          <div className="h-10 bg-gray-200 rounded-lg w-32 animate-pulse" />
        </div>
      </div>
      <div className="overflow-x-auto">
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="h-16 bg-gray-100 rounded-lg animate-pulse"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

