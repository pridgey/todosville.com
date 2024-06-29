import { createAsync, useAction, type RouteDefinition } from "@solidjs/router";
import { For, createEffect, createResource, createSignal } from "solid-js";
import { Button } from "~/components/Button";
import { Flex } from "~/components/Flex";
import { Input } from "~/components/Input";
import { Text } from "~/components/Text";
import { getUser, logout } from "~/lib";
import { createList, deleteList, getAllLists } from "~/lib/db";

export const route = {
  load: () => getUser(),
} satisfies RouteDefinition;

export default function Home() {
  const user = createAsync(() => getUser(), { deferStream: true });
  // Get all lists
  const [lists] = createResource(getAllLists);
  // create new list
  const createNewList = useAction(createList);
  // delete existing list
  const deleteExistingList = useAction(deleteList);

  const [listName, setListName] = createSignal("");

  return (
    <main>
      <Flex AlignItems="center" Direction="column" Gap="medium">
        <Text FontSize="extra-large" FontWeight="bold">
          Todosville
        </Text>
        <Text FontSize="header">Hello {user()?.email}</Text>
        <Input
          Label="List Name"
          OnChange={(newValue) => setListName(newValue)}
        />
        <Button
          OnClick={() => {
            createNewList({
              list_name: listName(),
              user: user()?.id,
            });
          }}
        >
          Create New List
        </Button>
        <For each={lists()}>
          {(list) => (
            <Flex AlignItems="center" Direction="row" Gap="small">
              <Text>{list.list_name}</Text>
              <Button
                OnClick={() => {
                  deleteExistingList(list.id!);
                }}
              >
                Delete
              </Button>
            </Flex>
          )}
        </For>
        <form action={logout} method="post">
          <Button Type="submit">LOGOUT</Button>
        </form>
      </Flex>
    </main>
  );
}
