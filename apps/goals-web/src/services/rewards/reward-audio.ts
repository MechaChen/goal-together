import type { RewardModalQueueItem } from "../reward-modal-queue.store";
import { playRewardAudioForType } from "./reward-audio-settings";

export function playRewardAudio(item: RewardModalQueueItem): void {
  playRewardAudioForType(item.reward_type);
}
