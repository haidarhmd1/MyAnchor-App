"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { Spinner } from "@/components/Spinner/Spinner";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { RefreshCwIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type Step = "email" | "code";

type FormValues = {
  email: string;
  code: string;
};

export default function SignInPage() {
  const t = useTranslations("auth.signIn");
  const isRtl = useLocale().startsWith("ar");

  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");

  const { register, handleSubmit, formState, watch, setValue } =
    useForm<FormValues>();
  const codeValue = watch("code");

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

      <div className="border-border/60 bg-background -mt-6 flex grow flex-col rounded-t-4xl border-t px-6 py-6 shadow-sm">
        <div className="mx-auto w-full max-w-md">
          {step === "email" ? (
            <form
              onSubmit={handleSubmit(requestCode)}
              className="surface-soft space-y-6 rounded-4xl p-5 shadow-sm"
            >
              <div>
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
                  dir={isRtl ? "rtl" : "ltr"}
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
            <form
              onSubmit={handleSubmit(verifyCode)}
              className="surface-soft space-y-6 rounded-4xl p-5 shadow-sm"
            >
              <h1 className="text-foreground text-2xl font-semibold tracking-tight">
                {t("enterCodeTitle")}
              </h1>
              <p className="text-muted-foreground text-sm leading-6">
                {t("enterCodeHint", { email })}
              </p>

              <div className="flex items-center justify-between">
                <p className="text-muted-foreground text-sm leading-6">
                  {t("verificationCode")}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={async () => await requestCode({ email })}
                  className={cn(
                    "flex",
                    isRtl ? "flex-row-reverse" : "flex-row",
                  )}
                >
                  <RefreshCwIcon />
                  {t("resendCode")}
                </Button>
              </div>

              <div className="space-y-8">
                <InputOTP
                  maxLength={6}
                  value={codeValue || ""}
                  id="otp-verification"
                  required
                  onChange={(value) => setValue("code", value)}
                >
                  <InputOTPGroup
                    className={cn(
                      "m-auto *:data-[slot=input-otp-slot]:h-12 *:data-[slot=input-otp-slot]:w-11 *:data-[slot=input-otp-slot]:text-xl",
                      "flex",
                      isRtl ? "flex-row-reverse" : "flex-row",
                    )}
                    dir={isRtl ? "rtl" : "ltr"}
                  >
                    <InputOTPSlot index={isRtl ? 2 : 0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={isRtl ? 0 : 2} />
                  </InputOTPGroup>
                  <InputOTPSeparator className="m-auto mx-2" />
                  <InputOTPGroup
                    className={cn(
                      "m-auto *:data-[slot=input-otp-slot]:h-12 *:data-[slot=input-otp-slot]:w-11 *:data-[slot=input-otp-slot]:text-xl",
                      "flex",
                      isRtl ? "flex-row-reverse" : "flex-row",
                    )}
                    dir={isRtl ? "rtl" : "ltr"}
                  >
                    <InputOTPSlot index={isRtl ? 5 : 3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={isRtl ? 3 : 5} />
                  </InputOTPGroup>
                </InputOTP>

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
