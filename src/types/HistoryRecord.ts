export type HistoryRecord = {
  id?: string;
  action: "created" | "completed" | "deleted" | "updated";
  item: string;
  user: string;
  created?: string;
  updated?: string;
};
