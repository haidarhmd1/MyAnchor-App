"use client";

import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import { useTransition } from "react";
import { Spinner } from "../Spinner/Spinner";
import { Button } from "../ui/button";

type Props = {
  callbackUrl?: string;
  className?: string;
};

export function SignOutButton({
  callbackUrl = "/home",
  className = "rounded-xl border px-3 py-2",
}: Props) {
  const [pending, startTransition] = useTransition();

  return (
    <Button
      type="button"
      className={className}
      disabled={pending}
      onClick={() => startTransition(() => signOut({ callbackUrl }))}
    >
      {pending ? <Spinner /> : <LogOut />}
    </Button>
  );
}
