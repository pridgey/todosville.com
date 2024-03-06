import { logIfError } from "~/utilities/LogIfError";
import { getClient, getUser } from "./supabase";
import type { Subscription } from "~/types";
import { retryPromise } from "~/utilities/retryPromise";

/**
 * Function that checks for a subscription's existence and will update or insert depending
 * @param subscription Subscription object to be inserted or updated
 * @returns Error object if an error occurs, or true otherwise
 */
export const createOrUpdateSubscription = async (
  subscription: Partial<Subscription>
) => {
  const client = await getClient();

  const { data, error } = await client
    .from("subscription")
    .select()
    .or(
      `user.eq.${subscription.user}, stripe_subscription_id.eq.${
        subscription.stripe_subscription_id || "-1"
      }`
    );

  console.log("Create or Update:", { data, subscription });

  if (error) {
    console.error("Error selecting subscription for create or update:", {
      error,
    });
    return { error };
  }

  if (data.length) {
    // Subscription exists
    const { error } = await client
      .from("subscription")
      .update({
        ...subscription,
      })
      .eq("id", data[0].id);

    if (error) {
      console.error("Error during subscription update:", { error });
      return { error };
    }
  } else {
    // No such subscription exists
    const { error } = await client.from("subscription").insert(subscription);

    if (error) {
      console.error("Error inserting new subscription record:", { error });
      return { error };
    }
  }

  return true;
};

/**
 * Function to query subscription data using a UserID. Useful for anonymous pages such as /forum
 * @param userID The UserID to lookup subscription information by
 * @returns Error object if an error occurs, otherwise any subscription data
 */
export const getSubscriptionByUserID = async (userID: string) => {
  const client = await getClient();

  const today = Date.now() / 1000;

  const { data: subscriptionData, error } = await client
    .from("subscription")
    .select()
    .eq("user", userID)
    .lt("start", today)
    .gte("end", today);

  if (logIfError(error, "Error retrieving subscription data by UserID:")) {
    return { error };
  }

  return subscriptionData?.[0] as Subscription;
};

/**
 * Function to query subscription data by the logged in User
 * @param request HTTP Request to identify the user
 * @returns { error } if an error occurs, otherwise Subscription data
 */
export const getUserSubscription = async (request: Request) => {
  const user = await getUser(request);
  const client = await getClient();

  const userID = user?.user?.id ?? "";
  const today = Date.now() / 1000;

  const { data: subscriptionData, error } = await client
    .from("subscription")
    .select()
    .eq("user", userID)
    .lt("start", today)
    .gte("end", today);

  if (error) {
    console.error("Error retrieving user subscriptions", { error });
    return { error };
  }

  return subscriptionData[0] as Subscription;
};

/**
 * Function to determine if a given forum is premium
 * @param forumSlug The identifiable slug to get the forum
 * @returns boolean that determines if the forum is considered premium
 */
export const isForumPremium = async (forumSlug: string) => {
  const client = await getClient();

  // Grab the forum via the supplied slug
  const { data, error } = await client
    .from("forum")
    .select("user_id")
    .eq("slug", forumSlug);

  // Check for any errors
  if (error instanceof Error) {
    console.error("Error determining isForumPremium", error.message);
    return false;
  }

  const userID = data?.[0].user_id ?? "-1";

  return isUserPremium(userID);
};

/**
 * Function to determine if a given UserID is premium
 * @param userID The UserID to lookup
 * @returns boolean that determines if the userID is considered premium
 */
export const isUserPremium = async (userID: string) => {
  const client = await getClient();

  // To find subscription records we are currently in the middle of
  const today = Date.now() / 1000;

  // Find the user via the attributes' stringified JSON
  const { data, error } = await client
    .from("subscription")
    .select()
    .eq("user", userID)
    .lt("start", today)
    .gte("end", today);

  // Check for any errors
  if (error instanceof Error) {
    console.error("Error determining isUserPremium", error.message);
    return false;
  }

  // Check if we have any results
  if (data?.length) {
    // Double check everything is accurate
    const result = data[0];
    return !!result.id;
  }

  // Must not have a record
  return false;
};

/**
 * Function to mark a subscription as cancelled
 * @param request HTTP Request to identify the user
 * @param subscription Partial properties of the Subscription
 * @returns Error object if an error occurs, otherwise true
 */
export const markSubscriptionAsCancelled = async (
  request: Request,
  subobj: Pick<Subscription, "stripe_subscription_id">
) => {
  const client = await getClient();

  // Check if data exists
  const { data, error } = await client
    .from("subscription")
    .select()
    .eq("stripe_subscription_id", subobj.stripe_subscription_id);

  if (
    logIfError(
      error,
      "Error looking up subscription for cancelled subscription"
    )
  ) {
    return { error };
  }

  // If data exists, update it to cancelled
  if (data?.length) {
    const currentSubscription = data?.[0];

    const { error: statusUpdateError } = await client
      .from("subscription")
      .update({
        status: "Cancelled",
      })
      .eq("id", currentSubscription?.id);

    if (
      logIfError(statusUpdateError, "Error marking subscription as cancelled")
    ) {
      return { error: statusUpdateError };
    }

    console.log("Updated!");

    return true;
  }
};

/**
 * Function to mark a subscription as failed
 * @param request HTTP Request to identify the user
 * @param subscription Partial properties of the Subscription
 * @returns Error object if an error occurs, otherwise true
 */
export const markSubscriptionAsFailed = async (
  request: Request,
  subscription: Pick<Subscription, "user" | "stripe_invoice_id">
) => {
  const client = await getClient(request);

  const { data: subscriptionData, error } = await client
    .from("subscription")
    .select()
    .eq("user", subscription.user)
    .eq("stripe_invoice_id", subscription.stripe_invoice_id);

  if (error) {
    console.error("Error looking up subscription for failed invoice", {
      error,
    });
    return { error };
  }

  if (subscriptionData.length) {
    const currentSubscription = subscriptionData[0];

    const { error: statusUpdateError } = await client
      .from("subscription")
      .update({
        status: "Payment Failed",
      })
      .eq("id", currentSubscription.id);

    if (statusUpdateError) {
      console.error("Error updating status on failed invoice:", {
        statusUpdateError,
      });
      return { error: statusUpdateError };
    }

    return true;
  }
};
