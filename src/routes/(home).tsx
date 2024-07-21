import { createAsync, useAction, type RouteDefinition } from "@solidjs/router";
import { For, createResource, createSignal } from "solid-js";
import { Button } from "~/components/Button";
import { Card } from "~/components/Card";
import { Divider } from "~/components/Divider";
import { Flex } from "~/components/Flex";
import { Grid } from "~/components/Grid";
import { Input } from "~/components/Input";
import { Text } from "~/components/Text";
import { ListItemCard } from "~/compositions/ListItemCard";
import { getUser, logout } from "~/lib";
import { createListItem, getAllItemsForUser } from "~/lib/db";
import homeStyles from "~/styles/home.module.css";
import { Mason } from "solid-mason";

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
  // create new list item
  const createNewListItem = useAction(createListItem);

  // State for a new list item
  const [listItemName, setListItemName] = createSignal("");

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
            padding="large"
            variant="transparent"
            width="100%"
          >
            <Card>
              <Flex Direction="column" Gap="medium" Width="100%">
                <Text FontSize="header" FontWeight="semibold">
                  Your List
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
                        description: "",
                        cooldown_seconds: 0,
                        shared_users: [],
                        tags: [],
                        user: user()?.id,
                      });
                      setListItemName("");
                      refetchListItems();
                    }}
                  >
                    Add Item
                  </Button>
                </Flex>
                <Divider />
                {/* <Grid
                  Columns="repeat(auto-fill, minmax(300px, 1fr))"
                  Gap="small"
                > */}
                <Mason as="div" items={listItems()} columns={4}>
                  {(item) => <ListItemCard {...item} />}
                </Mason>
                {/* </Grid> */}
              </Flex>
            </Card>
          </Card>
        </Flex>
      </Flex>
    </main>
  );
}
