export type RewardModalType = "TASK_COMPLETE" | "MILESTONE_5X";

export type RewardModalQueueItem = {
  queue_id: string;
  reward_type: RewardModalType;
  token_amount: number;
  reason: string;
  created_at: string;
  display_duration_ms: number;
};

type Listener = (items: RewardModalQueueItem[]) => void;

class RewardModalQueueStore {
  private items: RewardModalQueueItem[] = [];
  private listeners = new Set<Listener>();

  getSnapshot(): RewardModalQueueItem[] {
    return this.items;
  }

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    listener(this.items);
    return () => {
      this.listeners.delete(listener);
    };
  }

  enqueue(item: RewardModalQueueItem): void {
    this.items = [...this.items, item];
    this.emit();
  }

  dequeue(): void {
    if (!this.items.length) {
      return;
    }
    this.items = this.items.slice(1);
    this.emit();
  }

  clear(): void {
    this.items = [];
    this.emit();
  }

  private emit(): void {
    this.listeners.forEach((listener) => listener(this.items));
  }
}

export const rewardModalQueueStore = new RewardModalQueueStore();
