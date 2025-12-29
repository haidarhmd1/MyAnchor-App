export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-md">
        {/* Hero Image Skeleton */}
        <div className="mb-6 h-[240px] w-full animate-pulse rounded-b-4xl bg-gray-200" />
        <div className="px-4">
          {/* Question Skeleton */}
          <div className="mb-2">
            <div className="h-4 w-3/4 animate-pulse rounded bg-gray-300"></div>
          </div>

          {/* Title Skeleton */}
          <div className="mb-6">
            <div className="h-8 w-32 animate-pulse rounded bg-gray-300"></div>
          </div>

          {/* Progress Section Skeleton */}
          <div className="mb-2 flex items-center justify-between">
            <div className="h-4 w-20 animate-pulse rounded bg-gray-300"></div>
            <div className="h-4 w-8 animate-pulse rounded bg-gray-300"></div>
          </div>

          {/* Progress Bar Skeleton */}
          <div className="mb-8 h-2 w-full animate-pulse rounded-full bg-gray-200">
            <div className="h-2 w-1/5 rounded-full bg-blue-400"></div>
          </div>

          {/* Checkbox Options Skeleton */}
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((item) => (
              <div
                key={item}
                className="animate-pulse rounded-xl border border-gray-200 bg-white p-4"
              >
                <div className="flex items-start space-x-3">
                  <div className="mt-1 h-5 w-5 rounded border-2 bg-gray-300"></div>
                  <div className="flex-1">
                    <div className="mb-2 h-5 w-24 rounded bg-gray-300"></div>
                    <div className="h-4 w-32 rounded bg-gray-200"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Navigation Skeleton */}
          <div className="fixed right-0 bottom-0 left-0 border-t border-gray-200 bg-white p-4">
            <div className="mx-auto flex max-w-md justify-center space-x-8">
              <div className="h-8 w-8 animate-pulse rounded-full bg-gray-300"></div>
              <div className="h-8 w-8 animate-pulse rounded-full bg-gray-300"></div>
              <div className="h-8 w-8 animate-pulse rounded-full bg-gray-300"></div>
              <div className="h-8 w-8 animate-pulse rounded-full bg-gray-300"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
