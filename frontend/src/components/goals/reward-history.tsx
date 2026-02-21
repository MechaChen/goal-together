import type { RewardEvent } from "../../services/reward-hierarchy.types";
import { CalendarClock } from "lucide-react";
import { TokenIcon } from "../rewards/token-icon";

type RewardHistoryProps = {
  items: RewardEvent[];
};

export function RewardHistory({ items }: RewardHistoryProps) {
  return (
    <section className="rounded-[28px] border border-[#ddd5ce] bg-[var(--panel-bg)] p-4 md:p-6">
      <h2 className="text-lg font-semibold text-[var(--ink-strong)]">Reward History</h2>
      {items.length === 0 ? <p className="text-sm text-[var(--ink-soft)]">No reward events yet.</p> : null}
      <ul className="mt-2 space-y-2 rounded-[24px] bg-[#e8e1db] px-4 py-3">
        {items.map((event) => (
          <li key={event.id} className="border-b border-[var(--accent-line)] py-2 text-sm last:border-none">
            <div className="flex items-center gap-2">
              <TokenIcon size={18} label="History token" />
              <p className="font-medium text-[var(--ink-strong)]">
                {event.event_type} +{event.token_amount}
              </p>
            </div>
            <p className="text-xs text-[var(--ink-soft)]">Counter: {event.rewarded_completion_counter ?? "-"}</p>
            <p className="inline-flex items-center gap-1 text-xs text-[var(--ink-soft)]">
              <CalendarClock size={12} aria-hidden />
              {new Date(event.created_at).toLocaleString()}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
