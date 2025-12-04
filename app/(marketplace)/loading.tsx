/**
 * Loading State for Marketplace Homepage
 *
 * Skeleton screen while homepage data loads
 */

export default function MarketplaceLoading() {
  return (
    <div className="min-h-screen">
      {/* Hero Section Skeleton */}
      <section className="bg-gradient-to-br from-slate-50 to-slate-100 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            {/* Title Skeleton */}
            <div className="h-12 bg-slate-200 rounded-lg mb-6 animate-pulse"></div>
            {/* Subtitle Skeleton */}
            <div className="h-6 bg-slate-200 rounded-lg mb-8 max-w-2xl mx-auto animate-pulse"></div>
            {/* Button Skeletons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <div className="h-12 w-48 bg-slate-300 rounded-md animate-pulse"></div>
              <div className="h-12 w-48 bg-slate-200 rounded-md animate-pulse"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section Skeleton */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {/* Section Title */}
          <div className="h-8 bg-slate-200 rounded-lg mb-8 max-w-xs animate-pulse"></div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-white border border-slate-200 rounded-lg overflow-hidden"
              >
                {/* Image Skeleton */}
                <div className="h-64 bg-slate-200 animate-pulse"></div>

                {/* Content Skeleton */}
                <div className="p-4 space-y-3">
                  <div className="h-6 bg-slate-200 rounded animate-pulse"></div>
                  <div className="h-4 bg-slate-200 rounded w-3/4 animate-pulse"></div>
                  <div className="flex justify-between items-center pt-2">
                    <div className="h-6 bg-slate-200 rounded w-20 animate-pulse"></div>
                    <div className="h-4 bg-slate-200 rounded w-16 animate-pulse"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section Skeleton */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="text-center">
                <div className="h-12 bg-slate-200 rounded-lg mb-2 mx-auto max-w-[120px] animate-pulse"></div>
                <div className="h-4 bg-slate-200 rounded-lg mx-auto max-w-[100px] animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
