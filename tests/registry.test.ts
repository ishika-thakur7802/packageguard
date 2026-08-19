import assert from "node:assert/strict";
import { test } from "node:test";
import { getPackage } from "../src/registry/npmRegistry";

test("finds an existing npm package", async () => {
  const result = await getPackage("react");

  assert.equal(result.exists, true);
  assert.equal(result.name, "react");
  assert.ok(result.latestVersion);
  assert.ok(result.repository);
  assert.ok(result.downloads);
  assert.ok(result.maintainers.length > 0);
  assert.ok(result.scripts);
});

test("handles a package that does not exist", async () => {
  const result = await getPackage(
    "this-package-definitely-does-not-exist-123456789"
  );

  assert.equal(result.exists, false);
  assert.equal(result.latestVersion, null);
});