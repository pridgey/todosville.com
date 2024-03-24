import { useSubmission, type RouteSectionProps } from "@solidjs/router";
import { createMemo } from "solid-js";
import { Show } from "solid-js/web";
import { Button } from "~/components/button";
import { Flex } from "~/components/flex";
import { Input } from "~/components/input";
import { Text } from "~/components/text";
import { loginOrRegister } from "~/lib";
import styles from "~/styles/authStyles.module.css";

export default function Register(props: RouteSectionProps) {
  const registering = useSubmission(loginOrRegister);

  const data = createMemo(() => {
    const result = registering.result;

    let emailError;
    let passwordError;
    let confirmError;
    let registerError;

    if (result instanceof Error) {
      registerError = result.message;
    } else {
      emailError = result?.error.email;
      passwordError = result?.error.password;
      confirmError = result?.error.confirm;
    }

    return { emailError, passwordError, confirmError, registerError };
  });

  return (
    <main class={styles.layout}>
      <section class={styles.auth_container}>
        <Flex Direction="column" Gap="large" Width="50%">
          <Text As="h1" FontSize="extra-large" FontWeight="bold">
            Todosville
          </Text>
          <Text As="h2" FontSize="header" FontWeight="semibold">
            Register
          </Text>
          <Show when={!!data().registerError}>
            <Text As="h3" Color="error" FontSize="text" FontWeight="semibold">
              {data().registerError}
            </Text>
          </Show>
          <form action={loginOrRegister} method="post">
            <Flex Direction="column" Gap="medium" Width="100%">
              <input type="hidden" name="loginType" value="register" />
              <Input
                Error={data().emailError}
                Label="Email"
                Name="email"
                Placeholder="superCool@realfly.wiz"
              />
              <Input
                Error={data().passwordError}
                HelperText="At least 6 characters"
                Label="Password"
                Name="password"
                Placeholder="super secure like me 🥲"
                Type="password"
              />
              <Input
                Error={data().confirmError}
                Label="Confirm Password"
                Name="confirm"
                Placeholder="double check"
                Type="password"
              />
            </Flex>
            <Flex
              AlignItems="flex-end"
              Direction="column"
              Gap="medium"
              Padding="medium"
            >
              <Flex
                Direction="row"
                Gap="medium"
                JustifyContent="flex-end"
                Width="100%"
              >
                <Button
                  Disabled={registering.pending}
                  OnClick={() => undefined}
                  Pending={registering.pending}
                  Type="submit"
                >
                  Register
                </Button>
              </Flex>
              <Flex Direction="row" JustifyContent="flex-end">
                <Button
                  Disabled={registering.pending}
                  OnClick={() => undefined}
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
