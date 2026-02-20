import { RewardHistory } from "../components/goals/reward-history";
import type { RewardEvent } from "../services/reward-hierarchy.types";

type RewardHistoryPageProps = {
  items: RewardEvent[];
  onBackToMain: () => void;
};

export function RewardHistoryPage({ items, onBackToMain }: RewardHistoryPageProps) {
  return (
    <section className="space-y-3">
      <div>
        <button className="rounded bg-slate-900 px-3 py-1 text-sm text-white" onClick={onBackToMain}>
          Back to Main Page
        </button>
      </div>
      <h2 className="text-lg font-semibold text-slate-900">Reward History</h2>
      <RewardHistory items={items} />
    </section>
  );
}
