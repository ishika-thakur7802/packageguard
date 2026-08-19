export async function getDownloads(
  packageName: string
): Promise<number | null> {
  const response = await fetch(
    `https://api.npmjs.org/downloads/point/last-week/${encodeURIComponent(
      packageName
    )}`
  );

  if (!response.ok) {
    return null;
  }

  const data = await response.json();

  return typeof data.downloads === "number" ? data.downloads : null;
}