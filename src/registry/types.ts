export interface RegistryResult {
  name: string;
  exists: boolean;
  latestVersion: string | null;
  createdAt: string | null;
  modifiedAt: string | null;
  repository: string | null;
  downloads: number | null;
  maintainers: string[];
  scripts: Record<string, string>;
}