"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { Spinner } from "@/components/Spinner/Spinner";

type Step = "email" | "code";

export default function SignInPage() {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const { register, handleSubmit, formState } = useForm<{
    email: string;
    code: string;
  }>();

  async function requestCode({ email }: { email: string }) {
    try {
      await axios.post("/api/auth/otp/request", { email });
      setEmail(email);
      setStep("code");
      toast.success("Code sent to your email.");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      toast.error(e?.response?.data?.error ?? "Failed to send code");
    }
  }

  async function verifyCode({ code }: { code: string }) {
    await signIn("otp", {
      email,
      code,
      redirect: true,
      callbackUrl: "/",
    });
  }

  return (
    <>
      <div
        className="h-80 w-full rounded-b-4xl"
        style={{
          backgroundImage: `url(/illustration/welcome-screen.webp)`,
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
      />
      <div className="mx-auto max-w-sm p-6">
        {step === "email" ? (
          <form onSubmit={handleSubmit(requestCode)} className="space-y-4">
            <h1 className="text-xl font-semibold">Sign in</h1>
            <input
              type="email"
              placeholder="you@example.com"
              className="w-full rounded-xl border p-3"
              {...register("email", { required: true })}
            />
            <button
              className="w-full rounded-xl border p-3"
              disabled={formState.isSubmitting}
            >
              {formState.isSubmitting ? <Spinner /> : "Send code"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleSubmit(verifyCode)} className="space-y-4">
            <h1 className="text-xl font-semibold">Enter code</h1>
            <p className="text-sm opacity-70">
              We emailed a 6-digit code to {email}
            </p>
            <input
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder="123456"
              className="w-full rounded-xl border p-3 text-center text-xl tracking-widest"
              {...register("code", {
                required: true,
                minLength: 6,
                maxLength: 6,
              })}
            />
            <button
              className="w-full rounded-xl border p-3"
              disabled={formState.isSubmitting}
            >
              {formState.isSubmitting ? <Spinner /> : "Verify & sign in"}
            </button>
          </form>
        )}
      </div>
    </>
  );
}
