import { useSubmission, type RouteSectionProps } from "@solidjs/router";
import { Show } from "solid-js/web";
import { loginOrRegister } from "~/lib";
import styles from "~/styles/authStyles.module.css";
import { Button } from "~/components/button";
import { Flex } from "~/components/flex";
import { Input } from "~/components/input";
import { Text } from "~/components/text";
import { createEffect, createSignal } from "solid-js";

export default function Login(props: RouteSectionProps) {
  const loggingIn = useSubmission(loginOrRegister);

  const [emailError, setEmailError] = createSignal("");
  const [passwordError, setPasswordError] = createSignal("");
  const [loginError, setLoginError] = createSignal("");

  createEffect(() => {
    const result = loggingIn.result;

    if (!(result instanceof Error)) {
      setEmailError(result?.error.email ?? "");
      setPasswordError(result?.error.password ?? "");
    } else {
      setLoginError(result.message);
    }
  });

  return (
    <main class={styles.layout}>
      <section class={styles.auth_container}>
        <Flex Direction="column" Gap="large" Width="50%">
          <Text As="h1" FontSize="extra-large" FontWeight="bold">
            Todosville
          </Text>
          <Text As="h2" FontSize="header" FontWeight="semibold">
            Login
          </Text>
          <Show when={!!loginError()}>
            <Text As="h3" Color="error" FontSize="text" FontWeight="semibold">
              {loginError()}
            </Text>
          </Show>
          <form action={loginOrRegister} method="post">
            <Flex Direction="column" Gap="medium" Width="100%">
              <input type="hidden" name="loginType" value="login" />
              <Input
                Error={emailError()}
                Label="Email"
                Name="email"
                Placeholder="wellwell@whatsall.disden"
              />
              <Input
                Error={passwordError()}
                HelperText="At least 6 characters"
                Label="Password"
                Name="password"
                Placeholder="super secure, like me 🥲"
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
                  Disabled={loggingIn.pending}
                  Href="/forgot-password"
                  Variant="text"
                >
                  Forgot Password
                </Button>
                <Button
                  Disabled={loggingIn.pending}
                  OnClick={() => undefined}
                  Pending={loggingIn.pending}
                  Type="submit"
                >
                  Login
                </Button>
              </Flex>
              <Flex Direction="row" JustifyContent="flex-end">
                <Button
                  Disabled={loggingIn.pending}
                  Href="/register"
                  Variant="text"
                >
                  Create an account
                </Button>
              </Flex>
            </Flex>
          </form>
        </Flex>
      </section>
    </main>
  );
}
