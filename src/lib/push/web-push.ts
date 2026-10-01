import webpush, {
  type PushSubscription as WebPushSubscription,
} from "web-push";
import { prisma } from "../../../lib/prisma";
import { logWarn } from "@/lib/logger";

const publicKey = process.env.VAPID_PUBLIC_KEY;
const privateKey = process.env.VAPID_PRIVATE_KEY;
const contact = process.env.VAPID_SUBJECT ?? "mailto:support@myanchor.app";

let configured = false;

/**
 * VAPID details are set lazily so a missing key never breaks an unrelated
 * request at import time — only the push call itself fails.
 */
function configure() {
  if (configured) return true;
  if (!publicKey || !privateKey) return false;

  webpush.setVapidDetails(contact, publicKey, privateKey);
  configured = true;
  return true;
}

export type PushPayload = {
  title: string;
  body: string;
  /** Path opened when the notification is clicked. */
  url?: string;
};

/**
 * Sends a notification to every device the user has subscribed. Subscriptions
 * the push service reports as gone (404/410) are deleted, which is the only
 * way they ever get cleaned up — browsers don't tell us when they expire.
 */
export async function sendPushToUser(userId: string, payload: PushPayload) {
  if (!configure()) {
    throw new Error("VAPID keys are not configured");
  }

  const subscriptions = await prisma.pushSubscription.findMany({
    where: { userId },
  });

  if (subscriptions.length === 0) {
    return { sent: 0, removed: 0, failed: 0 };
  }

  const body = JSON.stringify(payload);
  let sent = 0;
  let failed = 0;
  const expired: string[] = [];

  await Promise.all(
    subscriptions.map(async (subscription) => {
      const target: WebPushSubscription = {
        endpoint: subscription.endpoint,
        keys: { p256dh: subscription.p256dh, auth: subscription.auth },
      };

      try {
        await webpush.sendNotification(target, body);
        sent += 1;
      } catch (error) {
        const statusCode = (error as { statusCode?: number }).statusCode;
        if (statusCode === 404 || statusCode === 410) {
          expired.push(subscription.endpoint);
        } else {
          failed += 1;
          logWarn("push_delivery_failed", {
            statusCode: statusCode ?? null,
          });
        }
      }
    }),
  );

  if (expired.length > 0) {
    await prisma.pushSubscription.deleteMany({
      where: { endpoint: { in: expired } },
    });
  }

  return { sent, removed: expired.length, failed };
}
