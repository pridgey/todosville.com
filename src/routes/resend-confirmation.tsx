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
import { resendConfirmationEmail } from "~/lib";
import styles from "~/styles/authStyles.module.css";

export default function ResendConfirmation(props: RouteSectionProps) {
  const resending = useSubmission(resendConfirmationEmail);

  const data = createMemo(() => {
    const result = resending.result;

    let emailError;
    let resendError;
    let resendSuccess = false;

    if (result instanceof Error) {
      resendError = result.message;
    } else if (typeof result !== "boolean") {
      emailError = result?.error.email;
    } else if (typeof result === "boolean") {
      resendSuccess = result;
    }

    return { emailError, resendError, resendSuccess };
  });

  return (
    <main class={styles.layout}>
      <section class={styles.auth_container}>
        <Flex Direction="column" Gap="large" Width="50%">
          <Text As="h1" FontSize="extra-large" FontWeight="bold">
            Todosville
          </Text>
          <Text As="h2" FontSize="header" FontWeight="semibold">
            Resend Confirmation Email
          </Text>
          <Text>
            Please enter your email below to begin the confirmation process.
          </Text>
          <Show when={!!data().resendError}>
            <Text As="h3" Color="error" FontSize="text" FontWeight="semibold">
              {data().resendError}
            </Text>
          </Show>
          <Show when={!!data().resendSuccess}>
            <Text As="h3" Color="success" FontSize="text" FontWeight="semibold">
              The resend request has been completed. Please check your inbox for
              the new confirmation request.
            </Text>
          </Show>
          <form action={resendConfirmationEmail} method="post">
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
                  Disabled={resending.pending}
                  Pending={resending.pending}
                  Type="submit"
                >
                  Resend
                </Button>
              </Flex>
              <Flex Direction="row" JustifyContent="flex-end">
                <Button
                  Disabled={resending.pending}
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
