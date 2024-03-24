import { action, cache, redirect } from "@solidjs/router";
import {
  getSession,
  login,
  logout as logoutSession,
  register,
  validateConfirm,
  validatePassword,
  validateUsername,
} from "./server";

export const getUser = cache(async () => {
  "use server";
  try {
    const session = await getSession();
    const user = session.data.session?.user;
    if (user === undefined) throw new Error("User not found");
    return { user };
  } catch {
    await logoutSession();
    throw redirect("/login");
  }
}, "user");

export const loginOrRegister = action(async (formData: FormData) => {
  "use server";
  const email = String(formData.get("email"));
  const password = String(formData.get("password"));
  const confirm = String(formData.get("confirm"));
  const loginType = String(formData.get("loginType"));

  const emailError = validateUsername(email);
  const passwordError = validatePassword(password);
  const confirmError = validateConfirm(password, confirm);

  if (emailError || passwordError || confirmError) {
    return {
      error: {
        email: emailError,
        password: passwordError,
        confirm: confirmError,
      },
    };
  }

  try {
    // Try and login or register
    const user = await (loginType !== "login"
      ? register(email, password)
      : login(email, password));
  } catch (err) {
    return err as Error;
  }
  return redirect("/");
});

export const logout = action(async () => {
  "use server";
  await logoutSession();
  return redirect("/login");
});
