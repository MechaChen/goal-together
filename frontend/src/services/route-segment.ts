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

