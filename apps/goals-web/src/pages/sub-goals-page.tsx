import { FormEvent, useEffect, useState } from "react";
import { Circle, CircleCheck, Plus } from "lucide-react";

import { RowMoreMenu } from "../components/actions/row-more-menu";
import { GoalTitleEditor } from "../components/goals/goal-title-editor";
import { HierarchySidebar } from "../components/layout/hierarchy-sidebar";
import {
  formatProgressFraction,
  formatProgressLabel,
  getSubGoalProgress,
} from "../services/goal-progress";
import type { MainGoalItem } from "../services/reward-hierarchy.types";

type SubGoalsPageProps = {
  items: MainGoalItem[];
  selectedMainGoalId: string | null;
  onCreateSubGoal: (mainGoalId: string, title: string) => Promise<void>;
  onUpdateSubGoal: (subGoalId: string, title: string) => Promise<void>;
  onCompleteSubGoal: (subGoalId: string) => Promise<void>;
  onDeleteSubGoal: (subGoalId: string) => Promise<void>;
  onSelectMainGoal: (id: string) => void;
  onOpenTasks: (id: string) => void;
  onBackToMain: () => void;
  isSidebarOpen: boolean;
  onCloseSidebar: () => void;
};

type SubGoalListItemProps = {
  subGoal: MainGoalItem["sub_goals"][number];
  onOpenTasks: (id: string) => void;
  onUpdateSubGoal: (subGoalId: string, title: string) => Promise<void>;
  onCompleteSubGoal: (subGoalId: string) => Promise<void>;
  onDeleteSubGoal: (subGoalId: string) => Promise<void>;
};

type UseSidebarEscapeToCloseParams = {
  isOpen: boolean;
  closeSidebar: () => void;
};

function useSidebarEscapeToClose({ isOpen, closeSidebar }: UseSidebarEscapeToCloseParams) {
  useEffect(() => {
    function registerSidebarEscapeHandler() {
      function closeSidebarOnEscape(event: KeyboardEvent) {
        if (event.key === "Escape") {
          closeSidebar();
        }
      }

      window.addEventListener("keydown", closeSidebarOnEscape);
      return () => window.removeEventListener("keydown", closeSidebarOnEscape);
    }

    if (!isOpen) {
      return;
    }

    return registerSidebarEscapeHandler();
  }, [closeSidebar, isOpen]);
}

function buildSubGoalRowActions(params: {
  openRenameEditor: () => void;
  confirmAndDeleteSubGoal: () => void;
}) {
  return [
    {
      label: "Rename",
      onSelect: params.openRenameEditor,
    },
    {
      label: "Delete",
      tone: "danger" as const,
      onSelect: params.confirmAndDeleteSubGoal,
    },
  ];
}

function SubGoalListItem({
  subGoal,
  onOpenTasks,
  onUpdateSubGoal,
  onCompleteSubGoal,
  onDeleteSubGoal,
}: SubGoalListItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const progress = getSubGoalProgress(subGoal);

  function completeSubGoal() {
    if (!subGoal.is_completed) {
      void onCompleteSubGoal(subGoal.id);
    }
  }

  function openSubGoalTasks() {
    onOpenTasks(subGoal.id);
  }

  function openRenameEditor() {
    setIsEditing(true);
  }

  function cancelRenameEditor() {
    setIsEditing(false);
  }

  async function saveRenamedSubGoalTitle(title: string) {
    await onUpdateSubGoal(subGoal.id, title);
    setIsEditing(false);
  }

  function confirmAndDeleteSubGoal() {
    if (window.confirm(`Delete sub goal "${subGoal.title}"?`)) {
      void onDeleteSubGoal(subGoal.id);
    }
  }

  const rowActions = buildSubGoalRowActions({
    openRenameEditor,
    confirmAndDeleteSubGoal,
  });

  return (
    <li className="border-b border-line-soft py-2 last:border-none">
      <div className="flex items-start gap-2">
        <button
          className={`mt-0.5 text-accent-orange ${subGoal.is_completed ? "cursor-not-allowed" : ""}`}
          aria-label={subGoal.is_completed ? `Sub goal ${subGoal.title} completed` : `Complete sub goal ${subGoal.title}`}
          disabled={subGoal.is_completed}
          onClick={(event) => {
            event.stopPropagation();
            completeSubGoal();
          }}
          type="button"
        >
          {subGoal.is_completed ? (
            <CircleCheck size={24} />
          ) : (
            <Circle size={24} className="text-ink-icon" />
          )}
        </button>
        {isEditing ? (
          <div className="flex-1">
            <p className={`font-medium ${subGoal.is_completed ? "text-ink-disabled line-through" : "text-ink-strong"}`}>
              {subGoal.title}
            </p>
            <GoalTitleEditor
              initialTitle={subGoal.title}
              onSave={saveRenamedSubGoalTitle}
              onCancel={cancelRenameEditor}
            />
            <p className="text-xs font-medium text-ink-soft">
              {formatProgressLabel(progress)} · {formatProgressFraction(progress)}
            </p>
          </div>
        ) : (
          <button className="flex-1 text-left" onClick={openSubGoalTasks} type="button">
            <div className="flex-1">
              <p className={`font-medium ${subGoal.is_completed ? "text-ink-disabled line-through" : "text-ink-strong"}`}>
                {subGoal.title}
              </p>
              <p className="text-xs font-medium text-ink-soft">
                {formatProgressLabel(progress)} · {formatProgressFraction(progress)}
              </p>
            </div>
          </button>
        )}
        <RowMoreMenu
          menuLabel="More actions"
          actions={rowActions}
        />
      </div>
    </li>
  );
}

