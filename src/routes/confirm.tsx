import {
  useSearchParams,
  type RouteSectionProps,
  useAction,
  useSubmission,
} from "@solidjs/router";
import { Match, Show, Switch, createEffect } from "solid-js";
import { Button } from "~/components/button";
import { Flex } from "~/components/flex";
import { Text } from "~/components/text";
import { resendConfirmationEmail } from "~/lib";
import styles from "~/styles/authStyles.module.css";

export default function Confirm(props: RouteSectionProps) {
  const [params] = useSearchParams();

  return (
    <main class={styles.layout}>
      <section class={styles.auth_container}>
        <Flex Direction="column" Gap="large" Width="50%">
          <Text As="h1" FontSize="extra-large" FontWeight="bold">
            Todosville
          </Text>
          <Text As="h2" FontSize="header" FontWeight="semibold">
            Confirm Email
          </Text>
          <Text>Your registration is almost complete.</Text>
          <Text>
            Thank you, <Text FontWeight="bold">{params.email}</Text>
          </Text>
          <Text>
            To log in and get started, please verify your email address. Check
            your inbox for our validation link.
          </Text>
          <Flex Direction="row" JustifyContent="flex-end" Gap="medium">
            <Button Href="/login" Variant="text">
              Resend Confirmation Email
            </Button>
            <Button Href="/login" Variant="text">
              To Login
            </Button>
          </Flex>
        </Flex>
      </section>
    </main>
  );
}
