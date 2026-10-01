import assert from "node:assert/strict";
import test from "node:test";
import { UnauthorizedError } from "@/lib/api-errors";
import { generateOtpCode, OTP_LENGTH } from "@/lib/auth/otp";
import { createReasoningPost } from "@/app/api/reasoning/handler";
import { createAnxietyProfilePost } from "@/app/api/anxietyProfile/handler";

test("OTP codes are fixed-length decimal values from a cryptographic generator", () => {
  const codes = new Set(Array.from({ length: 100 }, () => generateOtpCode()));

  assert.ok(codes.size > 1);
  for (const code of codes) {
    assert.match(code, new RegExp(`^\\d{${OTP_LENGTH}}$`));
  }
});

test("anonymous reasoning requests never reach the model", async () => {
  let calledModel = false;
  const handler = createReasoningPost({
    authenticate: async () => {
      throw new UnauthorizedError();
    },
    generate: async () => {
      calledModel = true;
      throw new Error("must not be called");
    },
    translate: async () => {
      calledModel = true;
      throw new Error("must not be called");
    },
    takeLimit: async () => true,
  });

  const response = await handler(
    new Request("http://localhost/api/reasoning", {
      method: "POST",
      body: JSON.stringify({
        location: "home",
        symptoms: ["dizziness"],
        locale: "en",
      }),
    }),
  );

  assert.equal(response.status, 401);
  assert.equal(calledModel, false);
});

test("anonymous anxiety-profile requests never reach the model", async () => {
  let calledModel = false;
  const handler = createAnxietyProfilePost({
    authenticate: async () => {
      throw new UnauthorizedError();
    },
    generate: async () => {
      calledModel = true;
      throw new Error("must not be called");
    },
    takeLimit: async () => true,
  });

  const response = await handler(
    new Request("http://localhost/api/anxietyProfile", {
      method: "POST",
      body: JSON.stringify({}),
    }),
  );

  assert.equal(response.status, 401);
  assert.equal(calledModel, false);
});

test("reasoning preview rejects requests without explicit health-data consent", async () => {
  let calledModel = false;
  const handler = createReasoningPost({
    authenticate: async () => ({
      userId: "test-user",
      user: {
        id: "test-user",
        name: null,
        email: "test@example.test",
        emailVerified: new Date(),
        dob: null,
        gender: null,
        image: null,
        deletedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    }),
    generate: async () => {
      calledModel = true;
      throw new Error("must not be called");
    },
    translate: async () => {
      calledModel = true;
      throw new Error("must not be called");
    },
    takeLimit: async () => true,
  });

  const response = await handler(
    new Request("http://localhost/api/reasoning", {
      method: "POST",
      body: JSON.stringify({
        location: "home",
        symptoms: ["dizziness"],
        locale: "en",
      }),
    }),
  );

  assert.equal(response.status, 400);
  assert.equal(calledModel, false);
});
