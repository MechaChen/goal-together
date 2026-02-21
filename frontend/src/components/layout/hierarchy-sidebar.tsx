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
    <aside className="w-full space-y-3 rounded-[28px] border border-[#ddd5ce] bg-[var(--panel-bg)] p-3 md:w-72">
      <button
        className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-[#d8cdc5] bg-[#eee7e1] px-3 py-2 text-sm font-medium text-[var(--ink-soft)]"
        onClick={onBackToMain}
      >
        <ArrowLeft size={16} aria-hidden />
        Back to Main Page
      </button>
      <div>
        <h3 className="text-sm font-semibold text-[var(--ink-strong)]">{title}</h3>
        {items.length === 0 ? <p className="mt-2 text-xs text-[var(--ink-soft)]">{emptyText}</p> : null}
      </div>
      <ul className="space-y-2 rounded-2xl bg-[#ebe4de] p-2">
        {items.map((item) => (
          <li key={item.id} className="border-b border-[var(--accent-line)] last:border-none">
            <button
              type="button"
              className="block w-full py-2 text-left text-sm"
              onClick={() => onSelect(item.id)}
            >
              <span className="inline-flex items-center gap-2">
                <Circle size={16} className={selectedId === item.id ? "fill-[var(--accent-orange)] text-[var(--accent-orange)]" : "text-[#6f7377]"} />
                <span className={selectedId === item.id ? "font-semibold text-[var(--ink-strong)]" : "text-[var(--ink-strong)]"}>
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
