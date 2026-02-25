import { useEffect, useState } from "react";

import {
  consumeRewardModal,
  getRewardModalQueueSnapshot,
  subscribeRewardModalQueue,
} from "../../services/reward-modal-queue.service";
import type { RewardModalQueueItem } from "../../services/reward-modal-queue.store";
import goalTogetherCongragulation from "../../assets/images/goal-together-logo-congragulation.png";
import goalTogetherFighting from "../../assets/images/goal-together-logo-fighting.png";
import { TokenIcon } from "./token-icon";

export function RewardModal() {
  const [queue, setQueue] = useState<RewardModalQueueItem[]>(() =>
    getRewardModalQueueSnapshot(),
  );

  useEffect(() => {
    return subscribeRewardModalQueue((items) => {
      setQueue(items);
    });
  }, []);

  const active = queue[0];

  useEffect(() => {
    if (!active) {
      return;
    }
    const timer = window.setTimeout(() => {
      consumeRewardModal();
    }, active.display_duration_ms);
    return () => window.clearTimeout(timer);
  }, [active]);

  if (!active) {
    return null;
  }

  const rewardLogo =
    active.reward_type === "SUBGOAL_COMPLETE"
      ? goalTogetherCongragulation
      : active.reward_type === "SUBGOAL_NEAR_COMPLETE"
        ? goalTogetherFighting
        : null;
  const rewardLogoAlt =
    active.reward_type === "SUBGOAL_COMPLETE"
      ? "Sub goal complete reward"
      : "Near complete reward";
  const milestoneMessage = active.reason || "Reward granted";

  return (
    <div
      className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center"
      role="status"
      aria-live="polite"
      aria-label="Reward celebration"
      data-testid="reward-modal"
    >
      <div className="pointer-events-none w-[320px] rounded-[28px] border border-card bg-surface-card/95 p-6 text-center shadow-xl">
        <p className="mb-2 text-sm uppercase tracking-widest text-accent-orange">
          Reward Earned
        </p>
        {rewardLogo ? (
          <div className="mx-auto mb-3 w-fit flex flex-col items-center justify-center">
            <img
              src={rewardLogo}
              alt={rewardLogoAlt}
              className="h-[200px] w-[200px] object-contain"
            />
            <p className="mb-3 text-md font-medium text-ink-strong">
              {milestoneMessage}
            </p>
          </div>
        ) : null}
        <div className="flex items-center justify-center gap-2">
          <div className="reward-coin-flip">
            <TokenIcon size={72} label="Reward token" />
          </div>
            <p className="text-xl font-bold text-ink-strong">
              +{active.token_amount} tokens
            </p>
          </div>
        {!rewardLogo ? (
          <p className="mt-1 text-xs font-medium text-ink-soft">
            {milestoneMessage}
          </p>
        ) : null}
      </div>
    </div>
  );
}
