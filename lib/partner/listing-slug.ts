export function slugifyListingName(name: string): string {
  const base = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48);
  return base || 'pet';
}

export async function uniqueListingSlug(
  shelterId: string,
  displayName: string,
  exists: (shelterId: string, slug: string) => Promise<boolean>
): Promise<string> {
  const base = slugifyListingName(displayName);
  let slug = base;
  let n = 2;
  while (await exists(shelterId, slug)) {
    slug = `${base}-${n}`;
    n += 1;
  }
  return slug;
}
