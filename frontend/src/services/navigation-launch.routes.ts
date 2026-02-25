import type { ParsedTasksPath } from "./navigation-launch.types";

const TASKS_PATH_RE = /^\/tasks(?:\/[^/]+(?:\/[^/]+)?)?$/;

export function isTasksPath(pathname: string): boolean {
  return TASKS_PATH_RE.test(pathname);
}

export function normalizeTasksPath(pathname: string): string {
  const trimmed = pathname.trim();
  if (!trimmed.startsWith("/")) {
    return `/${trimmed}`;
  }
  return trimmed;
}

export function parseTasksPath(pathname: string): ParsedTasksPath | null {
  const normalized = normalizeTasksPath(pathname);
  if (!isTasksPath(normalized)) {
    return null;
  }
  const segments = normalized.split("/").filter(Boolean);
  const [, mainSegment, subSegment] = segments;
  return {
    route: normalized,
    mainSegment: mainSegment ?? null,
    subSegment: subSegment ?? null,
  };
}

