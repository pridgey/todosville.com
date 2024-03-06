import { getClient } from "./supabase";
import { createUserSession } from "./session";
import { storage } from "./cookie";
import { redirect } from "solid-start";
import { logIfError } from "~/utilities/LogIfError";

type authInfo = {
  email: string;
  password: string;
};

/**
 * Function to register a user with the Supabase Client
 * @param registerInfo Object containing the email and password of the user registering
 * @returns null if an error occurs, or the user data if successful
 */
export const registerUser = async (registerInfo: authInfo) => {
  const client = await getClient();

  console.log("Ready to register with Supabase:", { registerInfo });

  const { data: newUserData, error } = await client.auth.signUp({
    email: registerInfo.email,
    password: registerInfo.password,
  });

  if (error) {
    console.error("Error registering new user:", error);
    return null;
  }

  return newUserData;
};

/**
 * Function to login a user with the Supabase Client
 * @param loginInfo Object containing the email and password of the user logging in
 * @returns null if an error occurs, or the user data if successful
 */
export const login = async (loginInfo: authInfo) => {
  const client = await getClient();

  const { data, error } = await client.auth.signInWithPassword({
    email: loginInfo.email,
    password: loginInfo.password,
  });

  if (error) {
    console.error("Error during user login:", error);
    return null;
  }

  return data;
};

/**
 * Function to log a user out of the Supabase Client
 * @param request The HTTP request containing the cookie
 * @returns A redirect to destroy the client cookie
 */
export const logout = async (request: Request) => {
  const client = await getClient(request);
  const session = await storage.getSession(request.headers.get("Cookie"));

  const { error } = await client.auth.signOut();

  if (error) {
    console.error("Error during logout:", error);
  }

  return redirect("/login?l=t", {
    headers: {
      "Set-Cookie": await storage.destroySession(session),
    },
  });
};

/**
 * Function to send the password reset email, initiating a password reset
 * @param email Email to send the password reset to
 * @returns Error object if an error occurs, or true on a successful send
 */
export const sendForgotPasswordEmail = async (email: string) => {
  const client = await getClient();

  const { error } = await client.auth.resetPasswordForEmail(email, {
    redirectTo: "https://chatplats.com/reset-password",
  });

  if (error) {
    console.error("Error during forgot password email:", error);
    return { error };
  }

  return true;
};

/**
 * Function to change an already authenticated user's password
 * @param request The HTTP Request to get user cookie
 * @param newPassword The new password for the user
 * @returns
 */
export const updatePassword = async (request: Request, newPassword: string) => {
  // Get authenticated client
  const session = await storage.getSession(request.headers.get("Cookie"));
  const token = await session.get("token");
  const refresh = await session.get("refresh");
  const client = await getClient(request);

  // Setup the session so supabase knows who to update
  await client.auth.setSession({
    access_token: token,
    refresh_token: refresh,
  });

  // Update the password
  const { error } = await client.auth.updateUser({
    password: newPassword,
  });

  if (error) {
    console.error("Error changing user password:", { error });
    return { error };
  }

  return true;
};

/**
 * Function to reset a user's password using a temporary token
 * @param token Temporary auth token to create a user session
 * @param refreshToken The refresh token of the temporary session
 * @param newPassword The new password for the user
 * @returns { error } if an error occurs, true if successful
 */
export const resetUserPassword = async (
  token: string,
  refreshToken: string,
  newPassword: string
) => {
  // Get unauthenticated client
  const client = await getClient();

  // Create a new session using the token we got for password reset
  await client.auth.setSession({
    access_token: token,
    refresh_token: refreshToken,
  });

  // Update the password
  const { error } = await client.auth.updateUser({
    password: newPassword,
  });

  if (error) {
    console.error("Error reseting user password:", { error });
    return { error };
  }

  // Destroy this session
  await client.auth.signOut();

  return true;
};
