#!/usr/bin/env node
import { Command } from "commander";
import { findPackageJson, getDependencies } from "./scanner/projectScanner";
import { getPackage } from "./registry/npmRegistry";
import { analyzeRisk } from "./risk/riskAnalyzer";

const program = new Command();

program
  .name("packageguard")
  .description("Scan your project for risky dependencies")
  .version("0.1.0");

program
  .command("scan")
  .description("Scan project dependencies")
  .action(async () => {
    console.log("PackageGuard scanning...");

    const packageJsonPath = findPackageJson();

    if (packageJsonPath === null) {
      console.log("No package.json found");
      return;
    }

    console.log("package.json found");

    const dependencies = getDependencies(packageJsonPath);

    for (const dependency of dependencies) {
      const registryResult = await getPackage(dependency.name);
      const riskResult = analyzeRisk(registryResult);

      console.log(riskResult);
    }
  });
program.parse();