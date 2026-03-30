export function isRewardEligible(
    lastRewardedDate: string | null,
    today: string,
) {
    return lastRewardedDate !== today;
}
