"use client";

import { useCallback, useEffect, useState } from "react";
import { deletePushSubscription, savePushSubscription } from "@/lib/api";

/** VAPID public keys travel as base64url; PushManager wants raw bytes. */
function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = window.atob(base64);

  return Uint8Array.from(raw, (char) => char.charCodeAt(0));
}

export type PushStatus = "loading" | "unsupported" | "denied" | "on" | "off";

/**
 * Owns web-push opt-in for the current device. The browser's own subscription
 * is the source of truth for on/off — the server only mirrors it so it knows
 * where to send.
 */
export function usePushSubscription() {
  const [status, setStatus] = useState<PushStatus>("loading");
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    const supported =
      typeof window !== "undefined" &&
      "serviceWorker" in navigator &&
      "PushManager" in window &&
      "Notification" in window;

    if (!supported) {
      setStatus("unsupported");
      return;
    }

    if (Notification.permission === "denied") {
      setStatus("denied");
      return;
    }

    let active = true;

    navigator.serviceWorker.ready
      .then((registration) => registration.pushManager.getSubscription())
      .then((subscription) => {
        if (active) setStatus(subscription ? "on" : "off");
      })
      .catch(() => {
        if (active) setStatus("off");
      });

    return () => {
      active = false;
    };
  }, []);

  const subscribe = useCallback(async () => {
    const permission = await Notification.requestPermission();

    if (permission !== "granted") {
      setStatus(permission === "denied" ? "denied" : "off");
      return false;
    }

    const keyResponse = await fetch("/api/push/public-key", {
      cache: "no-store",
    });
    if (!keyResponse.ok) throw new Error("VAPID public key is unavailable");
    const { publicKey: vapidKey } = (await keyResponse.json()) as {
      publicKey: string;
    };

    const registration = await navigator.serviceWorker.ready;
    const subscription =
      (await registration.pushManager.getSubscription()) ??
      (await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidKey),
      }));

    await savePushSubscription(subscription.toJSON());
    setStatus("on");
    return true;
  }, []);

  const unsubscribe = useCallback(async () => {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();

    if (subscription) {
      // Drop the server row first: a browser-side unsubscribe we fail to
      // mirror would leave the server pushing into a dead endpoint.
      await deletePushSubscription(subscription.endpoint);
      await subscription.unsubscribe();
    }

    setStatus("off");
    return true;
  }, []);

  const toggle = useCallback(
    async (next: boolean) => {
      setIsPending(true);
      try {
        return next ? await subscribe() : await unsubscribe();
      } finally {
        setIsPending(false);
      }
    },
    [subscribe, unsubscribe],
  );

  return { status, isPending, toggle };
}
