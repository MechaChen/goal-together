import type { MainGoalItem } from "./reward-hierarchy.types";
import { parseTasksPath } from "./navigation-launch.routes";
import { extractIdFromNameIdSegment } from "./route-segment";
import type { LastOpenedTasksContext } from "./navigation-launch.types";

type LaunchResolutionInput = {
  entryPathname: string;
  savedContext: LastOpenedTasksContext | null;
  items: MainGoalItem[];
};

export type LaunchResolution = {
  path: string;
  usedSavedContext: boolean;
  isSavedContextValid: boolean;
};

function isSavedContextValid(savedContext: LastOpenedTasksContext, items: MainGoalItem[]): boolean {
  const parsed = parseTasksPath(savedContext.route);
  if (!parsed) {
    return false;
  }

  if (!parsed.mainSegment) {
    return true;
  }

  const mainGoalId = extractIdFromNameIdSegment(parsed.mainSegment);
  if (!mainGoalId) {
    return false;
  }

  const mainGoal = items.find((item) => item.id === mainGoalId);
  if (!mainGoal) {
    return false;
  }

  if (!parsed.subSegment) {
    return true;
  }

  const subGoalId = extractIdFromNameIdSegment(parsed.subSegment);
  if (!subGoalId) {
    return false;
  }

  return mainGoal.sub_goals.some((subGoal) => subGoal.id === subGoalId);
}

export function resolveLaunchPath(input: LaunchResolutionInput): LaunchResolution {
  if (input.entryPathname !== "/") {
    return {
      path: input.entryPathname,
      usedSavedContext: false,
      isSavedContextValid: true,
    };
  }

  if (!input.savedContext) {
    return {
      path: "/tasks",
      usedSavedContext: false,
      isSavedContextValid: false,
    };
  }

  const valid = isSavedContextValid(input.savedContext, input.items);
  if (!valid) {
    return {
      path: "/tasks",
      usedSavedContext: false,
      isSavedContextValid: false,
    };
  }

  return {
    path: input.savedContext.route,
    usedSavedContext: true,
    isSavedContextValid: true,
  };
}

