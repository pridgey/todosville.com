import { createAsync, type RouteDefinition } from "@solidjs/router";
import { createEffect, createResource } from "solid-js";
import { Button } from "~/components/Button";
import { Flex } from "~/components/Flex";
import { Text } from "~/components/Text";
import { getUser, logout } from "~/lib";
import { getClasses } from "~/lib/db";

export const route = {
  load: () => getUser(),
} satisfies RouteDefinition;

export default function Home() {
  const user = createAsync(() => getUser(), { deferStream: true });
  const [classes] = createResource(getClasses);

  createEffect(() => {
    console.log("Classes", classes());
  });

  return (
    <main>
      <Flex AlignItems="center" Direction="column" Gap="medium">
        <Text FontSize="extra-large" FontWeight="bold">
          Todosville
        </Text>
        <Text FontSize="header">Hello {user()?.email}</Text>
        <form action={logout} method="post">
          <Button Type="submit">LOGOUT</Button>
        </form>
      </Flex>
    </main>
  );
}
