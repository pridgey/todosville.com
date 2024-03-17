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

export async function getSession() {
  return await supabase.auth.getSession();
}