export function SubGoalsPage({
  items,
  selectedMainGoalId,
  onCreateSubGoal,
  onUpdateSubGoal,
  onCompleteSubGoal,
  onDeleteSubGoal,
  onSelectMainGoal,
  onOpenTasks,
  onBackToMain,
  isSidebarOpen,
  onCloseSidebar,
}: SubGoalsPageProps) {
  const [title, setTitle] = useState("");
  const mainGoal = items.find((goal) => goal.id === selectedMainGoalId) ?? null;

  useSidebarEscapeToClose({ isOpen: isSidebarOpen, closeSidebar: onCloseSidebar });

  function submitNewSubGoal(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!mainGoal) {
      return;
    }
    const trimmed = title.trim();
    if (!trimmed) {
      return;
    }
    void onCreateSubGoal(mainGoal.id, trimmed);
    setTitle("");
  }

  function selectMainGoalAndCloseSidebar(mainGoalId: string) {
    onSelectMainGoal(mainGoalId);
    onCloseSidebar();
  }

  function navigateBackToMainAndCloseSidebar() {
    onBackToMain();
    onCloseSidebar();
  }

  return (
    <section className="relative">
      {isSidebarOpen ? (
        <>
          <button
            aria-label="Close sidebar overlay"
            className="fixed inset-0 z-30 bg-transparent"
            onClick={onCloseSidebar}
            type="button"
          />
          <div
            className="fixed left-4 top-32 z-40 w-[320px] max-w-[calc(100vw-2rem)]"
            id="hierarchy-sidebar-panel"
          >
            <HierarchySidebar
              title="Main Goals"
              items={items.map((goal) => ({
                id: goal.id,
                title: goal.title,
                isCompleted: goal.is_completed,
              }))}
              selectedId={selectedMainGoalId}
              emptyText="No main goals yet."
              onSelect={selectMainGoalAndCloseSidebar}
              onBackToMain={navigateBackToMainAndCloseSidebar}
            />
          </div>
        </>
      ) : null}
      <div className="flex-1 space-y-4 rounded-[32px] border border-panel bg-surface-card p-4 md:p-6">
        <h2 className="text-lg font-semibold text-ink-strong">
          {mainGoal ? `Sub Goals for ${mainGoal.title}` : "Sub Goals"}
        </h2>
        {!mainGoal ? (
          <p className="text-sm text-ink-soft">
            Choose a Main Goal in the sidebar.
          </p>
        ) : null}
        {mainGoal ? (
          <>
            <form onSubmit={submitNewSubGoal}>
              <div className="flex overflow-hidden rounded-full border border-soft bg-white">
                <input
                  className="flex-1 bg-transparent px-5 py-3 text-base text-ink-strong outline-none placeholder:text-ink-soft"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder="Sub goal title"
                />
                <button
                  className="inline-flex items-center gap-2 rounded-full bg-accent-blue px-6 py-3 text-base font-semibold tracking-wide text-white"
                  type="submit"
                >
                  <Plus size={18} aria-hidden />
                  ADD
                </button>
              </div>
            </form>

            <ul className="space-y-2 rounded-[24px] bg-surface-list px-4 py-3">
              {mainGoal.sub_goals.length === 0 ? (
                <li className="py-2 text-sm text-ink-soft">
                  No sub goals yet. Add one above to get started.
                </li>
              ) : null}
              {mainGoal.sub_goals.map((subGoal) => (
                <SubGoalListItem
                  key={subGoal.id}
                  subGoal={subGoal}
                  onOpenTasks={onOpenTasks}
                  onUpdateSubGoal={onUpdateSubGoal}
                  onCompleteSubGoal={onCompleteSubGoal}
                  onDeleteSubGoal={onDeleteSubGoal}
                />
              ))}
            </ul>
          </>
        ) : null}
      </div>
    </section>
  );
}
