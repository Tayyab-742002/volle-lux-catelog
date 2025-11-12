export default function Loading() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-linear-to-br from-emerald-600 to-teal-600">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-72 h-72 bg-emerald-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        <div className="absolute bottom-20 left-10 w-72 h-72 bg-teal-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
      </div>

      <div className="relative z-10">
        {/* Breadcrumbs Skeleton */}
        <div className="border-b border-emerald-200/30 bg-white/10 backdrop-blur-sm">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1600px] py-6">
            <div className="h-4 w-32 bg-white/20 rounded animate-pulse"></div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1600px] py-12 md:py-16 lg:py-20">
          {/* Header Skeleton */}
          <div className="text-center mb-12 md:mb-16 lg:mb-20">
            <div className="h-12 w-64 bg-white/20 rounded-lg mx-auto mb-4 animate-pulse"></div>
            <div className="h-6 w-96 bg-white/10 rounded mx-auto animate-pulse"></div>
          </div>

          {/* Categories Grid Skeleton */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 md:gap-8 lg:gap-10">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="w-full aspect-square max-w-[180px] rounded-full bg-white/20 animate-pulse"></div>
                <div className="mt-5 h-4 w-24 bg-white/20 rounded animate-pulse"></div>
                <div className="mt-2 h-3 w-32 bg-white/10 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
