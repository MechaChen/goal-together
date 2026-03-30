import { rewardHierarchyApi } from "./reward-hierarchy.client";
import type { RewardEvent } from "./reward-hierarchy.types";

export async function loadRewardHistoryPageData(): Promise<RewardEvent[]> {
  const response = await rewardHierarchyApi.rewardHistory();
  return response.items;
}
