import { ArrowLeft, Circle, CircleCheck, CircleCheckBig } from "lucide-react";

type SidebarItem = {
  id: string;
  title: string;
  isCompleted?: boolean;
};

type HierarchySidebarProps = {
  title: string;
  items: SidebarItem[];
  selectedId: string | null;
  emptyText: string;
  onSelect: (id: string) => void;
  onBackToMain: () => void;
  backButtonLabel?: string;
};

type ItemStatus = "completedSelected" | "completed" | "selected" | "default";

function getItemStatus(
  item: SidebarItem,
  selectedId: string | null,
): ItemStatus {
  const isSelected = selectedId === item.id;
  const isCompleted = item.isCompleted === true;
  if (isSelected && isCompleted) {
    return "completedSelected";
  }
  if (isCompleted) {
    return "completed";
  }
  if (isSelected) {
    return "selected";
  }
  return "default";
}

function ItemCircle({
  item,
  selectedId,
}: {
  item: SidebarItem;
  selectedId: string | null;
}) {
  const status = getItemStatus(item, selectedId);
  if (status === "completed") {
    return <CircleCheckBig size={16} className="text-accent-orange" />;
  }
  if (status === "selected" || status === "completedSelected") {
    return (
      <Circle size={16} className="fill-accent-orange text-accent-orange" />
    );
  }
  return <Circle size={16} className="text-ink-icon" />;
}

export function HierarchySidebar({
  title,
  items,
  selectedId,
  emptyText,
  onSelect,
  onBackToMain,
  backButtonLabel = "Back to Main Page",
}: HierarchySidebarProps) {
  return (
    <aside className="w-full space-y-3 rounded-[28px] border border-panel bg-surface-card p-3 md:w-72">
      <button
        className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-muted bg-surface-muted px-3 py-2 text-sm font-medium text-ink-soft"
        onClick={onBackToMain}
      >
        <ArrowLeft size={16} aria-hidden />
        {backButtonLabel}
      </button>
      <div>
        <h3 className="text-sm font-semibold text-ink-strong">{title}</h3>
        {items.length === 0 ? (
          <p className="mt-2 text-xs text-ink-soft">{emptyText}</p>
        ) : null}
      </div>
      <ul className="space-y-2 rounded-2xl bg-surface-list-alt p-2">
        {items.map((item) => (
          <li
            key={item.id}
            className="border-b border-line-soft last:border-none"
          >
            <button
              type="button"
              className="block w-full py-2 text-left text-sm"
              onClick={() => onSelect(item.id)}
            >
              <span className="inline-flex items-center gap-2">
                <ItemCircle item={item} selectedId={selectedId} />
                <span
                  className={
                    selectedId === item.id
                      ? "font-semibold text-ink-strong"
                      : "text-ink-strong"
                  }
                >
                  {item.title}
                </span>
              </span>
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}
