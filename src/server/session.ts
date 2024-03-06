import { redirect } from "solid-start";
import { storage } from "./cookie";
import { getClient } from "./supabase";

/**
 * Function for creating a user session with Supabase and creating the client cookie for it
 * @param userID The user's ID
 * @param token The user's token for this session
 * @param refreshToken The refresh token
 * @param redirectTo Where to redirect the user to
 * @returns A redirect response with the new client cookie
 */
export const createUserSession = async (
  userID: string,
  token: string,
  refreshToken: string,
  redirectTo: string = "/"
) => {
  const session = await storage.getSession();
  session.set("userId", userID);
  session.set("token", token);
  session.set("refresh", refreshToken);

  const client = await getClient();

  await client.auth.setSession({
    access_token: token,
    refresh_token: refreshToken,
  });

  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await storage.commitSession(session),
    },
  });
};
