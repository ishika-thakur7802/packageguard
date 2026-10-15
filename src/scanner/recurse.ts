import fs from "fs";
import path from "path";

export type DependencyNode = {
  name: string;
  version: string;
  dependencies: DependencyNode[];
};

type PackageJson = {
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
};

export function recurse(
  packageName: string,
  packageVersion: string,
  nodeModulesPath: string,
  visitedPackages: Set<string>,
  depth: number,
  maxDepth: number
): DependencyNode {
  const node: DependencyNode = {
    name: packageName,
    version: packageVersion,
    dependencies: [],
  };

  if (depth >= maxDepth) {
    return node;
  }

  if (visitedPackages.has(packageName)) {
    return node;
  }

  visitedPackages.add(packageName);

  const packagePath = path.join(
    nodeModulesPath,
    packageName,
    "package.json"
  );

  if (!fs.existsSync(packagePath)) {
    return node;
  }

  const packageJson: PackageJson = JSON.parse(
    fs.readFileSync(packagePath, "utf-8")
  );

  const dependencies = packageJson.dependencies ?? {};

  for (const [name, version] of Object.entries(dependencies)) {
    const child = recurse(
      name,
      version,
      nodeModulesPath,
      visitedPackages,
      depth + 1,
      maxDepth
    );

    node.dependencies.push(child);
  }

  return node;
}