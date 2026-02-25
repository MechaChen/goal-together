export type TaskItem = {
  id: string;
  sub_goal_id: string;
  title: string;
  lifecycle_state: "draft" | "confirmed";
  is_completed: boolean;
  first_rewarded_completion_at: string | null;
};

export type SubGoalItem = {
  id: string;
  main_goal_id: string;
  title: string;
  is_completed: boolean;
  completed_at: string | null;
  tasks: TaskItem[];
};

export type MainGoalItem = {
  id: string;
  title: string;
  description: string | null;
  is_completed: boolean;
  completed_at: string | null;
  sub_goals: SubGoalItem[];
};

export type HierarchyResponse = {
  items: MainGoalItem[];
};

export type WalletSummary = {
  user_id: string;
  balance: number;
  rewarded_completion_count: number;
};

export type RewardEvent = {
  id: string;
  event_type:
    | "TASK_COMPLETE"
    | "SUBGOAL_NEAR_COMPLETE"
    | "SUBGOAL_COMPLETE"
    | "SUBGOAL_MANUAL_COMPLETE"
    | "MAIN_GOAL_MANUAL_COMPLETE";
  token_amount: number;
  task_id: string | null;
  rewarded_completion_counter: number | null;
  created_at: string;
};

export type RewardHistoryResponse = {
  items: RewardEvent[];
};

export type CompleteTaskResult = {
  task_reward: number;
  extra_reward: number;
  extra_reward_type: "SUBGOAL_NEAR_COMPLETE" | "SUBGOAL_COMPLETE" | null;
  extra_reward_message: string | null;
  rewarded_completion_count: number;
  wallet_balance: number;
  hint: string | null;
  task: TaskItem;
};

export type BulkConfirmDraftTasksResult = {
  sub_goal_id: string;
  confirmed_count: number;
  already_confirmed_count: number;
  total_tasks_count: number;
};

export type CompletionProgress = {
  completed_count: number;
  total_count: number;
  percentage: number;
};

export type CompleteSubGoalResult = {
  sub_goal_id: string;
  is_completed: boolean;
  completed_at: string | null;
  reward_granted: boolean;
  reward_amount: number;
  wallet_balance: number;
  progress: CompletionProgress;
};

export type CompleteMainGoalResult = {
  main_goal_id: string;
  is_completed: boolean;
  completed_at: string | null;
  reward_granted: boolean;
  reward_amount: number;
  wallet_balance: number;
  progress: CompletionProgress;
};

export type AppToastKind = "success" | "error" | "info";

export type AppToast = {
  kind: AppToastKind;
  message: string;
};

export type ApiErrorShape = {
  code: string;
  message: string;
};
