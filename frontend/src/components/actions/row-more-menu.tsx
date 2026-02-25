import { useEffect, useRef, useState } from "react";
import { MoreHorizontal } from "lucide-react";

type RowMoreMenuProps = {
  menuLabel: string;
  confirmMessage: string;
  onDelete: () => Promise<void>;
};

export function RowMoreMenu({ menuLabel, confirmMessage, onDelete }: RowMoreMenuProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) {
      return;
    }
    function handleWindowClick(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }
    window.addEventListener("mousedown", handleWindowClick);
    window.addEventListener("keydown", handleEscape);
    return () => {
      window.removeEventListener("mousedown", handleWindowClick);
      window.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        aria-label={menuLabel}
        aria-haspopup="menu"
        aria-expanded={open}
        className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-muted bg-surface-muted text-ink-strong"
        onClick={(event) => {
          event.stopPropagation();
          setOpen((value) => !value);
        }}
      >
        <MoreHorizontal size={14} aria-hidden />
      </button>
      {open ? (
        <div
          role="menu"
          className="absolute right-0 top-9 z-10 min-w-28 rounded-xl border border-panel bg-surface-card p-1 shadow-md"
          onClick={(event) => event.stopPropagation()}
        >
          <button
            type="button"
            role="menuitem"
            className="w-full rounded-lg px-3 py-2 text-left text-xs font-medium text-danger-text hover:bg-danger-bg"
            onClick={() => {
              setOpen(false);
              if (window.confirm(confirmMessage)) {
                void onDelete();
              }
            }}
          >
            Delete
          </button>
        </div>
      ) : null}
    </div>
  );
}
