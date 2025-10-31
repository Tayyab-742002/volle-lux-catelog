export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
          <p className="text-muted-foreground">Loading categories...</p>
        </div>
      </div>
    </div>
  );
}
