import assert from "node:assert/strict";
import path from "node:path";
import { test } from "node:test";
import { recurse } from "../src/scanner/recurse";

test("finds a direct dependency", () => {
  const nodeModulesPath = path.join(process.cwd(), "node_modules");

  const result = recurse(
    "commander",
    "^15.0.0",
    nodeModulesPath,
    new Set<string>(),
    0,
    5
  );

  assert.equal(result.name, "commander");
  assert.equal(result.version, "^15.0.0");
  assert.ok(Array.isArray(result.dependencies));
});

test("finds nested dependencies", () => {
  const nodeModulesPath = path.join(process.cwd(), "node_modules");

  const result = recurse(
    "tsx",
    "^4.23.12",
    nodeModulesPath,
    new Set<string>(),
    0,
    5
  );

  assert.equal(result.name, "tsx");
  assert.ok(result.dependencies.length > 0);

  console.log(
    "tsx dependencies:",
    result.dependencies.map((dependency) => dependency.name)
  );
});

test("finds multiple levels of nested dependencies", () => {
  const nodeModulesPath = path.join(process.cwd(), "node_modules");

  const result = recurse(
    "tsx",
    "^4.23.12",
    nodeModulesPath,
    new Set<string>(),
    0,
    5
  );

  assert.equal(result.name, "tsx");
});

test("handles duplicate dependencies without infinite recursion", () => {
  const visited = new Set<string>();

  const result = recurse(
    "test-node-a",
    "1.0.0",
    path.join(process.cwd(), "test-project", "node_modules"),
    visited,
    0,
    10
  );

  const nodeB = result.dependencies.find(
    (dependency) => dependency.name === "test-node-b"
  );

  const nodeC = result.dependencies.find(
    (dependency) => dependency.name === "test-node-c"
  );

  assert.ok(nodeB);
  assert.ok(nodeC);
});

test("respects maximum recursion depth", () => {
  const result = recurse(
    "test-node-a",
    "1.0.0",
    path.join(process.cwd(), "test-project", "node_modules"),
    new Set<string>(),
    0,
    1
  );

  assert.equal(result.name, "test-node-a");
  assert.equal(result.dependencies.length, 2);

  const nodeB = result.dependencies.find(
    (dependency) => dependency.name === "test-node-b"
  );

  const nodeC = result.dependencies.find(
    (dependency) => dependency.name === "test-node-c"
  );

  assert.ok(nodeB);
  assert.ok(nodeC);

  assert.equal(nodeB.dependencies.length, 0);
  assert.equal(nodeC.dependencies.length, 0);
});