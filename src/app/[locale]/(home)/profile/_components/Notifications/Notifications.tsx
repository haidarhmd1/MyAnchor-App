"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { usePushSubscription } from "@/hooks/usePushSubscription";
import { sendTestPush } from "@/lib/api";

export const Notifications = () => {
  const t = useTranslations("notifications");
  const tPush = useTranslations("pwa");

  const { status, isPending, toggle } = usePushSubscription();
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  const isOn = status === "on";
  const isBlocked = status === "denied" || status === "unsupported";

  const statusText = () => {
    if (status === "unsupported") return tPush("notSupported");
    if (status === "denied") return tPush("push.denied");
    return isOn ? tPush("push.subscribed") : tPush("push.notSubscribed");
  };

  const onToggle = async (next: boolean) => {
    try {
      await toggle(next);
    } catch {
      toast.error(tPush("push.error"));
    }
  };

  const onSend = async () => {
    setIsSending(true);
    try {
      await sendTestPush(message.trim());
      setMessage("");
      toast.success(tPush("push.sent"));
    } catch {
      toast.error(tPush("push.error"));
    } finally {
      setIsSending(false);
    }
  };

  return (
    <section className="space-y-4">
      <div className="pt-4 pb-1">
        <h4 className="text-foreground text-base font-semibold tracking-tight">
          {t("title")}
        </h4>
      </div>

      <div className="space-y-3">
        <label
          htmlFor="push-notifications"
          className="bg-card border-border flex min-h-18 cursor-pointer items-center justify-between rounded-2xl border px-4 py-3 shadow-sm"
        >
          <div className="min-w-0">
            <p className="text-foreground text-base font-medium">
              {tPush("push.title")}
            </p>
            <p className="text-muted-foreground text-sm leading-6">
              {tPush("push.description")}
            </p>
            <p className="text-muted-foreground mt-1 text-xs leading-5">
              {statusText()}
            </p>
          </div>

          <div className="ml-4 shrink-0">
            <Switch
              id="push-notifications"
              checked={isOn}
              disabled={isBlocked || isPending || status === "loading"}
              onCheckedChange={onToggle}
            />
          </div>
        </label>

        {isOn && (
          <div className="bg-card border-border flex items-center gap-2 rounded-2xl border px-4 py-3 shadow-sm">
            <Input
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder={tPush("push.placeholder")}
              maxLength={200}
              disabled={isSending}
            />
            <Button
              type="button"
              onClick={onSend}
              disabled={isSending || message.trim().length === 0}
            >
              {tPush("push.send")}
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};
