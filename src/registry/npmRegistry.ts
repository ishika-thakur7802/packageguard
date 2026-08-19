import type { RegistryResult } from "./types";
import { getDownloads } from "./npmDownloads";

export async function getPackage(
  packageName: string
): Promise<RegistryResult> {
  const response = await fetch(
    `https://registry.npmjs.org/${encodeURIComponent(packageName)}`
  );

  if (response.status === 404) {
    return {
      name: packageName,
      exists: false,
      latestVersion: null,
      createdAt: null,
      modifiedAt: null,
      repository: null,
      downloads: null,
      maintainers: [],
      scripts: {},
    };
  }

  if (!response.ok) {
    throw new Error(
      `npm Registry request failed with status ${response.status}`
    );
  }

  const data = await response.json();

  const downloads = await getDownloads(packageName);

  return {
    name: data.name,
    exists: true,
    latestVersion: data["dist-tags"]?.latest ?? null,
    createdAt: data.time?.created ?? null,
    modifiedAt: data.time?.modified ?? null,
    repository: data.repository?.url ?? null,
    downloads,
    maintainers: Array.isArray(data.maintainers)
      ? data.maintainers.map(
          (maintainer: { name: string }) => maintainer.name
        )
      : [],
    scripts: data.scripts ?? {},
  };
}