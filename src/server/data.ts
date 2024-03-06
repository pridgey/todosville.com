import { getClient } from "./supabase";
import { generateSlug } from "~/utilities/Slug";
import crypto from "crypto";
import type { Forum, Question, Vote } from "~/types";
import { isUserPremium } from "./subscription";

/**
 * Function to create a new question for forum session
 * @param question The question text
 * @param sessionID The forum session to attach the question to
 * @returns { error } if an error occurs, otherwise true
 */
export const createQuestion = async (question: string, sessionID: number) => {
  const client = await getClient();

  const { error } = await client.from("questions").insert({
    question,
    forum: sessionID,
  });

  if (error) {
    console.error("Error creating new question record:", error);
    return { error };
  }

  return true;
};

/**
 * Function to create a new Q&A session or "forum"
 * @param request HTTP Request to identify the user
 * @param sessionName The name of the session to be created
 * @param description The description of the session to be created
 * @param userId The userID of the user creating the session
 * @returns ID of the created session, or { error } in an error occurs
 */
export const createSession = async (
  request: Request,
  sessionName: string,
  description: string,
  userId: string
) => {
  const client = await getClient(request);

  // Create a new forum session
  const { data, error } = await client
    .from("forum")
    .insert({
      name: sessionName,
      description,
      user_id: userId,
    })
    .select("id");

  if (error) {
    console.error("Error creating new session record:", error);
    return { error };
  }

  // Generate a new slug and apply to the new forum session
  const slug = generateSlug();
  const newId: number = data[0].id;

  const { error: slugError } = await client
    .from("forum")
    .update({
      slug: `${newId}-${slug}`,
    })
    .eq("id", newId);

  if (slugError) {
    console.error("Error assigning slug to new forum session:", slugError);
    return { error: slugError };
  }

  return newId;
};

/**
 * Function to delete storage bucket items based on UserID, SessionID and type of deletion
 * @param request HTTP Request to identify user
 * @param sessionID The sepcified SessionID
 * @param userId The UserID to identify which storage bucket
 * @param mode "all" deletes all user's items, "specific" will delete the specified sessionID item, "others" will delete everything except the specified sessionID item
 * @returns boolean if operation was successful
 */
export const deleteBucketItems = async (
  request: Request,
  sessionID: number,
  userId: string,
  mode: "all" | "specific" | "others"
) => {
  const client = await getClient(request);

  // Get a list of the bucket items for a specific user
  const { data: bucketItems, error: listBucketError } = await client.storage
    .from("banners")
    .list(userId);

  if (listBucketError instanceof Error) {
    console.error("Error listing bucket contents for user:", listBucketError);
    return false;
  }

  // If there are bucket items...
  if (bucketItems) {
    const bucketItemNames = bucketItems.map((item) => item.name);

    switch (mode) {
      // Delete everything
      case "all": {
        const { error } = await client.storage
          .from("banners")
          .remove(bucketItemNames.map((item) => `${userId}/${item}`));

        if (error instanceof Error) {
          console.error("Error deleting all bucket items:", error);
          return false;
        }
        break;
      }
      // Remove all items except specified session
      case "others": {
        const filteredItems = bucketItemNames.filter(
          (item) => item !== sessionID.toString()
        );

        console.log("Remove other items:", { filteredItems });

        // Delete the filtered list (everything not the session)
        const { error } = await client.storage
          .from("banners")
          .remove(filteredItems.map((item) => `${userId}/${item}`));

        if (error instanceof Error) {
          console.error("Error deleting bucket items except specific:", error);
          return false;
        }
        break;
      }
      // Delete only specific item
      case "specific": {
        const { error } = await client.storage
          .from("banners")
          .remove([`${userId}/${sessionID.toString()}`]);

        if (error instanceof Error) {
          console.error("Error deleting single specific bucket item:", error);
          return false;
        }
        break;
      }
    }

    return true;
  }

  // There is nothing to delete
  return true;
};

