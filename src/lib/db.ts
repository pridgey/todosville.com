import { getPocketBase } from ".";

/**
 * Gets the list of classes from the database
 * @returns class record array
 */
export const getClasses = async () => {
  "use server";
  const client = await getPocketBase();

  const classes = await client.collection("class").getFullList();

  return classes;
};
