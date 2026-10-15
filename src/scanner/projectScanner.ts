import fs from "fs";
import path from "path";
import { Dependency, PackageJson } from "../types/dependency";
import { recurse } from "./recurse";

export function findPackageJson(
  directory: string = process.cwd()
): string | null {
  const packageJsonPath = path.join(
    directory,
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
export function getDependencyTree(
  packageJsonPath: string,
  maxDepth: number = 5
): Dependency[] {
  const dependencies = getDependencies(packageJsonPath);

  const nodeModulesPath = path.join(
    path.dirname(packageJsonPath),
    "node_modules"
  );

  for (const dependency of dependencies) {
    dependency.tree = recurse(
      dependency.name,
      dependency.version,
      nodeModulesPath,
      new Set<string>(),
      0,
      maxDepth
    );
  }

  return dependencies;
}