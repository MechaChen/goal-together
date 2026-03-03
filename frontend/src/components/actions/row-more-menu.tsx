import { useCallback, useEffect, useRef, useState } from "react";
import type { RefObject } from "react";
import { MoreHorizontal } from "lucide-react";

type RowMenuAction = {
  label: string;
  onSelect: () => void;
  tone?: "default" | "danger";
};

type RowMoreMenuProps = {
  menuLabel: string;
  actions: RowMenuAction[];
};

function getActionClassName(tone: RowMenuAction["tone"]): string {
  if (tone === "danger") {
    return "w-full rounded-lg px-3 py-2 text-left text-xs font-medium text-danger-text hover:bg-danger-bg";
  }
  return "w-full rounded-lg px-3 py-2 text-left text-xs font-medium text-ink-strong hover:bg-surface-muted";
}

type UseMenuDismissBehaviorParams = {
  isOpen: boolean;
  containerRef: RefObject<HTMLDivElement | null>;
  closeMenu: () => void;
};

function useMenuDismissBehavior({
  isOpen,
  containerRef,
  closeMenu,
}: UseMenuDismissBehaviorParams) {
  useEffect(() => {
    function registerDismissListeners() {
      function dismissMenuOnOutsideClick(event: MouseEvent) {
        if (!containerRef.current?.contains(event.target as Node)) {
          closeMenu();
        }
      }

      function dismissMenuOnEscape(event: KeyboardEvent) {
        if (event.key === "Escape") {
          closeMenu();
        }
      }

      window.addEventListener("mousedown", dismissMenuOnOutsideClick);
      window.addEventListener("keydown", dismissMenuOnEscape);

      return () => {
        window.removeEventListener("mousedown", dismissMenuOnOutsideClick);
        window.removeEventListener("keydown", dismissMenuOnEscape);
      };
    }

    if (!isOpen) {
      return;
    }

    return registerDismissListeners();
  }, [closeMenu, containerRef, isOpen]);
}

export function RowMoreMenu({ menuLabel, actions }: RowMoreMenuProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const closeMenu = useCallback(() => setOpen(false), []);

  useMenuDismissBehavior({ isOpen: open, containerRef, closeMenu });

  function toggleMenuVisibility() {
    setOpen((value) => !value);
  }

  function closeMenuAndRunAction(onSelect: () => void) {
    closeMenu();
    onSelect();
  }

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
          toggleMenuVisibility();
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
          {actions.map((action) => (
            <button
              key={action.label}
              type="button"
              role="menuitem"
              className={getActionClassName(action.tone)}
              onClick={() => {
                closeMenuAndRunAction(action.onSelect);
              }}
            >
              {action.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
