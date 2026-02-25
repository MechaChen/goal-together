import { ArrowLeft, Circle } from "lucide-react";

type SidebarItem = {
  id: string;
  title: string;
};

type HierarchySidebarProps = {
  title: string;
  items: SidebarItem[];
  selectedId: string | null;
  emptyText: string;
  onSelect: (id: string) => void;
  onBackToMain: () => void;
};

export function HierarchySidebar({
  title,
  items,
  selectedId,
  emptyText,
  onSelect,
  onBackToMain,
}: HierarchySidebarProps) {
  return (
    <aside className="w-full space-y-3 rounded-[28px] border border-panel bg-surface-card p-3 md:w-72">
      <button
        className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-muted bg-surface-muted px-3 py-2 text-sm font-medium text-ink-soft"
        onClick={onBackToMain}
      >
        <ArrowLeft size={16} aria-hidden />
        Back to Main Page
      </button>
      <div>
        <h3 className="text-sm font-semibold text-ink-strong">{title}</h3>
        {items.length === 0 ? <p className="mt-2 text-xs text-ink-soft">{emptyText}</p> : null}
      </div>
      <ul className="space-y-2 rounded-2xl bg-surface-list-alt p-2">
        {items.map((item) => (
          <li key={item.id} className="border-b border-line-soft last:border-none">
            <button
              type="button"
              className="block w-full py-2 text-left text-sm"
              onClick={() => onSelect(item.id)}
            >
              <span className="inline-flex items-center gap-2">
                <Circle size={16} className={selectedId === item.id ? "fill-accent-orange text-accent-orange" : "text-ink-icon"} />
                <span className={selectedId === item.id ? "font-semibold text-ink-strong" : "text-ink-strong"}>
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