/**
 * Function to delete previous sessions and questions for non-premium users
 * @param request The HTTP Request to identify the user
 * @param currentSessionID The newly created session ID to keep
 * @param userId The user creating the session
 * @returns { error } if an error occurs, true if successful
 */
export const deleteOldSessions = async (
  request: Request,
  currentSessionID: number,
  userId: string
) => {
  const client = await getClient(request);

  // First delete the sessions
  const { error } = await client
    .from("forum")
    .delete()
    .eq("user_id", userId)
    .neq("id", currentSessionID);

  if (error) {
    console.error("Error deleting previous sessions:", error);
    return { error };
  }

  // Delete all bucket items except the current session
  await deleteBucketItems(request, currentSessionID, userId, "others");

  return true;
};

/**
 * Function to delete a specific session
 * @param request HTTP request to identify the user
 * @param sessionID The session being deleted
 * @param userId The userID of the session for validation
 * @returns boolean determining if the operation was successful
 */
export const deleteSession = async (
  request: Request,
  sessionID: number,
  userId: string
) => {
  const client = await getClient(request);

  // Delete the session
  const { error } = await client
    .from("forum")
    .delete()
    .eq("user_id", userId)
    .eq("id", sessionID);

  if (error instanceof Error) {
    console.error("Error deleting specific session", error);
    return false;
  }

  // Delete this sessions storage items
  const itemsDeleted = await deleteBucketItems(
    request,
    sessionID,
    userId,
    "specific"
  );

  return itemsDeleted;
};

// VoteNumbers
type VoteNumbers = {
  [key: number]: number;
};

/**
 * Function to retrieve a count of votes per question in a forum session
 * @param request HTTP Request to identify the user
 * @param forumID The forum to grab votes for
 * @returns Object of question IDs and their vote counts
 */
export const getAllVotes = async (request: Request, forumID: number) => {
  const client = await getClient(request);

  const { data, error } = await client
    .from("votes")
    .select()
    .eq("forum", forumID)
    .returns<Vote[]>();

  if (error instanceof Error) {
    console.error("Error retrieving all votes for forum", error);
    return [];
  }

  // The resulting object
  const results: VoteNumbers = {};

  // Transform results into { id: votes }
  const questionIDs = Array.from(new Set(data?.map((d) => d.question)));

  questionIDs.forEach((q) => {
    let total = data?.filter((d) => d.question === q).length ?? 0;

    results[q] = total;
  });

  return results;
};

type DashboardData = {
  forum?: Forum;
  otherForums: Array<Pick<Forum, "id" | "name"> & { numberQuestions: number }>;
  questions: Question[];
  questionVotes: VoteNumbers;
  banner: string;
};

/**
 * Function to grab the forum session data, if an id is supplied it will grab the specific specific otherwise it will find the latest
 * @param request The HTTP Request for identifying the user
 * @param userID The User's ID
 * @param sessionID (Optional) The SessionID being grabbed, if not supplied will grab the latest user session
 * @returns { error } if an error, or the Session data if all good
 */
