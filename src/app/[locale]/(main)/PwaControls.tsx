"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { sendNotification, subscribeUser, unsubscribeUser } from "./actions";

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i)
    outputArray[i] = rawData.charCodeAt(i);
  return outputArray;
}

export function PwaControls() {
  const t = useTranslations("pwa");

  const [isSupported, setIsSupported] = useState(false);
  const [subscription, setSubscription] = useState<PushSubscription | null>(
    null,
  );
  const [message, setMessage] = useState("");

  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    setIsStandalone(window.matchMedia("(display-mode: standalone)").matches);

    const onBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);

    if ("serviceWorker" in navigator) {
      setIsSupported(true);
      registerServiceWorker();
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function registerServiceWorker() {
    const registration = await navigator.serviceWorker.register("/sw.js", {
      scope: "/",
      updateViaCache: "none",
    });
    const sub = await registration.pushManager.getSubscription();
    setSubscription(sub);
  }

  async function subscribeToPush() {
    const registration = await navigator.serviceWorker.ready;

    const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
    if (!vapidKey) throw new Error("Missing NEXT_PUBLIC_VAPID_PUBLIC_KEY");

    const sub = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(vapidKey),
    });

    setSubscription(sub);

    const serializedSub = JSON.parse(JSON.stringify(sub));
    await subscribeUser(serializedSub);
  }

  async function unsubscribeFromPush() {
    await subscription?.unsubscribe();
    setSubscription(null);
    await unsubscribeUser();
  }

  async function sendTestNotification() {
    if (!subscription) return;
    await sendNotification(message);
    setMessage("");
  }

  async function installApp() {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    setDeferredPrompt(null);
  }

  if (!isSupported) return <p>{t("notSupported")}</p>;

  return (
    <div className="space-y-8">
      {/* INSTALL APP BANNER */}
      {!isStandalone && (
        <div className="from-background to-muted relative overflow-hidden rounded-2xl border bg-gradient-to-br p-6 shadow-sm">
          <div className="bg-[radial-gradient(circle_at_top_left,theme(colors.primary/10),transparent_60%)] pointer-events-none absolute inset-0" />

          <div className="relative space-y-3">
            <h3 className="text-lg font-semibold tracking-tight">
              {t("install.title")}
            </h3>

            <p className="text-muted-foreground text-sm">
              {t("install.description")}
            </p>

            {deferredPrompt ? (
              <button
                onClick={installApp}
                className="bg-primary text-primary-foreground focus:ring-primary/50 inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium shadow transition hover:opacity-90 focus:ring-2 focus:outline-none"
              >
                {t("install.cta")}
              </button>
            ) : (
              <p className="text-muted-foreground text-xs">
                {t("install.hint")}
              </p>
            )}
          </div>
        </div>
      )}

      {/* PUSH NOTIFICATIONS BANNER */}
      <div className="bg-card relative overflow-hidden rounded-2xl border p-6 shadow-sm">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold tracking-tight">
              {t("push.title")}
            </h3>
            <p className="text-muted-foreground text-sm">
              {t("push.description")}
            </p>
          </div>

          {subscription ? (
            <div className="space-y-4">
              <p className="text-sm text-emerald-600 dark:text-emerald-400">
                {t("push.subscribed")}
              </p>

              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  className="bg-background focus:ring-primary/40 w-full rounded-xl border px-4 py-2 text-sm focus:ring-2 focus:outline-none"
                  type="text"
                  placeholder={t("push.placeholder")}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />

                <button
                  onClick={sendTestNotification}
                  className="bg-primary text-primary-foreground rounded-xl px-4 py-2 text-sm font-medium transition hover:opacity-90"
                >
                  {t("push.send")}
                </button>
              </div>

              <button
                onClick={unsubscribeFromPush}
                className="text-muted-foreground text-sm underline-offset-4 hover:underline"
              >
                {t("push.unsubscribe")}
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-muted-foreground text-sm">
                {t("push.notSubscribed")}
              </p>

              <button
                onClick={subscribeToPush}
                className="bg-background hover:bg-muted rounded-xl border px-4 py-2 text-sm font-medium transition"
              >
                {t("push.subscribe")}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
