import { HistoryRecord } from "~/types/HistoryRecord";
import { getPocketBase } from "..";

/**
 * Gets history for a singular item
 * @returns history record array
 */
export const getHistoryForItem = async (itemID: string) => {
  "use server";
  try {
    const client = await getPocketBase();

    const itemHistoryRecords = await client
      .collection<HistoryRecord>("history")
      .getFullList({
        filter: `item.id = "${itemID}"`,
      });

    return itemHistoryRecords;
  } catch (err) {
    console.error("Error getting item history", err);
    return [];
  }
};

/**
 * Creates a new history record
 * @param history The history record to create
 * @returns boolean if successful
 */
export const createHistory = async (history: HistoryRecord) => {
  "use server";
  try {
    const client = await getPocketBase();

    await client.collection<HistoryRecord>("history").create(history);

    return true;
  } catch (err) {
    console.error("Error creating history", err);
    return false;
  }
};
