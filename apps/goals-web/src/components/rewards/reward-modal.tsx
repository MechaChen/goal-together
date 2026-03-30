import { useEffect, useState } from "react";

import {
  consumeRewardModal,
  getRewardModalQueueSnapshot,
  subscribeRewardModalQueue,
} from "../../services/reward-modal-queue.service";
import type { RewardModalQueueItem } from "../../services/reward-modal-queue.store";
import goalTogetherCongragulation from "../../assets/images/goal-together-logo-congragulation.png";
import goalTogetherFighting from "../../assets/images/goal-together-logo-fighting.png";
import goalTogetherMainGoalCompleted from "../../assets/images/goal-together-logo-main-goal-completed.png";
import goalTogetherSubGoalCompleted from "../../assets/images/goal-together-logo-subgoal-completed.png";
import { TokenIcon } from "./token-icon";
import { playRewardAudio } from "../../services/rewards/reward-audio";

type RewardLogoMeta = {
  src: string;
  alt: string;
};

function getRewardLogoMeta(rewardType: RewardModalQueueItem["reward_type"]): RewardLogoMeta | null {
  if (rewardType === "SUBGOAL_COMPLETE") {
    return {
      src: goalTogetherCongragulation,
      alt: "Sub goal complete reward",
    };
  }

  if (rewardType === "SUBGOAL_NEAR_COMPLETE") {
    return {
      src: goalTogetherFighting,
      alt: "Near complete reward",
    };
  }

  if (rewardType === "MAIN_GOAL_MANUAL_COMPLETE") {
    return {
      src: goalTogetherMainGoalCompleted,
      alt: "Main goal completed reward",
    };
  }

  if (rewardType === "SUBGOAL_MANUAL_COMPLETE") {
    return {
      src: goalTogetherSubGoalCompleted,
      alt: "Sub goal completed reward",
    };
  }

  return null;
}

function getRewardMessage(activeReward: RewardModalQueueItem): string {
  return activeReward.reason || "Reward granted";
}

type RewardLogoSectionProps = {
  logo: RewardLogoMeta;
  message: string;
};

function RewardLogoSection({ logo, message }: RewardLogoSectionProps) {
  return (
    <div className="mx-auto mb-3 w-fit flex flex-col items-center justify-center">
      <img
        src={logo.src}
        alt={logo.alt}
        className="h-[200px] w-[200px] object-contain"
      />
      <p className="mb-3 text-md font-medium text-ink-strong">
        {message}
      </p>
    </div>
  );
}

type RewardAmountSectionProps = {
  tokenAmount: number;
};

function RewardAmountSection({ tokenAmount }: RewardAmountSectionProps) {
  return (
    <div className="flex items-center justify-center gap-2">
      <div className="reward-coin-flip">
        <TokenIcon size={72} label="Reward token" />
      </div>
      <p className="text-xl font-bold text-ink-strong">
        +{tokenAmount} tokens
      </p>
    </div>
  );
}

type RewardFallbackMessageProps = {
  message: string;
};

function RewardFallbackMessage({ message }: RewardFallbackMessageProps) {
  return (
    <p className="mt-1 text-xs font-medium text-ink-soft">
      {message}
    </p>
  );
}

export function RewardModal() {
  const [queue, setQueue] = useState<RewardModalQueueItem[]>(() =>
    getRewardModalQueueSnapshot(),
  );

  useEffect(() => {
    return subscribeRewardModalQueue((items) => {
      setQueue(items);
    });
  }, []);

  const activeReward = queue[0];

  useEffect(() => {
    if (!activeReward) {
      return;
    }
    try {
      playRewardAudio(activeReward);
    } catch {
      // Ignore unsupported audio runtime environments (e.g. jsdom tests).
    }
  }, [activeReward]);

  useEffect(() => {
    if (!activeReward) {
      return;
    }
    const timer = window.setTimeout(() => {
      consumeRewardModal();
    }, activeReward.display_duration_ms);
    return () => window.clearTimeout(timer);
  }, [activeReward]);

  if (!activeReward) {
    return null;
  }

  const rewardLogo = getRewardLogoMeta(activeReward.reward_type);
  const rewardMessage = getRewardMessage(activeReward);

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
        {rewardLogo ? <RewardLogoSection logo={rewardLogo} message={rewardMessage} /> : null}
        <RewardAmountSection tokenAmount={activeReward.token_amount} />
        {!rewardLogo ? <RewardFallbackMessage message={rewardMessage} /> : null}
      </div>
    </div>
  );
}
