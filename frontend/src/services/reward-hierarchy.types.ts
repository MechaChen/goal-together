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
  tasks: TaskItem[];
};

export type MainGoalItem = {
  id: string;
  title: string;
  description: string | null;
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
  event_type: "TASK_COMPLETE" | "SUBGOAL_NEAR_COMPLETE" | "SUBGOAL_COMPLETE";
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

export type ApiErrorShape = {
  code: string;
  message: string;
};
