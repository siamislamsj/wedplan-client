"use client";
import { createAuthClient } from "better-auth/react";
import { jwtClient, inferAdditionalFields } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  plugins: [
    jwtClient(),
    inferAdditionalFields({
      user: {
        role: { type: "string" },
        isBlocked: { type: "boolean" },
        businessName: { type: "string" },
        subscriptionPlan: { type: "string" },
        subscriptionExpiresAt: { type: "date" },
      },
    }),
  ],
});
