import { useCallback, useMemo, useState } from "react";

import {
  TASKS_PAGE_COPY,
  TASKS_PAGE_LIMITS,
} from "../config/tasks-page.config";
import type {
  AppToastKind,
  BulkConfirmDraftTasksResult,
  CompleteTaskResult,
  MainGoalItem,
  SubGoalItem,
} from "../services/reward-hierarchy.types";

type UseTasksPageControllerArgs = {
  items: MainGoalItem[];
  selectedMainGoalId: string | null;
  selectedSubGoalId: string | null;
  onCreateTask: (subGoalId: string, title: string) => Promise<void>;
  onConfirmDraftTasks: (
    subGoalId: string,
  ) => Promise<BulkConfirmDraftTasksResult>;
  onCompleteTask: (taskId: string) => Promise<CompleteTaskResult>;
  onCompletionHint: (hint: string | null) => void;
  onNotify: (kind: AppToastKind, message: string) => void;
};

type TaskProgress = {
  completedCount: number;
  totalCount: number;
  percentage: number;
};

function buildTaskProgress(subGoal: SubGoalItem | null): TaskProgress {
  if (!subGoal) {
    return { completedCount: 0, totalCount: 0, percentage: 0 };
  }

  const totalCount = subGoal.tasks.length;
  const completedCount = subGoal.tasks.filter((task) => task.is_completed).length;
  const percentage = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

  return { completedCount, totalCount, percentage };
}

function getErrorMessage(error: unknown, fallback: string): string {
  return error instanceof Error ? error.message : fallback;
}

export function useTasksPageController({
  items,
  selectedMainGoalId,
  selectedSubGoalId,
  onCreateTask,
  onConfirmDraftTasks,
  onCompleteTask,
  onCompletionHint,
  onNotify,
}: UseTasksPageControllerArgs) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isConfirmingDraftTasks, setIsConfirmingDraftTasks] = useState(false);

  const selectedMainGoal = useMemo(
    () => items.find((mainGoal) => mainGoal.id === selectedMainGoalId) ?? null,
    [items, selectedMainGoalId],
  );

  const subGoals = selectedMainGoal?.sub_goals ?? [];

  const selectedSubGoal = useMemo(
    () => subGoals.find((subGoal) => subGoal.id === selectedSubGoalId) ?? null,
    [subGoals, selectedSubGoalId],
  );

  const progress = useMemo(() => buildTaskProgress(selectedSubGoal), [selectedSubGoal]);

  const isTaskLimitReached =
    !!selectedSubGoal &&
    selectedSubGoal.tasks.length >= TASKS_PAGE_LIMITS.maxTasksPerSubGoal;
  const isSelectedSubGoalCompleted = !!selectedSubGoal?.is_completed;

  const hasDraftTasks =
    !!selectedSubGoal &&
    selectedSubGoal.tasks.some((task) => task.lifecycle_state === "draft");
  const hasNoTasks = (selectedSubGoal?.tasks.length ?? 0) === 0;

  const handleCreateTask = useCallback(
    async (title: string) => {
      if (!selectedSubGoal) {
        return;
      }

      if (isTaskLimitReached) {
        setErrorMessage(TASKS_PAGE_COPY.taskLimitReached);
        return;
      }
      if (isSelectedSubGoalCompleted) {
        setErrorMessage(TASKS_PAGE_COPY.completedSubGoalCannotAddTask);
        return;
      }

      try {
        await onCreateTask(selectedSubGoal.id, title);
        setErrorMessage(null);
      } catch (error) {
        setErrorMessage(getErrorMessage(error, TASKS_PAGE_COPY.createFailure));
      }
    },
    [isSelectedSubGoalCompleted, isTaskLimitReached, onCreateTask, selectedSubGoal],
  );

  const handleConfirmDraftTasks = useCallback(async () => {
    if (!selectedSubGoal || isConfirmingDraftTasks || !hasDraftTasks) {
      return;
    }

    setIsConfirmingDraftTasks(true);

    try {
      const result = await onConfirmDraftTasks(selectedSubGoal.id);
      if (result.confirmed_count > 0) {
        onNotify(
          "success",
          `${TASKS_PAGE_COPY.confirmSuccessPrefix} ${result.confirmed_count} ${TASKS_PAGE_COPY.confirmSuccessSuffix}`,
        );
      } else {
        onNotify("info", TASKS_PAGE_COPY.confirmNoDraftTasks);
      }
      setErrorMessage(null);
    } catch (error) {
      const message = getErrorMessage(error, TASKS_PAGE_COPY.confirmFailure);
      onNotify("error", message);
      setErrorMessage(message);
    } finally {
      setIsConfirmingDraftTasks(false);
    }
  }, [
    hasDraftTasks,
    isConfirmingDraftTasks,
    onConfirmDraftTasks,
    onNotify,
    selectedSubGoal,
  ]);

  const handleCompleteTask = useCallback(
    async (taskId: string) => {
      try {
        const result = await onCompleteTask(taskId);
        onCompletionHint(result.hint);
      } catch (error) {
        setErrorMessage(getErrorMessage(error, TASKS_PAGE_COPY.completeFailure));
      }
    },
    [onCompleteTask, onCompletionHint],
  );

  const taskCreationDisabledMessage = isSelectedSubGoalCompleted
    ? TASKS_PAGE_COPY.completedSubGoalCannotAddTask
    : TASKS_PAGE_COPY.taskLimitReached;

  return {
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
  };
}
