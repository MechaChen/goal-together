import { HierarchySidebar } from "../layout/hierarchy-sidebar";

type SidebarItem = {
  id: string;
  title: string;
  isCompleted?: boolean;
};

type TasksSidebarOverlayProps = {
  isOpen: boolean;
  items: SidebarItem[];
  selectedId: string | null;
  emptyText: string;
  onClose: () => void;
  onSelect: (id: string) => void;
  onBackToMain: () => void;
};

export function TasksSidebarOverlay({
  isOpen,
  items,
  selectedId,
  emptyText,
  onClose,
  onSelect,
  onBackToMain,
}: TasksSidebarOverlayProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <>
      <button
        aria-label="Close sidebar overlay"
        className="fixed inset-0 z-30 bg-transparent"
        onClick={onClose}
        type="button"
      />
      <div
        className="fixed left-4 top-32 z-40 w-[320px] max-w-[calc(100vw-2rem)]"
        id="hierarchy-sidebar-panel"
      >
        <HierarchySidebar
          title="Sub Goals"
          items={items}
          selectedId={selectedId}
          emptyText={emptyText}
          backButtonLabel="Back to Sub Goals page"
          onSelect={(id) => {
            onSelect(id);
            onClose();
          }}
          onBackToMain={() => {
            onBackToMain();
            onClose();
          }}
        />
      </div>
    </>
  );
}
