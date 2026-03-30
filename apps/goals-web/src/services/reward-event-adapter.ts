import type {
  CompleteMainGoalResult,
  CompleteSubGoalResult,
  CompleteTaskResult,
} from "./reward-hierarchy.types";
import type { RewardModalQueueItem } from "./reward-modal-queue.store";

function newQueueItem(
  reward_type: RewardModalQueueItem["reward_type"],
  token_amount: number,
  reason: string,
  display_duration_ms: number,
): RewardModalQueueItem {
  return {
    queue_id: `${reward_type}-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    reward_type,
    token_amount,
    reason,
    created_at: new Date().toISOString(),
    display_duration_ms,
  };
}

export function toRewardQueueItems(
  result: CompleteTaskResult,
): RewardModalQueueItem[] {
  const items: RewardModalQueueItem[] = [];
  if (result.task_reward > 0) {
    items.push(
      newQueueItem(
        "TASK_COMPLETE",
        result.task_reward,
        `Completed task: "${result.task.title}"`,
        3000,
      ),
    );
  }
  if (result.extra_reward > 0 && result.extra_reward_type) {
    const reason =
      result.extra_reward_message ||
      (result.extra_reward_type === "SUBGOAL_COMPLETE"
        ? "You Snailed it! Awesome job"
        : "Almost there! Enjoy a treat.");
    items.push(
      newQueueItem(result.extra_reward_type, result.extra_reward, reason, 3000),
    );
  }
  return items;
}

export function toSubGoalCompleteRewardQueueItem(
  result: CompleteSubGoalResult,
): RewardModalQueueItem | null {
  if (!result.reward_granted || result.reward_amount <= 0) {
    return null;
  }
  return newQueueItem(
    "SUBGOAL_MANUAL_COMPLETE",
    result.reward_amount,
    "Sub goal completed",
    3000,
  );
}

export function toMainGoalCompleteRewardQueueItem(
  result: CompleteMainGoalResult,
): RewardModalQueueItem | null {
  if (!result.reward_granted || result.reward_amount <= 0) {
    return null;
  }
  return newQueueItem(
    "MAIN_GOAL_MANUAL_COMPLETE",
    result.reward_amount,
    "Main goal completed",
    3000,
  );
}
