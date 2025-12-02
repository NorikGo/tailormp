import { TailorCardSkeleton } from "@/components/marketplace/TailorCardSkeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function TailorsLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Skeleton */}
      <div className="mb-8">
        <Skeleton className="h-10 w-64 mb-2" />
        <Skeleton className="h-5 w-96" />
      </div>

      {/* Filters Skeleton */}
      <div className="mb-8 space-y-4">
        <div className="flex gap-2">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 w-24" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-10 w-48" />
        </div>
      </div>

      {/* Tailors Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <TailorCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
