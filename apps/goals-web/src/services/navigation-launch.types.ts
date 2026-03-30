export type LastOpenedTasksContext = {
  route: string;
  main_segment: string | null;
  sub_segment: string | null;
  saved_at: string;
  schema_version: number;
};

export type ParsedTasksPath = {
  route: string;
  mainSegment: string | null;
  subSegment: string | null;
};

