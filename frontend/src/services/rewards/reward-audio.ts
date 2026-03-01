import coinSoundUrl from "../../assets/audio/coin_sound.mp3";
import multipleCoinSoundUrl from "../../assets/audio/multi_coin_sound.mp3";
import type { RewardModalQueueItem } from "../reward-modal-queue.store";

type RewardAudioType = RewardModalQueueItem["reward_type"];

const BONUS_TYPES: RewardAudioType[] = [
  "SUBGOAL_NEAR_COMPLETE",
  "SUBGOAL_COMPLETE",
  "MAIN_GOAL_MANUAL_COMPLETE",
  "SUBGOAL_MANUAL_COMPLETE",
];

function createAudio(url: string): HTMLAudioElement {
  const audio = new Audio(url);
  audio.preload = "auto";
  audio.volume = 0.7;
  return audio;
}

const coinAudio = createAudio(coinSoundUrl);
const multipleCoinAudio = createAudio(multipleCoinSoundUrl);

function isBonus(type: RewardAudioType): boolean {
  return BONUS_TYPES.includes(type);
}

export function playRewardAudio(item: RewardModalQueueItem): void {
  const audio = isBonus(item.reward_type) ? multipleCoinAudio : coinAudio;
  audio.currentTime = 0;
  void audio.play().catch(() => {});
}
