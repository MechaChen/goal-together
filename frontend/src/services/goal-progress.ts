import type { MainGoalItem, SubGoalItem } from "./reward-hierarchy.types";

type Progress = {
  completedCount: number;
  totalCount: number;
  percentage: number;
};

function toPercentage(completedCount: number, totalCount: number): number {
  if (totalCount <= 0) {
    return 0;
  }
  return Math.round((completedCount / totalCount) * 100);
}

export function getMainGoalProgress(mainGoal: MainGoalItem): Progress {
  const totalCount = mainGoal.sub_goals.length;
  const completedCount = mainGoal.sub_goals.filter((subGoal) => subGoal.is_completed).length;
  return {
    completedCount,
    totalCount,
    percentage: toPercentage(completedCount, totalCount),
  };
}

export function getSubGoalProgress(subGoal: SubGoalItem): Progress {
  const confirmedTasks = subGoal.tasks.filter((task) => task.lifecycle_state === "confirmed");
  const totalCount = confirmedTasks.length;
  const completedCount = confirmedTasks.filter((task) => task.is_completed).length;
  return {
    completedCount,
    totalCount,
    percentage: toPercentage(completedCount, totalCount),
  };
}

export function formatProgressLabel(progress: Progress): string {
  return `${progress.percentage}%`;
}

export function formatProgressFraction(progress: Progress): string {
  return `${progress.completedCount}/${progress.totalCount}`;
}
