import {
  useSubmission,
  type RouteSectionProps,
  useAction,
  useSearchParams,
  useLocation,
} from "@solidjs/router";
import { createEffect, createMemo, createSignal } from "solid-js";
import { Show } from "solid-js/web";
import { Button } from "~/components/button";
import { Flex } from "~/components/flex";
import { Input } from "~/components/input";
import { Text } from "~/components/text";
import { resetPassword } from "~/lib";
import styles from "~/styles/authStyles.module.css";

export default function ResetPassword(props: RouteSectionProps) {
  const resetPasswordAction = useSubmission(resetPassword);
  const location = useLocation();

  const [accessToken, setAccessToken] = createSignal("");
  const [refreshToken, setRefreshToken] = createSignal("");

  const hashParams = createMemo(() => {
    const params = new URLSearchParams(location.hash.slice(1));

    const token = params.get("access_token") ?? "";
    const refresh = params.get("refresh_token") ?? "";

    console.log("Memo", { params, token, refresh });

    return { token, refresh };
  });

  createEffect(() => {
    setAccessToken(hashParams().token);
    setRefreshToken(hashParams().refresh);
  });

  const data = createMemo(() => {
    const result = resetPasswordAction.result;

    let emailError;
    let passwordError;
    let confirmError;
    let actionError;
    let actionSuccess = false;

    if (result instanceof Error) {
      actionError = result.message;
    } else if (typeof result !== "boolean") {
      emailError = result?.error.email;
      passwordError = result?.error.password;
      confirmError = result?.error.confirm;
    } else if (typeof result === "boolean") {
      actionSuccess = result;
    }

    return { emailError, actionError, actionSuccess };
  });

  return (
    <main class={styles.layout}>
      <section class={styles.auth_container}>
        <Flex Direction="column" Gap="large" Width="50%">
          <Text As="h1" FontSize="extra-large" FontWeight="bold">
            Todosville
          </Text>
          <Text As="h2" FontSize="header" FontWeight="semibold">
            Reset Password
          </Text>
          <Text>
            Please fill in the following fields to reset your password.
          </Text>
          <Show when={!!data().actionError}>
            <Text As="h3" Color="error" FontSize="text" FontWeight="semibold">
              {data().actionError}
            </Text>
          </Show>
          <Show when={!!data().actionSuccess}>
            <Text As="h3" Color="success" FontSize="text" FontWeight="semibold">
              Your password reset has been successful. You can no login.
            </Text>
          </Show>
          <form action={resetPassword} method="post">
            <input type="hidden" name="access_token" value={accessToken()} />
            <input type="hidden" name="refresh_token" value={refreshToken()} />
            <Flex Direction="column" Gap="medium" Width="100%">
              <Input
                Error={data().emailError}
                Label="Email"
                Name="email"
                Placeholder="The email your registered with"
              />
              <Input
                Error={data().emailError}
                Label="New Password"
                Name="password"
                Placeholder="Memorable, yet strong"
                Type="password"
              />
              <Input
                Error={data().emailError}
                Label="Confirm Password"
                Name="confirm"
                Placeholder="Confirm the new password"
                Type="password"
              />
            </Flex>
            <Flex
              AlignItems="flex-end"
              Direction="column"
              Gap="medium"
              PaddingY="medium"
            >
              <Flex
                Direction="row"
                Gap="medium"
                JustifyContent="flex-end"
                Width="100%"
              >
                <Button
                  Disabled={resetPasswordAction.pending}
                  Pending={resetPasswordAction.pending}
                  Type="submit"
                >
                  Reset Password
                </Button>
              </Flex>
              <Flex Direction="row" JustifyContent="flex-end">
                <Button
                  Disabled={resetPasswordAction.pending}
                  Href="/login"
                  Variant="text"
                >
                  Go to Login
                </Button>
              </Flex>
            </Flex>
          </form>
        </Flex>
      </section>
    </main>
  );
}
