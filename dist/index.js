#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const projectScanner_1 = require("./scanner/projectScanner");
const program = new commander_1.Command();
program
    .name("packageguard")
    .description("Scan your project for risky dependencies")
    .version("0.1.0");
program
    .command("scan")
    .description("Scan project dependencies")
    .action(() => {
    console.log("PackageGuard scanning...");
    const packageJsonPath = (0, projectScanner_1.findPackageJson)();
    if (packageJsonPath === null) {
        console.log("No package.json found");
        return;
    }
    console.log("package.json found");
    const dependencies = (0, projectScanner_1.getDependencies)(packageJsonPath);
    console.log("Dependencies:");
    console.log(dependencies);
});
program.parse();
//# sourceMappingURL=index.js.map