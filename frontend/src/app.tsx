import { useEffect, useMemo, useState } from "react";
import { HashRouter, Navigate, Route, Routes, matchPath, useLocation, useNavigate } from "react-router-dom";

import { AppShell } from "./components/layout/app-shell";
import { MainGoalsPage } from "./pages/main-goals-page";
import { RewardHistoryPage } from "./pages/reward-history-page";
import { SubGoalsPage } from "./pages/sub-goals-page";
import { TasksPage } from "./pages/tasks-page";
import {
  toMainGoalCompleteRewardQueueItem,
  toRewardQueueItems,
  toSubGoalCompleteRewardQueueItem,
} from "./services/reward-event-adapter";
import { toNameIdSegment } from "./services/route-segment";
import { rewardHierarchyApi } from "./services/reward-hierarchy.client";
import { loadRewardHistoryPageData } from "./services/reward-history-page.service";
import type { AppToast, AppToastKind, MainGoalItem, RewardEvent } from "./services/reward-hierarchy.types";
import { enqueueRewardModal, enqueueRewardModals } from "./services/reward-modal-queue.service";
import { resolveLaunchPath } from "./services/navigation-launch.resolver";
import {
  clearLastOpenedTasksContext,
  readLastOpenedTasksContext,
  writeLastOpenedTasksContext,
} from "./services/navigation-launch.storage";
import { isTasksPath } from "./services/navigation-launch.routes";

function RootEntryRedirect({ items }: { items: MainGoalItem[] }) {
  const navigate = useNavigate();

  useEffect(() => {
    const savedContext = readLastOpenedTasksContext();
    const resolution = resolveLaunchPath({
      entryPathname: "/",
      savedContext,
      items,
    });
    if (savedContext && !resolution.isSavedContextValid) {
      clearLastOpenedTasksContext();
    }
    navigate(resolution.path, { replace: true });
  }, [items, navigate]);

  return null;
}

function AppInner() {
  const [items, setItems] = useState<MainGoalItem[]>([]);
  const [historyItems, setHistoryItems] = useState<RewardEvent[]>([]);
  const [walletBalance, setWalletBalance] = useState(0);
  const [completionHint, setCompletionHint] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [appToast, setAppToast] = useState<AppToast | null>(null);
  const [dataReady, setDataReady] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const subGoalsMatch = matchPath("/sub-goals/:mainSegment", location.pathname);
  const tasksMatch = matchPath("/tasks/:mainSegment/:subSegment", location.pathname);
  const tasksMainOnlyMatch = matchPath("/tasks/:mainSegment", location.pathname);
  const hasSidebar = location.pathname.startsWith("/sub-goals") || location.pathname.startsWith("/tasks");

  const mainSegment = tasksMatch?.params.mainSegment ?? tasksMainOnlyMatch?.params.mainSegment ?? subGoalsMatch?.params.mainSegment ?? null;
  const subSegment = tasksMatch?.params.subSegment ?? null;

  function notify(kind: AppToastKind, message: string) {
    setAppToast({ kind, message });
  }

  function toErrorMessage(errorValue: unknown): string {
    return errorValue instanceof Error ? errorValue.message : "Request failed";
  }

  async function refreshData() {
    const [tree, history, wallet] = await Promise.all([
      rewardHierarchyApi.listTree(),
      loadRewardHistoryPageData(),
      rewardHierarchyApi.wallet(),
    ]);
    setItems(tree.items);
    setHistoryItems(history);
    setWalletBalance(wallet.balance);
  }

  useEffect(() => {
    void refreshData().catch((err) => {
      setError(err instanceof Error ? err.message : "Failed to load app data");
    }).finally(() => setDataReady(true));
  }, []);

  useEffect(() => {
    if (isTasksPath(location.pathname)) {
      writeLastOpenedTasksContext(location.pathname);
    }
  }, [location.pathname]);

  useEffect(() => {
    if (!hasSidebar && isSidebarOpen) {
      setIsSidebarOpen(false);
    }
  }, [hasSidebar, isSidebarOpen]);

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
      onCompleteMainGoal={async (mainGoalId) => {
        try {
          const result = await rewardHierarchyApi.completeMainGoal(mainGoalId);
          await refreshData();
          const rewardItem = toMainGoalCompleteRewardQueueItem(result);
          if (rewardItem) {
            enqueueRewardModal(rewardItem);
          }
        } catch (err) {
          notify("error", toErrorMessage(err));
        }
      }}
      onDeleteMainGoal={async (mainGoalId) => {
        try {
          await rewardHierarchyApi.deleteMainGoal(mainGoalId);
          await refreshData();
          navigate("/main-goals");
          notify("success", "Main goal deleted.");
        } catch (err) {
          notify("error", toErrorMessage(err));
        }
      }}
    />
  );

  const subGoalsElement = (
    <SubGoalsPage
      items={items}
      selectedMainGoalId={selectedMainGoalId}
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
      isSidebarOpen={hasSidebar && isSidebarOpen}
      onCloseSidebar={() => setIsSidebarOpen(false)}
      onCreateSubGoal={async (mainGoalId, title) => {
        await rewardHierarchyApi.createSubGoal(mainGoalId, title);
        await refreshData();
      }}
      onCompleteSubGoal={async (subGoalId) => {
        try {
          const result = await rewardHierarchyApi.completeSubGoal(subGoalId);
          await refreshData();
          const rewardItem = toSubGoalCompleteRewardQueueItem(result);
          if (rewardItem) {
            enqueueRewardModal(rewardItem);
          }
        } catch (err) {
          notify("error", toErrorMessage(err));
        }
      }}
      onDeleteSubGoal={async (subGoalId) => {
        try {
          await rewardHierarchyApi.deleteSubGoal(subGoalId);
          await refreshData();
          if (selectedMainGoal) {
            navigate(`/sub-goals/${toNameIdSegment(selectedMainGoal.title, selectedMainGoal.id)}`);
          } else {
            navigate("/sub-goals");
          }
          notify("success", "Sub goal deleted.");
        } catch (err) {
          notify("error", toErrorMessage(err));
        }
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
      isSidebarOpen={hasSidebar && isSidebarOpen}
      onCloseSidebar={() => setIsSidebarOpen(false)}
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
      onConfirmDraftTasks={async (subGoalId) => {
        const result = await rewardHierarchyApi.confirmDraftTasks(subGoalId);
        await refreshData();
        return result;
      }}
      onCompleteTask={async (taskId) => {
        const result = await rewardHierarchyApi.completeTask(taskId);
        await refreshData();
        if (!result.hint) {
          enqueueRewardModals(toRewardQueueItems(result));
        }
        return result;
      }}
      onCompletionHint={setCompletionHint}
      onNotify={notify}
    />
  );

  return (
    <AppShell
      isSidebarEnabled={hasSidebar}
      isSidebarOpen={hasSidebar && isSidebarOpen}
      walletBalance={walletBalance}
      appToast={appToast}
      onDismissToast={() => setAppToast(null)}
      onToggleSidebar={() => {
        if (!hasSidebar) {
          return;
        }
        setIsSidebarOpen((value) => !value);
      }}
    >
      {error ? <p className="rounded bg-red-100 px-3 py-2 text-sm text-red-700">{error}</p> : null}
      <Routes>
        <Route path="/" element={dataReady ? <RootEntryRedirect items={items} /> : <p className="text-sm text-ink-soft">Loading...</p>} />
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
