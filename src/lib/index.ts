import { action, cache, redirect } from "@solidjs/router";
import { getSession, logout as logoutSession } from "./server";
import PocketBase from "pocketbase";

/**
 * Grabs the cookie out of the session and uses it to create a PocketBase client
 * @returns pocketbase client
 */
export const getPocketBase = async () => {
  "use server";
  const client = new PocketBase(process.env.VITE_POCKETBASE_URL ?? "");

  try {
    const session = await getSession();
    const cookie = session.data.cookie;
    client.authStore.loadFromCookie(cookie);
  } catch (err) {
    console.error("Error getting PocketBase client:", err);
  } finally {
    return client;
  }
};

/**
 * Grabs the user from the session and returns the user model
 * @returns user object
 */
export const getUser = cache(async () => {
  "use server";
  try {
    const client = await getPocketBase();
    const user = client.authStore.model;

    if (!user) throw new Error("User not found");
    return user;
  } catch {
    await logoutSession();
    throw redirect("/login");
  }
}, "user");

/**
 * Takes user data and updates session with it
 */
export const setUserInSession = action(
  async (data: { userId: string; email: string; cookie: string }) => {
    "use server";

    try {
      const session = await getSession();
      await session.update((theSession) => {
        theSession.userId = data.userId;
        theSession.email = data.email;
        theSession.cookie = data.cookie;
      });
    } catch (err) {
      return err as Error;
    }
  }
);

/**
 * Current Unused
 */
// export const loginOrRegister = action(async (formData: FormData) => {
//   "use server";
//   const username = String(formData.get("username"));
//   const password = String(formData.get("password"));
//   const loginType = String(formData.get("loginType"));
//   let error = validateUsername(username) || validatePassword(password);
//   if (error) return new Error(error);

//   try {
//     const user = await (loginType !== "login"
//       ? register(username, password)
//       : login(username, password));
//     const session = await getSession();
//     await session.update((d) => {
//       d.userId = user.id;
//     });
//   } catch (err) {
//     return err as Error;
//   }
//   return redirect("/");
// });

/**
 * Logs the user out and redirects to login page
 */
export const logout = action(async () => {
  "use server";
  const client = await getPocketBase();
  client.authStore.clear();

  await logoutSession();
  return redirect("/login");
});
