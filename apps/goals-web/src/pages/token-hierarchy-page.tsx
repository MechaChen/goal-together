import { FormEvent, useEffect, useState } from "react";

import { GoalTree } from "../components/goals/goal-tree";
import { RewardHistory } from "../components/goals/reward-history";
import { RewardToast } from "../components/goals/reward-toast";
import { WalletSummaryCard } from "../components/goals/wallet-summary";
import { ApiError, rewardHierarchyApi } from "../services/reward-hierarchy.client";
import type { MainGoalItem, RewardEvent, WalletSummary } from "../services/reward-hierarchy.types";

const EMPTY_WALLET: WalletSummary = {
  user_id: "default-user",
  balance: 0,
  rewarded_completion_count: 0,
};

export function TokenHierarchyPage() {
  const [items, setItems] = useState<MainGoalItem[]>([]);
  const [wallet, setWallet] = useState<WalletSummary>(EMPTY_WALLET);
  const [history, setHistory] = useState<RewardEvent[]>([]);
  const [mainGoalTitle, setMainGoalTitle] = useState("");
  const [mainGoalDescription, setMainGoalDescription] = useState("");
  const [rewardMessage, setRewardMessage] = useState<string | null>(null);
  const [completionHint, setCompletionHint] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function refresh() {
    const [tree, walletSummary, rewardHistory] = await Promise.all([
      rewardHierarchyApi.listTree(),
      rewardHierarchyApi.wallet(),
      rewardHierarchyApi.rewardHistory(),
    ]);
    setItems(tree.items);
    setWallet(walletSummary);
    setHistory(rewardHistory.items);
  }

  useEffect(() => {
    void refresh().catch((err) => {
      setError(err instanceof Error ? err.message : "Failed to load hierarchy");
    });
  }, []);

  async function createMainGoal(event: FormEvent) {
    event.preventDefault();
    if (!mainGoalTitle.trim()) {
      setError("Main goal title is required");
      return;
    }
    await rewardHierarchyApi.createMainGoal(mainGoalTitle.trim(), mainGoalDescription.trim() || undefined);
    setMainGoalTitle("");
    setMainGoalDescription("");
    await refresh();
  }

  async function completeTask(taskId: string) {
    setCompletionHint(null);
    setRewardMessage(null);
    try {
      const result = await rewardHierarchyApi.completeTask(taskId);
      if (result.hint) {
        setCompletionHint(result.hint);
        return;
      }
      const extraText = result.extra_reward > 0 ? ` + bonus ${result.extra_reward}` : "";
      setRewardMessage(`Reward granted: +${result.task_reward}${extraText} tokens`);
      await refresh();
    } catch (err) {
      if (err instanceof ApiError && err.message.includes("already completed previously")) {
        setCompletionHint("already completed previously");
        return;
      }
      setError(err instanceof Error ? err.message : "Failed to complete task");
    }
  }

  return (
    <main className="mx-auto max-w-5xl space-y-4 p-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold text-slate-900">Goal Together: Token Rewards</h1>
        <p className="text-sm text-slate-600">Main goal → sub goals → tasks with confirmation and reward rules.</p>
      </header>

      <WalletSummaryCard wallet={wallet} />
      <RewardToast message={rewardMessage} />
      {error ? <p className="rounded bg-red-100 px-3 py-2 text-sm text-red-700">{error}</p> : null}

      <section className="rounded border border-slate-200 bg-white p-4">
        <h2 className="text-lg font-semibold text-slate-900">Create Main Goal</h2>
        <form className="mt-2 space-y-2" onSubmit={(event) => void createMainGoal(event)}>
          <input
            className="w-full rounded border border-slate-300 px-3 py-2"
            placeholder="Main goal title"
            value={mainGoalTitle}
            onChange={(event) => setMainGoalTitle(event.target.value)}
            maxLength={200}
          />
          <textarea
            className="w-full rounded border border-slate-300 px-3 py-2"
            placeholder="Description (optional)"
            value={mainGoalDescription}
            onChange={(event) => setMainGoalDescription(event.target.value)}
            rows={2}
          />
          <button type="submit" className="rounded bg-slate-900 px-3 py-2 text-sm text-white">
            Add main goal
          </button>
        </form>
      </section>

      <GoalTree
        items={items}
        completionHint={completionHint}
        onCreateSubGoal={async (mainGoalId, title) => {
          await rewardHierarchyApi.createSubGoal(mainGoalId, title);
          await refresh();
        }}
        onCreateTask={async (subGoalId, title) => {
          await rewardHierarchyApi.createDraftTask(subGoalId, title);
          await refresh();
        }}
        onUpdateTask={async (taskId, title) => {
          await rewardHierarchyApi.updateTask(taskId, title);
          await refresh();
        }}
        onDeleteTask={async (taskId) => {
          await rewardHierarchyApi.deleteTask(taskId);
          await refresh();
        }}
        onCompleteTask={completeTask}
      />

      <RewardHistory items={history} />
    </main>
  );
}
