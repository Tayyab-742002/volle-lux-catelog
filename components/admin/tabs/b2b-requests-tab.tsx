"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { B2BRequestsTable } from "../b2b-requests-table";
import type { AdminB2BRequest } from "@/types/b2b-request";
import type { B2BRequestStatus } from "@/types/b2b-request";

interface B2BRequestsTabProps {
  requests: AdminB2BRequest[];
}

export function B2BRequestsTab({ requests: initialRequests }: B2BRequestsTabProps) {
  const router = useRouter();
  const [requests, setRequests] = useState<AdminB2BRequest[]>(initialRequests);

  const handleStatusUpdate = (id: string, newStatus: B2BRequestStatus) => {
    // Update local state optimistically
    setRequests((prev) =>
      prev.map((req) =>
        req.id === id
          ? {
              ...req,
              status: newStatus,
              reviewedAt: newStatus !== "pending" ? new Date().toISOString() : req.reviewedAt,
            }
          : req
      )
    );

    // Refresh data after a short delay to ensure consistency
    setTimeout(() => {
      router.refresh();
    }, 500);
  };

  return (
    <div className="p-6 md:p-8">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <div className="h-1 w-8 bg-emerald-600 rounded-full" />
          B2B Requests Management
        </h2>
        <p className="mt-2 text-gray-600">
          Review and manage custom bulk order requests from businesses
        </p>
      </div>

      <div className="rounded-2xl border border-gray-300 bg-white shadow-lg overflow-hidden">
        <B2BRequestsTable
          requests={requests}
          loading={false}
          onStatusUpdate={handleStatusUpdate}
        />
      </div>
    </div>
  );
}

