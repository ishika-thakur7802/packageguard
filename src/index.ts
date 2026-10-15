#!/usr/bin/env node

import { Command } from "commander";
import path from "path";
import { getPackage } from "./registry/npmRegistry";
import { analyzeRisk } from "./risk/riskAnalyzer";
import { findPackageJson, getDependencies } from "./scanner/projectScanner";
import { recurse } from "./scanner/recurse";

async function analyzeTree(
  node: {
    name: string;
    version: string;
    dependencies: {
      name: string;
      version: string;
      dependencies: any[];
    }[];
  },
  depth = 0
): Promise<number[]> {
  const registryResult = await getPackage(node.name);
  const riskResult = analyzeRisk(registryResult);

  const scores = [riskResult.score];

  const indent = "  ".repeat(depth);

  console.log(
    `${indent}${node.name}@${node.version} - ${riskResult.level} (${riskResult.score})`
  );

  for (const reason of riskResult.reasons) {
    console.log(`${indent}  - ${reason}`);
  }

  for (const child of node.dependencies) {
    const childScores = await analyzeTree(child, depth + 1);
    scores.push(...childScores);
  }

  return scores;
}

const program = new Command();

program
  .name("packageguard")
  .description("Scan your project for risky dependencies")
  .version("0.1.0");

program
  .command("scan [path]")
  .description("Scan project dependencies")
  .action(async (scanPath = ".") => {
    console.log("PackageGuard scanning...");

    const packageJsonPath = findPackageJson(scanPath);

    if (packageJsonPath === null) {
      console.error(
        `No package.json found in "${scanPath}".`
      );
      return;
    }

    console.log("package.json found");

    const dependencies = getDependencies(packageJsonPath);

    const nodeModulesPath = path.join(
      path.dirname(packageJsonPath),
      "node_modules"
    );

    const counts = {
      LOW: 0,
      MEDIUM: 0,
      HIGH: 0,
      CRITICAL: 0,
    };

    for (const dependency of dependencies) {
      const tree = recurse(
        dependency.name,
        dependency.version,
        nodeModulesPath,
        new Set<string>(),
        0,
        5
      );

      const scores = await analyzeTree(tree);

      for (const score of scores) {
        if (score >= 80) {
          counts.CRITICAL++;
        } else if (score >= 60) {
          counts.HIGH++;
        } else if (score >= 30) {
          counts.MEDIUM++;
        } else {
          counts.LOW++;
        }
      }
    }

    console.log("\nRisk summary:");
    console.log(`  LOW: ${counts.LOW}`);
    console.log(`  MEDIUM: ${counts.MEDIUM}`);
    console.log(`  HIGH: ${counts.HIGH}`);
    console.log(`  CRITICAL: ${counts.CRITICAL}`);
  });


program.parse();