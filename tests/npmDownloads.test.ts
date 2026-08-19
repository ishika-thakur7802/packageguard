import assert from "node:assert/strict";
import { test } from "node:test";
import { getDownloads } from "../src/registry/npmDownloads";

test("gets weekly download count for an npm package", async () => {
  const downloads = await getDownloads("react");

  assert.ok(downloads !== null);
  assert.equal(typeof downloads, "number");
  assert.ok(downloads > 0);
});