import { ArrowLeft } from "lucide-react";
import { RewardHistory } from "../components/goals/reward-history";
import type { RewardEvent } from "../services/reward-hierarchy.types";

type RewardHistoryPageProps = {
  items: RewardEvent[];
  onBackToMain: () => void;
};

export function RewardHistoryPage({ items, onBackToMain }: RewardHistoryPageProps) {
  return (
    <section className="space-y-4">
      <div>
        <button
          className="inline-flex items-center gap-2 rounded-full border border-muted bg-surface-muted px-4 py-2 text-sm font-medium text-ink-soft"
          onClick={onBackToMain}
        >
          <ArrowLeft size={16} aria-hidden />
          Back to Main Page
        </button>
      </div>
      <h2 className="text-lg font-semibold text-ink-strong">Reward History</h2>
      <RewardHistory items={items} />
    </section>
  );
}
