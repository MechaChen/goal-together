export type TodoItem = {
  id: string;
  main_target: string;
  is_completed: boolean;
  created_at: string;
  updated_at: string;
};

export type TodoListResponse = {
  items: TodoItem[];
};

export type ProgressSummary = {
  total_count: number;
  completed_count: number;
  percentage: number;
  label: string;
};

export type ApiError = {
  code: string;
  message: string;
};
