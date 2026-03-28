export default function Loading() {
  return (
    <div className="mx-auto w-full max-w-4xl">
      {/* Hero */}
      <div className="bg-muted relative h-60 w-full overflow-hidden rounded-b-4xl">
        <div className="animate-shimmer absolute inset-0 bg-linear-to-r from-transparent via-white/40 to-transparent" />
      </div>

      <div className="space-y-4 p-4">
        {/* Category */}
        <div className="bg-muted relative h-4 w-32 overflow-hidden rounded">
          <div className="animate-shimmer absolute inset-0 bg-linear-to-r from-transparent via-white/40 to-transparent" />
        </div>

        {/* Title */}
        <div className="space-y-2">
          <div className="bg-muted relative h-8 w-3/4 overflow-hidden rounded">
            <div className="animate-shimmer absolute inset-0 bg-linear-to-r from-transparent via-white/40 to-transparent" />
          </div>
          <div className="bg-muted relative h-8 w-1/2 overflow-hidden rounded">
            <div className="animate-shimmer absolute inset-0 bg-linear-to-r from-transparent via-white/40 to-transparent" />
          </div>
        </div>

        {/* Paragraph */}
        <div className="space-y-2">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-muted relative h-4 w-full overflow-hidden rounded"
            >
              <div className="animate-shimmer absolute inset-0 bg-linear-to-r from-transparent via-white/40 to-transparent" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
