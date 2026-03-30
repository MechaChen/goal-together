import { FormEvent, useState } from "react";
import { CircleCheck, Circle, Plus, History, Music4 } from "lucide-react";
import { RowMoreMenu } from "../components/actions/row-more-menu";
import { GoalTitleEditor } from "../components/goals/goal-title-editor";
import { MAIN_GOALS_PAGE_COPY, MAIN_GOALS_PAGE_UI } from "../config/main-goals-page.config";
import { REWARD_AUDIO_SETTINGS_UI } from "../config/reward-audio-settings.config";
import {
  formatProgressFraction,
  formatProgressLabel,
  getMainGoalProgress,
} from "../services/goal-progress";

import type { MainGoalItem } from "../services/reward-hierarchy.types";

type MainGoalsPageProps = {
  items: MainGoalItem[];
  onCreateMainGoal: (title: string, description?: string) => Promise<void>;
  onUpdateMainGoal: (id: string, title: string) => Promise<void>;
  onDeleteMainGoal: (id: string) => Promise<void>;
  onCompleteMainGoal: (id: string) => Promise<void>;
  onOpenSubGoals: (id: string) => void;
  onOpenRewardHistory: () => void;
  onOpenRewardAudioSettings: () => void;
};

function buildMainGoalDescription(goal: MainGoalItem): string {
  return goal.description ?? MAIN_GOALS_PAGE_COPY.noDescription;
}

function getMainGoalTitleClass(isCompleted: boolean): string {
  return isCompleted ? "font-medium text-ink-disabled line-through" : "font-medium text-ink-strong";
}

type MainGoalsHeaderProps = {
  onOpenRewardHistory: () => void;
  onOpenRewardAudioSettings: () => void;
};

function MainGoalsHeader({
  onOpenRewardHistory,
  onOpenRewardAudioSettings,
}: MainGoalsHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-lg font-semibold text-ink-strong">{MAIN_GOALS_PAGE_COPY.title}</h2>
      <div className="flex flex-wrap items-center gap-2">
        <button
          className="inline-flex items-center gap-2 rounded-full border border-muted bg-surface-muted px-3 py-1 text-sm font-medium text-ink-soft"
          onClick={onOpenRewardAudioSettings}
          type="button"
        >
          <Music4 size={REWARD_AUDIO_SETTINGS_UI.actionIconSize} aria-hidden />
          {MAIN_GOALS_PAGE_COPY.rewardAudioButton}
        </button>
        <button
          className="inline-flex items-center gap-2 rounded-full border border-muted bg-surface-muted px-3 py-1 text-sm font-medium text-ink-soft"
          onClick={onOpenRewardHistory}
          type="button"
        >
          <History size={MAIN_GOALS_PAGE_UI.actionIconSize} aria-hidden />
          {MAIN_GOALS_PAGE_COPY.rewardHistoryButton}
        </button>
      </div>
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
  onOpenSubGoals: (id: string) => void;
  onCompleteMainGoal: (id: string) => Promise<void>;
  onUpdateMainGoal: (id: string, title: string) => Promise<void>;
  onDeleteMainGoal: (id: string) => Promise<void>;
};

