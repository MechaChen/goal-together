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
    <aside className="w-full space-y-3 rounded border border-slate-200 bg-white p-3 md:w-72">
      <button className="w-full rounded bg-slate-900 px-3 py-2 text-sm text-white" onClick={onBackToMain}>
        Back to Main Page
      </button>
      <div>
        <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
        {items.length === 0 ? <p className="mt-2 text-xs text-slate-500">{emptyText}</p> : null}
      </div>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item.id} className="rounded">
            <button
              type="button"
              className={`block w-full rounded border px-3 py-2.5 text-left text-sm ${
                selectedId === item.id
                  ? "border-slate-900 bg-slate-900 text-white"
                  : "border-slate-200 bg-white text-slate-800"
              }`}
              onClick={() => onSelect(item.id)}
            >
              {item.title}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}
