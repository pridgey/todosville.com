import { useSubmission, type RouteSectionProps } from "@solidjs/router";
import { Show } from "solid-js/web";
import { loginOrRegister } from "~/lib";
import styles from "~/styles/authStyles.module.css";
import { Button } from "~/components/button";
import { Flex } from "~/components/flex";
import { Input } from "~/components/input";
import { Text } from "~/components/text";

export default function Login(props: RouteSectionProps) {
  const loggingIn = useSubmission(loginOrRegister);

  return (
    <main class={styles.layout}>
      <section class={styles.auth_container}>
        <Flex Direction="column" Gap="var(--spacing-large)" Width="50%">
          <Text As="h1" FontSize="extra-large" FontWeight="bold">
            Todosville
          </Text>
          <Text As="h2" FontSize="header" FontWeight="semibold">
            Login
          </Text>
          <form action={loginOrRegister} method="post">
            <Flex Direction="column" Gap="var(--spacing-small)" Width="100%">
              <Input
                Label="Email"
                Placeholder="superCool@realfly.wiz"
                OnChange={() => undefined}
                Error={loggingIn.error}
              />
              <Input
                HelperText="At least 6 characters"
                Label="Password"
                Placeholder="super secure like me 🥲"
                OnChange={() => undefined}
                Type="password"
              />
            </Flex>
            <Flex
              Direction="row"
              Gap="var(--spacing-medium)"
              JustifyContent="flex-end"
              Width="100%"
            >
              <Button
                Disabled={loggingIn.pending}
                OnClick={() => undefined}
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
                OnClick={() => undefined}
                Variant="text"
              >
                Create an account
              </Button>
            </Flex>
          </form>
        </Flex>
      </section>

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
        <Show when={loggingIn.result}>
          <p style={{ color: "red" }} role="alert" id="error-message">
            {loggingIn.result!.message}
          </p>
        </Show>
      </form> */}
    </main>
  );
}
