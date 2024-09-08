import { createAsync, type RouteDefinition } from "@solidjs/router";
import { createResource, createSignal, Show } from "solid-js";
import { Button } from "~/components/Button";
import { Card } from "~/components/Card";
import { Divider } from "~/components/Divider";
import { Flex } from "~/components/Flex";
import { Text } from "~/components/Text";
import { ListItemModal } from "~/compositions/ListItemModal";
import { ToDoList } from "~/compositions/ToDoList";
import { getUser, logout } from "~/lib";
import { getAllItemsForUser } from "~/lib/db";
import homeStyles from "~/styles/home.module.css";
import { ListItemRecord } from "~/types/ListItemRecord";

export const route = {
  load: () => getUser(),
} satisfies RouteDefinition;

export default function Home() {
  // The current user
  const user = createAsync(() => getUser(), { deferStream: true });

  // Get all list items for current user
  const [listItems, { refetch: refetchListItems }] =
    createResource(getAllItemsForUser);

  // // create new list
  // const createNewList = useAction(createList);
  // // delete existing list
  // const deleteExistingList = useAction(deleteList);

  // Show the add item modal
  const [addItemModalOpen, setAddItemModalOpen] = createSignal(false);
  const [selectedListItem, setSelectedListItem] =
    createSignal<ListItemRecord | null>();

  return (
    <main class={homeStyles.background}>
      <Flex
        AlignItems="flex-start"
        Direction="column"
        Gap="medium"
        PaddingX="large"
        PaddingY="medium"
        Width="100%"
      >
        {/* Header bar */}
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
          {/* Main Content - List Items */}
          <Card
            height="100%"
            padding="medium"
            variant="transparent"
            width="100%"
          >
            <Card>
              <Flex Direction="column" Gap="medium" Width="100%">
                <Text FontSize="header" FontWeight="semibold">
                  Your List
                </Text>
                <Divider />
                <ToDoList
                  OnClick={(selectedItem) => {
                    setSelectedListItem({
                      item_name: selectedItem.item_name,
                      description: selectedItem.description,
                      cooldown_seconds: selectedItem.cooldown_seconds,
                    } as ListItemRecord);
                    setAddItemModalOpen(true);
                  }}
                  ListItems={listItems() || []}
                />
                <Button
                  OnClick={() => setAddItemModalOpen(true)}
                  Padding="medium"
                  Sticky={true}
                  StickyOffsets={{ Edge: "bottom", Offset: "10px" }}
                >
                  Add New Item
                </Button>
              </Flex>
            </Card>
          </Card>
        </Flex>
      </Flex>
      <Show when={addItemModalOpen()}>
        <ListItemModal
          SelectedItem={selectedListItem() || undefined}
          OnClose={() => {
            setAddItemModalOpen(false);
            setSelectedListItem(null);
          }}
          OnCreated={() => {
            refetchListItems();
            setAddItemModalOpen(false);
          }}
        />
      </Show>
    </main>
  );
}
