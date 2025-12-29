export default function Loading() {
  return (
    <div className="mx-auto w-full max-w-4xl">
      {/* Hero Image Skeleton */}
      <div className="h-[240px] w-full animate-pulse rounded-b-4xl bg-gray-200" />

      <div className="space-y-4 p-4">
        {/* Category Badge Skeleton */}
        <div className="h-4 w-32 animate-pulse rounded bg-gray-200" />

        {/* Main Title Skeleton */}
        {/* <div className="space-y-2">
          <div className="h-8 w-3/4 animate-pulse rounded bg-gray-200" />
          <div className="h-8 w-1/2 animate-pulse rounded bg-gray-200" />
        </div> */}

        {/* Description Skeleton */}
        <div className="space-y-2">
          <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
          <div className="h-4 w-2/3 animate-pulse rounded bg-gray-200" />
          <div className="h-4 w-2/3 animate-pulse rounded bg-gray-200" />
        </div>

        {/* Content Cards Skeleton */}
        <div className="mx-4 space-y-4">
          {[1, 2, 3].map((index) => (
            <div
              key={index}
              className="border-border bg-card flex items-start gap-4 rounded-lg border p-6"
            >
              {/* Card Icon Skeleton */}
              <div className="h-16 w-16 flex-shrink-0 animate-pulse rounded-lg bg-gray-200" />

              {/* Card Content Skeleton */}
              <div className="flex-1 space-y-2">
                <div className="h-6 w-3/4 animate-pulse rounded bg-gray-200" />
                <div className="space-y-1">
                  <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
                  <div className="h-4 w-2/3 animate-pulse rounded bg-gray-200" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
