import type { WalletSummary } from "../../services/reward-hierarchy.types";

type WalletSummaryProps = {
  wallet: WalletSummary;
};

export function WalletSummaryCard({ wallet }: WalletSummaryProps) {
  return (
    <section className="rounded border border-slate-200 bg-white p-4">
      <h2 className="text-lg font-semibold text-slate-900">Token Wallet</h2>
      <p className="text-sm text-slate-600">Balance: {wallet.balance} tokens</p>
      <p className="text-sm text-slate-600">Rewarded completions: {wallet.rewarded_completion_count}</p>
    </section>
  );
}
