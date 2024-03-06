import { createCookieSessionStorage } from "solid-start";

const sessionSecret =
  import.meta.env.VITE_SESSION_SECRET || "super-duper-secret";

export const storage = createCookieSessionStorage({
  cookie: {
    name: "chatplats-sesssion",
    secure: true,
    secrets: [sessionSecret],
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  },
});
