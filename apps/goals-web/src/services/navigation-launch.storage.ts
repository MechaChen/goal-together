import { NAVIGATION_LAUNCH_SCHEMA_VERSION, NAVIGATION_LAUNCH_STORAGE_KEY } from "./navigation-launch.constants";
import { parseTasksPath } from "./navigation-launch.routes";
import type { LastOpenedTasksContext } from "./navigation-launch.types";

function hasWindow(): boolean {
  if (typeof window === "undefined" || typeof window.localStorage === "undefined") {
    return false;
  }
  return (
    typeof window.localStorage.getItem === "function" &&
    typeof window.localStorage.setItem === "function" &&
    typeof window.localStorage.removeItem === "function"
  );
}

export function readLastOpenedTasksContext(): LastOpenedTasksContext | null {
  if (!hasWindow()) {
    return null;
  }
  const raw = window.localStorage.getItem(NAVIGATION_LAUNCH_STORAGE_KEY);
  if (!raw) {
    return null;
  }
  try {
    const parsed = JSON.parse(raw) as Partial<LastOpenedTasksContext>;
    if (!parsed || parsed.schema_version !== NAVIGATION_LAUNCH_SCHEMA_VERSION || typeof parsed.route !== "string") {
      return null;
    }
    const path = parseTasksPath(parsed.route);
    if (!path) {
      return null;
    }
    return {
      route: path.route,
      main_segment: parsed.main_segment ?? null,
      sub_segment: parsed.sub_segment ?? null,
      saved_at: typeof parsed.saved_at === "string" ? parsed.saved_at : new Date(0).toISOString(),
      schema_version: NAVIGATION_LAUNCH_SCHEMA_VERSION,
    };
  } catch {
    return null;
  }
}

export function writeLastOpenedTasksContext(pathname: string): void {
  if (!hasWindow()) {
    return;
  }
  const parsed = parseTasksPath(pathname);
  if (!parsed) {
    return;
  }
  const payload: LastOpenedTasksContext = {
    route: parsed.route,
    main_segment: parsed.mainSegment,
    sub_segment: parsed.subSegment,
    saved_at: new Date().toISOString(),
    schema_version: NAVIGATION_LAUNCH_SCHEMA_VERSION,
  };
  window.localStorage.setItem(NAVIGATION_LAUNCH_STORAGE_KEY, JSON.stringify(payload));
}

export function clearLastOpenedTasksContext(): void {
  if (!hasWindow()) {
    return;
  }
  window.localStorage.removeItem(NAVIGATION_LAUNCH_STORAGE_KEY);
}
