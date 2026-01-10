"use client";

import { useEffect, useState } from "react";
import { MoveLeft } from "lucide-react";
import { useRouter, useSelectedLayoutSegments } from "next/navigation";

export const BackArrow = () => {
  const router = useRouter();
  const segments = useSelectedLayoutSegments();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // Avoid SSR/CSR mismatch by not rendering until mounted
  if (!mounted) return null;

  // // Hide on root route (no parent segment)
  // if (segments.length === 0) return <div />;

  return (
    <button
      type="button"
      onClick={() => router.back()}
      aria-label="Go back"
      className="inline-flex items-center justify-center rounded-md p-1 pr-4 text-[#2E3D49]/80 hover:bg-black/5 hover:text-[#2E3D49] focus:ring-2 focus:ring-[#8AB6A9] focus:outline-none"
    >
      <MoveLeft className="h-5 w-5" />
    </button>
  );
};
