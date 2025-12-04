import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function TailorDetailLoading() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header Section Skeleton */}
      <Card className="mb-8">
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Avatar Skeleton */}
            <Skeleton className="w-24 h-24 md:w-32 md:h-32 rounded-full flex-shrink-0" />

            {/* Info Skeleton */}
            <div className="flex-1 space-y-4">
              {/* Name and Badge */}
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-64" />
                <Skeleton className="h-6 w-6 rounded-full" />
              </div>

              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-4">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-5 w-36" />
              </div>

              {/* Specialties */}
              <div className="flex flex-wrap gap-2">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-6 w-24 rounded-full" />
                ))}
              </div>

              {/* Languages */}
              <Skeleton className="h-5 w-48" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs Skeleton */}
      <div className="mb-8">
        <div className="flex gap-2 mb-6 border-b">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-32" />
        </div>

        {/* Tab Content Skeleton */}
        <Card>
          <CardContent className="p-6">
            <Skeleton className="h-6 w-48 mb-4" />
            <div className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>

            <div className="mt-6 pt-6 border-t">
              <Skeleton className="h-6 w-48 mb-4" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-12 rounded-lg" />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Contact CTA Skeleton */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex-1 space-y-2">
              <Skeleton className="h-6 w-64" />
              <Skeleton className="h-5 w-80" />
            </div>
            <Skeleton className="h-12 w-48" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
