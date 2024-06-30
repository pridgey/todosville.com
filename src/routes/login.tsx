import {
  useAction,
  useSubmission,
  type RouteSectionProps,
} from "@solidjs/router";
import { Show, createEffect, createResource } from "solid-js";
import { setUserInSession } from "~/lib";
import PocketBase from "pocketbase";

export default function Login(props: RouteSectionProps) {
  const setSessionData = useAction(setUserInSession);
  const settingSession = useSubmission(setUserInSession);

  return (
    <main>
      <h1>Login</h1>
      <button
        onClick={async () => {
          "use client";
          try {
            console.log("Try google login", {
              url: import.meta.env.VITE_POCKETBASE_URL,
            });

            const client = new PocketBase(
              import.meta.env.VITE_POCKETBASE_URL ?? ""
            );

            const user = await client
              .collection("users")
              .authWithOAuth2({ provider: "google" });

            const cookie = client.authStore.exportToCookie();
            console.log("COOKIE:", cookie);

            await setSessionData({
              userId: user.meta?.id ?? "",
              email: user.meta?.email ?? "",
              cookie,
            });

            console.log("USER:", { user });
          } catch (err) {
            console.error("Error logging in with Google:", err);
          }
        }}
      >
        Login with Google
      </button>
      {/* <form action={loginOrRegister} method="post">
        <input
          type="hidden"
          name="redirectTo"
          value={props.params.redirectTo ?? "/"}
        />
        <fieldset>
          <legend>Login or Register?</legend>
          <label>
            <input type="radio" name="loginType" value="login" checked={true} />{" "}
            Login
          </label>
          <label>
            <input type="radio" name="loginType" value="register" /> Register
          </label>
        </fieldset>
        <div>
          <label for="username-input">Username</label>
          <input name="username" placeholder="kody" />
        </div>
        <div>
          <label for="password-input">Password</label>
          <input name="password" type="password" placeholder="twixrox" />
        </div>
        <button type="submit">Login</button>
      </form> */}
      <Show when={settingSession.result}>
        <p style={{ color: "red" }} role="alert" id="error-message">
          {settingSession.result!.message}
        </p>
      </Show>
    </main>
  );
}
