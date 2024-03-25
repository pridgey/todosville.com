import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL ?? "no_url_found";
const supabaseKey = process.env.SUPABASE_KEY ?? "no_key_found";
const supabase = createClient(supabaseUrl, supabaseKey);

export function validateUsername(username: unknown) {
  if (typeof username !== "string" || username.length < 3) {
    return `Usernames must be at least 3 characters long`;
  }
}

export function validatePassword(password: unknown) {
  if (typeof password !== "string" || password.length < 6) {
    return `Passwords must be at least 6 characters long`;
  }
}

export function validateConfirm(password: unknown, confirm: unknown) {
  if (
    typeof password !== "string" ||
    typeof confirm !== "string" ||
    password !== confirm
  ) {
    return "Password confirmation does not match";
  }
}

export async function login(username: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: username,
    password,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data.user;
}

export async function logout() {
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw new Error(error.message);
  }
}

export async function register(username: string, password: string) {
  const { data, error } = await supabase.auth.signUp({
    email: username,
    password,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data.user;
}

export async function sendPasswordReset(email: string) {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.SITE_URL ?? ""}/reset-password`,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function resetUserPassword(
  accessToken: string,
  refreshToken: string,
  email: string,
  newPassword: string
) {
  const { error: sessionError } = await supabase.auth.setSession({
    access_token: accessToken,
    refresh_token: refreshToken,
  });

  if (sessionError) {
    throw new Error(sessionError.message);
  }

  const { data, error: updateError } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (updateError) {
    throw new Error(updateError.message);
  }

  if (data.user.email !== email) {
    throw new Error("Unrecognized Email address for request.");
  }

  await supabase.auth.signOut();

  return true;
}

export async function resendConfirmation(email: string) {
  const { data, error } = await supabase.auth.resend({
    type: "signup",
    email,
    options: {
      emailRedirectTo: `${process.env.SITE_URL ?? ""}/login`,
    },
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function getSession() {
  return await supabase.auth.getSession();
}