export const getDashboardData = async (
  request: Request,
  userID: string,
  sessionID?: number
): Promise<DashboardData> => {
  const client = await getClient(request);

  // Is this user a premium subscriber
  const isPremium = await isUserPremium(userID);

  // Empty return object for errors
  const emptyObject: DashboardData = {
    forum: undefined,
    otherForums: [],
    questions: [],
    questionVotes: {},
    banner: "",
  };

  // Select all forum sessions by user, order by created_at
  const { data, error } = await client
    .from("forum")
    .select()
    .eq("user_id", userID)
    .order("created_at", { ascending: false })
    .returns<Forum[]>();

  if (error instanceof Error) {
    console.error("Error retrieving dashboard data", error);
    return emptyObject;
  }

  if (data?.length) {
    // The selected session, defaults to the latest session
    const selectedSession =
      (sessionID ? data?.find((d) => d.id === sessionID) : data[0]) ?? data[0];

    // Other sessions to show for premium users
    const otherSessions = isPremium
      ? data.filter((s) => s.id !== selectedSession?.id)
      : [];

    // The url for the session banner
    const bannerUrl: string = selectedSession?.banner_url ?? "";

    // Get the questions for all sessions of this user
    const { data: questionData, error: questionError } = await client
      .from("questions")
      .select()
      .in(
        "forum",
        data.map((d) => d.id)
      )
      .returns<Question[]>();

    if (questionError instanceof Error) {
      console.error("Error retrieving questions for dashboard", questionError);
      return emptyObject;
    }

    // All the question data for the selected session
    const questions =
      questionData?.filter((qd) => qd.forum === selectedSession.id) ?? [];

    // Get votes for the selected session's questions
    const questionVotes = await getAllVotes(request, selectedSession.id);

    // Build the other forums array
    const otherForums = otherSessions.map((os) => ({
      id: os.id,
      name: os.name,
      numberQuestions: (questionData?.filter((q) => q.forum === os.id) ?? [])
        .length,
    }));

    console.log("Dashboard Data Call:", { questions, otherForums });

    // Return
    return {
      forum: selectedSession,
      otherForums,
      questions,
      questionVotes,
      banner: bannerUrl,
    };
  }

  return emptyObject;
};

/**
 * Function to grab the data of a Forum Q&A session, its questions and branding
 * @param slug Identifier for grabbing the correct forum session
 * @returns { error } if an error occurs, otherwise returns the forum data
 */
export const getForumDataAnon = async (slug: string) => {
  const client = await getClient();

  const { data, error } = await client.from("forum").select().eq("slug", slug);

  if (error) {
    console.error("Error retrieving data for anonymous forum:", error);
    return { error };
  }

  if (!data.length) {
    return { error: "No Data Found" };
  }

  const forumData: Forum = data[0];
  const sessionID: number = forumData.id;
  const bannerUrl: string = forumData.banner_url;

  const { data: questionData, error: questionError } = await client
    .from("questions")
    .select()
    .eq("forum", sessionID);

  if (questionError) {
    console.error(
      "Error retrieving questions for anonymous forum:",
      questionError
    );
    return { error: questionError };
  }

  return {
    forum: forumData,
    questions: questionData as Question[],
    banner: bannerUrl,
  };
};

/**
 * Function to calculate the highly voted questions of any given forum session
 * @param sessionID The forum session id
 * @returns { error } if an error occurs, otherwise an array of question id's considered highly voted
 */
export const getHighlyVoteQuestions = async (slug: string) => {
  const client = await getClient();

  const { data: forumData, error: forumError } = await client
    .from("forum")
    .select("id")
    .eq("slug", slug);

  if (forumError) {
    console.error(
      "Error getting forum Id for highly voted calculations:",
      forumError
    );
    return { error: forumError };
  }

  const sessionID = forumData[0]?.id;

  const { count: totalQuestionsCount, error: questionCountError } = await client
    .from("questions")
    .select("id", { head: true, count: "exact" })
    .eq("forum", sessionID);

  if (questionCountError) {
    console.error(
      "Error counting total questions for highly voted calculations:",
      questionCountError
    );
    return { error: questionCountError };
  }

  const { data: voteRecords, error: voteRecordsError } = await client
    .from("votes")
    .select()
    .eq("forum", sessionID);

  if (voteRecordsError) {
    console.error(
      "Error retrieving votes for highly voted calculations:",
      voteRecordsError
    );
    return { error: voteRecordsError };
  }

  if (!voteRecords.length) {
    return [];
  }

  // Create Map for questionID and vote count
  const uniqueQuestionIDs = voteRecords.map((vr) => vr.question);

  const questionVotes = new Map();

  uniqueQuestionIDs.forEach((q) => {
    const voteCount = voteRecords.filter((vr) => vr.question === q).length;

    questionVotes.set(q, voteCount);
  });

  // Order Map by votes
  const mapArray = Array.from(questionVotes);
  mapArray.sort((a, b) => b[1] - a[1]);

  // Determine how many to return based on total questions asked
  const questionsToReturn = Math.min(
    1,
    Math.floor(totalQuestionsCount ?? 10 / 10)
  );

  // Get the questions (plus any ties)
  const topQuestionVotes = mapArray.slice(0, questionsToReturn);
  const lastValue = topQuestionVotes.at(-1)?.[1];
  // Add any tied values
  for (let i = questionsToReturn; i < mapArray.length; i++) {
    if (mapArray[i][1] === lastValue) {
      topQuestionVotes.push(mapArray[i]);
      continue;
    } else {
      break;
    }
  }

  return topQuestionVotes.map((tqv) => tqv[0]) as number[];
};

