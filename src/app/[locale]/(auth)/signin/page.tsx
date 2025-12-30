"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { Spinner } from "@/components/Spinner/Spinner";
import { useTranslations } from "next-intl";

type Step = "email" | "code";

export default function SignInPage() {
  const t = useTranslations("auth.signIn");
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const { register, handleSubmit, formState } = useForm<{
    email: string;
    code: string;
  }>();

  const requestCode = async ({ email }: { email: string }) => {
    try {
      await axios.post("/api/auth/otp/request", { email });
      setEmail(email);
      setStep("code");
      toast.success(t("codeSent"));
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      toast.error(e?.response?.data?.error ?? t("sendCodeError"));
    }
  };

  const verifyCode = async ({ code }: { code: string }) => {
    await signIn("otp", {
      email,
      code,
      redirect: true,
      callbackUrl: "/home",
    });
  };

  return (
    <div className="flex flex-col">
      <div
        className="h-60 w-full"
        style={{
          backgroundImage: `url(/illustration/welcome-screen.webp)`,
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
      />
      <div className="grow rounded-t-4xl bg-white p-6">
        {step === "email" ? (
          <form onSubmit={handleSubmit(requestCode)}>
            <h2 className="font-semibold">Sign in</h2>
            <h5 className="font-light">{t("subtitle")}</h5>
            <div className="space-y-4 pt-8">
              <input
                type="email"
                placeholder={t("emailPlaceholder")}
                className="w-full rounded-xl border p-3"
                {...register("email", { required: true })}
              />
              <button
                className="bottom-0 w-full rounded-xl border p-3"
                disabled={formState.isSubmitting}
              >
                {formState.isSubmitting ? <Spinner /> : t("sendCode")}
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleSubmit(verifyCode)} className="space-y-4">
            <h1 className="text-xl font-semibold">{t("enterCodeTitle")}</h1>
            <p className="text-sm opacity-70">
              {t("enterCodeHint", { email })}
            </p>
            <input
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder={t("codePlaceholder")}
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
              {formState.isSubmitting ? <Spinner /> : t("verify")}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
