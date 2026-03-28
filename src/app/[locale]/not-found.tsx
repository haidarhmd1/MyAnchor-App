import { Link } from "@/i18n/navigation";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Metadata } from "next";

export default function NotFound() {
  return (
    <div className="bg-background flex min-h-dvh items-center justify-center px-4 py-8">
      <div className="surface-soft w-full max-w-lg rounded-[2rem] p-6 text-center shadow-sm sm:p-8">
        <div className="flex justify-center">
          <Image
            alt="Not Found"
            width={200}
            height={240}
            src="/illustration/notFound.png"
            className="h-auto w-auto object-contain"
            priority
          />
        </div>

        <div className="mt-6 space-y-3">
          <p className="text-muted-foreground text-sm font-medium tracking-[0.2em] uppercase">
            404
          </p>

          <h1 className="text-foreground text-3xl font-semibold tracking-tight sm:text-4xl">
            Page Not Found
          </h1>

          <p className="text-muted-foreground mx-auto max-w-md text-sm leading-6 sm:text-base">
            Sorry, we couldn&apos;t find the page you&apos;re looking for. It
            may have been moved, removed, or never existed in the first place.
          </p>
        </div>

        <div className="mt-8 space-y-3">
          <Button
            asChild
            size="lg"
            className="bg-primary text-primary-foreground hover:opacity-95"
          >
            <Link href="/">Go Back Home</Link>
          </Button>

          <p className="text-muted-foreground text-sm">
            Return to the homepage to continue your journey.
          </p>
        </div>
      </div>
    </div>
  );
}

export const metadata: Metadata = {
  title: "⚓ MyAnchor - Not Found",
};
