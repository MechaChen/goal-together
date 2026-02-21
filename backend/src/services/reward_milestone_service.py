MILESTONE_STEP = 5
MILESTONE_REWARD = 50


def milestone_config() -> dict[str, int]:
    return {
        "milestone_step": MILESTONE_STEP,
        "milestone_reward": MILESTONE_REWARD,
    }


def should_grant_milestone(rewarded_completion_count: int) -> bool:
    return rewarded_completion_count > 0 and rewarded_completion_count % MILESTONE_STEP == 0
