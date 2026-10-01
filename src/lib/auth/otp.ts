import { randomInt } from "node:crypto";

export const OTP_LENGTH = 6;
export const OTP_MAX_ATTEMPTS = 5;
export const OTP_TTL_MINUTES = 10;

export function generateOtpCode() {
  const upperBound = 10 ** OTP_LENGTH;
  return randomInt(0, upperBound).toString().padStart(OTP_LENGTH, "0");
}
