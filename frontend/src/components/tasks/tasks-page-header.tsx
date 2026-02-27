import { ListTodo } from "lucide-react";

import { TASKS_PAGE_COPY } from "../../config/tasks-page.config";

type TasksPageHeaderProps = {
  subGoalTitle: string | null;
};

function getHeadingText(subGoalTitle: string | null): string {
  if (!subGoalTitle) {
    return TASKS_PAGE_COPY.title;
  }

  return `${TASKS_PAGE_COPY.titlePrefix} ${subGoalTitle}`;
}

export function TasksPageHeader({ subGoalTitle }: TasksPageHeaderProps) {
  return (
    <h2 className="inline-flex items-center gap-2 text-lg font-semibold text-ink-strong">
      <ListTodo size={19} aria-hidden />
      <span>{getHeadingText(subGoalTitle)}</span>
    </h2>
  );
}