function MainGoalListItem({
  goal,
  onOpenSubGoals,
  onCompleteMainGoal,
  onUpdateMainGoal,
  onDeleteMainGoal,
}: MainGoalListItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const titleClass = getMainGoalTitleClass(goal.is_completed);
  const description = buildMainGoalDescription(goal);
  const progress = getMainGoalProgress(goal);

  function completeMainGoal() {
    if (!goal.is_completed) {
      void onCompleteMainGoal(goal.id);
    }
  }

  function openSubGoalList() {
    onOpenSubGoals(goal.id);
  }

  function openRenameEditor() {
    setIsEditing(true);
  }

  function cancelRenameEditor() {
    setIsEditing(false);
  }

  async function saveRenamedMainGoalTitle(title: string) {
    await onUpdateMainGoal(goal.id, title);
    setIsEditing(false);
  }

  function confirmAndDeleteMainGoal() {
    if (window.confirm(`Delete main goal "${goal.title}"?`)) {
      void onDeleteMainGoal(goal.id);
    }
  }

  return (
    <li className="border-b border-line-soft py-2 last:border-none">
      <div className="flex items-start gap-2">
        <button
          className={`mt-0.5 text-accent-orange ${goal.is_completed ? "cursor-not-allowed" : ""}`}
          aria-label={goal.is_completed ? `Main goal ${goal.title} completed` : `Complete main goal ${goal.title}`}
          disabled={goal.is_completed}
          onClick={(event) => {
            event.stopPropagation();
            completeMainGoal();
          }}
          type="button"
        >
          {goal.is_completed ? (
            <CircleCheck size={MAIN_GOALS_PAGE_UI.statusIconSize} />
          ) : (
            <Circle size={MAIN_GOALS_PAGE_UI.statusIconSize} className="text-ink-icon" />
          )}
        </button>
        {isEditing ? (
          <div className="flex-1">
            <p className={titleClass}>{goal.title}</p>
            <GoalTitleEditor
              initialTitle={goal.title}
              onSave={saveRenamedMainGoalTitle}
              onCancel={cancelRenameEditor}
            />
            <p className="text-xs text-ink-soft">{description}</p>
            <p className="text-xs font-medium text-ink-soft">
              {formatProgressLabel(progress)} · {formatProgressFraction(progress)}
            </p>
          </div>
        ) : (
          <button className="flex-1 text-left" onClick={openSubGoalList} type="button">
            <div className="flex-1">
              <p className={titleClass}>{goal.title}</p>
              <p className="text-xs text-ink-soft">{description}</p>
              <p className="text-xs font-medium text-ink-soft">
                {formatProgressLabel(progress)} · {formatProgressFraction(progress)}
              </p>
            </div>
          </button>
        )}
        <RowMoreMenu
          menuLabel="More actions"
          actions={[
            {
              label: "Rename",
              onSelect: openRenameEditor,
            },
            {
              label: "Delete",
              tone: "danger",
              onSelect: confirmAndDeleteMainGoal,
            },
          ]}
        />
      </div>
    </li>
  );
}

type MainGoalsListProps = {
  items: MainGoalItem[];
  onOpenSubGoals: (id: string) => void;
  onCompleteMainGoal: (id: string) => Promise<void>;
  onUpdateMainGoal: (id: string, title: string) => Promise<void>;
  onDeleteMainGoal: (id: string) => Promise<void>;
};

function MainGoalsList({
  items,
  onOpenSubGoals,
  onCompleteMainGoal,
  onUpdateMainGoal,
  onDeleteMainGoal,
}: MainGoalsListProps) {
  return (
    <ul className="space-y-2 rounded-[28px] bg-surface-list px-4 py-3">
      {items.map((goal) => (
        <MainGoalListItem
          key={goal.id}
          goal={goal}
          onOpenSubGoals={onOpenSubGoals}
          onCompleteMainGoal={onCompleteMainGoal}
          onUpdateMainGoal={onUpdateMainGoal}
          onDeleteMainGoal={onDeleteMainGoal}
        />
      ))}
    </ul>
  );
}

export function MainGoalsPage({
  items,
  onCreateMainGoal,
  onUpdateMainGoal,
  onCompleteMainGoal,
  onDeleteMainGoal,
  onOpenSubGoals,
  onOpenRewardHistory,
  onOpenRewardAudioSettings,
}: MainGoalsPageProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  async function submitNewMainGoal(event: FormEvent) {
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
      <MainGoalsHeader
        onOpenRewardHistory={onOpenRewardHistory}
        onOpenRewardAudioSettings={onOpenRewardAudioSettings}
      />
      <MainGoalCreateForm
        title={title}
        description={description}
        onTitleChange={setTitle}
        onDescriptionChange={setDescription}
        onSubmit={(event) => void submitNewMainGoal(event)}
      />

      {items.length === 0 ? <MainGoalsEmptyState /> : null}
      <MainGoalsList
        items={items}
        onOpenSubGoals={onOpenSubGoals}
        onCompleteMainGoal={onCompleteMainGoal}
        onUpdateMainGoal={onUpdateMainGoal}
        onDeleteMainGoal={onDeleteMainGoal}
      />
    </section>
  );
}
