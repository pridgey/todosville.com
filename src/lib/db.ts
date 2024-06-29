import { ListRecord } from "~/types/ListRecord";
import { getPocketBase } from ".";
import { action } from "@solidjs/router";

/**
 * Gets all lists from the database
 * @returns list record array
 */
export const getAllLists = async () => {
  "use server";
  try {
    const client = await getPocketBase();

    const lists = await client.collection<ListRecord>("list").getFullList();

    return lists;
  } catch (err) {
    console.error("Error getting lists", err);
    return [];
  }
};

/**
 * Creates a new to-do list
 * @param list The list record to create
 * @returns boolean if successful
 */
export const createList = action(async (list: ListRecord) => {
  "use server";
  try {
    const client = await getPocketBase();

    await client.collection<ListRecord>("list").create(list);

    return true;
  } catch (err) {
    console.error("Error creating list", err);
    return false;
  }
});

/**
 * Deletes a to-do list
 * @param listId The id of the list to delete
 * @returns boolean if successful
 */
export const deleteList = action(async (listId: string) => {
  "use server";
  try {
    const client = await getPocketBase();

    await client.collection<ListRecord>("list").delete(listId);

    return true;
  } catch (err) {
    console.error("Error deleting list", err);
    return false;
  }
});
