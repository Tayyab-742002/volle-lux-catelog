// PERFORMANCE: Loading skeleton for admin tables dynamic import
export function AdminTableSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      {/* Search and Filters */}
      <div className="flex gap-4 items-center">
        <div className="flex-1 h-10 bg-gray-200 rounded-lg" />
        <div className="h-10 w-32 bg-gray-200 rounded-lg" />
      </div>

      {/* Table Header */}
      <div className="rounded-t-xl border border-gray-300 bg-white overflow-hidden">
        <div className="bg-linear-to-r from-emerald-50 to-teal-50 p-4">
          <div className="grid grid-cols-5 gap-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-4 bg-gray-300 rounded" />
            ))}
          </div>
        </div>

        {/* Table Rows */}
        <div className="divide-y divide-gray-200">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="p-4">
              <div className="grid grid-cols-5 gap-4">
                {[1, 2, 3, 4, 5].map((j) => (
                  <div key={j} className="h-4 bg-gray-200 rounded" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center">
        <div className="h-8 w-48 bg-gray-200 rounded" />
        <div className="flex gap-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-8 w-8 bg-gray-200 rounded" />
          ))}
        </div>
      </div>
    </div>
  );
}

