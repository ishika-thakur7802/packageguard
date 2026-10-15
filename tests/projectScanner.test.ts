import assert from "node:assert/strict";
import { test } from "node:test";
import {
  findPackageJson,
  getDependencies,
  getDependencyTree,
} from "../src/scanner/projectScanner";

test("finds the project package.json", () => {
  const packageJsonPath = findPackageJson();

  assert.ok(packageJsonPath);
  assert.ok(packageJsonPath.endsWith("package.json"));
});

test("reads project dependencies", () => {
  const packageJsonPath = findPackageJson();

  assert.ok(packageJsonPath);

  const dependencies = getDependencies(packageJsonPath);

  assert.ok(dependencies.length > 0);
});

test("builds the recursive dependency tree", () => {
  const packageJsonPath = findPackageJson();

  assert.ok(packageJsonPath);

  const dependencies = getDependencyTree(packageJsonPath, 5);

  const tsx = dependencies.find(
    (dependency) => dependency.name === "tsx"
  );

  assert.ok(tsx);
  assert.ok(tsx.tree);
  assert.equal(tsx.tree.name, "tsx");
  assert.ok(tsx.tree.dependencies.length > 0);

  console.log(
    "tsx tree:",
    JSON.stringify(tsx.tree, null, 2)
  );
});