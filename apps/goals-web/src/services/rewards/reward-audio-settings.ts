import coinSoundUrl from "../../assets/audio/coin_sound.mp3";
import multipleCoinSoundUrl from "../../assets/audio/multi_coin_sound.mp3";
import { rewardHierarchyApi, toApiUrl } from "../reward-hierarchy.client";
import type { RewardAudioSettings, RewardAudioSlot, RewardModalType } from "../reward-hierarchy.types";

const rewardAudioCache = new Map<string, HTMLAudioElement>();

const BONUS_TYPES: RewardModalType[] = [
  "SUBGOAL_NEAR_COMPLETE",
  "SUBGOAL_COMPLETE",
  "MAIN_GOAL_MANUAL_COMPLETE",
  "SUBGOAL_MANUAL_COMPLETE",
];

let rewardAudioSettings: RewardAudioSettings | null = null;

function createAudio(url: string): HTMLAudioElement {
  const audio = new Audio(url);
  audio.preload = "auto";
  audio.volume = 0.7;
  return audio;
}

function getOrCreateAudio(url: string): HTMLAudioElement {
  const cached = rewardAudioCache.get(url);
  if (cached) {
    return cached;
  }
  const audio = createAudio(url);
  rewardAudioCache.set(url, audio);
  return audio;
}

function playAudioUrl(url: string): void {
  const audio = getOrCreateAudio(url);
  audio.currentTime = 0;
  try {
    const playback = audio.play();
    if (playback && typeof playback.catch === "function") {
      void playback.catch(() => {});
    }
  } catch {
    // Ignore unsupported audio runtimes such as jsdom.
  }
}

function resolveSlotKind(rewardType: RewardModalType): RewardAudioSlot["kind"] {
  return BONUS_TYPES.includes(rewardType) ? "bonus" : "normal";
}

function defaultRewardAudioUrl(slotKind: RewardAudioSlot["kind"]): string {
  return slotKind === "bonus" ? multipleCoinSoundUrl : coinSoundUrl;
}

export function replaceRewardAudioSettings(settings: RewardAudioSettings): RewardAudioSettings {
  rewardAudioSettings = settings;
  return settings;
}

export async function syncRewardAudioSettings(): Promise<RewardAudioSettings> {
  const settings = await rewardHierarchyApi.rewardAudioSettings();
  return replaceRewardAudioSettings(settings);
}

export function getRewardAudioSettingsSnapshot(): RewardAudioSettings | null {
  return rewardAudioSettings;
}

export function getRewardAudioSlotSnapshot(slotKind: RewardAudioSlot["kind"]): RewardAudioSlot | null {
  return rewardAudioSettings?.slots.find((slot) => slot.kind === slotKind) ?? null;
}

export function resolveRewardAudioUrl(rewardType: RewardModalType): string {
  const slotKind = resolveSlotKind(rewardType);
  const customUrl = getRewardAudioSlotSnapshot(slotKind)?.file_url;
  return customUrl ? toApiUrl(customUrl) : defaultRewardAudioUrl(slotKind);
}

export function previewRewardAudioSlot(slotKind: RewardAudioSlot["kind"]): void {
  const customUrl = getRewardAudioSlotSnapshot(slotKind)?.file_url;
  const url = customUrl ? toApiUrl(customUrl) : defaultRewardAudioUrl(slotKind);
  playAudioUrl(url);
}

export function playRewardAudioForType(rewardType: RewardModalType): void {
  playAudioUrl(resolveRewardAudioUrl(rewardType));
}
