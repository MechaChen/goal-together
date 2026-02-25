import { CheckCircle2, Info, TriangleAlert, X } from "lucide-react";

import type { AppToast } from "../../services/reward-hierarchy.types";

type AppToastProps = {
  toast: AppToast | null;
  onClose: () => void;
};

function getToastStyle(kind: AppToast["kind"]): string {
  if (kind === "success") {
    return "border-success bg-success-bg text-success-text";
  }
  if (kind === "error") {
    return "border-danger bg-danger-bg text-danger-text";
  }
  return "border-muted bg-surface-muted text-ink-strong";
}

function ToastIcon({ kind }: Pick<AppToast, "kind">) {
  if (kind === "success") {
    return <CheckCircle2 size={18} aria-hidden />;
  }
  if (kind === "error") {
    return <TriangleAlert size={18} aria-hidden />;
  }
  return <Info size={18} aria-hidden />;
}

export function AppToastBanner({ toast, onClose }: AppToastProps) {
  if (!toast) {
    return null;
  }

  return (
    <div className="fixed right-4 top-24 z-50 w-[360px] max-w-[calc(100vw-2rem)]">
      <div className={`flex items-start gap-2 rounded-2xl border px-4 py-3 shadow-md ${getToastStyle(toast.kind)}`}>
        <ToastIcon kind={toast.kind} />
        <p className="flex-1 text-sm font-medium">{toast.message}</p>
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-full p-1 text-current/80 hover:text-current"
          aria-label="Dismiss notification"
          onClick={onClose}
        >
          <X size={15} aria-hidden />
        </button>
      </div>
    </div>
  );
}
