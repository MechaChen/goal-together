import type { ReactNode } from "react";

import { RewardModal } from "../rewards/reward-modal";

type AppShellProps = { children: ReactNode };

export function AppShell({ children }: AppShellProps) {
  return (
    <main className="mx-auto max-w-5xl space-y-4 p-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-bold text-slate-900">Goal Together</h1>
      </header>

      {children}
      <RewardModal />
    </main>
  );
}
