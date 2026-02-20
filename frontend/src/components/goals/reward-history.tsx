import type { RewardEvent } from "../../services/reward-hierarchy.types";

type RewardHistoryProps = {
  items: RewardEvent[];
};

export function RewardHistory({ items }: RewardHistoryProps) {
  return (
    <section className="rounded border border-slate-200 bg-white p-4">
      <h2 className="text-lg font-semibold text-slate-900">Reward History</h2>
      {items.length === 0 ? <p className="text-sm text-slate-500">No reward events yet.</p> : null}
      <ul className="mt-2 space-y-2">
        {items.map((event) => (
          <li key={event.id} className="rounded border border-slate-200 p-2 text-sm">
            <p className="font-medium text-slate-800">
              {event.event_type} +{event.token_amount}
            </p>
            <p className="text-xs text-slate-500">Counter: {event.rewarded_completion_counter ?? "-"}</p>
            <p className="text-xs text-slate-500">{new Date(event.created_at).toLocaleString()}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
