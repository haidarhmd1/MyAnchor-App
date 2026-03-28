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
    console.error(error);
  }, [error]);

  return (
    <div className="bg-background flex min-h-[70dvh] items-center justify-center px-4 py-8">
      <div className="surface-soft w-full max-w-lg rounded-4xl p-6 text-center shadow-sm sm:p-8">
        <div className="flex justify-center">
          <Image
            alt="Error"
            width={200}
            height={240}
            src="/illustration/notFound.png"
            className="h-auto w-auto object-contain"
            priority
          />
        </div>

        <div className="mt-6 space-y-3">
          <p className="text-muted-foreground text-sm font-medium tracking-[0.2em] uppercase">
            Error
          </p>

          <h1 className="text-foreground text-3xl font-semibold tracking-tight sm:text-4xl">
            Something went wrong
          </h1>

          <p className="text-muted-foreground mx-auto max-w-md text-sm leading-6 sm:text-base">
            An unexpected problem occurred. Try again to continue.
          </p>
        </div>

        <div className="mt-8 space-y-3">
          <Button
            size="lg"
            onClick={reset}
            className="bg-primary text-primary-foreground hover:opacity-95"
          >
            Retry
          </Button>
        </div>
      </div>
    </div>
  );
}
