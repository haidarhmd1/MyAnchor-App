"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="bg-background flex min-h-screen p-4">
      <div className="w-full max-w-lg space-y-8 text-center">
        {/* 404 Error Display */}
        <div className="flex justify-center">
          <Image
            alt="Not Found"
            width={200}
            height={240}
            src="/illustration/notFound.png"
          />
        </div>
        <div className="space-y-4">
          <h1 className="text-muted-foreground text-8xl font-bold">Error</h1>
          <h2 className="text-foreground text-3xl font-semibold">
            Something wen&apos;t wrong
          </h2>
        </div>

        {/* Navigation Options */}
        <div className="space-y-4">
          <Button size="lg" className="w-full max-w-xs" onClick={reset}>
            Retry
          </Button>
        </div>
      </div>
    </div>
  );
}
