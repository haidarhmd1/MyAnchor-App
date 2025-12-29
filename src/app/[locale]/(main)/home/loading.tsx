export default function Loading() {
  return (
    <div className="mt-6 min-h-screen bg-gray-50 p-4">
      <div className="mx-auto max-w-md space-y-6">
        {/* Today's Focus Section */}
        <div className="space-y-4">
          <div className="h-6 w-32 animate-pulse rounded bg-gray-200"></div>

          <div className="flex items-center justify-between rounded-2xl bg-white p-4">
            <div className="space-y-2">
              <div className="h-5 w-24 animate-pulse rounded bg-gray-200"></div>
              <div className="h-4 w-36 animate-pulse rounded bg-gray-200"></div>
            </div>
            <div className="h-16 w-16 animate-pulse rounded-xl bg-orange-100"></div>
          </div>
        </div>

        {/* Emergency Panic Section */}
        <div className="space-y-4 rounded-2xl bg-red-50 p-6 text-center">
          <div className="mx-auto h-12 w-12 animate-pulse rounded-xl bg-red-200"></div>
          <div className="space-y-2">
            <div className="mx-auto h-6 w-48 animate-pulse rounded bg-red-200"></div>
            <div className="mx-auto h-4 w-64 animate-pulse rounded bg-red-200"></div>
          </div>
        </div>

        {/* Main Features Cards */}
        <div className="space-y-3">
          {[1, 2, 3].map((item) => (
            <div key={item} className="space-y-2 rounded-2xl bg-white p-4">
              <div className="h-5 w-32 animate-pulse rounded bg-gray-200"></div>
              <div className="h-4 w-full animate-pulse rounded bg-gray-200"></div>
              <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200"></div>
            </div>
          ))}
        </div>

        {/* Inspiration Section */}
        <div className="space-y-4">
          <div className="h-6 w-36 animate-pulse rounded bg-gray-200"></div>

          <div className="space-y-3 rounded-2xl bg-green-100 p-4">
            <div className="flex items-center justify-between">
              <div className="h-4 w-32 animate-pulse rounded bg-green-200"></div>
              <div className="h-6 w-6 animate-pulse rounded bg-green-200"></div>
            </div>
            <div className="space-y-2">
              <div className="h-4 w-full animate-pulse rounded bg-green-200"></div>
              <div className="h-4 w-16 animate-pulse rounded bg-green-200"></div>
            </div>
          </div>
        </div>

        {/* Tips Section */}
        <div className="space-y-4">
          <div className="h-6 w-12 animate-pulse rounded bg-gray-200"></div>

          <div className="grid grid-cols-2 gap-3">
            {[1, 2].map((item) => (
              <div key={item} className="space-y-3">
                <div className="aspect-square animate-pulse rounded-2xl bg-gray-200"></div>
                <div className="space-y-2">
                  <div className="h-4 w-full animate-pulse rounded bg-gray-200"></div>
                  <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200"></div>
                  <div className="h-3 w-full animate-pulse rounded bg-gray-200"></div>
                  <div className="h-3 w-5/6 animate-pulse rounded bg-gray-200"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
