import fs from "fs";
import path from "path";
import { Dependency, PackageJson } from "../types/dependency";

export function findPackageJson(): string | null {
  const currentDirectory = process.cwd();

  const packageJsonPath = path.join(
    currentDirectory,
    "package.json"
  );

  if (!fs.existsSync(packageJsonPath)) {
    return null;
  }

  return packageJsonPath;
}
function readPackageJson(packageJsonPath: string): PackageJson {
  const contents = fs.readFileSync(
    packageJsonPath,
    "utf-8"
  );

  return JSON.parse(contents);
}
export function getDependencies(
  packageJsonPath: string
): Dependency[] {
  const packageJson = readPackageJson(packageJsonPath);

  const dependencies = packageJson.dependencies ?? {};
  const devDependencies = packageJson.devDependencies ?? {};

  const result: Dependency[] = [];

  for (const [name, version] of Object.entries(dependencies)) {
    result.push({
      name,
      version,
      type: "dependency"
    });
  }

  for (const [name, version] of Object.entries(devDependencies)) {
    result.push({
      name,
      version,
      type: "devDependency"
    });
  }

  return result;
}
