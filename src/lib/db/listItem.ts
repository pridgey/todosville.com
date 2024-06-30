import { getPocketBase } from "..";
import { ListRecord } from "~/types/ListRecord";
import { action } from "@solidjs/router";
import { ListItemRecord } from "~/types/ListItemRecord";

/**
 * Gets all list items given a list id
 * @returns list_item record array
 */
export const getAllItemsForList = async (listID: string) => {
  "use server";
  try {
    const client = await getPocketBase();

    console.log("GetAllItemsForList", listID);

    const listItems = await client
      .collection<ListItemRecord>("list_item")
      .getFullList({
        filter: `list.id = "${listID}"`,
      });

    console.log("GetAllItemsForList Results", listItems);

    return listItems;
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

    await client.collection<ListItemRecord>("list_item").create(item);

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
