export default function Loading() {
  return (
    <div className="h-screen w-screen overflow-hidden bg-[#E6F1F5] pt-24">
      {/* Main content area */}

      {/* Large circular button skeleton */}
      <div className="m-auto flex h-64 w-64 items-center justify-center rounded-full bg-[#B5E2D3]">
        <div className="h-8 w-16 animate-pulse rounded bg-gray-300"></div>

        {/* Message text skeleton */}
        <div className="max-w-md space-y-4 text-center">
          <div className="mb-2 h-8 animate-pulse rounded bg-gray-200"></div>
          <div className="mb-2 h-8 animate-pulse rounded bg-gray-200"></div>
          <div className="mb-2 h-8 animate-pulse rounded bg-gray-200"></div>
          <div className="mx-auto h-8 w-3/4 animate-pulse rounded bg-gray-200"></div>
        </div>
      </div>
    </div>
  );
}
