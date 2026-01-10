"use client";

import { LogIn } from "lucide-react";
import Link from "next/link";

export function SignInButton() {
  return (
    <Link href="/signin">
      <LogIn strokeWidth={1} />
    </Link>
  );
}
