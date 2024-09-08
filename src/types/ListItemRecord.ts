export type ListItemRecord = {
  id?: string;
  item_name: string;
  user: string;
  description: string;
  cooldown_seconds: number;
  created?: string;
  updated?: string;
  shared_users: string[];
  tags: string[];
};

export const emptyListItem: ListItemRecord = {
  item_name: "",
  user: "",
  description: "",
  cooldown_seconds: 0,
  shared_users: [],
  tags: [],
};
