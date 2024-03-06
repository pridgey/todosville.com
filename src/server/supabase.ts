import { createClient } from "@supabase/supabase-js";
import { storage } from "./cookie";

/**
 * Function for generating the Supabase client
 * @param request The HTTP request object
 */
export const getClient = async (
  request?: Request,
  token?: string,
  envUrl?: string,
  envKey?: string
) => {
  // Supabase env variables
  const url = envUrl || import.meta.env.VITE_SUPABASE_URL || "no_url_found";
  const key = envKey || import.meta.env.VITE_SUPABASE_KEY || "no_key_found";

  // Creates client from cookie token
  if (request) {
    const session = await storage.getSession(request.headers.get("Cookie"));
    const token = await session.get("token");

    return createClient(url, key, {
      global: {
        headers: { Authorization: `Bearer ${token}` },
      },
      auth: {
        persistSession: false,
      },
    });
  }
  // Creates client from given token
  if (token) {
    return createClient(url, key, {
      global: {
        headers: { Authorization: `Bearer ${token}` },
      },
      auth: {
        persistSession: false,
      },
    });
  } else {
    // Creates unauthenticated client
    return createClient(url, key, {
      auth: {
        persistSession: false,
      },
    });
  }
};

/**
 * Function for getting the current user
 * @param request The HTTP request object (contains the cookie)
 * @returns null if an error occurs, otherwise the user data
 */
export const getUser = async (request: Request) => {
  const session = await storage.getSession(request.headers.get("Cookie"));
  const token = await session.get("token");
  const client = await getClient(request);

  const { data, error } = await client.auth.getUser(token);

  if (error && error.status !== 401) {
    console.error("Error during getUser call:", error);
    return null;
  }

  return data;
};
