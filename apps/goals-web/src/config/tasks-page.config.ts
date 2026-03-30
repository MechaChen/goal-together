export const TASKS_PAGE_LIMITS = {
  maxTasksPerSubGoal: 5,
} as const;

export const TASKS_PAGE_COPY = {
  title: "Tasks",
  titlePrefix: "Tasks for",
  chooseSubGoal: "Choose a Sub Goal in the sidebar.",
  progressLabel: "Progress",
  addTaskLabel: "Add task",
  noTasks: "No tasks yet. Add one above to get started.",
  noSubGoals: "No sub goals for this main goal yet.",
  chooseMainGoal: "Choose a main goal first.",
  taskLimitReached: "Task limit reached (5 per sub goal). Delete a task to add a new one.",
  completedSubGoalCannotAddTask: "Completed sub goal cannot add tasks.",
  confirmDraftTasks: "Confirm Draft Tasks",
  confirmingDraftTasks: "Fighting",
  confirmNoDraftTasks: "No draft tasks to confirm.",
  confirmSuccessPrefix: "Confirmed",
  confirmSuccessSuffix: "draft task(s).",
  confirmFailure: "Failed to confirm draft tasks",
  createFailure: "Failed to create task",
  completeFailure: "Failed to complete task",
} as const;
