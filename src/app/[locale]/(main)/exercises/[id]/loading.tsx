export default function Loading() {
  return (
    <div className="bg-background mx-auto w-full max-w-4xl">
      <div className="bg-muted h-60 w-full animate-pulse rounded-b-4xl" />

      <div className="space-y-4 p-4">
        <div className="bg-muted h-4 w-32 animate-pulse rounded" />

        <div className="space-y-2">
          <div className="bg-muted h-8 w-3/4 animate-pulse rounded" />
          <div className="bg-muted h-8 w-1/2 animate-pulse rounded" />
        </div>

        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="space-y-2">
              <div className="bg-muted h-4 w-full animate-pulse rounded" />
              <div className="bg-muted h-4 w-2/3 animate-pulse rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
