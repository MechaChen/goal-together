import { Hourglass, Play } from "lucide-react";

import { TASKS_PAGE_COPY } from "../../config/tasks-page.config";

type ConfirmDraftTasksButtonProps = {
  isLoading: boolean;
  hasDraftTasks: boolean;
  hasNoTasks: boolean;
  onClick: () => void;
};

function getButtonLabel(hasDraftTasks: boolean, hasNoTasks: boolean): string {
  return hasDraftTasks || hasNoTasks
    ? TASKS_PAGE_COPY.confirmDraftTasks
    : TASKS_PAGE_COPY.confirmingDraftTasks;
}

function getButtonClassName(
  hasDraftTasks: boolean,
  hasNoTasks: boolean,
): string {
  if (hasDraftTasks) {
    return "inline-flex items-center gap-2 rounded-full border border-muted bg-accent-orange px-4 py-2 text-sm font-medium text-white";
  }
  if (hasNoTasks) {
    return "inline-flex items-center gap-2 rounded-full border border-accent-orange/40 bg-accent-orange/20 px-4 py-2 text-sm font-medium text-ink-soft";
  }

  return "inline-flex items-center gap-2 rounded-full border border-muted bg-transparent px-4 py-2 text-sm font-medium text-ink-strong";
}

export function ConfirmDraftTasksButton({
  isLoading,
  hasDraftTasks,
  hasNoTasks,
  onClick,
}: ConfirmDraftTasksButtonProps) {
  const label = getButtonLabel(hasDraftTasks, hasNoTasks);
  const className = getButtonClassName(hasDraftTasks, hasNoTasks);

  return (
    <button
      type="button"
      className={className}
      disabled={isLoading || !hasDraftTasks}
      onClick={onClick}
      aria-label={label}
    >
      {hasDraftTasks || hasNoTasks ? (
        <Play size={16} aria-hidden />
      ) : (
        <Hourglass size={16} aria-hidden />
      )}
      <span>{label}</span>
    </button>
  );
}
