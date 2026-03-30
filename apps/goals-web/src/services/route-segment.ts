export function slugifyName(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function toNameIdSegment(name: string, id: string): string {
  const slug = slugifyName(name) || "item";
  return `${slug}-${encodeURIComponent(id)}`;
}

export function extractIdFromNameIdSegment(segment: string): string | null {
  const index = segment.lastIndexOf("-");
  if (index < 0 || index === segment.length - 1) {
    return null;
  }
  try {
    return decodeURIComponent(segment.slice(index + 1));
  } catch {
    return null;
  }
}
