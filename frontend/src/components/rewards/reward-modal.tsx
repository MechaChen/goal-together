import { useEffect, useState } from "react";

import {
  consumeRewardModal,
  getRewardModalQueueSnapshot,
  subscribeRewardModalQueue,
} from "../../services/reward-modal-queue.service";
import type { RewardModalQueueItem } from "../../services/reward-modal-queue.store";
import { TokenIcon } from "./token-icon";

export function RewardModal() {
  const [queue, setQueue] = useState<RewardModalQueueItem[]>(() => getRewardModalQueueSnapshot());

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

  return (
    <div
      className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center"
      role="status"
      aria-live="polite"
      aria-label="Reward celebration"
      data-testid="reward-modal"
    >
      <div className="pointer-events-none w-[320px] rounded-xl border border-amber-200/80 bg-white/95 p-6 text-center shadow-2xl backdrop-blur-sm">
        <p className="mb-2 text-sm uppercase tracking-widest text-amber-600">Reward Earned</p>
        <div className="mx-auto mb-3 w-fit reward-coin-flip">
          <TokenIcon size={72} label="Reward token" />
        </div>
        <p className="text-xl font-bold text-slate-900">+{active.token_amount} tokens</p>
        <p className="mt-1 text-xs text-slate-500">{active.reason || "Reward granted"}</p>
      </div>
    </div>
  );
}
