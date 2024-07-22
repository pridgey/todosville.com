import { getPocketBase, getUser } from "..";
import { ListItemRecord } from "~/types/ListItemRecord";
import { action } from "@solidjs/router";
import { TagRecord } from "~/types/TagRecord";
import { CompletedItemRecord } from "~/types/CompletedItemRecord";

/**
 * Gets all list items given a list id
 * @returns list_item record array
 */
export const getAllItemsForUser = async () => {
  "use server";
  try {
    const client = await getPocketBase();
    const user = await getUser();

    // Get all list items for the current user
    const listItems = await client
      .collection<ListItemRecord>("list_items")
      .getFullList({
        filter: `user.id = "${user.id}" || shared_users ~ "${user.id}"`,
      });

    // Get all tags for the current user
    const itemTags = await client.collection<TagRecord>("tags").getFullList({
      filter: `user.id = "${user.id}"`,
    });

    // Get complition data for the list items
    const itemCompletions = await client
      .collection<CompletedItemRecord>("completed_items")
      .getFullList({
        filter: listItems.map((li) => `item.id = "${li.id}"`).join(" || "),
      });

    // Map the tags to the list items
    const uiListItems = listItems.map((li) => ({
      ...li,
      tags: itemTags.filter((tag) => li.tags.includes(tag.id ?? "")),
      LastCompleted: itemCompletions.find((ci) => ci.item === li.id),
    }));

    return uiListItems;
  } catch (err) {
    console.error("Error getting list items", err);
    return [];
  }
};

/**
 * Creates a new to-do list item
 * @param list The list_item record to create
 * @returns boolean if successful
 */
export const createListItem = action(async (item: ListItemRecord) => {
  "use server";
  try {
    const client = await getPocketBase();

    await client.collection<ListItemRecord>("list_items").create(item);

    return true;
  } catch (err) {
    console.error("Error creating list item", err);
    return false;
  }
});

/**
 * Deletes a to-do list item
 * @param listId The id of the list_item to delete
 * @returns boolean if successful
 */
export const deleteListItem = action(async (listItemId: string) => {
  "use server";
  try {
    const client = await getPocketBase();

    await client.collection<ListItemRecord>("list_item").delete(listItemId);

    return true;
  } catch (err) {
    console.error("Error deleting list item", err);
    return false;
  }
});
