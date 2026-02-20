import type { CompleteTaskResult } from "./reward-hierarchy.types";
import type { RewardModalQueueItem } from "./reward-modal-queue.store";

function newQueueItem(
  reward_type: RewardModalQueueItem["reward_type"],
  token_amount: number,
  reason: string,
): RewardModalQueueItem {
  return {
    queue_id: `${reward_type}-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    reward_type,
    token_amount,
    reason,
    created_at: new Date().toISOString(),
    display_duration_ms: 3000,
  };
}

export function toRewardQueueItems(result: CompleteTaskResult): RewardModalQueueItem[] {
  const items: RewardModalQueueItem[] = [];
  if (result.task_reward > 0) {
    items.push(newQueueItem("TASK_COMPLETE", result.task_reward, `Completed task: "${result.task.title}"`));
  }
  if (result.milestone_applied && result.milestone_reward > 0) {
    items.push(newQueueItem("MILESTONE_5X", result.milestone_reward, "Milestone reached: 5 rewarded tasks"));
  }
  return items;
}