/**
 * Function to get an array of votes per user hash
 * @param hash The hash identifier to filter the vote records
 * @param sessionID The forum session
 * @returns { error } if an error occurs, otherwise an array of vote records
 */
export const getVotedQuestionsByHash = async (
  hash: string,
  sessionID: number
) => {
  const client = await getClient();

  const { data, error } = await client
    .from("votes")
    .select()
    .eq("hash", hash)
    .eq("forum", sessionID);

  if (error) {
    console.error("Error retrieving votes for a given hash:", error);
    return { error };
  }

  return data as Vote[];
};

/**
 * Function to replace the banner for a given Forum Session
 * @param request The HTTP Request to identify the user
 * @param fileName The filename of the banner
 * @param file The new file contents
 * @returns { error } if an error occurs, or true otherwise
 */
export const replaceForumBanner = async (
  request: Request,
  sessionID: number,
  fileName: string,
  file: File
) => {
  const client = await getClient(request);

  // Update the image
  const { error: replaceBannerError } = await client.storage
    .from("banners")
    .update(fileName, file);

  if (replaceBannerError) {
    console.error(
      "Error removing banner during Forum Session Banner replacement:",
      replaceBannerError
    );
    return { error: replaceBannerError };
  }

  // Get the image url
  const { data: publicUrlData } = await client.storage
    .from("banners")
    .getPublicUrl(fileName);

  // Update forum record with public url
  if (publicUrlData?.publicUrl) {
    const { error: updateBannerURLError } = await client
      .from("forum")
      .update({
        banner_url: `${publicUrlData.publicUrl}?lm=${Date.now()}`,
      })
      .eq("id", sessionID);

    if (updateBannerURLError) {
      console.error(
        "Error updating forum record banner url:",
        updateBannerURLError
      );
      return { error: updateBannerURLError };
    }
  }

  return true;
};

/**
 * Function to toggle the featured status of a question record
 * @param request The HTTP Request to identify the user
 * @param questionID The ID of the question being toggled
 * @param featuredStatus The current featured status of the question
 * @returns { error } if something goes wrong, true if successful
 */
export const toggleQuestionFeatured = async (
  request: Request,
  questionID: number,
  featuredStatus: boolean
) => {
  const client = await getClient(request);

  const { error } = await client
    .from("questions")
    .update({
      featured: !featuredStatus,
    })
    .eq("id", questionID);

  if (error) {
    console.error("Error toggling question featured status:", error);
    return { error };
  }

  return true;
};

/**
 * Function to toggle the off topic status of a question record
 * @param request The HTTP Request to identify the user
 * @param questionID The ID of the question being toggled
 * @param offTopicStatus The current off topic status of the question
 * @returns { error } if something goes wrong, true if successful
 */
export const toggleQuestionOffTopic = async (
  request: Request,
  questionID: number,
  offTopicStatus: boolean
) => {
  const client = await getClient(request);

  const { error } = await client
    .from("questions")
    .update({
      off_topic: !offTopicStatus,
    })
    .eq("id", questionID);

  if (error) {
    console.error("Error toggling question off topic status:", error);
    return { error };
  }

  return true;
};

