import { useEffect, useMemo, useState } from "react";
import { HashRouter, Navigate, Route, Routes, matchPath, useLocation, useNavigate } from "react-router-dom";

import { AppShell } from "./components/layout/app-shell";
import { MainGoalsPage } from "./pages/main-goals-page";
import { RewardHistoryPage } from "./pages/reward-history-page";
import { SubGoalsPage } from "./pages/sub-goals-page";
import { TasksPage } from "./pages/tasks-page";
import { toNameIdSegment } from "./services/route-segment";
import { rewardHierarchyApi } from "./services/reward-hierarchy.client";
import { loadRewardHistoryPageData } from "./services/reward-history-page.service";
import type { MainGoalItem, RewardEvent } from "./services/reward-hierarchy.types";

function AppInner() {
  const [items, setItems] = useState<MainGoalItem[]>([]);
  const [historyItems, setHistoryItems] = useState<RewardEvent[]>([]);
  const [completionHint, setCompletionHint] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const subGoalsMatch = matchPath("/sub-goals/:mainSegment", location.pathname);
  const tasksMatch = matchPath("/tasks/:mainSegment/:subSegment", location.pathname);
  const tasksMainOnlyMatch = matchPath("/tasks/:mainSegment", location.pathname);

  const mainSegment = tasksMatch?.params.mainSegment ?? tasksMainOnlyMatch?.params.mainSegment ?? subGoalsMatch?.params.mainSegment ?? null;
  const subSegment = tasksMatch?.params.subSegment ?? null;

  async function refreshData() {
    const [tree, history] = await Promise.all([rewardHierarchyApi.listTree(), loadRewardHistoryPageData()]);
    setItems(tree.items);
    setHistoryItems(history);
  }

  useEffect(() => {
    void refreshData().catch((err) => {
      setError(err instanceof Error ? err.message : "Failed to load app data");
    });
  }, []);

  const selectedMainGoal = useMemo(
    () => items.find((goal) => mainSegment !== null && toNameIdSegment(goal.title, goal.id) === mainSegment) ?? null,
    [items, mainSegment],
  );

  const selectedSubGoal = useMemo(
    () =>
      selectedMainGoal?.sub_goals.find(
        (subGoal) => subSegment !== null && toNameIdSegment(subGoal.title, subGoal.id) === subSegment,
      ) ?? null,
    [selectedMainGoal, subSegment],
  );

  const selectedMainGoalId = selectedMainGoal?.id ?? null;
  const selectedSubGoalId = selectedSubGoal?.id ?? null;

  const mainGoalsElement = (
    <MainGoalsPage
      items={items}
      selectedMainGoalId={selectedMainGoalId}
      onOpenSubGoals={(id) => {
        const mainGoal = items.find((item) => item.id === id);
        if (!mainGoal) {
          navigate("/sub-goals");
          return;
        }
        navigate(`/sub-goals/${toNameIdSegment(mainGoal.title, mainGoal.id)}`);
      }}
      onOpenRewardHistory={() => navigate("/reward-history")}
      onCreateMainGoal={async (title, description) => {
        await rewardHierarchyApi.createMainGoal(title, description);
        await refreshData();
      }}
    />
  );

  const subGoalsElement = (
    <SubGoalsPage
      items={items}
      selectedMainGoalId={selectedMainGoalId}
      selectedSubGoalId={selectedSubGoalId}
      onSelectMainGoal={(id) => {
        const mainGoal = items.find((item) => item.id === id);
        if (!mainGoal) {
          navigate("/sub-goals");
          return;
        }
        navigate(`/sub-goals/${toNameIdSegment(mainGoal.title, mainGoal.id)}`);
      }}
      onOpenTasks={(id) => {
        if (!selectedMainGoal) {
          navigate("/tasks");
          return;
        }
        const subGoal = selectedMainGoal.sub_goals.find((item) => item.id === id);
        if (!subGoal) {
          navigate(`/tasks/${toNameIdSegment(selectedMainGoal.title, selectedMainGoal.id)}`);
          return;
        }
        navigate(
          `/tasks/${toNameIdSegment(selectedMainGoal.title, selectedMainGoal.id)}/${toNameIdSegment(
            subGoal.title,
            subGoal.id,
          )}`,
        );
      }}
      onBackToMain={() => navigate("/main-goals")}
      onCreateSubGoal={async (mainGoalId, title) => {
        await rewardHierarchyApi.createSubGoal(mainGoalId, title);
        await refreshData();
      }}
    />
  );

  const tasksElement = (
    <TasksPage
      items={items}
      selectedMainGoalId={selectedMainGoalId}
      selectedSubGoalId={selectedSubGoalId}
      completionHint={completionHint}
      onSelectSubGoal={(id) => {
        if (!selectedMainGoal) {
          navigate("/tasks");
          return;
        }
        const subGoal = selectedMainGoal.sub_goals.find((item) => item.id === id);
        if (!subGoal) {
          navigate(`/tasks/${toNameIdSegment(selectedMainGoal.title, selectedMainGoal.id)}`);
          return;
        }
        navigate(
          `/tasks/${toNameIdSegment(selectedMainGoal.title, selectedMainGoal.id)}/${toNameIdSegment(
            subGoal.title,
            subGoal.id,
          )}`,
        );
      }}
      onBackToMain={() => navigate("/main-goals")}
      onCreateTask={async (subGoalId, title) => {
        await rewardHierarchyApi.createDraftTask(subGoalId, title);
        await refreshData();
      }}
      onUpdateTask={async (taskId, title) => {
        await rewardHierarchyApi.updateTask(taskId, title);
        await refreshData();
      }}
      onDeleteTask={async (taskId) => {
        await rewardHierarchyApi.deleteTask(taskId);
        await refreshData();
      }}
      onConfirmTask={async (taskId) => {
        await rewardHierarchyApi.confirmTask(taskId);
        await refreshData();
      }}
      onCompleteTask={async (taskId) => {
        const result = await rewardHierarchyApi.completeTask(taskId);
        await refreshData();
        return result;
      }}
      onCompletionHint={setCompletionHint}
    />
  );

  return (
    <AppShell>
      {error ? <p className="rounded bg-red-100 px-3 py-2 text-sm text-red-700">{error}</p> : null}
      <Routes>
        <Route path="/" element={<Navigate to="/main-goals" replace />} />
        <Route path="/main-goals" element={mainGoalsElement} />
        <Route path="/sub-goals" element={subGoalsElement} />
        <Route path="/sub-goals/:mainSegment" element={subGoalsElement} />
        <Route path="/tasks" element={tasksElement} />
        <Route path="/tasks/:mainSegment" element={tasksElement} />
        <Route path="/tasks/:mainSegment/:subSegment" element={tasksElement} />
        <Route path="/reward-history" element={<RewardHistoryPage items={historyItems} onBackToMain={() => navigate("/main-goals")} />} />
        <Route path="*" element={<Navigate to="/main-goals" replace />} />
      </Routes>
    </AppShell>
  );
}

export function App() {
  return (
    <HashRouter>
      <AppInner />
    </HashRouter>
  );
}
