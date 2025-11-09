import { CustomerTable } from "../customer-table";
import type { AdminCustomer } from "@/services/admin/customer.service";

interface CustomersTabProps {
  customers: AdminCustomer[];
}

export function CustomersTab({ customers }: CustomersTabProps) {
  return (
    <div className="p-6 md:p-8">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <div className="h-1 w-8 bg-emerald-600 rounded-full" />
          Customer Management
        </h2>
        <p className="mt-2 text-gray-600">View and manage customer accounts</p>
      </div>

      <div className="rounded-2xl border border-gray-300 bg-white shadow-lg overflow-hidden">
        <CustomerTable customers={customers} loading={false} />
      </div>
    </div>
  );
}
