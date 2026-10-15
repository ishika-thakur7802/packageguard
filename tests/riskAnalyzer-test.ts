import assert from "node:assert/strict";
import { test } from "node:test";
import type { RegistryResult } from "../src/registry/types";
import { analyzeRisk } from "../src/risk/riskAnalyzer";

function makePackage(
  overrides: Partial<RegistryResult>
): RegistryResult {
  return {
    name: "test-package",
    exists: true,
    latestVersion: "1.0.0",
    createdAt: new Date(
      Date.now() - 30 * 24 * 60 * 60 * 1000
    ).toISOString(),
    modifiedAt: new Date().toISOString(),
    downloads: 1000,
    repository: "https://github.com/example/test-package",
    maintainers: ["test-user"],
    scripts: {},
    ...overrides,
  };
}

test("existing package has low risk", () => {
  const result = analyzeRisk(
    makePackage({
      name: "react",
    })
  );

  assert.equal(result.score, 0);
  assert.equal(result.level, "LOW");
  assert.deepEqual(result.reasons, []);
});

test("new package receives age risk", () => {
  const result = analyzeRisk(
    makePackage({
      name: "some-new-package",
      createdAt: new Date(
        Date.now() - 2 * 24 * 60 * 60 * 1000
      ).toISOString(),
    })
  );

  assert.equal(result.score, 30);
  assert.equal(result.level, "MEDIUM");
  assert.ok(
    result.reasons.includes("Package is less than 7 days old")
  );
});

test("low download activity increases risk", () => {
  const result = analyzeRisk(
    makePackage({
      name: "low-download-package",
      downloads: 12,
    })
  );

  assert.equal(result.score, 20);
  assert.equal(result.level, "LOW");
  assert.ok(
    result.reasons.includes(
      "Package has a very low download activity"
    )
  );
});

test("missing package is critical", () => {
  const result = analyzeRisk(
    makePackage({
      name: "fake-ai-package",
      exists: false,
    })
  );

  assert.equal(result.score, 100);
  assert.equal(result.level, "CRITICAL");
  assert.deepEqual(result.reasons, [
    "Package does not exist on npm",
  ]);
});

test("missing repository increases risk", () => {
  const result = analyzeRisk(
    makePackage({
      name: "no-repository-package",
      repository: null,
    })
  );

  assert.equal(result.score, 15);
  assert.equal(result.level, "LOW");
  assert.ok(
    result.reasons.includes("No repository found")
  );
});

test("install-time scripts increase risk", () => {
  const result = analyzeRisk(
    makePackage({
      name: "install-script-package",
      scripts: {
        postinstall: "node install.js",
      },
    })
  );

  assert.equal(result.score, 20);
  assert.equal(result.level, "LOW");
  assert.ok(
    result.reasons.includes(
      "Package contains install-time scripts"
    )
  );
});