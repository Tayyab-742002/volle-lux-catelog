// PERFORMANCE: Loading skeleton for checkout form dynamic import
export function CheckoutFormSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Shipping Address Section */}
      <div className="rounded-xl border border-gray-300 bg-white p-6 shadow-sm">
        <div className="h-6 bg-gray-200 rounded w-48 mb-4" />
        <div className="space-y-4">
          <div className="h-10 bg-gray-200 rounded" />
          <div className="h-10 bg-gray-200 rounded" />
          <div className="grid grid-cols-2 gap-4">
            <div className="h-10 bg-gray-200 rounded" />
            <div className="h-10 bg-gray-200 rounded" />
          </div>
        </div>
      </div>

      {/* Billing Address Section */}
      <div className="rounded-xl border border-gray-300 bg-white p-6 shadow-sm">
        <div className="h-6 bg-gray-200 rounded w-48 mb-4" />
        <div className="space-y-4">
          <div className="h-10 bg-gray-200 rounded" />
          <div className="h-10 bg-gray-200 rounded" />
          <div className="grid grid-cols-2 gap-4">
            <div className="h-10 bg-gray-200 rounded" />
            <div className="h-10 bg-gray-200 rounded" />
          </div>
        </div>
      </div>

      {/* Payment Section */}
      <div className="rounded-xl border border-gray-300 bg-white p-6 shadow-sm">
        <div className="h-6 bg-gray-200 rounded w-48 mb-4" />
        <div className="h-32 bg-gray-200 rounded" />
      </div>

      {/* Submit Button */}
      <div className="h-12 bg-linear-to-r from-emerald-600 to-teal-600 rounded-lg opacity-50" />
    </div>
  );
}

