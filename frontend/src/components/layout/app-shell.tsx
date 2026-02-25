import type { ReactNode } from "react";
import { Menu } from "lucide-react";
import goalTogetherLogo from "../../assets/images/goal-together-logo.png";
import goalTogetherTitle from "../../assets/images/goal-together-title.png";

import { RewardModal } from "../rewards/reward-modal";
import { TokenIcon } from "../rewards/token-icon";

type AppShellProps = {
  children: ReactNode;
  isSidebarOpen: boolean;
  isSidebarEnabled: boolean;
  onToggleSidebar: () => void;
  walletBalance: number;
};

export function AppShell({
  children,
  isSidebarOpen,
  isSidebarEnabled,
  onToggleSidebar,
  walletBalance,
}: AppShellProps) {
  return (
    <main className="space-y-4 pb-4 md:pb-6">
      <header className="border-y border-panel bg-surface-card">
        <div className="flex items-center justify-center px-4 py-4 relative">
          <button
            type="button"
            aria-controls="hierarchy-sidebar-panel"
            aria-expanded={isSidebarEnabled ? isSidebarOpen : false}
            aria-label={isSidebarOpen ? "Hide sidebar" : "Toggle sidebar"}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-muted bg-surface-muted text-ink-strong absolute left-4 top-0 bottom-0 my-auto"
            onClick={onToggleSidebar}
            disabled={!isSidebarEnabled}
          >
            <Menu size={18} aria-hidden />
          </button>
          <img
            src={goalTogetherLogo}
            alt=""
            aria-hidden
            className="h-12 w-12 object-contain md:h-24 md:w-24"
          />
          <img
            src={goalTogetherTitle}
            alt="Goal Together"
            className="h-14 w-auto object-contain md:h-24"
          />
          <div
            className="absolute right-4 top-0 bottom-0 my-auto inline-flex h-12 items-center gap-2 rounded-full px-4 text-lg font-bold text-ink-strong"
            aria-label={`Coin total: ${walletBalance}`}
          >
            <TokenIcon size={36} label="Coin total icon" />
            <span>{walletBalance}</span>
          </div>
        </div>
      </header>

      <div className="mx-auto w-full max-w-3xl px-4 md:px-6">{children}</div>
      <RewardModal />
    </main>
  );
}
