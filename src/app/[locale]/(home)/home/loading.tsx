export default function Loading() {
  return (
    <div className="bg-background min-h-dvh px-4 py-6">
      <div className="mx-auto max-w-md space-y-6">
        {/* Today's Focus Section */}
        <section className="space-y-4">
          <div className="bg-muted h-6 w-32 animate-pulse rounded-full" />

          <div className="surface-soft flex items-center justify-between rounded-3xl p-4 shadow-sm">
            <div className="space-y-2">
              <div className="bg-muted h-5 w-24 animate-pulse rounded-full" />
              <div className="bg-muted h-4 w-36 animate-pulse rounded-full" />
            </div>
            <div className="bg-accent h-16 w-16 animate-pulse rounded-2xl" />
          </div>
        </section>

        {/* Emergency / Quick Action Section */}
        <section className="surface-soft space-y-4 rounded-3xl p-6 text-center shadow-sm">
          <div className="bg-accent mx-auto flex h-12 w-12 animate-pulse items-center justify-center rounded-2xl" />
          <div className="space-y-2">
            <div className="bg-muted mx-auto h-6 w-48 animate-pulse rounded-full" />
            <div className="bg-muted mx-auto h-4 w-64 animate-pulse rounded-full" />
          </div>
        </section>

        {/* Main Feature Cards */}
        <section className="space-y-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="surface-soft space-y-3 rounded-3xl p-4 shadow-sm"
            >
              <div className="bg-muted h-5 w-32 animate-pulse rounded-full" />
              <div className="bg-muted h-4 w-full animate-pulse rounded-full" />
              <div className="bg-muted h-4 w-3/4 animate-pulse rounded-full" />
            </div>
          ))}
        </section>

        {/* Inspiration / Highlight Section */}
        <section className="surface-soft space-y-4 rounded-3xl p-4 shadow-sm">
          <div className="bg-muted h-6 w-36 animate-pulse rounded-full" />

          <div className="bg-secondary rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <div className="bg-muted h-4 w-32 animate-pulse rounded-full" />
              <div className="bg-accent h-6 w-6 animate-pulse rounded-full" />
            </div>

            <div className="mt-4 space-y-2">
              <div className="bg-muted h-4 w-full animate-pulse rounded-full" />
              <div className="bg-muted h-4 w-16 animate-pulse rounded-full" />
            </div>
          </div>
        </section>

        {/* Tips Section */}
        <section className="space-y-4 pb-8">
          <div className="bg-muted h-6 w-12 animate-pulse rounded-full" />

          <div className="grid grid-cols-2 gap-3">
            {[1, 2].map((item) => (
              <div
                key={item}
                className="surface-soft rounded-3xl p-3 shadow-sm"
              >
                <div className="bg-muted aspect-square animate-pulse rounded-2xl" />

                <div className="mt-3 space-y-2">
                  <div className="bg-muted h-4 w-full animate-pulse rounded-full" />
                  <div className="bg-muted h-4 w-3/4 animate-pulse rounded-full" />
                  <div className="bg-muted h-3 w-full animate-pulse rounded-full" />
                  <div className="bg-muted h-3 w-5/6 animate-pulse rounded-full" />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
