import { rewardModalQueueStore, type RewardModalQueueItem } from "./reward-modal-queue.store";

export function enqueueRewardModal(item: RewardModalQueueItem): void {
  rewardModalQueueStore.enqueue(item);
}

export function enqueueRewardModals(items: RewardModalQueueItem[]): void {
  items.forEach((item) => rewardModalQueueStore.enqueue(item));
}

export function consumeRewardModal(): void {
  rewardModalQueueStore.dequeue();
}

export function subscribeRewardModalQueue(listener: (items: RewardModalQueueItem[]) => void): () => void {
  return rewardModalQueueStore.subscribe(listener);
}

export function getRewardModalQueueSnapshot(): RewardModalQueueItem[] {
  return rewardModalQueueStore.getSnapshot();
}
