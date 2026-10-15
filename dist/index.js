#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const path_1 = __importDefault(require("path"));
const npmRegistry_1 = require("./registry/npmRegistry");
const riskAnalyzer_1 = require("./risk/riskAnalyzer");
const projectScanner_1 = require("./scanner/projectScanner");
const recurse_1 = require("./scanner/recurse");
async function analyzeTree(node, depth = 0) {
    const registryResult = await (0, npmRegistry_1.getPackage)(node.name);
    const riskResult = (0, riskAnalyzer_1.analyzeRisk)(registryResult);
    const scores = [riskResult.score];
    const indent = "  ".repeat(depth);
    console.log(`${indent}${node.name}@${node.version} - ${riskResult.level} (${riskResult.score})`);
    for (const reason of riskResult.reasons) {
        console.log(`${indent}  - ${reason}`);
    }
    for (const child of node.dependencies) {
        const childScores = await analyzeTree(child, depth + 1);
        scores.push(...childScores);
    }
    return scores;
}
const program = new commander_1.Command();
program
    .name("packageguard")
    .description("Scan your project for risky dependencies")
    .version("0.1.0");
program
    .command("scan [path]")
    .description("Scan project dependencies")
    .action(async (scanPath = ".") => {
    console.log("PackageGuard scanning...");
    const packageJsonPath = (0, projectScanner_1.findPackageJson)(scanPath);
    if (packageJsonPath === null) {
        console.error(`No package.json found in "${scanPath}".`);
        return;
    }
    console.log("package.json found");
    const dependencies = (0, projectScanner_1.getDependencies)(packageJsonPath);
    const nodeModulesPath = path_1.default.join(path_1.default.dirname(packageJsonPath), "node_modules");
    const counts = {
        LOW: 0,
        MEDIUM: 0,
        HIGH: 0,
        CRITICAL: 0,
    };
    for (const dependency of dependencies) {
        const tree = (0, recurse_1.recurse)(dependency.name, dependency.version, nodeModulesPath, new Set(), 0, 5);
        const scores = await analyzeTree(tree);
        for (const score of scores) {
            if (score >= 80) {
                counts.CRITICAL++;
            }
            else if (score >= 60) {
                counts.HIGH++;
            }
            else if (score >= 30) {
                counts.MEDIUM++;
            }
            else {
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
//# sourceMappingURL=index.js.map