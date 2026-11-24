import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { jwt } from "better-auth/plugins";
import { nextCookies } from "better-auth/next-js";
import { APIError, createAuthMiddleware } from "better-auth/api";
import { MongoClient, ObjectId } from "mongodb";

const client = (globalThis._wedplanMongo ??= new MongoClient(process.env.MONGODB_URI));
const db = client.db(process.env.DB_NAME || "wedplan");

export const auth = betterAuth({
  database: mongodbAdapter(db, { client }),
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  trustedOrigins: [process.env.BETTER_AUTH_URL || "http://localhost:3000"],
  emailAndPassword: { enabled: true, minPasswordLength: 6, autoSignIn: true },
  socialProviders: {
    google: { clientId: process.env.GOOGLE_CLIENT_ID, clientSecret: process.env.GOOGLE_CLIENT_SECRET },
  },
  user: {
    additionalFields: {
      role: { type: "string", defaultValue: "customer", input: true },
      isBlocked: { type: "boolean", defaultValue: false, input: false },
      businessName: { type: "string", required: false, input: true },
      subscriptionPlan: { type: "string", defaultValue: "free", input: false },
      subscriptionExpiresAt: { type: "date", required: false, input: false },
    },
  },
  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      if (ctx.path === "/sign-up/email") {
        const p = ctx.body?.password || "";
        if (!/[A-Z]/.test(p) || !/[a-z]/.test(p)) {
          throw new APIError("BAD_REQUEST", { message: "Password needs at least one uppercase and one lowercase letter" });
        }
      }
    }),
  },
  databaseHooks: {
    user: {
      create: {
        before: async (user) => ({
          data: { ...user, role: ["vendor", "customer"].includes(user.role) ? user.role : "customer", isBlocked: false, subscriptionPlan: "free" },
        }),
      },
      update: {
        before: async (data) => {
          const { role, isBlocked, subscriptionPlan, subscriptionExpiresAt, ...safe } = data;
          return { data: safe };
        },
      },
    },
    session: {
      create: {
        before: async (session) => {
          const sessionUserId = String(session.userId);
          const userIdMatches = [{ _id: sessionUserId }, { id: sessionUserId }];
          if (ObjectId.isValid(sessionUserId)) userIdMatches.unshift({ _id: new ObjectId(sessionUserId) });
          const user = await db.collection("user").findOne({ $or: userIdMatches });
          if (user?.isBlocked) throw new APIError("FORBIDDEN", { message: "Your account has been blocked. Contact support." });
        },
      },
    },
  },
  session: { cookieCache: { enabled: true, strategy: "jwt", maxAge: 5 * 24 * 60 * 60 } },
  plugins: [
    jwt({
      jwt: {
        definePayload: ({ user }) => ({ id: user.id, email: user.email }),
      },
    }),
    nextCookies(),
  ],
});