/**
 * Function to toggle the open status of a forum session
 * @param request The HTTP Request to identify the user
 * @param sessionID The ID of the forum session
 * @param currentStatus Represents current open status of the forum session
 * @returns { error } if something goes wrong, true if successful
 */
export const toggleQuestionsOpen = async (
  request: Request,
  sessionID: number,
  currentStatus: boolean
) => {
  const client = await getClient(request);

  const { error } = await client
    .from("forum")
    .update({
      open: !currentStatus,
    })
    .eq("id", sessionID);

  if (error) {
    console.error("Error toggling forum open status:", error);
    return { error };
  }

  return true;
};

/**
 * Function to vote or unvote a particular question based on record existence. Uses a hashed fingerprint to try and prevent spam voting but maintain anonimity
 * @param fingerprint Fingerprint for UX purposes
 * @param questionID Question being voted for
 * @param sessionID Forum session
 * @returns { error } if error occurs, otherwise true
 */
export const toggleVoteForQuestion = async (
  fingerprint: string,
  questionID: number,
  sessionID: number
) => {
  const client = await getClient();

  const hash = crypto
    .createHash("sha256")
    .update(fingerprint)
    .digest("base64url");

  const { data: checkExistData, error: checkExistError } = await client
    .from("votes")
    .select()
    .eq("hash", hash)
    .eq("question", questionID)
    .eq("forum", sessionID);

  if (checkExistError) {
    console.error(
      "Error checking existence of a vote record:",
      checkExistError
    );
    return { error: checkExistError };
  }

  if (!!checkExistData.length) {
    // The record exists, remove it
    const toRemoveId = checkExistData[0].id;

    const { error: removeVoteError } = await client
      .from("votes")
      .delete()
      .eq("id", toRemoveId);

    if (removeVoteError) {
      console.error("Error removing vote record:", removeVoteError);
      return { error: removeVoteError };
    }
  } else {
    // The record doesn't exist, add it
    const { error: addVoteError } = await client.from("votes").insert({
      question: questionID,
      forum: sessionID,
      hash,
    });

    if (addVoteError) {
      console.error("Error inserting vote record:", addVoteError);
      return { error: addVoteError };
    }
  }

  return true;
};

/**
 * Function to update the Name and Description of a Forum Session
 * @param request The HTTP Request to identify the user
 * @param SessionID The ID of the forum session to be updated
 * @param newData The new data
 * @returns { error } if an error occurs, or true if successful
 */
export const updateForumSessionData = async (
  request: Request,
  SessionID: number,
  newData: { SessionName: string; Description: string }
) => {
  const client = await getClient(request);

  const { error } = await client
    .from("forum")
    .update({
      name: newData.SessionName,
      description: newData.Description,
    })
    .eq("id", SessionID);

  if (error) {
    console.error("Error during Forum Session Update:", error);
    return { error };
  }

  return true;
};

/**
 * Function to upload an image to the banner bucket
 * @param request HTTP Request to identify the user
 * @param fileName Name of the file, including folders
 * @param file The contents of the file to upload
 * @returns Data regarding the bucket's path
 */
export const uploadFileToBucket = async (
  request: Request,
  sessionID: number,
  fileName: string,
  file: File
) => {
  const client = await getClient(request);

  // Upload banner
  const { data, error } = await client.storage
    .from("banners")
    .upload(fileName, file);

  if (error) {
    console.error("Error during file upload to storage bucket:", error);
    return { error };
  }

  // Get public url
  const { data: publicURLData } = await client.storage
    .from("banners")
    .getPublicUrl(fileName);

  // Update forum record url
  if (publicURLData?.publicUrl) {
    const { error: updateForumBannerError } = await client
      .from("forum")
      .update({
        banner_url: publicURLData.publicUrl,
      })
      .eq("id", sessionID);

    if (updateForumBannerError) {
      console.error(
        "Error inserting banner url to new forum record:",
        updateForumBannerError
      );
      return { error: updateForumBannerError };
    }
  }

  return data;
};
