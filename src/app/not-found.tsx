import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function NotFound() {
  return (
    <div className="bg-background flex min-h-screen items-center justify-center p-4">
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
          <h1 className="text-muted-foreground text-8xl font-bold">404</h1>
          <h2 className="text-foreground text-3xl font-semibold">
            Page Not Found
          </h2>
          <p className="text-muted-foreground mx-auto max-w-md text-lg">
            Sorry, we couldn&apos;t find the page you&apos;re looking for. The
            page may have been moved or doesn&apos;t exist.
          </p>
        </div>

        {/* Navigation Options */}
        <div className="space-y-4">
          <Button asChild size="lg" className="w-full max-w-xs">
            <Link href="/">Go Back Home</Link>
          </Button>

          <p className="text-muted-foreground text-sm">
            Return to the homepage to continue your journey
          </p>
        </div>
      </div>
    </div>
  );
}
