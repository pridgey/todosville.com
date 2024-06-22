import { createAsync, type RouteDefinition } from "@solidjs/router";
import { createEffect, createResource } from "solid-js";
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
    <main class="w-full p-4 space-y-2">
      <h2 class="font-bold text-3xl">Hello {user()?.email}</h2>
      <h3 class="font-bold text-xl">Message board</h3>
      <form action={logout} method="post">
        <button name="logout" type="submit">
          Logout
        </button>
      </form>
    </main>
  );
}
