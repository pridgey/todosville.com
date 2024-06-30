import { createAsync, useAction, type RouteDefinition } from "@solidjs/router";
import {
  For,
  Show,
  createEffect,
  createResource,
  createSignal,
} from "solid-js";
import { Button } from "~/components/Button";
import { Card } from "~/components/Card";
import { Divider } from "~/components/Divider";
import { Flex } from "~/components/Flex";
import { Input } from "~/components/Input";
import { Text } from "~/components/Text";
import { getUser, logout } from "~/lib";
import {
  createList,
  createListItem,
  deleteList,
  getAllItemsForList,
  getAllLists,
} from "~/lib/db";
import { ListRecord } from "~/types/ListRecord";

export const route = {
  load: () => getUser(),
} satisfies RouteDefinition;

export default function Home() {
  // The current user
  const user = createAsync(() => getUser(), { deferStream: true });

  // Looking at current list
  const [currentList, setCurrentList] = createSignal<ListRecord | null>(null);

  // Get all lists
  const [lists, { refetch: refetchLists }] = createResource(getAllLists);
  // Get all items for current list
  const [listItems, { refetch: refetchListItems }] = createResource(() =>
    getAllItemsForList(currentList()?.id ?? "")
  );
  // create new list
  const createNewList = useAction(createList);
  // delete existing list
  const deleteExistingList = useAction(deleteList);
  // create new list item
  const createNewListItem = useAction(createListItem);

  const [listName, setListName] = createSignal("");
  const [listItemName, setListItemName] = createSignal("");

  return (
    <main>
      <Flex
        AlignItems="flex-start"
        Direction="column"
        Gap="medium"
        PaddingX="large"
        PaddingY="medium"
        Width="100%"
      >
        <Flex
          AlignItems="center"
          Direction="row"
          JustifyContent="space-between"
          Width="100%"
        >
          <Text FontSize="extra-large" FontWeight="bold">
            Todosville
          </Text>
          <form action={logout} method="post">
            <Button Type="submit">LOGOUT</Button>
          </form>
        </Flex>
        <Flex Direction="row" Gap="medium" Width="100%">
          {/* Side Bar - Lists */}
          <Card variant="alternate">
            <Flex Direction="column" Gap="small" Width="350px">
              <Card>
                <Flex Direction="column" Gap="small">
                  <Text FontSize="large" FontWeight="semibold">
                    Your Lists
                  </Text>
                  <For each={lists()}>
                    {(list) => (
                      <Flex
                        AlignItems="center"
                        Direction="row"
                        JustifyContent="space-between"
                      >
                        <Button
                          OnClick={() => {
                            setCurrentList(list);
                            refetchListItems(list.id!);
                          }}
                          Variant="text"
                        >
                          {list.list_name}
                        </Button>
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
                </Flex>
              </Card>
              <Divider />
              <Card>
                <Flex Direction="column" Gap="small">
                  <Text FontSize="large" FontWeight="semibold">
                    Create New List
                  </Text>
                  <Input
                    Label="List Name"
                    OnChange={(newValue) => setListName(newValue)}
                  />
                  <Button
                    OnClick={async () => {
                      await createNewList({
                        list_name: listName(),
                        user: user()?.id,
                      });
                      refetchLists();
                    }}
                  >
                    Create New List
                  </Button>
                </Flex>
              </Card>
            </Flex>
          </Card>
          {/* Main Content - List Items */}
          <Show when={!!currentList()}>
            <Card height="100%" variant="alternate" width="100%">
              <Card>
                <Flex Direction="column" Gap="medium" Width="100%">
                  <Text FontSize="header" FontWeight="semibold">
                    {currentList()?.list_name}
                  </Text>
                  <Flex
                    AlignItems="flex-end"
                    Direction="row"
                    Gap="medium"
                    JustifyContent="space-between"
                    Width="100%"
                  >
                    <Input
                      Label="Item Name"
                      OnChange={(newValue) => setListItemName(newValue)}
                    />
                    <Button
                      OnClick={async () => {
                        await createNewListItem({
                          item_name: listItemName(),
                          list: currentList()?.id!,
                          completion_timeout: 0,
                          last_completed: "",
                          user: user()?.id,
                        });
                        setListItemName("");
                        refetchListItems(currentList()?.id!);
                      }}
                    >
                      Add Item
                    </Button>
                  </Flex>
                  <Divider />
                  <For each={listItems()}>
                    {(item) => (
                      <Card variant="alternate">{item.item_name}</Card>
                    )}
                  </For>
                </Flex>
              </Card>
            </Card>
          </Show>
        </Flex>
      </Flex>
    </main>
  );
}
