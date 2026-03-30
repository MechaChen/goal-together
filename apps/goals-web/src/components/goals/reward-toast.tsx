type RewardToastProps = {
  message: string | null;
};

export function RewardToast({ message }: RewardToastProps) {
  if (!message) {
    return null;
  }

  return <p className="rounded bg-emerald-100 px-3 py-2 text-sm text-emerald-800">{message}</p>;
}
