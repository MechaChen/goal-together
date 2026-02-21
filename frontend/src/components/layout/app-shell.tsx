import type { ReactNode } from "react";
import goalTogetherLogo from "../../assets/images/goal-together-logo.png";
import goalTogetherTitle from "../../assets/images/goal-together-title.png";

import { RewardModal } from "../rewards/reward-modal";

type AppShellProps = { children: ReactNode };

export function AppShell({ children }: AppShellProps) {
  return (
    <main className="space-y-4 pb-4 md:pb-6">
      <header className="border-y border-[#ddd5ce] bg-[var(--surface-card)]">
        <div className="flex items-center justify-center px-4 py-4">
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
        </div>
      </header>

      <div className="mx-auto w-full max-w-5xl px-4 md:px-6">{children}</div>
      <RewardModal />
    </main>
  );
}
