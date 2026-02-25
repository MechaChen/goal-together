import { FormEvent, useState } from "react";
import { CircleCheck, Circle, Plus, History } from "lucide-react";
import { MAIN_GOALS_PAGE_COPY, MAIN_GOALS_PAGE_UI } from "../config/main-goals-page.config";

import type { MainGoalItem } from "../services/reward-hierarchy.types";

type MainGoalsPageProps = {
  items: MainGoalItem[];
  selectedMainGoalId: string | null;
  onCreateMainGoal: (title: string, description?: string) => Promise<void>;
  onOpenSubGoals: (id: string) => void;
  onOpenRewardHistory: () => void;
};

function buildMainGoalDescription(goal: MainGoalItem): string {
  return goal.description ?? MAIN_GOALS_PAGE_COPY.noDescription;
}

function isSelectedMainGoal(goalId: string, selectedMainGoalId: string | null): boolean {
  return selectedMainGoalId === goalId;
}

function getMainGoalTitleClass(selected: boolean): string {
  return selected ? "font-medium text-ink-disabled line-through" : "font-medium text-ink-strong";
}

type MainGoalsHeaderProps = {
  onOpenRewardHistory: () => void;
};

function MainGoalsHeader({ onOpenRewardHistory }: MainGoalsHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-lg font-semibold text-ink-strong">{MAIN_GOALS_PAGE_COPY.title}</h2>
      <button
        className="inline-flex items-center gap-2 rounded-full border border-muted bg-surface-muted px-3 py-1 text-sm font-medium text-ink-soft"
        onClick={onOpenRewardHistory}
      >
        <History size={MAIN_GOALS_PAGE_UI.actionIconSize} aria-hidden />
        {MAIN_GOALS_PAGE_COPY.rewardHistoryButton}
      </button>
    </div>
  );
}

type MainGoalCreateFormProps = {
  title: string;
  description: string;
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onSubmit: (event: FormEvent) => void;
};

function MainGoalCreateForm({
  title,
  description,
  onTitleChange,
  onDescriptionChange,
  onSubmit,
}: MainGoalCreateFormProps) {
  return (
    <form className="space-y-2" onSubmit={onSubmit}>
      <div className="flex overflow-hidden rounded-full border border-soft bg-white">
        <input
          className="flex-1 bg-transparent px-5 py-3 text-base text-ink-strong outline-none placeholder:text-ink-soft"
          value={title}
          onChange={(event) => onTitleChange(event.target.value)}
          placeholder={MAIN_GOALS_PAGE_COPY.titlePlaceholder}
        />
        <button
          className="inline-flex items-center gap-2 rounded-full bg-accent-blue px-6 py-3 text-base font-semibold tracking-wide text-white"
          type="submit"
        >
          <Plus size={MAIN_GOALS_PAGE_UI.addIconSize} aria-hidden />
          {MAIN_GOALS_PAGE_COPY.addButton}
        </button>
      </div>
      <textarea
        className="w-full rounded-2xl border border-soft bg-white px-4 py-2 text-sm text-ink-strong outline-none placeholder:text-ink-soft"
        value={description}
        onChange={(event) => onDescriptionChange(event.target.value)}
        placeholder={MAIN_GOALS_PAGE_COPY.descriptionPlaceholder}
        rows={2}
      />
    </form>
  );
}

function MainGoalsEmptyState() {
  return <p className="text-sm text-ink-soft">{MAIN_GOALS_PAGE_COPY.emptyState}</p>;
}

type MainGoalListItemProps = {
  goal: MainGoalItem;
  selectedMainGoalId: string | null;
  onOpenSubGoals: (id: string) => void;
};

function MainGoalListItem({ goal, selectedMainGoalId, onOpenSubGoals }: MainGoalListItemProps) {
  const selected = isSelectedMainGoal(goal.id, selectedMainGoalId);
  const titleClass = getMainGoalTitleClass(selected);
  const description = buildMainGoalDescription(goal);

  return (
    <li className="border-b border-line-soft last:border-none">
      <button className="w-full py-2 text-left" onClick={() => onOpenSubGoals(goal.id)}>
        <div className="flex items-start gap-3">
          <span className="mt-0.5 text-accent-orange">
            {selected ? (
              <CircleCheck size={MAIN_GOALS_PAGE_UI.statusIconSize} />
            ) : (
              <Circle size={MAIN_GOALS_PAGE_UI.statusIconSize} className="text-ink-icon" />
            )}
          </span>
          <div className="flex-1">
            <p className={titleClass}>{goal.title}</p>
            <p className="text-xs text-ink-soft">{description}</p>
          </div>
        </div>
      </button>
    </li>
  );
}

type MainGoalsListProps = {
  items: MainGoalItem[];
  selectedMainGoalId: string | null;
  onOpenSubGoals: (id: string) => void;
};

function MainGoalsList({ items, selectedMainGoalId, onOpenSubGoals }: MainGoalsListProps) {
  return (
    <ul className="space-y-2 rounded-[28px] bg-surface-list px-4 py-3">
      {items.map((goal) => (
        <MainGoalListItem
          key={goal.id}
          goal={goal}
          selectedMainGoalId={selectedMainGoalId}
          onOpenSubGoals={onOpenSubGoals}
        />
      ))}
    </ul>
  );
}

export function MainGoalsPage({
  items,
  selectedMainGoalId,
  onCreateMainGoal,
  onOpenSubGoals,
  onOpenRewardHistory,
}: MainGoalsPageProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) {
      return;
    }
    await onCreateMainGoal(trimmed, description.trim() || undefined);
    setTitle("");
    setDescription("");
  }

  return (
    <section className="space-y-4 rounded-[32px] border border-panel bg-surface-card p-4 md:p-6">
      <MainGoalsHeader onOpenRewardHistory={onOpenRewardHistory} />
      <MainGoalCreateForm
        title={title}
        description={description}
        onTitleChange={setTitle}
        onDescriptionChange={setDescription}
        onSubmit={(event) => void handleSubmit(event)}
      />

      {items.length === 0 ? <MainGoalsEmptyState /> : null}
      <MainGoalsList
        items={items}
        selectedMainGoalId={selectedMainGoalId}
        onOpenSubGoals={onOpenSubGoals}
      />
    </section>
  );
}
