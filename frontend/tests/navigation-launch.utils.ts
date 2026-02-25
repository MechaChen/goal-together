import React from "react";
import { render } from "@testing-library/react";
import { App } from "../src/app";
import { NAVIGATION_LAUNCH_STORAGE_KEY } from "../src/services/navigation-launch.constants";
import type { LastOpenedTasksContext } from "../src/services/navigation-launch.types";
import { installMockApi, type CompletionResponse } from "./mock-api";
import type { MainGoalItem, RewardEvent } from "../src/services/reward-hierarchy.types";

type MockOptions = {
  tree?: MainGoalItem[];
  completions?: CompletionResponse[];
  history?: RewardEvent[];
};

export function setLastOpenedTasksContext(context: LastOpenedTasksContext) {
  window.localStorage.setItem(NAVIGATION_LAUNCH_STORAGE_KEY, JSON.stringify(context));
}

export function clearLaunchState() {
  window.localStorage.removeItem(NAVIGATION_LAUNCH_STORAGE_KEY);
}

export function renderAppAt(hash: string, options?: MockOptions) {
  const { restore } = installMockApi(options);
  window.location.hash = hash;
  const renderResult = render(React.createElement(App));
  return {
    restore,
    ...renderResult,
  };
}
