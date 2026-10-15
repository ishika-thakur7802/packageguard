import type { DependencyNode } from "../scanner/recurse";

export interface Dependency {
  name: string;
  version: string;
  type: "dependency" | "devDependency";
  tree?: DependencyNode;
}

export interface PackageJson {
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
}