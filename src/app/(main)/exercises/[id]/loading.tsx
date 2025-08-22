export default function Loading() {
  return (
    <div className="mx-auto w-full max-w-4xl">
      {/* Hero Image Skeleton */}
      <div className="h-[240px] w-full animate-pulse rounded-b-4xl bg-gray-200" />

      <div className="space-y-6 p-4">
        {/* Icon and Title Section Skeleton */}
        <div className="flex items-start gap-3">
          <div className="h-6 w-6 animate-pulse rounded bg-gray-200" />
          <div className="h-8 w-48 animate-pulse rounded bg-gray-200" />
        </div>

        {/* Description Skeleton */}
        <div className="space-y-2">
          <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
          <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
          <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
          <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
          <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200" />
        </div>

        {/* Status Cards Skeleton */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2 rounded-lg border p-4">
            <div className="h-5 w-20 animate-pulse rounded bg-gray-200" />
            <div className="h-6 w-24 animate-pulse rounded bg-gray-200" />
          </div>
          <div className="space-y-2 rounded-lg border p-4">
            <div className="h-5 w-16 animate-pulse rounded bg-gray-200" />
            <div className="h-6 w-20 animate-pulse rounded bg-gray-200" />
          </div>
        </div>

        {/* Start Button Skeleton */}
        <div className="flex justify-center pt-8">
          <div className="h-48 w-48 animate-pulse rounded-full bg-gray-200" />
        </div>

        {/* Bottom Navigation Skeleton */}
        <div className="flex justify-center gap-4 pt-8">
          <div className="h-12 w-12 animate-pulse rounded-full bg-gray-200" />
          <div className="h-12 w-12 animate-pulse rounded-full bg-gray-200" />
          <div className="h-12 w-12 animate-pulse rounded-full bg-gray-200" />
        </div>
      </div>
    </div>
  );
}
