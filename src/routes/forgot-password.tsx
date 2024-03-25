import {
  useSubmission,
  type RouteSectionProps,
  useAction,
} from "@solidjs/router";
import { createMemo } from "solid-js";
import { Show } from "solid-js/web";
import { Button } from "~/components/button";
import { Flex } from "~/components/flex";
import { Input } from "~/components/input";
import { Text } from "~/components/text";
import { sendPasswordResetEmail } from "~/lib";
import styles from "~/styles/authStyles.module.css";

export default function ForgotPassword(props: RouteSectionProps) {
  const sending = useSubmission(sendPasswordResetEmail);

  const data = createMemo(() => {
    const result = sending.result;

    let emailError;
    let sendError;
    let sendSuccess = false;

    if (result instanceof Error) {
      sendError = result.message;
    } else if (typeof result !== "boolean") {
      emailError = result?.error.email;
    } else if (typeof result === "boolean") {
      sendSuccess = result;
    }

    return { emailError, sendError, sendSuccess };
  });

  return (
    <main class={styles.layout}>
      <section class={styles.auth_container}>
        <Flex Direction="column" Gap="large" Width="50%">
          <Text As="h1" FontSize="extra-large" FontWeight="bold">
            Todosville
          </Text>
          <Text As="h2" FontSize="header" FontWeight="semibold">
            Forgot Password
          </Text>
          <Text>Please enter your email below to begin the reset process.</Text>
          <Show when={!!data().sendError}>
            <Text As="h3" Color="error" FontSize="text" FontWeight="semibold">
              {data().sendError}
            </Text>
          </Show>
          <Show when={!!data().sendSuccess}>
            <Text As="h3" Color="success" FontSize="text" FontWeight="semibold">
              The reset request has been started. Please check your inbox to
              continue your password reset request.
            </Text>
          </Show>
          <form action={sendPasswordResetEmail} method="post">
            <Flex Direction="column" Gap="medium" Width="100%">
              <Input
                Error={data().emailError}
                Label="Email"
                Name="email"
                Placeholder="The email your registered with"
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
                  Disabled={sending.pending}
                  Pending={sending.pending}
                  Type="submit"
                >
                  Get Reset Link
                </Button>
              </Flex>
              <Flex Direction="row" JustifyContent="flex-end">
                <Button Disabled={sending.pending} Href="/login" Variant="text">
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
