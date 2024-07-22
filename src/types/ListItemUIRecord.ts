import { CompletedItemRecord } from "./CompletedItemRecord";
import { TagRecord } from "./TagRecord";

export type ListItemUIRecord = {
  id?: string;
  item_name: string;
  user: string;
  description: string;
  cooldown_seconds: number;
  created?: string;
  updated?: string;
  shared_users: string[];
  LastCompleted?: CompletedItemRecord;
  tags: TagRecord[];
};
