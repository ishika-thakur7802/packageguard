import { analyzeRisk } from "../src/risk/riskAnalyzer";

const existingPackage = {
  name: "react",
  exists: true,
};

const newPackage = {
  name: "some-new-package",
  exists: true,
  createdAt: new Date(
    Date.now() - 2 * 24 * 60 * 60 * 1000
  ).toISOString(),
};

const lowDownloadPackage = {
  name: "low-download-package",
  exists: true,
  createdAt: new Date(
    Date.now() - 2 * 24 * 60 * 60 * 1000
  ).toISOString(),
  downloads: 12,
};

const missingPackage = {
  name: "fake-ai-package",
  exists: false,
};

const noRepositoryPackage = {
  name: "no-repository-package",
  exists: true,
  createdAt: new Date(
    Date.now() - 2 * 24 * 60 * 60 * 1000
  ).toISOString(),
  downloads: 12,
};

const installScriptPackage = {
  name: "install-script-package",
  exists: true,
  createdAt: new Date(
    Date.now() - 2 * 24 * 60 * 60 * 1000
  ).toISOString(),
  downloads: 12,
  installScripts: ["postinstall"],
};

console.log("Existing package:");
console.log(analyzeRisk(existingPackage));

console.log("\nNew package:");
console.log(analyzeRisk(newPackage));

console.log("\nMissing package:");
console.log(analyzeRisk(missingPackage));

console.log("\nLowDownloads package:");
console.log(analyzeRisk(lowDownloadPackage));

console.log("\nNo Repository Package:");
console.log(analyzeRisk(noRepositoryPackage));

console.log("\nInstall Script Package:");
console.log(analyzeRisk(installScriptPackage));