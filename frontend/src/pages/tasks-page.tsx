import { TaskEditor } from "../components/goals/task-editor";
import { ConfirmDraftTasksButton } from "../components/tasks/confirm-draft-tasks-button";
import { TasksListPanel } from "../components/tasks/tasks-list-panel";
import { TasksPageHeader } from "../components/tasks/tasks-page-header";
import { TasksProgressPanel } from "../components/tasks/tasks-progress-panel";
import { TasksSidebarOverlay } from "../components/tasks/tasks-sidebar-overlay";
import { TASKS_PAGE_COPY } from "../config/tasks-page.config";
import { useEscapeKey } from "../hooks/use-escape-key";
import { useTasksPageController } from "../hooks/use-tasks-page-controller";
import type {
  AppToastKind,
  BulkConfirmDraftTasksResult,
  CompleteTaskResult,
  MainGoalItem,
} from "../services/reward-hierarchy.types";

type TasksPageProps = {
  items: MainGoalItem[];
  selectedMainGoalId: string | null;
  selectedSubGoalId: string | null;
  completionHint: string | null;
  onCreateTask: (subGoalId: string, title: string) => Promise<void>;
  onUpdateTask: (taskId: string, title: string) => Promise<void>;
  onDeleteTask: (taskId: string) => Promise<void>;
  onConfirmDraftTasks: (
    subGoalId: string,
  ) => Promise<BulkConfirmDraftTasksResult>;
  onCompleteTask: (taskId: string) => Promise<CompleteTaskResult>;
  onCompletionHint: (hint: string | null) => void;
  onNotify: (kind: AppToastKind, message: string) => void;
  onSelectSubGoal: (id: string) => void;
  onBackToMain: () => void;
  isSidebarOpen: boolean;
  onCloseSidebar: () => void;
};

function getSidebarEmptyText(selectedMainGoalId: string | null): string {
  return selectedMainGoalId
    ? TASKS_PAGE_COPY.noSubGoals
    : TASKS_PAGE_COPY.chooseMainGoal;
}

export function TasksPage({
  items,
  selectedMainGoalId,
  selectedSubGoalId,
  completionHint,
  onCreateTask,
  onUpdateTask,
  onDeleteTask,
  onConfirmDraftTasks,
  onCompleteTask,
  onCompletionHint,
  onNotify,
  onSelectSubGoal,
  onBackToMain,
  isSidebarOpen,
  onCloseSidebar,
}: TasksPageProps) {
  const {
    selectedSubGoal,
    subGoals,
    progress,
    errorMessage,
    isTaskLimitReached,
    isSelectedSubGoalCompleted,
    hasDraftTasks,
    hasNoTasks,
    isConfirmingDraftTasks,
    taskCreationDisabledMessage,
    handleCreateTask,
    handleConfirmDraftTasks,
    handleCompleteTask,
  } = useTasksPageController({
    items,
    selectedMainGoalId,
    selectedSubGoalId,
    onCreateTask,
    onConfirmDraftTasks,
    onCompleteTask,
    onCompletionHint,
    onNotify,
  });

  useEscapeKey({ enabled: isSidebarOpen, onEscape: onCloseSidebar });

  return (
    <section className="relative">
      <TasksSidebarOverlay
        isOpen={isSidebarOpen}
        items={subGoals.map((subGoal) => ({
          id: subGoal.id,
          title: subGoal.title,
          isCompleted: subGoal.is_completed,
        }))}
        selectedId={selectedSubGoalId}
        emptyText={getSidebarEmptyText(selectedMainGoalId)}
        onClose={onCloseSidebar}
        onSelect={onSelectSubGoal}
        onBackToMain={onBackToMain}
      />

      <div className="flex-1 space-y-4 rounded-[32px] border border-panel bg-surface-card p-4 md:p-6">
        <TasksPageHeader subGoalTitle={selectedSubGoal?.title ?? null} />

        {!selectedSubGoal ? (
          <p className="text-sm text-ink-soft">{TASKS_PAGE_COPY.chooseSubGoal}</p>
        ) : null}

        {selectedSubGoal ? (
          <div className="space-y-2">
            <TasksProgressPanel
              completedCount={progress.completedCount}
              totalCount={progress.totalCount}
              percentage={progress.percentage}
              label={TASKS_PAGE_COPY.progressLabel}
            />

            <TaskEditor
              submitLabel={TASKS_PAGE_COPY.addTaskLabel}
              disabled={isTaskLimitReached || isSelectedSubGoalCompleted}
              disabledMessage={taskCreationDisabledMessage}
              onSubmit={handleCreateTask}
            />

            <ConfirmDraftTasksButton
              isLoading={isConfirmingDraftTasks}
              hasDraftTasks={hasDraftTasks}
              hasNoTasks={hasNoTasks}
              onClick={() => void handleConfirmDraftTasks()}
            />
          </div>
        ) : null}

        {errorMessage ? <p className="text-sm text-error-strong">{errorMessage}</p> : null}

        {selectedSubGoal ? (
          <TasksListPanel
            tasks={selectedSubGoal.tasks}
            completionHint={completionHint}
            emptyText={TASKS_PAGE_COPY.noTasks}
            onUpdateTask={onUpdateTask}
            onDeleteTask={onDeleteTask}
            onCompleteTask={handleCompleteTask}
          />
        ) : null}
      </div>
    </section>
  );
}
