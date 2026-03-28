"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { Spinner } from "@/components/Spinner/Spinner";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Step = "email" | "code";

type FormValues = {
  email: string;
  code: string;
};

export default function SignInPage() {
  const t = useTranslations("auth.signIn");
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");

  const { register, handleSubmit, formState } = useForm<FormValues>();

  const requestCode = async ({ email }: { email: string }) => {
    if (process.env.NODE_ENV === "production") {
      try {
        await axios.post("/api/auth/otp/request", { email });
        setEmail(email);
        setStep("code");
        toast.success(t("codeSent"));
      } catch (e: any) {
        toast.error(e?.response?.data?.error ?? t("sendCodeError"));
      }
    } else {
      setEmail(email);
      setStep("code");
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
    <div className="bg-background flex min-h-dvh flex-col">
      <div
        className="bg-muted h-60 w-full"
        style={{
          backgroundImage: "url(/illustration/welcome-screen.webp)",
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
      />

      <div className="border-border/60 bg-background -mt-6 flex grow flex-col rounded-t-[2rem] border-t px-6 py-6 shadow-sm">
        <div className="mx-auto w-full max-w-md">
          {step === "email" ? (
            <form onSubmit={handleSubmit(requestCode)} className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-foreground text-2xl font-semibold tracking-tight">
                  {t("title")}
                </h2>
                <p className="text-muted-foreground text-sm leading-6">
                  {t("subtitle")}
                </p>
              </div>

              <div className="space-y-4">
                <Input
                  type="email"
                  placeholder={t("emailPlaceholder")}
                  className="bg-card text-foreground border-border h-12 rounded-2xl"
                  {...register("email", { required: true })}
                />

                <Button
                  type="submit"
                  className="bg-primary text-primary-foreground h-12 w-full rounded-2xl hover:opacity-95"
                  disabled={formState.isSubmitting}
                >
                  {formState.isSubmitting ? <Spinner /> : t("sendCode")}
                </Button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleSubmit(verifyCode)} className="space-y-6">
              <div className="space-y-2">
                <h1 className="text-foreground text-2xl font-semibold tracking-tight">
                  {t("enterCodeTitle")}
                </h1>
                <p className="text-muted-foreground text-sm leading-6">
                  {t("enterCodeHint", { email })}
                </p>
              </div>

              <div className="space-y-4">
                <Input
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder={t("codePlaceholder")}
                  className="bg-card text-foreground border-border h-12 rounded-2xl text-center text-xl tracking-[0.3em]"
                  {...register("code", {
                    required: true,
                    minLength: 6,
                    maxLength: 6,
                  })}
                />

                <Button
                  type="submit"
                  className="bg-primary text-primary-foreground h-12 w-full rounded-2xl hover:opacity-95"
                  disabled={formState.isSubmitting}
                >
                  {formState.isSubmitting ? <Spinner /> : t("verify")}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
